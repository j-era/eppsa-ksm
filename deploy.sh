#!/bin/bash

ssh $USERNAME@$HOST <<-EOF
  git clone git@github.com:artcom/eppsa-ksm.git
  cd eppsa-ksm
  docker-compose -f docker-compose.yml -f docker-compose.production.yml up
EOF
