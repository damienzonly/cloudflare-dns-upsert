# Cloudflare DNS Upsers

This scripts fetches the public ip from the machine it's running on and upserts all the subdomains using that same ip address

### Supported envs

NOTE: you need an API Token with read/write access on Zones->DNS resource in cloudflare

```bash
ZONE_ID=<dns zone id>
API_TOKEN=<cloudflare api token>
DOMAIN=<yourdomain.com>
SUBDOMAINS=www,smtp,sftp
```

