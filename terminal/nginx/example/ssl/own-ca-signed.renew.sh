#!/bin/bash
openssl x509 -req -sha256 -days 30 \
	-CA ../files/myCA.pem -CAkey ../files/myCA.key -CAcreateserial \
	-extfile own-ca-signed.ext -in own-ca-signed.csr -out own-ca-signed.crt
