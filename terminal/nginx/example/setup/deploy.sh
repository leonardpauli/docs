#!/bin/bash
# ./setup/deploy.sh
echo deploying...

envtoload="SSH_PROD SSH_PROD_PREFIX"
[ -f .env ] && for a in $envtoload; do export $a="$(cat .env | grep $a= | sed -e "s/.*=//g")"; done

deploy_command='git pull && ./run'
ssh $SSH_PROD "$SSH_PROD_PREFIX $deploy_command"

echo done
