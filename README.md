#8chanX 2.0
##<a href="https://github.com/Pashe/8chan-X/raw/2-0_pure/8chan-x.user.js">Install</a>

This version of the script should work on versions of Firefox past 30. <a href="https://github.com/Pashe/8chan-X/tree/master">Version 1.x</a> still works, though.
***

This is a small 8chan userscript, it adds various features and options like:
 * Post and image counts in the menu
 * Image hover
 * Relative post dates (n minutes/hours/days ago)

Additionally, this fork adds:
 * Thread page and visible autosage on the catalog and in the menu
 * Reverse image search links
 * Mascots
 * Notifications
 * Many other poorly written hacks
 * Slightly less dead than tux's version
 
This version adds:
 * Uses GM_{get,set}Value instead of localStorage to save settings
 * Fixes that thing where frequently updating threads would fuck everything up
 * Way more jQuery (maybe a bad thing)
 * Flag preview
 * Probably some other stuff I'm forgetting

This is a userscript, you will need <a href="https://addons.mozilla.org/en-US/firefox/addon/greasemonkey/">Greasemonkey</a> (Firefox), <a href="https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo">Tampermonkey</a> (Chrome), <a href="https://addons.opera.com/en/extensions/details/violent-monkey/">Violentmonkey</a> (Opera) or an equivalent extension to run it.

Key bindings
-----

####General

Key(s)  | Function
------- | --------
R       | Reloads the page
E       | Expands/shrinks all images
Q       | Opens the quick reply
Esc     | Closes the quick reply