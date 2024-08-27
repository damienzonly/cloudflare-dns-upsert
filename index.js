import cloudflare from "cloudflare";
import axios from "axios";

const zoneID = process.env.ZONE_ID
const apiToken = process.env.API_TOKEN
const ownedDomain = process.env.DOMAIN
const subnames = process.env.SUBDOMAINS.split(',') // sub1,sub2...

async function getCurrentIp() {
    const providers = [
        'https://api.ipify.org?format=json',
        'https://ipinfo.io/json',
        'https://ip.seeip.org/jsonip',
    ];

    for (const provider of providers) {
        try {
            const response = await axios.get(provider);
            return response.data.ip;
        } catch (error) {
            console.error(`Failed to get IP from ${provider}:`, error.message);
        }
    }

    throw new Error('All IP providers failed');
}

;(async () => {
    const currentIp = await getCurrentIp();
    const client = new cloudflare.Cloudflare({apiToken});
    try {
        const response = await client.dns.records.list({ zone_id: zoneID, type: "A" });
        const records = response.result
        for (const dom of subnames) {
            const exists = records.find(r => r.name === `${dom}.${ownedDomain}`)
            if (exists) {
                await client.dns.records.edit(exists.id, {...exists, zone_id: zoneID, content: currentIp})
            } else {
                await client.dns.records.create({zone_id: zoneID, type: 'A', name: dom, proxied: false, content: currentIp})
            }
        }
    } catch (error) {
        console.error("Failed to list DNS records:", error.response ? error.response.data : error.message);
    }
})()