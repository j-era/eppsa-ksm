#!/bin/bash
set -e
ssh -o StrictHostKeyChecking=no -p $SSH_PORT $SSH_USER@$SSH_HOST << EOF
  rm -rf eppsa-ksm
  git clone --recursive https://github.com/artcom/eppsa-ksm.git
  cd eppsa-ksm
  git checkout $GIT_BRANCH
  sudo systemctl stop eppsa-ksm
  docker-compose rm -f
  docker-compose -f docker-compose.yml -f docker-compose.production.yml build
  sudo systemctl start eppsa-ksm
EOF
