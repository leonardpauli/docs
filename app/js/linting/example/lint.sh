#!/usr/bin/env sh

# lint-fix file(s) using configured preset

# usage: echo alias lint="$(pwd)"'/lint.sh' >> ~/.zshrc // + reload terminal
# lint -w // all js-files in current dir and sub dir
# lint -w 'src/**/*.js'
# lint src/**/*.js

script_dir () { (a="/$0"; a=${a%/*}; a=${a:-.}; a=${a#/}; echo "$a"); }

npm_bin_path="$(script_dir)"/node_modules/.bin

if [ "$1" = "-w" ]; then
	"$npm_bin_path"/onchange -v "${2-'./**/*.js'}" -d 200 -w -- "$npm_bin_path"/eslint --fix {{changed}}
	exit
fi

"$npm_bin_path"/eslint --fix $*
