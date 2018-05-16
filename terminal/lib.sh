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
script_dir () { (a="/$0"; a=${a%/*}; a=${a:-.}; a=${a#/}; echo "$a"); }

# load_env () {
# 	# load_env -> load_env -f .env list of all # exports all vars from .env file
# 	# load_env var1 PORT some_other_var
# 	# env file: lines starting with # are skipped, var_name_1=value with spaces # and hashes = and equals
# 	# returns 1 if env file not found; if ! load_env; then echo 'no .env file found'; exit; fi
# 	envfile='.env'; if [ "$1" = "-f" ]; then shift; envfile="$1"; shift; fi
# 	if [ ! -f "$envfile" ]; then return 1; fi
# 	toload="$*"
# 	while read a <&3; do ([ "${a#'#'}" = "$a" ] && [ ! -z "$a" ]) \
# 		&& ([ -z "$toload" ] || (echo "$toload " | grep "$(echo "$a" | sed "s/=.*//") ")) \
# 		&& export "$a"
# 	done 3< "$envfile";
# }
# if ! load_env; then echo 'Please add it.'; exit; fi # load_env = load_env .env;
# lines starting with # are skipped, var_name_1=value with spaces # and hashes = and equals
load_env () { while read a <&3; do [ "${a#'#'}" = "$a" ] && [ ! -z "$a" ] && export "$a"; done 3< "${1:-.env}"; }

debug () { [ ! -z $debug_enabled ] && echo $*; }

# see https://linux.die.net/man/1/sponge (my own re-implementation)
# see terminal."editing file in place"
# TODO: should exit on error - instead of possibly emptying the file?
sponge () { if [ -z "$1" ]; then cat; else mytmp="$(mktemp)"; cat > $mytmp; mv $mytmp "$1"; fi }

# like cp -r, but only adds/overwrites files, no deletion (ie. no dir replacement)
# overlay_folder /base /target && overlay_folder /on-top /target
# TODO: will it have problem with filenames using spaces?
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

# sed "s/WEBROOT/$(sed_escaped_path "$ssl_acme_webroot")/g"
sed_escaped_path () { echo "$1" | sed "s/\//\\\\\//g"; }


# based on https://stackoverflow.com/questions/10909685/run-parallel-multiple-commands-at-once-in-the-same-terminal
# background_cmds_use; background_cmds_add 'sleep 3'; background_cmds_await;
background_cmds_use () {
	background_cmds_pids=""
	background_cmds_await () { wait $background_cmds_pids; }
	background_cmds_add () {
		echo "process '$1' started";
		$1 & pid=$!;
		background_cmds_pids="$background_cmds_pids $pid"
	}
	trap "kill $background_cmds_pids" EXIT # correct exit? SIGHUB, INT, etc?
	# also, won't multiple traps override each other? also, remove pid if process ends earlier
}
# background process, simpler use:
# heartbeat () { while [ "a" = "a" ]; do echo "loop $1"; sleep 1; done; }
# heartbeat a & pid_a=$!; trap "kill $pid_a" EXIT
# heartbeat b


eval_template () { # not "safe" in terms of eval
	# echo 'a\na {{echo "b\nb"}} c {{echo d}} e' | eval_template # -> 'a\na b\nb c d e'
	# hello=hi; echo '{{=$hello}} there' | eval_template # -> {{echo "$hello"}} there -> 'hi there'
	# echo '{{&=b="hello"}} {{&:a="$(sleep 1 && date)"}} {{=$a}} {{=$a}} {{echo there $b}}!' | eval_template
	#  use {{&=varname="$(code)"}} if you only need varname (eval:ed once)
	#  use {{&:code}} if code sets multiple vars (though will be run for every {{}})
	varstore=$(mktemp); trap "rm -rf $varstore" EXIT; echo "# TMP" > "$varstore"
	fn () {
		middle="$(cat)"
		case "$middle" in
			'='*) eval "$(cat "$varstore")"$'\n'"echo \"${middle#=}\"" ;; # '=$a' -> 'echo "$a"'
			'&='*) echo "$(echo "${middle#&=}" | sed 's/=.*//')='$(eval "$(cat "$varstore")"$'\n'"$(echo "${middle#&=}" | sed 's/[^=]*=/echo /')")'" >> "$varstore";;
			'&:'*) echo "${middle#&:}" >> "$varstore";;
			*) eval "$(cat "$varstore")"$'\n'"$middle";;
		esac
	}
	cat | replace_multiline_enclosed '{{' fn '}}'
}


replace_multiline_enclosed () {
	sub_start="$1"; shift; fn_name="$1"; shift; sub_end="$1"; shift; left="$(cat)";
	# uppercase () { cat | tr 'a-z' 'A-Z'; }; echo 'Hello [there]!' | replace_multiline_enclosed '\[' uppercase '\]'

	# make single-line, sanitize input against _SUB(START|END)_, a\ra {{echo "b\rb"}} c {{echo d}} e
	left="$(echo "$left" | tr '\n' '\r' | sed 's/_SUB/_ASUB/g')"

	while [[ ! -z "$left" ]]; do
		left="$(echo "$left" | sed "s/$sub_start/_SUBSTART_/")" # a\ra _SUBSTART_echo "b\rb"}} c {{echo d}} e
		printf '%s' "$(echo "$left" | sed 's/_SUBSTART_.*//' | sed 's/_ASUB/_SUB/g' | tr '\r' '\n')" # a\na
		
		lefttmp="$(echo "$left" | sed 's/.*_SUBSTART_//' | sed "s/$sub_end/_SUBEND_/")" # echo "b\rb"_SUBEND_ c {{echo d}} e
		if [ "$lefttmp" = "$left" ]; then left=''; break; fi
		left="$lefttmp"

		middle="$(echo "$left" | sed 's/_SUBEND_.*//' | tr '\r' '\n')" # echo "b\nb"
		[ ! -z "$middle" ] && printf '%s' "$(echo "$middle" | $fn_name | sed 's/_ASUB/_SUB/g')" # b\nb
		left="$(echo "$left" | sed 's/.*_SUBEND_//')" # c {{echo d}} e
	done
}

