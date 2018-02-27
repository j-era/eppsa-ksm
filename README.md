# EPPSA KSM

Game and CMS setup behind a nginx as reverse proxy.

Dependencies:
  * [Docker](https://docs.docker.com/install/)

## Development
`docker-compose -f docker-compose.yml -f docker-compose.development.yml up`

## Production
`docker-compose -f docker-compose.yml -f docker-compose.production.yml up`
