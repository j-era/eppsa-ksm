#!/bin/bash

ssh -p $SSH_PORT $SSH_USER@$SSH_HOST << EOF
rm -rf eppsa-ksm
git clone --recursive https://github.com/artcom/eppsa-ksm.git
cd eppsa-ksm
git checkout -b $GIT_BRANCH
docker-compose stop
docker-compose rm -f
docker-compose -f docker-compose.yml -f docker-compose.production.yml build
docker-compose -f docker-compose.yml -f docker-compose.production.yml up -d
EOF
