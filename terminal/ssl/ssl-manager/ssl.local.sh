#!/bin/bash
# see terminal/ssl/using-ca
kind=${1:-help} # create | renew
filename=$2; # path/to/file-prefix // $filename.{crt,key}
name=${3:-"Some Name"} # show to user
domains=${4:-"localhost,my-app.localhost,local.my-app.com"}
signscript=${5:-../data/ca/sign-request.sh}


# create
if [ "$kind" = "create" ]; then
	
	openssl genrsa -out $filename.key 2048
	openssl req -new \
		-subj "/CN=$name" \
		-key $filename.key -out $filename.csr

	$signscript "$filename" "$domains"

	exit
fi
if [ ! "$kind" = "renew" ]; then echo "read the code"; exit; fi


# renew
$signscript "$filename" "$domains"
