#!/usr/bin/env sh
script_dir () { (a="/$0"; a=${a%/*}; a=${a:-.}; a=${a#/}/; echo "$a"); }
cd "$(script_dir)"

docker-compose ps | grep Up > /dev/null && exit 0 || exit 1
