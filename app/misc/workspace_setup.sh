#!/usr/bin/env sh
# $lpdocs/app/misc/workspace_setup.sh
# Created by Leonard Pauli 13 may 2018
# 
# usage:
# dev_window_setup='{w: 1920, h: 1200}' # or unset, optional
# "$lpdocs/app/misc/workspace_setup.sh" "$dev_window_setup" <<-EOF
# 	{type: "# default", [x: 0, y: 0, w: ..., h: ..., resize: true]}
# 	{type: "finder", [h: p's h, w: p's w / 2], [path: "...(defaults to pwd)"]}
# 	{type: "sublime", [path]}
# 	{type: "chrome", [url: "...(defaults to none)"]}
# 	{type: "iterm", [in_new: "window/tab/v_panel/h_panel", cmd: "pwd", m_down/m_left: 9, condition: $(some_cmd && echo true || echo false)]}
# EOF

dev_window_setup="$1"; xs_defaults="$(cat)" # "items" is reserved in applescript... so "xs" instead
script_dir="$(pwd)"

dev_window_setup_default='{w: 1920, h: 1200}'
dev_window_setup=${dev_window_setup:-$dev_window_setup_default}
dev_window_setup_xs_default="$(echo "$xs_defaults" | tr '\n' ',')"
dev_window_setup_xs_default="${dev_window_setup_xs_default%','}"

osascript <<EOF
set arrowkeys to {k_left:123, k_right:124, k_up:126, k_down:125}

set p to $dev_window_setup
set p to (p & {xs: {$dev_window_setup_xs_default}})
set setups to xs of p
set defaultDimentions to {x: 0, y: 0, w: 800, h: 500}


repeat with i from 1 to (count of setups)
	set setup to item i of setups
	set setup to (setup & defaultDimentions & {resize: true} & {condition: true})
	
	if setup's condition then

		if setup's type is "finder" then
			set setup to (setup & {path: "$script_dir"})

			tell application "Finder" to open setup's path as POSIX file
			tell application "Finder" to activate

			-- todo: add in_new: window/tab
			-- tell application "System Events" to keystroke "t" using {command down}
			-- delay 0.2

			if setup's resize then
				tell application "System Events" to tell application process "Finder"
					set win to front window
					get properties of win
					set win's position to {setup's x, setup's y}
					set win's size to {setup's w, setup's h}
				end tell
			end if
		end if

		if setup's type is "sublime" then
			set setup to (setup & {path: "$script_dir"})
			-- /Applications/Sublime Text.app/Contents/SharedSupport/bin/subl
			-- todo: change to type: editor + prefered_variant: {"sublime", "vscode", ...}, etc

			set patha to setup's path
			set filep to do shell script (("p='" & patha & "'; ") & "echo \"\$p\$([ -d \"\$p\" ] && echo '/' || \
				echo '')\$(([ -d \"\$p\" ] && (ls \"\$p\" | grep .sublime-project | head -n 1)) || echo '')\"")
			tell application "Sublime Text" to open filep
			delay 0.2

			if setup's resize then
				tell application "System Events" to tell application process "Sublime Text"
					set win to front window
					get properties of win
					set win's position to {setup's x, setup's y}
					set win's size to {setup's w, setup's h}
				end tell
			end if
		end if

		if setup's type is "chrome" then
			set setup to (setup & {url: ""})
			set theurl to setup's url

			tell application "Google Chrome"
				set win to make new window
				if setup's resize then
					set win's bounds to {setup's x, setup's y, setup's x + setup's w, setup's y + setup's h}
				end if

				if theurl isn't "" then set win's active tab's URL to theurl
				activate
			end tell
		end if

		if setup's type is "safari" then
			set setup to (setup & {url: ""})
			set theurl to setup's url
			log "type: safari not fully implemented, todo: resize, tab/window/fullscreen, change to type: browser + prefered_variant: {\"safari\", \"chrome\"}, etc"
			-- set value of attribute "AXFullScreen" of first window to true

			tell application "Safari"
				activate
				make new document with properties {URL: theurl}
			end tell
		end if

		if setup's type is "iterm" then
			set setup to (setup & {in_new: "window", cmd: "clear", m_down: 0, m_left: 0})
			-- todo: change to type: terminal + prefered_variant: {"item", "terminal", ...}, etc

			if setup's in_new is "window" then
				tell application "iTerm2"
					activate
					delay 0.1
					tell application "System Events" to keystroke "n" using {command down}
					delay 0.1

					if setup's resize then
						tell application "System Events" to tell application process "iTerm2"
							set win to front window
							get properties of win
							set win's position to {setup's x, setup's y}
							set win's size to {setup's w, setup's h}
						end tell
					end if
				end tell
			else if setup's in_new is "tab" then
				tell application "iTerm2" to activate
				delay 0.1
				tell application "System Events" to keystroke "t" using {command down}
			else if setup's in_new is "v_panel" then
				tell application "iTerm2" to activate
				delay 0.1
				tell application "System Events" to keystroke "d" using {shift down, command down}
			else if setup's in_new is "h_panel" then
				tell application "iTerm2" to activate
				delay 0.1
				tell application "System Events" to keystroke "d" using {command down}
			else
				log ("setup's in_new is unknown: " & setup's in_new)
			end if
			delay 0.1

			repeat (setup's m_down) times
				tell application "System Events" to key code (k_down of arrowkeys) using {command down, control down}
				delay 0.1
			end repeat
			repeat (setup's m_left) times
				tell application "System Events" to key code (k_left of arrowkeys) using {command down, control down}
				delay 0.1
			end repeat

			tell application "System Events" to keystroke ("cd \"$script_dir\"; clear; " & setup's cmd & "\n")
		end if

	end if -- condition
end repeat
EOF
