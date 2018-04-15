#!/bin/bash
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ca=$DIR/ca
filename="$1"
domains="$2" # "localhost,example.com"


# helpers
itera () { local fn=${1:-"echo"} del=${2:-","} xs=${3:-"a,b,c"} i=0;
	while [ "$xs" ]; do x=${xs%%$del*}
		$fn "$x" $((i++))
	[ "$xs" = "$x" ] && xs='' || xs="${xs#*$del}"; done
}


# create ext file

altnames="";fn () {
	nl=$'\n';altnames+="DNS.$2 = $1${nl}";
};
itera fn "," "$domains"

extFile=$(cat <<- EOF
	authorityKeyIdentifier=keyid,issuer
	basicConstraints=CA:FALSE
	keyUsage = digitalSignature, nonRepudiation, keyEncipherment, dataEncipherment # sure of all of those?
	subjectAltName = @alt_names

	[alt_names]
	$altnames
	EOF)
echo "$extFile" > $DIR/tmp.ext


# sign

openssl x509 -req -sha256 -days 30 \
	-CAserial $... -CAcreateserial \
	-CA $ca.pem -CAkey $ca.key \
	-extfile $DIR/tmp.ext -in $filename.csr -out $filename.crt
