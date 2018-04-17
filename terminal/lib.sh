#!/usr/bin/env sh
# terminal/lib.sh
# LeonadrdPauli/docs
# Created by Leonard Pauli, 17 apr 2017
# licence (this file): AGPL-3.0-or-later
# 
#  - own and collected shell utility function
#  
# usage: source /path/to/this-file
# then just use the functions :)

# https://www.jasan.tk/posix/2017/05/11/posix_shell_dirname_replacement
# cd "$(script_dir)"
script_dir () { (a="/$0"; a=${a%/*}; a=${a:-.}; a=${a#/}/; echo "$a"); }

# load_env "my_env_var SOME_OTHER_VAR etc"
load_env () { [ -f .env ] && for a in $1; do
	export $a="$(cat .env | grep $a= | sed -e "s/.*=//g")"; done; }

# like cp -r, but only adds/overwrites files, no deletion (ie. no dir replacement)
# overlay_folder /base /target && overlay_folder /on-top /target
overlay_folder () {
	source_d="$1"; target_d="$2"
	cd "$source_d"
	for p in *; do
		[ -d "$p" ] && (mkdir -p "$target_d/$p" && overlay_folder "$source_d/$p" "$target_d/$p")
		[ -f "$p" ] && cp -f "$source_d/$p" "$target_d/$p"
	done
	return 0
}

# p 'my log'; p +1; p 'my indented item'; p -1; p 'back to normal'
use_p_indentations_logging () {
	p_indentations=0
	p () {
		if   [ "$1" = "+1" ]; then p_indentations=$(($p_indentations+1))
		elif [ "$1" = "-1" ]; then p_indentations=$(($p_indentations-1))
		else echo "$(printf %$(($p_indentations * 2))s | tr " " " ")$@"
		fi
	}
}

keep_alive () { tail -f /dev/null; }

# r=""; r="line 1"$'\n'; r="line 2"$'\n'; replace_with_multiline "find" "$r"
replace_with_multiline () {
	to_find="$1"; to_repl="$2"
	tmp_file=$(mktemp)
	trap "rm -rf $tmp_file" EXIT
	echo "$to_repl" > $tmp_file
	cat - | sed "/$to_find/ r $tmp_file" | sed "/$to_find/d"
}
