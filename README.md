# EPPSA KSM

Game and CMS setup behind an nginx server as reverse proxy.

`git clone --recursive https://github.com/artcom/eppsa-ksm.git`

## Requirements

### Certificate
Use the production certificate or create a self-signed development certificate as follows:
```
cd certificate/development
mkdir -p live/eppsa.de
openssl req -new -newkey rsa:2048 -sha1 -days 3650 -nodes -x509 -keyout ./live/eppsa.de/privkey.pem -out ./live/eppsa.de/fullchain.pem -config openssl.cnf
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

### Docker & Docker Compose
  * [Docker](https://docs.docker.com/install/)

## Run
Set environement variable for the path to the ssl certificate:
  * `CERTIFICATE_PATH=/path/to/certificate`

Set the HOST variable of your target enironment:
  * `HOST=env.eppsa.de``

### Build Images
`docker-compose -f docker-compose.yml -f docker-compose.development.yml build`

### Start Containers
`docker-compose -f docker-compose.yml -f docker-compose.development.yml up -V`
### Troubleshooting
If you need to recreate any volume (but not "named volumes"), first use the following commands before using 'up':
```
docker-compose stop
docker-compose rm
```
E.g. this will be necessary if you want to install new node dependencies during theÂ build.

### Both
`docker-compose -f docker-compose.yml -f docker-compose.development.yml up --build -V`

## Content
Access content repository:

* `git clone https://cms.<environment>.eppsa.de content`
