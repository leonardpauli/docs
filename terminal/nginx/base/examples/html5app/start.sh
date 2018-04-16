#!/usr/bin/env sh

envtoload="env"
[ -f .env ] && for a in $envtoload; do export $a="$(cat .env | grep $a= | sed -e "s/.*=//g")"; done

if [ "$env" = "dev" ]; then
	req_image="leonardpauli/docs-nginx-base"
	if ! (docker images | grep "$req_image "); then
		echo "$req_image missing, building it"
		(cd ../.. && docker build -t leonardpauli/docs-nginx-base .)
	fi
	docker-compose -f docker-compose.yml -f docker-compose.dev-override.yml up --build
elif [ "$env" = "prod" ]; then
	docker-compose up --build -d
else
	echo "unknown env '$env', check ./.env"
fi
