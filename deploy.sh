#!/bin/bash
set -e
ssh -o StrictHostKeyChecking=no -p $SSH_PORT $SSH_USER@$SSH_HOST << EOF
  if ! grep -q "HOST=$HOST" /etc/environment; then
    echo "Setting HOST in environment"
    echo "HOST=$HOST" | sudo tee --append /etc/environment > /dev/null
  fi;
  if ! grep -q "CERTIFICATE_PATH=$CERTIFICATE_PATH" /etc/environment; then
    echo "Setting CERTIFICATE_PATH in environment"
    echo "CERTIFICATE_PATH=$CERTIFICATE_PATH" | sudo tee --append /etc/environment > /dev/null
  fi;
  echo "HOST=$HOST"
  echo "CERTIFICATE_PATH=$CERTIFICATE_PATH"
  rm -rf eppsa-ksm
  git clone https://github.com/artcom/eppsa-ksm.git
  cd eppsa-ksm
  grep path .gitmodules | sed 's/.*= //' | xargs rm -rf
  git checkout -b $GIT_BRANCH
  git pull origin $GIT_BRANCH
  git submodule init
  git submodule update --recursive
  sudo systemctl stop eppsa-ksm
  docker-compose rm -f
  docker-compose -f docker-compose.yml -f docker-compose.production.yml build
  sudo systemctl start eppsa-ksm
EOF
