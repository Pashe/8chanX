// ==UserScript==
// @name        Pashe's 8chanX v2
// @version     2.0.0.pa-1418188820
// @description Small userscript to improve 8chan
// @namespace   https://github.com/Pashe/tree/2-0
// @updateURL   https://github.com/Pashe/8chan-X/raw/2-0/8chan-x.meta.js
// @downloadURL https://github.com/Pashe/8chan-X/raw/2-0/8chan-x.user.js

// @grant       GM_deleteValue
// @grant       GM_getValue
// @grant       GM_listValues
// @grant       GM_setValue
// @grant       unsafeWindow

// @require     https://8chan.co/js/jquery.min.js
// @require     https://8chan.co/js/jquery-ui.custom.min.js
// @require     https://github.com/alexei/sprintf.js/raw/master/src/sprintf.js

// @match       *://8chan.co/*
// @match       *://hatechan.co/*
// @match       *://jp.8chan.co/*
// @match       *://8ch.net/*
// ==/UserScript==

/*Contributors
** tux3
** Zaphkiel
** varemenos
** 7185
** Pashe
*/

////////////////
//GLOBAL VARIABLES
////////////////
//Constants
var threadsPerPage = 15;
var bumpLimit = 300;

//Initializations
var pages = null;

//Dynamic
var originalPageTitle = document.title;
var thisBoard = unsafeWindow.location.pathname.split("/")[1]=="mod.php"?unsafeWindow.location.href.split("/")[4]:unsafeWindow.location.pathname.split("/")[1];
try {var thisThread = parseInt(unsafeWindow.location.href.match(/([0-9]+)\.html/)[1]);} catch (e) {var thisThread = -1};

////////////////
//SETTINGS
////////////////
var settingsMenu = unsafeWindow.document.createElement('div');

if (unsafeWindow.Options) {
	var tab = unsafeWindow.Options.add_tab('8chanX', 'times', '8chanX');
	$(settingsMenu).appendTo(tab.content);
}

settingsMenu.innerHTML = sprintf('<span style="font-size:8pt;">8chanX %s</span>', GM_info.script.version)
+ '<div style="overflow:auto;height:240px;">'
+ '<label><input type="checkbox" name="precisePages">' + 'Increase page indicator precision' + '</label><br>'
+ '</div>';

var defaultSettings = {
	'precisePages': true
};

function getSetting(key) {
	return GM_getValue(key, defaultSettings[key]);
}

function setSetting(key, value) {
	GM_setValue(key, value);
}

function refreshSettings() {
	var settingsItems = settingsMenu.getElementsByTagName("input");
	for (i in settingsItems) {
		var control = settingsItems[i];
		
		switch (control.type) {
			case "checkbox":
				control.checked = getSetting(control.name);
				break;
			default:
				control.value = getSetting(control.name);
				break;
		}
	}
}

function setupControl(control) {
	if (control.addEventListener) control.addEventListener("change", function (e) {
		switch (control.type) {
			case "checkbox":
				setSetting(control.name, control.checked);
				break;
			default:
				setSetting(control.name, control.value);
				break;
		}
	}, false);
}

////////////////
//GENERAL FUNCTIONS
////////////////
function strEndsWith(str, s) {
  return str.length >= s.length && str.substr(str.length - s.length) == s;
}
  
function isOnCatalog() {
  return active_page === "catalog";
}

function isOnBoardIndex() {
  return active_page === "index";
}

function isOnThread() {
  return active_page === "thread";
}

function printf() {
	var key = arguments[0], cache = sprintf.cache
	if (!(cache[key] && cache.hasOwnProperty(key))) {
		cache[key] = sprintf.parse(key)
	}
	console.log(sprintf.format.call(null, cache[key], arguments))
}

function getThreadPage(threadId, boardId, cached) {
	var threadPage = -1;
	var precisePages = getSetting("precisePages");
	
	if ((!cached) || (pages == null)) {
		$.ajax({
			url: "/" + boardId + "/threads.json",
			async: false,
			dataType: "json",
			success: function (response) {pages = response;}
		});
	}
	
	for (var pageIdx in pages) {
		if (threadPage != -1) {break}
		var threads = pages[pageIdx]['threads'];
		
		for (threadIdx in threads) {
			if (threadPage != -1) {break}
			
			if (threads[threadIdx]['no'] == threadId) {
				if (!precisePages) {
					threadPage = pages[pageIdx]['page']+1;
				} else {
					threadPage = ((pages[pageIdx]['page']+1)+(threadIdx/threads.length)).toFixed(2)
				}
				break;
			}
		}
	}
	return threadPage;
}

////////////////
//INIT FUNCTIONS
////////////////
function initSettings() {
	refreshSettings();
	var settingsItems = settingsMenu.getElementsByTagName("input");
	for (var i = 0; i < settingsItems.length; i++) {
	  setupControl(settingsItems[i]);
	}
	if (settingsMenu.addEventListener && !window.Options) {
	  settingsMenu.addEventListener("mouseover", function (e) {
		refreshSettings();
		settingsMenu.getElementsByTagName("a") [0].style.fontWeight = "bold";
		settingsMenu.getElementsByTagName("div") [0].style.display = "block";
	  }, false);
	  settingsMenu.addEventListener("mouseout", function (e) {
		settingsMenu.getElementsByTagName("a") [0].style.fontWeight = "normal";
		settingsMenu.getElementsByTagName("div") [0].style.display = "none";
	  }, false);
	}
}

////////////////
//INIT CALLS
////////////////
initSettings();