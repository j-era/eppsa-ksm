#!/bin/bash

ssh -p $SSH_PORT $SSH_USERNAME@$SSH_HOST <<-EOF
rm -rf eppsa-ksm
git clone https://github.com/artcom/eppsa-ksm.git
cd eppsa-ksm
docker-compose -f docker-compose.yml -f docker-compose.production.yml up
EOF
