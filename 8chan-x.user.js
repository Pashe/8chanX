// ==UserScript==
// @name        Pashe's 8chanX v2
// @version     2.0.0.pa-1418194830
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
// @require     https://raw.githubusercontent.com/rmm5t/jquery-timeago/master/jquery.timeago.js

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
+ '<label><input type="checkbox" name="relativeTime">' + 'Use relative post times' + '</label><br>'
+ '<label><input type="checkbox" name="hideTopBoards">' + 'Hide top boards' + '</label><br>'
+ '<label><input type="checkbox" name="catalogLinks">' + 'Force catalog links' + '</label><br>'
+ '</div>';

var defaultSettings = {
	'precisePages': true,
	'relativeTime': true,
	'hideTopBoards': true,
	'catalogLinks': true
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
  return unsafeWindow.active_page === "catalog";
}

function isOnBoardIndex() {
  return unsafeWindow.active_page === "index";
}

function isOnThread() {
  return unsafeWindow.active_page === "thread";
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
//MENU BAR
////////////////
function getMenuStats() {
	var nPosts = document.getElementsByClassName("post reply").length;
	var nImages = document.getElementsByClassName("post-image").length;
	var hlStyle = "<span style='color:#f00;font-weight:bold;'>";
	
	if (nPosts >= bumpLimit) {nPosts = hlStyle + nPosts + "</span>";}
	
	var threadPage = getThreadPage(thisThread, thisBoard, false);
	
	return sprintf(
		 '<span title="Posts">%s</span> / '
		+'<span title="Images">%s</span> / '
		+'<span title="Page">%s</span>',
		nPosts, nImages, (threadPage<1?"<span style='opacity:0.5'>???</span>":threadPage));
}

function updateMenuStats() {
	var stats = document.getElementById("menuStats");
	stats.innerHTML = getMenuStats();
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

function initRelativeTime() {
	if (getSetting('relativeTime')) {$("time").timeago();}
	
	// Show the relative time for new posts
	$(document).on('new_post', function (e, post) {  //TODO: Fix this
		if (getSetting('relativeTime')) {$("time").timeago();}
	});
};

function initMenu() {
	var menu = unsafeWindow.document.getElementsByClassName("boardlist")[0];
	var $menu = $(menu);
	
	$("[data-description='1'], [data-description='2']").hide();
	if (getSetting("hideTopBoards")) {
		var checkTopBoardsExist = setInterval(function() {
			if ($("[data-description='3']")[0]) {
				$("[data-description='3']").hide();
				clearInterval(checkTopBoardsExist);
			}
		}, 500);
	}
	
	if (getSetting('catalogLinks') && !isOnCatalog()) {
		$('.favorite-boards a').each( function (index, data) {
			$(this).attr("href", $(this).attr("href")+"/catalog.html");
		});
	}
	
	if (isOnThread()) {
		$('#update_secs').remove();
		
		var updateNode = $("<span></span>");
		updateNode.attr("id", "update_secs");
		updateNode.css("font-family", "'Source Code Pro', monospace");
		updateNode.css("padding-left", "3pt");
		updateNode.attr("title","Update thread");
		updateNode.click(function() {$('#update_thread').click();});
		updateNode.appendTo($menu);
		
		var statsNode = $("<span></span>");
		statsNode.html(getMenuStats());
		statsNode.attr("id", "menuStats");
		statsNode.css("padding-left", "3pt");
		statsNode.appendTo($menu);
	}
}

////////////////
//INIT CALLS
////////////////
initSettings();

$(unsafeWindow.document).ready(function() {
	initRelativeTime();
	initMenu();
});