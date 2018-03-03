#!/bin/bash

ssh -p $SSH_PORT $SSH_USERNAME@$SSH_HOST <<-EOF
rm -rf eppsa-ksm
git clone --recursive -b feature/jenkins-deployment https://github.com/artcom/eppsa-ksm.git
cd eppsa-ksm
docker-compose stop
docker-compose rm -f
docker-compose -f docker-compose.yml -f docker-compose.production.yml build
docker-compose -f docker-compose.yml -f docker-compose.production.yml up -d
EOF
