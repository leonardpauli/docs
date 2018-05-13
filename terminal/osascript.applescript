#!/usr/bin/osascript
-- terminal/osascript-reference
-- LeonardPauli/docs
-- Created/curated by Leonard Pauli, 25 apr 2018 (mostly snippets from apples docs, see their licensing/copyright rules)
-- 
-- Apple Script - used to automate osx
--
-- references/sources:
-- https://developer.apple.com/library/content/documentation/AppleScript/Conceptual/AppleScriptLangGuide/conceptual/ASLR_variables.html
-- TODO: first and last pages of apples guide not yet covered
-- TODO: clean up

-- from terminal:
-- #!/usr/bin/osascript
-- osascript -e 'tell app "Address Book" to get the name of every person' | perl -pe 's/, /\n/g' | sort | uniq -d
-- osascript -e 'say "line 1"' -e 'say "line 2"'
-- there is not command termination like semicolon;, so multilines is mostly required...


tell application "System Events" to keystroke "d" using {shift down, command down}
tell application "System Events" to keystroke "hello there\n"
set arrowkeys to {k_left:123, k_right:124, k_up:126, k_down:125} -- left, right, etc seems to be reserved words...
tell application "System Events" to key code (k_left of arrowkeys) -- using {command down, control down, option down, shift down}
repeat 9 times
	-- do something
end repeat
set mylist to {0,0, 1920, 1200}
set myvar to item 3 of mylist
set mypath to POSIX path of path of folder "~/projects/collaborations/attendance/web"
tell application "Finder"
	set win to make new Finder window
	set win's target to mypath
	set win's bounds to {wPosMidX, wPosMidY, wPosMaxX, wPosMaxY}
	activate
end tell
tell application "Sublime Text" to activate
delay 0.2
tell application "System Events" to tell application process "Sublime Text"
	set win to front window
	get properties of win
	set win's position to {wPosMinX, wPosMinY}
	set win's size to {wPosMidX, wPosMidY}
end tell
"cd " & (quoted form of finderFolderCD)
tell application "Google Chrome"
	set win to make new window
	set win's bounds to {wPosMidX, wPosMinY, wPosMaxX, wPosMidY}
	set win's active tab's URL to chromeURL
	activate
end tell
tell application "Safari"
	activate
	make new document with properties {URL:"https://google.com"}
end tell
tell application "System Events"
	tell process "Safari"
		set position of first window to {-1920, -1380}
		set value of attribute "AXFullScreen" of first window to true
	end tell
end tell
# Helpers
on makeTab()
	tell application "System Events" to keystroke "t" using {command down}
	delay 0.2
end makeTab
on lastA(array)
	return item -1 of array
end lastA
-- https://gist.github.com/reyjrar/1769355
on isAppRunning(appName)
	tell application "System Events" to (name of processes) contains appName
end isAppRunning

set AppleScript's text item delimiters to {"\n"}
tell application "System Events" to log (name of processes as string)


-- Reference

-- delimiters; string split / join
set AppleScript's text item delimiters to {", "}
{"bread", "milk", "butter", 10.45}  as string
set AppleScript's text item delimiters to {":"}
get last text item of "Hard Disk:CD Contents:Release Notes"

-- undefined
set myVariable to missing value
	-- perform operations that might change the value of myVariable
if myVariable is equal to missing value then
	-- the value of the variable never changed
else
	-- the value of the variable did change
end if

-- files
set notesFile to POSIX file "/Users/myUser/Feb_Meeting_Notes.rtf"
tell application "TextEdit" to open notesFile

-- interact
beep 3
display dialog "In factorial routine; x = " & (x as string)
say "hello"
delay
display alert
display dialog
display notification
say

-- loop over words
set wordList to words in "Where is the hammer?"
repeat with currentWord in wordList
	log currentWord
	if contents of currentWord is equal to "hammer" then
		display dialog "I found the hammer!"
	end if
end repeat

-- destructuring
set x to {8, 94133, {firstName:"John", lastName:"Chapman"}}
set {p, q, r} to x
(* now p, q, and r have these values:
				p = 8
				q = 94133
				r = {firstName:"John", lastName:"Chapman"}  *)
set {p, q, {lastName:r}} to x
(* now p, q, and r have these values: p = 8
									  q = 94133
									  r = "Chapman" *)

-- script definitions
script John
	property HowManyTimes : 0
	to sayHello to someone
		set HowManyTimes to HowManyTimes + 1
		return "Hello " & someone
	end sayHello
	display dialog "John received the run command"
end script
tell John to sayHello to "Herb" --result: "Hello Herb"
tell John to sayHello to "Herb" --result: "Hello Herb"
get John's HowManyTimes
John's sayHello to "Jake" --result: "Hello Jake"
sayHello of John to "Jake" --result: "Hello Jake"

tell John
	sayHello to "Herb"
	sayHello to "Grace"
end tell
tell John to run

-- initializing script objects
on makePoint(x, y)
	script thePoint
		property xCoordinate:x
		property yCoordinate:y
	end script
	return thePoint
end makePoint
 
