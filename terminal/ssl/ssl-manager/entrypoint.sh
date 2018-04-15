#!/usr/bin/env sh
cron_prefix='my-app run'
source ./helpers.sh



# main

cleanup


# ssl_data_makeshift_use
if [ "$ssl_data_makeshift_use" = "true" ]; then
	echo 'do ssl.data.makeshift.use'
	ssl_data_makeshift_use_fn
fi


# ssl_dhparam_create
if [ "$ssl_dhparam_create" = "true" ] && isnt_created "$ssl_dhparam_path"; then
	echo 'do ssl.dhparam.create // can take ~3min'

	dhparam_path="$ssl_dhparam_path"
	ssl_dhparam_create_fn

	rm -f "$ssl_dhparam_path.makeshift"
fi


# ssl_local_ca_create
if [ "$ssl_local_ca_create" = "true" ] && isnt_created "$ssl_local_ca_crt"; then
	echo 'do ssl.local.ca.create'

	ca_displayname="$ssl_local_ca_displayname"
	ca_key="$ssl_local_ca_key"
	ca_crt="$ssl_local_ca_crt"
	ca_signscript="$ssl_local_ca_signscript"
	ssl_ca_create
	ssl_crt_signscript_create

	rm -f "$ssl_local_ca_crt.makeshift"
fi


# ssl_local_create
if [ "$ssl_local_create" = "true" ] && isnt_created "$ssl_local_crt"; then
	echo 'do ssl.local.create'

	# set params
	crt_key="$ssl_local_key"
	crt_domains="$ssl_local_domains"
	crt_displayname="$ssl_local_displayname"
	crt_csr="$ssl_local_csr"
	crt_csr_conf="$crt_csr.conf"
	crt_signscript="$ssl_local_ca_signscript"
	crt_crt="$ssl_local_crt"
	crt_renew_schedule="$ssl_local_renew_schedule"

	# do
	ssl_crt_key_create
	ssl_crt_csr_create
	ssl_crt_csr_sign

	# renewal
	[ ! "$ssl_local_renew_schedule" = "false" ] && ssl_crt_renewal_setup local

	# done
	rm -f "$ssl_local_crt.makeshift"
fi


# ssl_prod_create
if [ "$ssl_prod_create" = "true" ] && isnt_created "$ssl_prod_crt"; then
	echo 'do ssl.prod.create'

	# set acme params
	ssl_acme_data="$ssl_acme_data"
	ssl_acme_webroot="$ssl_acme_webroot"
	ssl_acme_staging="$ssl_prod_stageing"
	ssl_acme_notify_email="$ssl_prod_notify_email"

	# set params
	crt_key="$ssl_prod_key"
	crt_domains="$ssl_prod_domains"
	crt_displayname="$ssl_prod_displayname"
	crt_csr="$ssl_prod_csr"
	crt_csr_conf="$crt_csr.conf"
	# crt_signscript="$ssl_prod_ca_signscript"
	crt_crt="$ssl_prod_crt"
	crt_renew_schedule="$ssl_prod_renew_schedule"

	# do
	ssl_acme_await_online
	ssl_crt_key_create
	ssl_crt_csr_create
	# ssl_crt_csr_sign
	ssl_acme_init
	ssl_acme_csr_sign

	# renewal
	[ ! "$ssl_prod_renew_schedule" = "false" ] && ssl_acme_crt_renewal_setup prod

	# done
	rm -f "$ssl_prod_crt.makeshift"
fi


# done
echo "process.keep-alive // for renewal cronjobs"
keep_alive
