#!/bin/sh
sender=${1:-anon}
data_path="$(pwd)/data"

echo "$(date): set-renew-needed triggered by '$sender'" >> data_path/ssl/renew-needed