set myPoint to makePoint(10,20)
get xCoordinate of myPoint  --result: 10
get yCoordinate of myPoint  --result: 20


-- inheritance
script John
	property vegetable : "Spinach"
end script
script JohnSon
	property parent : John
end script
set vegetable of John to "Swiss chard"
vegetable of JohnSon
--result: "Swiss chard"

script John
	property vegetable : "Spinach"
end script
script JohnSon
	property parent : John
	on changeVegetable()
		set my vegetable to "Zucchini"
	end changeVegetable
end script
tell JohnSon to changeVegetable()
vegetable of John
--result: "Zucchini"

script Elizabeth
	property HowManyTimes : 0
	to sayHello to someone
		set HowManyTimes to HowManyTimes + 1
		return "Hello " & someone
	end sayHello
end script
 
script ChildOfElizabeth
	property parent : Elizabeth
	on sayHello to someone
		if my HowManyTimes > 3 then
			return "No, I'm tired of saying hello."
		else
			continue sayHello to someone
		end if
	end sayHello
end script
tell Elizabeth to sayHello to "Matt"
--result: "Hello Matt", no matter how often the tell is executed
tell ChildOfElizabeth to sayHello to "Bob"
--result: "Hello Bob", the first four times the tell is executed;
--   after the fourth time: "No, I’m tired of saying hello."


-- handlers / functions
on rock around the clock
	display dialog (clock as text)
end rock
rock around the current date -- call handler to display current date

on helloWorld()
	display dialog "Hello World"
end
 
helloWorld() -- Call the handler



to findNumbers of numberList above minLimit given rounding:roundBoolean
		set resultList to {}
		repeat with i from 1 to (count items of numberList)
			set x to item i of numberList
			if roundBoolean then -- round the number
				-- Use copy so original list isn’t modified.
				copy (round x) to x
			end if
			if x > minLimit then
				set end of resultList to x
			end if
		end repeat
		return resultList
end findNumbers

set myList to {2, 5, 19.75, 99, 1}
findNumbers of myList above 19 given rounding:true
	--result: {20, 99}
findNumbers of myList above 19 given rounding:false
	--result: {19.75, 99}
findNumbers of {5.1, 20.1, 20.5, 33} above 20 with rounding
	--result: {33}
findNumbers of {5.1, 20.1, 20.5, 33.7} above 20 without rounding
	--result: {20.1, 20.5, 33.7}

to check for yourNumber from startRange thru endRange
	if startRange ≤ yourNumber and yourNumber ≤ endRange then
		display dialog "Congratulations! Your number is included."
	end if
end check
check for 8 from 7 thru 10 -- call the handler


on displayPoint({x, y})
	display dialog ("x = " & x & ", y = " & y)
end displayPoint
 
-- Calling the handler:
set testPoint to {3, 8}
displayPoint(testPoint)


on areaOfRectangleWithWidth:w height:h
	return w * h
end areaOfRectangleWithWidth:height:

its foo:5 bar:105 --this works
tell it to foo:5 bar:105 --as does this
foo:5 bar:105 --syntax error.
on tableView:t objectValueForTableColumn:c row:r -- gets translated to
on tableView_objectValueForTableColumn_row_(t, c, r)



-- implicit run handler
sayHello()
 
on sayHello()
	display dialog "Hello"
end sayHello

on run
	sayHello()
end run
 
on sayHello()
	display dialog "Hello"
end sayHello


-- quit handler
on quit
	display dialog "Really quit?" ¬
		buttons {"No", "Quit"} default button  "Quit"
	if the button returned of the result is "Quit" then
		continue quit
	end if
	-- Without the continue statement, the application doesn't quit.
end quit

-- launch a "non-stay-open application" and run its script
launch application "NonStayOpen"
run application "NonStayOpen"

-- launch "non-stay-open application" and run one of its handlers
tell application "NonStayOpen"
	launch
	stringTest("Some example text.")
end tell



--- https://developer.apple.com/library/content/documentation/AppleScript/Conceptual/AppleScriptLangGuide/reference/ASLR_classes.html
tell application "iTunes" -- doesn't automatically launch app
	if it is running then
		pause
	end if
end tell
You can also use this format:

if application "iTunes" is running
	tell application "iTunes" to pause
end if


application id "ttxt" -- by "signature"
application id "com.apple.TextEdit" -- by bundle id
application "/Applications/TextEdit.app" -- by POSIX path

-- applications are launched hidden by default if not told to activate
tell application X to activate
get X's name
get X's version
get X's frontmost -- boolean if some of its window is frontmost

-- operators
-- "and, or, not, &, =, and ≠, as well as their text equivalents: is equal to, is not equal to, equals"
-- ">, ≥, <, ≤, comes before, or comes after" (for dates)
-- (theString = "Yes") or (today = "Tuesday")
-- true & false --result: {true, false}
-- concatenation operator (&)
-- return companyName is equal to "Acme Baking"
-- class of {1, 2, "hello"} --result: list

considering punctuation but ignoring hyphens and white space
	"bet-the farm," = "BetTheFarm," --result: true
