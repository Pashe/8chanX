#8chanX 2.0 Pure
##<a href="https://github.com/Pashe/8chan-X/raw/2-0_pure/8chan-x.user.js">Install</a>

This branch of the script should work on versions of Firefox past 30, and is meant to replace <a href="https://github.com/Pashe/8chan-X/tree/master">Version 1.x</a>. It accomplishes this by replacing all of the Greasemonkey features with native equivalents (e.g. GM_setValue -> localStorage.setItem) so it isn't forced into a sandbox. Really, it should just use the new sandbox functions, but the main branches work on Chrome and 27, and those are the only browsers I care about.
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