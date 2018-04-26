#!/usr/bin/env sh
#	docs/app/misc/git-hook-runner.sh
# Created by Leonard Pauli, 24 apr 2018
# <script> install all; <script> install pre-commit commit-msg;
# <script> install -noop all
inner_runner_parents="web"

all_hooks="applypatch-msg commit-msg prepare-commit-msg push-to-checkout sendemail-validate update"
all_hooks="$all_hooks pre-applypatch pre-auto-gc pre-commit pre-push pre-rebase pre-receive"
all_hooks="$all_hooks post-applypatch post-checkout post-commit post-merge post-receive post-rewrite post-update"

# install hooks
if [ "$1" = "install" ]; then
	shift;
	use_noop=""; if [ "$1" = "-noop" ]; then use_noop="1"; shift; fi
	enabled_hooks="$*"; if [ "$1" = "all" ]; then enabled_hooks="$all_hooks"; fi

	for hook_name in $enabled_hooks; do
		hook_file=".git/hooks/$hook_name"
		if [ -f "$hook_file" ]; then
			echo "$hook_file exists, skipping"
		else
			if [ ! -z "$use_noop" ]; then
				cat <<-EOF > $hook_file
				#!/usr/bin/env sh
				# noop
				EOF
			else
				cat <<-EOF > $hook_file
				#!/usr/bin/env sh
				./git-hook-runner.sh $hook_name \$*
				EOF
			fi
			chmod u+x $hook_file
		fi
	done
	exit	
fi

# check inner hooks
hook_name="$1"; shift; git_params="$*"
for parent in $inner_runner_parents; do
	(cd $parent && ./git-hook-runner-inner.sh $hook_name $git_params) || exit 1
done
