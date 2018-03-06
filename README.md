# EPPSA KSM

Game and CMS setup behind a nginx as reverse proxy.


`git clone --recursive https://github.com/artcom/eppsa-ksm.git`


## Requirements

### Certificate
Use the production certificate or create a self-signed development certificate as follows:
```
cd certificate/development && openssl req -new -newkey rsa:2048 -sha1 -days 3650 -nodes -x509 -keyout privkey.pem -out fullchain.pem -config openssl.cnf
```
The development certificate points to `*.eppsa.de`. Set the correct path in CERTIFICATE_PATH below.

### Local Service Lookup
  * For local development:
    * /etc/hosts:
    ```
    127.0.0.1 cms.local.eppsa.de
    127.0.0.1 game.local.eppsa.de
    ```
  * Certifcate for `*.eppsa.de` or for each subdomain `*.<environment>.eppsa.de`

Dependencies:
  * [Docker](https://docs.docker.com/install/)

## Run
Set environement variable for the path to the ssl certificate:
  * `CERTIFICATE_PATH=/path/to/certificate`

### Development
`docker-compose -f docker-compose.yml -f docker-compose.development.yml up`

### Production
`docker-compose -f docker-compose.yml -f docker-compose.production.yml up`



## Content
Access content repository:

* `git clone https://cms.<environment>.eppsa.de/git/content`
