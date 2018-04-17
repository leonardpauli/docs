#!/usr/bin/env sh
crt_csr="$1"; crt_crt="$2"

extracted_san="$( \
openssl req -text -noout -in "$crt_csr" | tr $'\n' ';' \
| sed -e "s/.*X509v3 Subject Alternative Name: ; *\([^;]*\).*/\1/" \
)"

extfile=$(mktemp); trap "rm -f $extfile" EXIT
echo "keyUsage = nonRepudiation, digitalSignature, keyEncipherment" > "$extfile"
echo "subjectAltName = $extracted_san" >> "$extfile"

openssl x509 -req -sha256 -days 30 \
-CAcreateserial \
-CA "/data/ca/ca.pem" -CAkey "/data/ca/ca.key" \
-extfile "$extfile" \
-in "$crt_csr" -out "$crt_crt"
