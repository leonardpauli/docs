#!/bin/bash
# bootstrap new project using this as base
# ./LeonardPauli/docs/terminal/nginx/base/bootstrap path/to/my-new-project
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
project="$1"

mkdir -p "$project"
cp -R "$DIR/example/*" "$project"

# .env.example
# .env
# data
# setup/setup.rim
# setup/nginx-base (dir link)
# start (-> setup/nginx-base/setup/start.sh)
# deploy (-> setup/nginx-base/setup/deploy.sh)

# Dockerfile
# docker-compose.yaml
# nginx/sites/my-app
# dist/index.html

