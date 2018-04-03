#!/bin/bash
# see terminal/ssl/using-ca
# ca.srl?
# <script> output/dir "Name shown to user"
outdir=${1:-../data/ca}
name=${2:-"Some Name"} # show to user

# ca.key, ca.pem
openssl genrsa -out $outdir/ca.key 2048
openssl req -x509 -new -nodes -sha256 -days 365 \
	-subj "/CN=$name" \
	-key $outdir/ca.key -out $outdir/ca.pem

# sign-request.sh
cp makeshift-data/ca/sign-request.sh $outdir/sign-request.sh
chmod u+x $outdir/sign-request.sh
