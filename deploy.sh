#!/bin/bash

printenv
echo $GIT_BRANCH
echo "!!!"

cmd=$(cat <<EOF
echo "GIT_BRANCH: $GIT_BRANCH"
rm -rf eppsa-ksm
git clone --recursive -b $GIT_BRANCH https://github.com/artcom/eppsa-ksm.git
cd eppsa-ksm
docker-compose stop
docker-compose rm -f
docker-compose -f docker-compose.yml -f docker-compose.production.yml build
docker-compose -f docker-compose.yml -f docker-compose.production.yml up -d
EOF
)

ssh -p $SSH_PORT $SSH_USERNAME@$SSH_HOST $cmd