end considering
class of hyphens --result: constant

-- date
set theDate to current date
--result: "Friday, November 9, 2007 11:35:50 AM"
theDate's day -- read/write, integer
theDate's weekday -- read only, constant
-- Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, or Sunday
theDate's month -- read/write, constant
-- January, February, March, April, May, June, July, August, September, October, November, or December
theDate's year -- read/write, integer, eg. 2004
theDate's time -- read/write, integer, seconds since midnight, eg. 2700 for 00:45
theDate's date string -- read only, text, eg. "Friday, November 9, 2007"
theDate's short date string -- eg. "1/27/08"
theDate's time string -- eg. "3:20:24 PM"

date + timeDifference
--result: date
date - date
--result: timeDifference
date - timeDifference
--result: date
date "Friday, November 9, 2007" + 4 * days + 3 * hours + 2 *  minutes
--result: date "Tuesday, November 13, 2007 3:02:00 AM"
31449600 / weeks --result: 52.0
151200 div days --result: 1 -- div -> int, / -> real

date "8/9/2007, 17:06"
	 --result: date "Thursday, August 9, 2007 5:06:00 PM"
date "7/16/70"
	 --result: date "Wednesday, July 16, 2070 12:00:00 AM"
date "12:06" -- specifies a time on the current date
	 --result: date "Friday, November 9, 2007 12:06:00 PM"
date "Sunday, December 12, 1954 12:06 pm"
	 --result: date "Sunday, December 12, 1954 12:06:00 PM"
date "2:30 am" of date "Jan 1, 2008"



-- list
count {"a", "b", "c", 1, 2, 3} --result: 6
length of {"a", "b", "c", 1, 2, 3} --result: 
{"a", "b", "c", 1, 2, 3}'s reverse


-- files
set fileName to choose file name default location (POSIX file "/tmp")
--result: dialog starts in /tmp folder


-- records / dictionaries
count {name:"Robin", mileage:400} --result: 2

set myRecord to {product:"pen", price:2.34}
product of myRecord -- result: "pen"
 
set product of myRecord to "pencil"
product of myRecord -- result: "pencil"


-- reference
-- wraps object
-- get (a reference to X) -> returns a reference to X
-- contents of (a reference to X) -> returns X
-- other stuff is forwarded to wrapped object (eg. class of (a reference to X) -> returns X's class)


-- color
set redColor to {65535, 0, 0} -- red
set userColor to choose color default color redColor



-- text
set jp to "日本語"
set ru to "Русский"
jp & " and " & ru -- returns "日本語 and Русский"
jp's quoted form -- safe from further interpretation by the shell, useful for "do shell script" command
"hi"'s character -- {"h", "i"}
paragraphs of "this\n\nthat\n" --result: {"this", "", "that", ""}
-- "carriage return character (\r), a linefeed character (\n), a return/linefeed pair (\r\n), or the end of the text"
js's word

space -- " "
tab -- "\t"
return -- "\r"
linefeed -- "\n”

set docText to text of document "MyFavoriteFish.rtf" of application "TextEdit"
class of docText --result: text
first character of docText --result: a character
every paragraph of docText --result: a list containing all paragraphs
paragraphs 2 thru 3 of docText --result: a list containing two paragraphs
set folderName to quoted form of POSIX path of (choose folder)

-- substr
get text 3 thru 7 of "Try this at home"
--result: "y thi"


-- units
set circleArea to (pi * 7 * 7) as square yards --result: square yards 153.9380400259
circleArea as square feet --result: square feet 1385.4423602331

Length: centimetres, centimeters, feet, inches, kilometres, kilometers, metres, meters, miles, yards
Area: square feet, square kilometres, square kilometers, square metres, square meters, square miles, square yards
Cubic volume: cubic centimetres, cubic centimeters, cubic feet, cubic inches, cubic metres, cubic meters, cubic yards
Liquid volume: gallons, litres, liters, quarts
Weight: grams, kilograms, ounces, pounds
Temperature: degrees Celsius, degrees Fahrenheit, degrees Kelvin


-- https://developer.apple.com/library/content/documentation/AppleScript/Conceptual/AppleScriptLangGuide/reference/ASLR_cmds.html
...
set the clipboard to
the clipboard
...
info for
...
list folder
...
path to (application)
...
offset -- String.indexOf
...
choose application, choose remote application, choose URL
choose file, choose file name, choose folder,
choose from list, choose color


-- https://developer.apple.com/library/content/documentation/AppleScript/Conceptual/AppleScriptLangGuide/reference/ASLR_reference_forms.html
tell application "TextEdit"
	close every window whose name is not "Old Report.rtf"
end tell
...

-- https://developer.apple.com/library/content/documentation/AppleScript/Conceptual/AppleScriptLangGuide/reference/ASLR_operators.html
...

-- https://developer.apple.com/library/content/documentation/AppleScript/Conceptual/AppleScriptLangGuide/reference/ASLR_control_statements.html
...
repeat
	-- perform operations
	if someBooleanTest then
		exit repeat
	end if
end repeat