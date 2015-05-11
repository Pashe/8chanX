// ==UserScript==
// @name        Pashe's 8chanX v2
// @version     2.0.0.1431302870
// @description Small userscript to improve 8chan
// @icon        https://cdn.rawgit.com/Pashe/8chanX/2-0/images/logo.svg
// @namespace   https://github.com/Pashe/8chanX/tree/2-0
// @updateURL   https://github.com/Pashe/8chanX/raw/2-0/8chan-x.meta.js
// @downloadURL https://github.com/Pashe/8chanX/raw/2-0/8chan-x.user.js

// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_listValues
// @grant       GM_deleteValue
// @grant       unsafeWindow

// @require     https://code.jquery.com/jquery-2.1.3.min.js
// @require     https://code.jquery.com/ui/1.11.2/jquery-ui.min.js
// @require     https://github.com/alexei/sprintf.js/raw/master/src/sprintf.js
// @require     https://raw.githubusercontent.com/rmm5t/jquery-timeago/master/jquery.timeago.js
// @require     https://raw.githubusercontent.com/samsonjs/strftime/master/strftime.js

// @match       *://hatechan.co/*
// @match       *://8chan.co/*
// @match       *://h.8chan.co/*
// @match       *://h.8ch.net/*
// @match       *://jp.8chan.co/*
// @match       *://jp.8ch.net/*
// @match       *://8ch.net/*
// ==/UserScript==

/*Contributors
** tux3
** Zaphkiel
** varemenos
** 7185
** anonish
** Pashe
*/

function chxErrorHandler(e, section) {
	console.error(e);
	console.trace();
	
	var rptObj = { //Chrome needs this
		name:          e?(e.name||"unknown"):"VERY unknown",
		msg:           e?(e.message||"unknown"):"VERY unknown",
		file:          e?((e.fileName||"unknown").split("/").slice(-1).join("")):"VERY unknown",
		line:          e?(e.lineNumber||"?"):"???",
		col:           e?(e.columnNumber||"?"):"???",
		section:       (section||"unknown"),
		scriptName:    (GM_info&&GM_info.script)?(GM_info.script.name||"unknown"):"VERY unknown",
		scriptVersion: (GM_info&&GM_info.script)?(GM_info.script.version||"unknown"):"VERY unknown",
		gmVersion:     (GM_info&&GM_info.version)?(GM_info.version||"unknown"):"VERY unknown",
		activePage:    unsafeWindow?(unsafeWindow.active_page||"unknown"):"VERY unknown",
		browser:       (unsafeWindow&&unsafeWindow.navigator)?((unsafeWindow.navigator.userAgent||"unknown").match(/(Chrom\S*|\S*fox\/\S*|Ice\S*)/gi)||["unknown"]).join(", "):"VERY unknown",
		userAgent:     (unsafeWindow&&unsafeWindow.navigator)?(unsafeWindow.navigator.userAgent||"unknown"):"VERY unknown",
		location:      (unsafeWindow&&unsafeWindow.location)?(unsafeWindow.location.href||"unknown"):"VERY unknown",
		stack:         e?((e.stack||"unknown").replace(/file:[^ \n]*\//g, "file:").replace(/^/gm, "  ")):"VERY unknown",
	};
	
	console.error(sprintf(
		"8chanX experienced an error. Please include the following information with your report:\n"+ 
		"[code]%s in %s/%s @ L%s C%s: %s\n\nVersion: %s (2-0@%s)\nGreasemonkey: %s\nActive page: %s\nBrowser: %s\nUser agent: %s\nLocation: %s\nStack:\n%s[/code]",
		rptObj.name, rptObj.file, rptObj.section, rptObj.line, rptObj.col, rptObj.msg,
		rptObj.scriptName, rptObj.scriptVersion,
		rptObj.gmVersion,
		rptObj.activePage,
		rptObj.browser,
		rptObj.userAgent,
		rptObj.location,
		rptObj.stack
	));
	
	alert("8chanX experienced an error. Check the console for details (typically F12).");
}

try {
////////////////
//GLOBAL VARIABLES
////////////////
//Constants
var bumpLimit = 300;

//Initializations
var thisThread;
var cachedPages = null;
var galleryImages;
var galleryImageIndex;

//Dynamic
var isMod = (unsafeWindow.location.pathname.split("/")[1]=="mod.php");
var thisBoard = isMod?unsafeWindow.location.href.split("/")[4]:unsafeWindow.location.pathname.split("/")[1];
try {thisThread = parseInt(unsafeWindow.location.href.match(/([0-9]+)\.html/)[1]);} catch (e) {thisThread = -1;}
var thisBoardAnonName;

////////////////
//SETTINGS
////////////////
var settingsMenu = unsafeWindow.document.createElement('div');

if (unsafeWindow.Options) {
	var tab = unsafeWindow.Options.add_tab('8chanX', 'times', '8chanX');
	$(settingsMenu).appendTo(tab.content);
}
settingsMenu.innerHTML = sprintf('<span style="font-size:8pt;">8chanX %s</span>', GM_info.script.version)
+ '<div style="overflow:auto;height:100%;">' //General
+ '<label><input type="checkbox" name="catalogLinks">' + 'Force catalog links' + '</label><br>'
+ '<label><input type="checkbox" name="revealImageSpoilers">' + 'Reveal image spoilers' + '</label><br>'
+ '<label><input type="checkbox" name="hideNoFilePosts">' + 'Hide posts without files' + '</label><br>'
+ '<label><input type="checkbox" name="keyboardShortcutsEnabled">' + 'Enable keyboard shortcuts' + '</label><br>'
+ '<hr>' //How information is displayed
+ '<label><input type="checkbox" name="reverseImageSearch">' + 'Add reverse image search links' + '</label><br>'
+ '<label><input type="checkbox" name="parseTimestampImage">' + 'Guess original download date of imageboard-style filenames' + '</label><br>'
+ '<label><input type="checkbox" name="precisePages">' + 'Increase page indicator precision' + '</label><br>'
+ '<label>' + 'Mascot URL(s) (pipe separated):<br />' + '<input type="text" name="mascotUrl" style="width: 30em"></label><br>'
+ '<label>' + '<a href="http://strftime.net/">Date format</a>:<br />' + '<input type="text" name="dateFormat" style="width:30em"></label><br>'
+ '<label><input type="checkbox" name="localTime">' + 'Use local time' + '</label><br>'
+ '<hr>' //Filters
+ '<h3>Filters</h3>'
+ '<table style="text-align:center;">'
+ '<tr><th>Field</th><th title="Regular expressions seperated with &quot;````&quot;. Boards may be specified like this: &quot;fag```a,b,c&quot;, which will filter &quot;fag&quot; on /a/, /b/, and /c/">Regex</th><th title="Recursive: If this is checked, replies to filtered posts will also be removed">R</th><th title="Stubs: If this is not checked, filtered posts will be removed completely">S</th><th title="All: If this is checked, all posts of this type will be removed, ignoring regex">A</th></tr>'

+ '<tr><td class="chx_FilterField">Tripcode</td><td><input type="text" name="filterTripsRegex" style="width:25em"></td><td><input type="checkbox" name="filterTripsRecursive"></td><td><input type="checkbox" name="filterTripsStubs"></td><td><input type="checkbox" name="filterTrips"></td></tr>'

+ '<tr><td class="chx_FilterField">Name</td><td><input type="text" name="filterNamesRegex" style="width:25em"></td><td><input type="checkbox" name="filterNamesRecursive"></td><td><input type="checkbox" name="filterNamesStubs"></td><td><input type="checkbox" name="filterNames"></td></tr>'

+ '<tr><td class="chx_FilterField">Body</td><td><input type="text" name="filterBodyRegex" style="width:25em"></td><td><input type="checkbox" name="filterBodyRecursive"></td><td><input type="checkbox" name="filterBodyStubs"></td><td><input type="checkbox" name="filterBody"></td></tr>'

+ '<tr><td class="chx_FilterField">Email</td><td><input type="text" name="filterEmailRegex" style="width:25em"></td><td><input type="checkbox" name="filterEmailRecursive"></td><td><input type="checkbox" name="filterEmailStubs"></td><td><input type="checkbox" name="filterEmail"></td></tr>'

+ '<tr><td class="chx_FilterField">Subject</td><td><input type="text" name="filterSubjectRegex" style="width:25em"></td><td><input type="checkbox" name="filterSubjectRecursive"></td><td><input type="checkbox" name="filterSubjectStubs"></td><td><input type="checkbox" name="filterSubject"></td></tr>'

+ '<tr><td class="chx_FilterField">Flag</td><td><input type="text" name="filterFlagRegex" style="width:25em"></td><td><input type="checkbox" name="filterFlagRecursive"></td><td><input type="checkbox" name="filterFlagStubs"></td><td><input type="checkbox" name="filterFlag"></td></tr>'

+ '</table>'
+ '<hr>' //Other shit
+ '<button id="chx_purgeDeadFavorites">' + 'Clean favorites' + '</button>'
+ '<button id="chx_clearLocalStorage">' + 'Clear localStorage' + '</button>'
+ '<button id="chx_clearChxSettings">' + 'Clear 8chanX settings' + '</button>'
+ '</div>';

$(settingsMenu).find(".chx_FilterField").css("text-align", "right");
$(settingsMenu).find('input').css("max-width", "100%");


var defaultSettings = {
	'precisePages': true,
	'catalogLinks': true,
	'revealImageSpoilers': false,
	'reverseImageSearch': true,
	'parseTimestampImage': true,
	'localTime': true,
	'dateFormat':"",
	'mascotUrl':"",
	'keyboardShortcutsEnabled': true,
	'filterDefaultRegex': '',
	'filterDefaultRecursive': true,
	'filterDefaultStubs': false,
	'filterDefault': false,
	'hideNoFilePosts': false,
};

function getSetting(key) {
	if (GM_getValue(key)) {
		return JSON.parse(GM_getValue(key));
	} else {
		try {
			var keyMatch = key.match(/filter([A-Z][a-z]*)([A-Z][a-z]*)?/);
			if (!keyMatch) {
				return defaultSettings[key];
			} else {
				return defaultSettings["filterDefault"+(keyMatch.hasOwnProperty(2)?keyMatch[2]:"")];
			}
		} catch(e) {console.error(e);}
	}
}

function setSetting(key, value) {
	GM_setValue(key, JSON.stringify(value));
}

function refreshSettings() {
	var settingsItems = settingsMenu.getElementsByTagName("input");
	for (var i in settingsItems) {
		if (!settingsItems.hasOwnProperty(i)) {continue;}
		var control = settingsItems[i];
		if (!control.name) {continue;}
		
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
	switch (control.type) {
		case "checkbox":
			$(control).on("change", function () {
				setSetting(this.name, this.checked);
			});
			break;
		default:
			$(control).on("input", function () {
				setSetting(this.name, this.value);
			});
			break;
	}
}

////////////////
//GENERAL FUNCTIONS
////////////////
function contentEval(source) {  // GFDL 1.2 http://wiki.greasespot.net/Content_Script_Injection
	// Check for function input.
	if ('function' == typeof source) {
		// Execute this function with no arguments, by adding parentheses.
		// One set around the function, required for valid syntax, and a
		// second empty set calls the surrounded function.
		source = '(' + source + ')();'
	}

	// Create a script node holding this  source code.
	var script = document.createElement('script');
	script.setAttribute("type", "application/javascript");
	script.textContent = source;

	// Insert the script node into the page, so it will run, and immediately
	// remove it to clean up.
	document.body.appendChild(script);
	document.body.removeChild(script);
}

function isOnCatalog() {
	return unsafeWindow.active_page === "catalog";
}

function isOnThread() {
	return unsafeWindow.active_page === "thread";
}

function printf() { //alexei et al, 3BSD
	var key = arguments[0], cache = sprintf.cache;
	if (!(cache[key] && cache.hasOwnProperty(key))) {
		cache[key] = sprintf.parse(key);
	}
	console.log(sprintf.format.call(null, cache[key], arguments));
}

function getThreadPage(threadId, boardId, cached) { //Pashe, WTFPL
	if ((!cached) || (cachedPages === null)) {
		$.ajax({
			url: "/" + boardId + "/threads.json",
			async: false,
			dataType: "json",
			success: function (response) {cachedPages = response;}
		});
	}
	
	return calcThreadPage(cachedPages, threadId);
}

function calcThreadPage(pages, threadId) { //Pashe, WTFPL
	var threadPage = -1;
	var precisePages = getSetting("precisePages");
	
	for (var pageIdx in pages) {
		if (!pages.hasOwnProperty(pageIdx)) {continue;}
		if (threadPage != -1) {break;}
		var threads = pages[pageIdx].threads;
		
		for (var threadIdx in threads) {
			if (!threads.hasOwnProperty(threadIdx)) {continue;}
			if (threadPage != -1) {break;}
			
			if (threads[threadIdx].no == threadId) {
				if (!precisePages) {
					threadPage = pages[pageIdx].page+1;
				} else {
					threadPage = ((pages[pageIdx].page+1)+(threadIdx/threads.length)).toFixed(2);
				}
				break;
			}
		}
	}
	return threadPage;
}

function getThreadPosts() { //Pashe, WTFPL
	return $(".post").length;
}

function getThreadImages() { //Pashe, WTFPL
	return $(".post-image").length;
}

function getFileExtension(filename) { //Pashe, WTFPL
	if (filename.match(/\.([a-z0-9]+)(&loop.*)?$/i) !== null) {
		return filename.match(/\.([a-z0-9]+)(&loop.*)?$/i)[1];
	} else if (filename.match(/https?:\/\/(www\.)?youtube.com/)) {
		return 'Youtube';
	} else {
		return sprintf("unknown: %s", filename);
	}
}

function isImage(fileExtension) { //Pashe, WTFPL
	return ($.inArray(fileExtension, ["jpg", "jpeg", "gif", "png"]) !== -1);
}

function isVideo(fileExtension) { //Pashe, WTFPL
	return ($.inArray(fileExtension, ["webm", "mp4"]) !== -1);
}

////////////////
//MENU BAR
////////////////
function updateMenuStats() { //Pashe, WTFPL
	var nPosts = getThreadPosts(thisThread, thisBoard, false);
	if (nPosts >= bumpLimit) {nPosts = sprintf('<span style="color:#f00;font-weight:bold;">%d</span>', nPosts);}
	
	$("#chx_menuPosts").html(nPosts);
	$("#chx_menuImages").html(getThreadImages(thisThread, thisBoard, false));
	
	$.ajax({
		url: "/" + thisBoard + "/threads.json",
		async: true,
		dataType: "json",
		success: function (response) {
			cachedPages = response;
			
			var nPage = calcThreadPage(response, thisThread);
			if (nPage < 1 ) {nPage = "<span style='opacity:0.5'>???</span>";}
			
			$("#chx_menuPage").html(nPage);
		}
	});
	
}

////////////////
//KEYBOARD SHORTCUTS
////////////////
function reloadPage() { //Pashe, WTFPL
	if (isOnThread()) {
		unsafeWindow.$('#update_thread').click();
		updateMenuStats();
	} else {
		document.location.reload();
	}
}

function showQR() { //Pashe, WTFPL
	unsafeWindow.$(window).trigger('cite');
	$("#quick-reply textarea").focus();
}

function toggleExpandAll() { //Tux et al, MIT
	var shrink = unsafeWindow.$('#shrink-all-images a');
	if (shrink.length) {
		shrink.click();
	} else {
		unsafeWindow.$('#expand-all-images a').click();
	}
}

function goToCatalog() { //Pashe, WTFPL
	if (isOnCatalog()) {return;}
	unsafeWindow.location = sprintf("/%s/catalog.html", thisBoard);
}

////////////////
//REVERSE IMAGE SEARCH
////////////////
var RISProviders = {
	"google": {
		"urlFormat" : "https://www.google.com/searchbyimage?image_url=%s",
		"name"      : "Google"
	},
	"iqdb": {
		"urlFormat" : "http://iqdb.org/?url=%s",
		"name"      : "iqdb"
	},
	"saucenao": {
		"urlFormat" : "https://saucenao.com/search.php?db=999&url=%s",
		"name"      : "SauceNAO"
	},
	"tineye": {
		"urlFormat" : "https://www.tineye.com/search/?url=%s",
		"name"      : "TinEye"
	},
	"harrylu": {
		"urlFormat" : "https://iqdb.harry.lu/?url=%s",
		"name"      : "Harry.lu (e621)",
		"shortName" : "E"
	},
	"karmadecay": {
		"urlFormat" : "http://karmadecay.com/%s",
		"name"      : "Karma Decay"
	},
};

var RISProvidersBoards = {
	"##ALL": ["google", "iqdb", "saucenao", "tineye", "karmadecay"],
	"furry": ["harrylu"],
};

function addRISLinks(image) { //Pashe, 7185, WTFPL
	var thisBoardRISProviders = (RISProvidersBoards["##ALL"].concat(RISProvidersBoards[thisBoard]||[]));
	for (var providerIdx in thisBoardRISProviders) {
		providerIdx = thisBoardRISProviders[providerIdx];
		if (!RISProviders.hasOwnProperty(providerIdx)) {continue;}
		var provider = RISProviders[providerIdx];
		
		try {
			var RISUrl;
			if (!image.src.match(/\/spoiler.png$/)) {
				RISUrl = sprintf(provider.urlFormat, image.src);
			} else {
				RISUrl = sprintf(provider.urlFormat, image.parentNode.href);
			}
			
			var RISLink = $('<a class="chx_RISLink"></a>');
			RISLink.attr("href", RISUrl);
			RISLink.attr("title", provider.name);
			RISLink.attr("target", "_blank");
			RISLink.css("font-size", "8pt");
			RISLink.css("margin-left", "2pt");
			RISLink.text(sprintf("[%s]", provider.shortName||provider.name[0].toUpperCase()));
			
			RISLink.appendTo(image.parentNode.parentNode.getElementsByClassName("fileinfo")[0]);
		} catch (e) {}
	}
}

////////////////
//NOTIFICATIONS
////////////////
function notifyReplies() {
	/*
	* taken from https://github.com/ctrlcctrlv/8chan/blob/master/js/show-own-posts.js
	*
	* Released under the MIT license
	* Copyright (c) 2014 Marcin Labanowski <marcin@6irc.net>
	*/
	
	var thread = $(this).parents('[id^="thread_"]').first();
	if (!thread.length) {thread = $(this);}
	
	var ownPosts = JSON.parse(unsafeWindow.localStorage.own_posts || '{}');
	
	$(this).find('div.body:first a:not([rel="nofollow"])').each(function() {
		var postID = $(this).text().match(/^>>(\d+)$/);
		
		if (postID !== null && postID.hasOwnProperty(1)) {
			postID = postID[1];
		} else {
			return;
		}
		
		if (ownPosts[thisBoard] && ownPosts[thisBoard].indexOf(postID) !== -1) {
			var replyPost = $(this).closest("div.post");
			var replyUser = (replyPost.find(".name").text()+replyPost.find(".trip").text());
			var replyBody = replyPost.find(".body").text();
			var replyImage = replyPost.find(".post-image").first().attr('src');
			
			new Notification(replyUser+" replied to your post", {body:replyBody,icon:replyImage});
		}
	});
}

////////////////
//GALLERY
////////////////
var fileExtensionStyles = {
	"jpg":  {"background-color": "#0f0", "color": "#000"}, "jpeg": {"background-color": "#0f0", "color": "#000"},
	"png":  {"background-color": "#00f", "color": "#fff"},
	"webm": {"background-color": "#f00", "color": "#000"}, "mp4": {"background-color": "#a00", "color": "#000"},
	"gif": {"background-color": "#ff0", "color": "#000"},
};

function refreshGalleryImages() { //Pashe, 7185, WTFPL
	galleryImages = [];
	
	$("img.post-image").each(function() {
		var metadata = $(this).parent("a").siblings(".fileinfo").children(".unimportant").text().replace(/[()]/g, '').split(", ");
		if (!this.src.match(/\/deleted.png$/)) {
			galleryImages.push({
				"thumbnail":  this.src,
				"full":       this.parentNode.href,
				"fileSize":   metadata[0],
				"resolution": metadata[1],
				"aspect":     metadata[2],
				"origName":   metadata[3],
			});
		}
	});
}

function openGallery() { //Pashe, WTFPL
	refreshGalleryImages();
	
	var galleryHolder = $("<div id='chx_gallery'></div>");
	galleryHolder.appendTo($("body"));
	
	galleryHolder.css({
		"background-color": "rgba(0,0,0,0.8)",
		"overflow":         "auto",
		"z-index":          "101",
		"position":         "fixed",
		"left":             "0",
		"top":              "0",
		"width":            "100%",
		"height":           "100%"
	});
	
	galleryHolder.click(function(e) {
		if(e.target == this) $(this).remove();
	});
	
	for (var i in galleryImages) {
		if (!galleryImages.hasOwnProperty(i)) {continue;}
		var image = galleryImages[i];
		var fileExtension = getFileExtension(image.full);
		
		var thumbHolder = $('<div class="chx_galleryThumbHolder"></div>');
		var thumbLink = $(sprintf('<a class="chx_galleryThumbLink" href="%s" data-extension="%s"></a>', image.full, fileExtension));
		var thumbImage = $(sprintf('<img class="chx_galleryThumbImage" src="%s" />', image.thumbnail));
		var metadataSpan = $(sprintf('<span class="chx_galleryThumbMetadata">%s</span>', fileExtension));
		
		thumbImage.css({
			"max-height": "128px",
			"max-width":  "128px",
			"margin":     "auto auto auto auto",
			"display":    "block"
		});
		
		thumbHolder.css({
			"padding":    "0pt 0pt 0pt 0pt",
			"height":     "155px",
			"width":      "128px",
			"overflow":   "hidden",
			"float":      "left",
			"text-align": "center",
			"color":      "#fff"
		});
		
		metadataSpan.css({
			"cursor": "pointer",
		});
		
		if (fileExtensionStyles.hasOwnProperty(fileExtension)) {
			metadataSpan.css(fileExtensionStyles[fileExtension]).css({"padding": "0pt 5pt 2pt 5pt", "border-radius": "2pt", "font-weight": "bolder"});
		}
		
		thumbImage.appendTo(thumbLink);
		thumbLink.appendTo(thumbHolder);
		metadataSpan.appendTo(thumbHolder);
		thumbHolder.appendTo(galleryHolder);
		
		metadataSpan.click(fileExtension, function(e) {
			$(sprintf('.chx_galleryThumbLink[data-extension=%s]', e.data)).each(function(i) {
				$this = $(this);
				if ($this.attr("data-hidden") === "false" || $this.attr("data-hidden") === undefined) {
					if (i === 0) {$this.hide();} else {$this.parent().hide();}
					$this.attr("data-hidden", "true");
				} else {
					if (i === 0) {$this.show();} else {$this.parent().show();}
					$this.attr("data-hidden", "false");
				}
			});
		});
		
		thumbLink.click(i, function(e) {
			e.preventDefault();
			expandGalleryImage(parseInt(e.data));
		});
	}
}

function closeGallery() { //Pashe, WTFPL
	if ($("#chx_galleryExpandedImageHolder").length) {
		$("#chx_galleryExpandedImageHolder").remove();
	} else {
		$("#chx_gallery").remove();
	}
}

function toggleGallery() { //Pashe, WTFPL
	if ($("#chx_gallery").length) {
		closeGallery();
	} else {
		openGallery();
	}
}

function expandGalleryImage(index) { //Pashe, WTFPL
	galleryImageIndex = index;
	var expandedImage;
	var image = galleryImages[index].full;
	var imageHolder = $('<div id="chx_galleryExpandedImageHolder"></div>');
	var fileExtension = getFileExtension(image);
	
	if (isImage(fileExtension)) {
		expandedImage = $(sprintf('<img class="chx_galleryExpandedImage" src="%s" />', image));
		expandedImage.css({
			"max-height": "98%",
			"max-width":  "100%",
			"margin":     "auto auto auto auto",
			"display":    "block"
		});
	} else if (isVideo(fileExtension)) {
		image = image.match(/player\.php\?v=([^&]*[0-9]+\.[a-z0-9]+).*/i)[1];
		expandedImage = $(sprintf('<video class="chx_galleryExpandedImage" src="%s" autoplay controls>Your browser is shit</video>', image));
		expandedImage.css({
			"max-height": "98%",
			"max-width":  "100%",
			"margin":     "auto auto auto auto",
			"display":    "block"
		});
	} else {
		expandedImage = $(sprintf('<iframe class="chx_galleryExpandedImage" src="%s"></iframe>', image));
		expandedImage.css({
			"max-height": "98%",
			"max-width":  "100%",
			"height":     "98%",
			"width":      "100%",
			"margin":     "auto auto auto auto",
			"display":    "block"
		});
	}
	
	imageHolder.css({
		"background-color": "rgba(0,0,0,0.8)",
		"overflow":         "auto",
		"z-index":          "102",
		"position":         "fixed",
		"left":             "0",
		"top":              "0",
		"width":            "100%",
		"height":           "100%"
	});
	
	imageHolder.appendTo($("body"));
	expandedImage.appendTo(imageHolder);
	imageHolder.click(function(e) {
		if(e.target == this) $(this).remove();
	});
}

function jogExpandedGalleryImage(steps) {
	if ($("#chx_galleryExpandedImageHolder").length && galleryImages.hasOwnProperty(galleryImageIndex+steps)) {
		$("#chx_galleryExpandedImageHolder").remove();
		expandGalleryImage(galleryImageIndex+steps);
	}
}

////////////////
//FILTERS
////////////////
function hidePost(post, recursive, stubs) { //Pashe, WTFPL
	if (!stubs) {
		post.jqObj.hide();
		post.jqObj.next("br").remove();
	} else {
		unsafeWindow.$("#reply_"+post.no).find(".post-hide-link").trigger("click");
	}
	
	if (recursive && post.ment.length) {
		for (var i in post.ment) {
			if (!post.ment.hasOwnProperty(i)) {continue;}
			
			if (!stubs) {
				$("#reply_"+post.ment[i]).hide();
				$("#reply_"+post.ment[i]).next("br").remove();
			} else {
				unsafeWindow.$("#reply_"+post.ment[i]).find(".post-hide-link").trigger("click");
			}
		}
	}
}

function runFilter() { //Pashe, WTFPL
	var $this = $(this);
	
	var thisPost = {
		trip:  $this.find("span.trip").text(),
		name:  $this.find("span.name").text(),
		body:  $this.find("div.body").text(),
		email: $this.find("a.email").attr("href"),
		sub:   $this.find("span.subject").text(),
		flag:  $this.find("img.flag").attr("title"),

		cap:   $this.find("span.capcode").text(),
		ment:  $this.find(".mentioned").text().length?$this.find(".mentioned").text().replace(/>>/g, "").replace(/ $/, "").split(" "):[],
		
		// date:  $this.find("time").attr("datetime"),
		no:    $this.find("a.post_no").first().next().text(),
		
		jqObj: $this,
		// stdObj: this,
	};
	
	if (thisPost.trip == "!!tKlE5XtNKE") {
		$this.find("span.trip").after($(' <span class="capcode" title="Green is my pepper; I shall not want."><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAFo9M/3AAADgUlEQVQ4y2VTbUyTVxS+VZaYqMtcHFHjZCEbsgwR2jS0EKCLSJnMSoGy0toKFUvpB/TjpX37SfuuDChSJlTHqiIBqTJF14JMous0hERj5uIPib+XLCbLsvhj/tig58y+Vea28+e55z7POffce88hhnYBWTf9aTGyi/H5oxxidYqhN65AgohkONmJsR/7UqFkK5KW3Pc2uFtK0KYqxsC1I5mY3mjbdBpP3dUQYjhfe6adKk11aAtWgzfV24lJJ3xumZCCbkwEgcQxHpFtyv6IYg6AdVAE5HUzqHkl3pnmv05FtD+Pzh79I733xW1JhjSPHP6zc1wF1C0tMBc9EFp2QexhFMOLlsPEINmfpSvNp3y28rVuXyXQ9jIwh8uh53oT9sw07yU7Xh5hE7wPDlkxnsjd8VjJ24WOuEr8EAczpKm3hvMCOFNL4UnyX6Of2Uh9ffHbodGGkZNJGp2t+c+iTxh/mpt9/Cgj8sw1o93fAENJLQwndCmbpwC/XLYlWPKEQyjqnlJj17VWmHg0A4pRIXy78h2MLbkz76iXFJY7nFXY0V8NrqsKVIcE4LksTTEJxdP1OixqPrroCvCOfAomqgjs56tTzJx6ZV1gqih4QnWVgd1XgZ3qfeiI1a72XpGOZcj8PNKwdYvWJd6HXjn3qSp7G2q6uL//77rGOdW/fN+5puGRW67fZqeCtQOSd7iJCzL+Ky50r4NFZkFKiC5yaGPaUQTLiuwx+dLns/pfKXc9aiyl2H/HjOM/MOgIiZEO1+BQRIIDicZz3tvynWwj3VRuYDMdc1bm0DH5T3RcifbpxjXn9Gfgnm8B5no70KMycE3UgW9CBgM3jqeiD4IYvR/C/sX2g+vltqkLj3R6qpA+24q2sxowTirAGtfAV/fPoOeSBRv7+GD6RgbhpBci35vx5KIG+260/ZPARHZuNTZz5x1GITr1glWbpwKsQ2LwTcrByohAz/DBEhGB40JNynu1HgNx5YrvinovG9xRnJeVxuN7cg6Z67jPe4xlSOsESL1oSzoggm6LEIw0H6ivP0HntGTNn2jC4IJy2X+pbhebQLrlLc7LQt7Q5O2565QWodMgBLr/ILjdlUh9/CF28XKQsvKw+3I1Oi7W/BIYrCpMB/gna9kPIK+NN5G+udkr274NdB+8i/b9uRYeIbtFWVmnSzkbF0o2bT7wSsfNzmPxb3jllxw700zlAAAAAElFTkSuQmCC" style="width:16px;height:16px;" /> 8chanX</span>'));
		return;
	}
	
	if (isMod) {return;}
	
	if (getSetting("hideNoFilePosts") && (!$this.find("div.file").length)) {
		hidePost(thisPost, false, false);
		return;
	}
	
	var filterTypes = {
		trip: "Trips",
		name: "Names",
		body: "Body",
		email: "Email",
		sub: "Subject",
		flag: "Flag",
	};
	
	for (var i in filterTypes) {
		if (!filterTypes.hasOwnProperty(i) || !thisPost[i]) {continue;}
		
		var filterType = filterTypes[i];
		var filterField = thisPost[i];
		
		var filterHideAll = getSetting(sprintf("filter%s", filterType));
		var filterRecursive = getSetting(sprintf("filter%sRecursive", filterType));
		var filterStubs = getSetting(sprintf("filter%sStubs", filterType));
		var filterRegex = getSetting(sprintf("filter%sRegex", filterType));
		
		if ((filterHideAll && filterType !== "Names") && filterField.length) {
			hidePost(thisPost, filterRecursive, filterStubs);
		} else if ((thisBoardAnonName !== undefined) && (filterHideAll && filterType === "Names") && (filterField !== thisBoardAnonName)) {
			hidePost(thisPost, filterRecursive, filterStubs);
		} else if (filterRegex) {
			filterRegex = filterRegex.split('````');
			for (var i in filterRegex) {
				var thisRegex;
				var thisRegexStr = filterRegex[i].split("```")[0];
				
				if (filterRegex[i].split("```").length > 1) {
					var thisRegexBoards = filterRegex[i].split("```")[1].split(",");
					for (var i in thisRegexBoards) {
						if (thisBoard.match(RegExp(thisRegexBoards[i])) !== null) {
							thisRegex = new RegExp(thisRegexStr);
							if (filterField.match(thisRegex)) {hidePost(thisPost, filterRecursive, filterStubs);}
						}
					}
				} else {
					thisRegex = new RegExp(thisRegexStr);
					if (filterField.match(thisRegex)) {hidePost(thisPost, filterRecursive, filterStubs);}
				}
			}
		}
	}
}

////////////////
//INIT FUNCTIONS
////////////////
function initSettings() {
	refreshSettings();
	var settingsItems = settingsMenu.getElementsByTagName("input");
	for (var i in settingsItems) {
		if (!settingsItems.hasOwnProperty(i)) {continue;}
		setupControl(settingsItems[i]);
	}
}

function initMenu() { //Pashe, WTFPL
	var menu = unsafeWindow.document.getElementsByClassName("boardlist")[0];
	var $menu = $(menu);
	
	// [data-description="0"] - home, boards
	// [data-description="1"] - pinned boards (/b/, /meta/, /int/)
	// [data-description="2"] - twitter
	// [data-description="3"] - top boards
	
	$('[data-description="1"], [data-description="2"]').hide();
	$(".boardlist.bottom").find('[data-description="0"], [data-description="2"], .favorite-boards').hide(); //Hide stuff that's at the top already
	$(".boardlist.bottom").find('[data-description="1"]').show(); //Show pinned boards at the bottom
	$(".boardlist.bottom").find('.favorite-boards').next().hide(); //Hide the watchlist link at the bottom
	
	if ((!$(".boardlist.bottom").find('[data-description="3"]').length) && ($(".boardlist.bottom").find('[data-description="1"]').length)) {
		var topBoardsLinks = [];

		$.ajax("/boards-top20.json", {
			async: true,
			cache: true,
			success: function(response) {
				for (var x in response) {
					topBoardsLinks.push(sprintf(
						'<a href="/%s/" title="%s &bull; %s &bull; %s">%s</a>',
						response[x].uri,
						response[x].title,
						response[x].subtitle,
						response[x].tags.join("/"),
						response[x].uri
					));
				}
				$(".boardlist.bottom").find('[data-description="1"]').after(sprintf(' <span class="chx_topBoards">[ %s ]</span>', topBoardsLinks.slice(0,15).join(" / ")));
			}
		});
	}
	
	if (getSetting('catalogLinks') && !isOnCatalog()) {
		$('.favorite-boards a').each(function () {
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
		statsNode.html(
			 '<span title="Posts" id="chx_menuPosts">---</span> / '
			+'<span title="Images" id="chx_menuImages">---</span> / '
			+'<span title="Page" id="chx_menuPage">---</span>'
		);
		statsNode.attr("id", "menuStats");
		statsNode.css("padding-left", "3pt");
		statsNode.appendTo($menu);
		
		updateMenuStats();
		
		var galleryButton = $('<a href="javascript:void(0)" title="Gallery"><i class="fa fa-th-large chx_menuGalleryButton"></i></a>');
		var menuButtonHolder = $('span.sub[data-description=0]').first();
		
		menuButtonHolder.html(function() {return this.innerHTML.replace("]", " / ");});
		
		galleryButton.appendTo(menuButtonHolder);
		menuButtonHolder.html(function() {return this.innerHTML + " ]";});
		
		$(".chx_menuGalleryButton").on("click", toggleGallery); //galleryButton isn't the same as $(".chx_menuGalleryButton") after appending the ] to menuButtonHolder.
	}
}

function initRevealImageSpoilers() { //Tux et al, MIT
	if (!getSetting('revealImageSpoilers')) {return;}
	
	$('.post-image').each(function() {
		var pic;
		if ($(this)[0].tagName == "IMG") {
			pic = $(this);
		} else if ($(this)[0].tagName == "CANVAS") {
			pic = $(this).next();
		} else {return;}
		
		var picUrl = pic.attr("src");
		if (picUrl.indexOf('spoiler.png') >= 0) {
			pic.attr("src", $(this).parent().attr("href"));
			pic.addClass("chx_unspoileredImage");
		}
	});
}

function initKeyboardShortcuts() { //Pashe, heavily influenced by Tux et al, WTFPL
	if (!getSetting("keyboardShortcutsEnabled")) {return;}
	
	$(document).keydown(function(e) {
		if (e.keyCode == 27) {
			$('#quick-reply').remove();
			closeGallery();
		}
		
		if (e.target.nodeName == "INPUT" || e.target.nodeName == "TEXTAREA") {return;}
		if ((!e.ctrlKey) && (!e.metaKey)) {
			switch (e.keyCode) {
				case 82:
					reloadPage();
					break;
				case 81:
					showQR();
					e.preventDefault();
					break;
				case 71:
					toggleGallery();
					break;
				case 69:
					toggleExpandAll();
					break;
				case 67:
					goToCatalog();
					break;
				case 39:
					jogExpandedGalleryImage(+1);
					break;
				case 37:
					jogExpandedGalleryImage(-1);
					break;
			}
		}
	});
}

function initCatalog() { //Pashe, WTFPL
	if (!isOnCatalog()) {return;}
	
	//addCatalogPages
	if (getSetting("precisePages")) { 
		$(".thread").each(function (e, ele) {
			var threadId = $(ele).html().match(/<a href="[^0-9]*([0-9]+).html?">/)[1];
			var threadPage = getThreadPage(threadId, thisBoard, true);
			
			$(ele).find("strong").first().html(function(e, html) {
				return html.replace(/P: [0-9]+/, ("P: " + (threadPage<1?"<span style='opacity:0.5'>???</span>":threadPage)));
			});
		});
	};
	
	//highlightCatalogAutosage
	$(".replies").each(function (e, ele) {
		var eReplies = $(ele).html().match(/R: ([0-9]+)/)[1];
		if (eReplies>bumpLimit) {
			$(ele).html(function(e, html) {
				return html.replace(/R: ([0-9]+)/, "<span style='color:#f00;'>R: $1</span>");
			});
		}
	});
	
	//setCatalogImageSize
	var catalogStorage = JSON.parse(localStorage.catalog);
	if (!catalogStorage.image_size) {
		catalogStorage.image_size = "large";
		localStorage.catalog = JSON.stringify(catalogStorage);
		
		$(".grid-li").removeClass("grid-size-vsmall");
		$(".grid-li").removeClass("grid-size-small");
		$(".grid-li").removeClass("grid-size-large");
		$(".grid-li").addClass("grid-size-" + catalogStorage.image_size);
		$("#image_size").val(catalogStorage.image_size);
	}
	
	//addCatalogNullImagePlaceholders
	$("img[src=''], img[src='/static/no-file.png']").attr("src", "data:image/svg+xml;base64,PHN2ZyB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgaGVpZ2h0PSIyMDAiIHdpZHRoPSIyMDAiIHZlcnNpb249IjEuMSI+PGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCwtODYwKSI+PHRleHQgc3R5bGU9ImxldHRlci1zcGFjaW5nOjBweDt0ZXh0LWFuY2hvcjptaWRkbGU7d29yZC1zcGFjaW5nOjBweDt0ZXh0LWFsaWduOmNlbnRlcjsiIHhtbDpzcGFjZT0icHJlc2VydmUiIGZvbnQtc2l6ZT0iNjRweCIgeT0iOTMwIiB4PSI5NSIgZm9udC1mYW1pbHk9IidBZG9iZSBDbGVhbiBVSScsIHNhbnMtc2VyaWYiIGxpbmUtaGVpZ2h0PSIxMjUlIiBmaWxsPSIjMDAwMDAwIj48dHNwYW4geD0iOTUiIHk9IjkyOSI+Tm88L3RzcGFuPjx0c3BhbiB4PSI5NSIgeT0iMTAxMCI+SW1hZ2U8L3RzcGFuPjwvdGV4dD48L2c+PC9zdmc+");
}

function initRISLinks() { //Pashe, 7185, WTFPL
	if (!getSetting("reverseImageSearch")) {return;}
	$("img.post-image").each(function() {addRISLinks(this);});
}

function initParseTimestampImage() { //Pashe, WTFPL
	//if (!getSetting("parseTimestampImage")) {break;}
	try {
		var minTimestamp = new Date(1985,1).valueOf();
		var maxTimestamp = Date.now()+(24*60*60*1000);
		
		$("p.fileinfo > span.unimportant > a:link").each(function() {
			var $this = $(this);
			var filename = $this.text();
			
			if (!filename.match(/^([0-9]{9,13})[^a-zA-Z0-9]?.*$/)) {return;}
			var timestamp = parseInt(filename.match(/^([0-9]{9,13})[^a-zA-Z0-9]?.*$/)[1]);
			
			if (timestamp < minTimestamp) {timestamp *= 1000;}
			if ((timestamp < minTimestamp) || (timestamp > maxTimestamp)) {return;}
			
			var fileDate = new Date(timestamp);
			
			var fileTimeElement = $('<span class="chx_PTIStamp"></span>');
			fileTimeElement.attr("title", fileDate.toGMTString());
			fileTimeElement.attr("data-timestamp", timestamp);
			fileTimeElement.attr("data-isotime", fileDate.toISOString());
			fileTimeElement.text(", " + $.timeago(timestamp) + ")");
			fileTimeElement.appendTo($this.parent());
			
			$this.parent().html(function(e, html) {
				return html.replace(")", "");
			});
		});
	} catch (e) {}
}

function initNotifications() {
	Notification.requestPermission();
}

function initMascot() { //Pashe, based on an anonymous contribution, WTFPL
	if (!getSetting("mascotUrl")) {return;}
	
	var mascotUrls = getSetting("mascotUrl").split("|");
	var mascotUrl = mascotUrls[Math.floor((Math.random()*mascotUrls.length))];
	
	$("head").append(
		"<style>" +
		"	form[name=postcontrols] {"+
		"		margin-right: 22%;"+
		"	}"+
		"	div.delete{"+
		"		padding-right: 6%;"+
		"	}"+
		"	div.styles {"+
		"		float: left;"+
		"	}"+
		"	div#chx_mascot img {"+
		"		display: block;"+
		"		position: fixed;"+
		"		bottom: 0pt;"+
		"		right: 0pt;"+
		"		left: auto;"+
		"		max-width: 25%;"+
		"		max-height: 100%;"+
		"		opacity: 0.8;"+
		"		z-index: -100;"+
		"		pointer-events: none;"+
		"	}"+
		"</style>"
	);
	
	var mascotHolder = $('<div id="chx_mascot"></div>');
	var mascotImage = $('<img></img>');
	var hostElement = $("body").first();
	
	mascotImage.attr("src", mascotUrl);
	
	mascotImage.appendTo(mascotHolder);
	mascotHolder.appendTo(hostElement);
	
	if (isOnCatalog()) {mascotImage.css("z-index", "-100");}
}

function initpurgeDeadFavorites() { //Pashe, WTFPL
	$("#chx_purgeDeadFavorites").click(function() {
		console.log("Working...");
		var originalText = $("#chx_purgeDeadFavorites").text();
		$("#chx_purgeDeadFavorites").text("Working...");
		$("#chx_purgeDeadFavorites").prop("disabled", true);
		var boards;
		$.ajax({
				url: "/boards.json",
				async: false,
				dataType: "json",
				success: function (response) {boards = response;}
		});	
		var boardsURIs = [];
		var favorites = JSON.parse(localStorage.favorites);

		for (var x in boards) {
			if (!boards.hasOwnProperty(x)) {continue;}
			boardsURIs.push(boards[x].uri);
		}
		
		if (boardsURIs.length > 0) {
			for (var i=0; i<favorites.length; i++) {
				var board = favorites[i];
				if (($.inArray(board, boardsURIs) == -1)) {
					$.ajax({
						url: "/" + board + "/",
						async: false,
						statusCode: {404: function() {
							unfavorite(board);
							console.log("Purge board /" + board + "/");
						}},
						success: function () {console.log("Keep unlisted board /" + board + "/");},
						type: "HEAD"
					});
				} else {
					console.log("Keep listed board /" + board + "/");
				}
			}
		}
		console.log("Done");
		$("#chx_purgeDeadFavorites").text(originalText + " - done");
		$("#chx_purgeDeadFavorites").prop("disabled", false);
	});
}

function initDefaultSettings() { //Pashe, WTFPL
	if (unsafeWindow.localStorage.color_ids === undefined) unsafeWindow.localStorage.color_ids = true;
	if (unsafeWindow.localStorage.videohover === undefined) unsafeWindow.localStorage.videohover = true;
	if (unsafeWindow.localStorage.useInlining === undefined) unsafeWindow.localStorage.useInlining = true;
	if (unsafeWindow.localStorage.catalogImageHover === undefined) unsafeWindow.localStorage.catalogImageHover = true;
	if (unsafeWindow.localStorage.imageHover === undefined) unsafeWindow.localStorage.imageHover = true;
}

function initFavicon() { //Pashe, WTFPL
	var faviconUrl = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAFo9M/3AAAAAXNSR0IArs4c6QAAAeNJREFUOMu9kk1IVGEUhp/3jj8zukiYIGkh6iftwzZGaw1EqJW5KAxsvhmFgta1DGpRGTF35g5EURBGQRuJqG21iCKIaOUVCqHdYIU/k849LXIMEymCenbncM7hvO85sIF6fTgv6GELfb44qc0gFz6wwN4D4Hxo7MRmi/PhQ+BIU1++NKSkvpjALoAmM3tsCp7H0eShHec4Xzzs8uEFAPXnouZF1b8BYHyIK4UekDW2aVpU/Q3YsTiautc9Wezcm6tkMkHpOEmyP45+6vh7UttTJpfrPJ89MLJWfT27sK3A5fc8NXgFdifbP/xFzoezwPAPnzQWlwszAPty0e666h/lfGiNbZ0vvgANSDphZlfMdDlojO4ev5nGgpla22pbYjZo0sn5SuGinC9Ng50BMEt1zFf8Z/4rv7W6e/xqR6q15RFoYIuZcG0uKpxVI+714VEZgya1S3pWy6zcTpbalSGZWCe439xaq85dP10D6PXFMaG7wLvA+fCc86VEUlnirbBZzEZal9PLGdWXCGy0hbWuRjNAEGhp47vScj5cAdK19Zbswo2J6raz58ujmF0Cun5RfyuuZifkfJgDIuArsmlLgk8SQ8jaMavG0dToH5noThUPktIwiVYV8HKunH/SePx/ynf5T8EXjP2zGwAAAABJRU5ErkJggg==";
	$('<link></link>').attr("rel", "shortcut icon").attr("href", faviconUrl).appendTo($("head").first());
}

function initFlagIcons() { //Anon from >>>/tech/60489, presumably WTFPL or similar
	if (!$("#user_flag").length) {return;}
	
	var board = window.location.pathname.replace(/^\/([^/]+).*?$/, "$1");
	var custom_flag_url = window.location.origin + '/static/custom-flags/' + board + '/';
	var dropdown_options = document.getElementById('user_flag').childNodes;

	if (!dropdown_options || !dropdown_options.length) return;

	for (var i = 0; i < dropdown_options.length; i++) {
			var opt = dropdown_options[i];
			opt.style.paddingLeft = '20px';
			if (opt.value)
					opt.style.background = 'no-repeat left center url(' + custom_flag_url + opt.value + '.png)';
	}
}

function initFormattedTime() { //Pashe, WTFPL
	if (!getSetting("dateFormat")) {return;}
	
	$("time").text(function() {
		//%Y-%m-%d %H:%M:%S is nice
		
		var $this = $(this);
		
		var thisDate = new Date($this.attr("datetime"));
		
		if (getSetting("localTime")) {
			return strftime(getSetting("dateFormat"), thisDate);
		} else {
			return strftimeUTC(getSetting("dateFormat"), thisDate);
		}
	});
}

function initFilter() { //Pashe, WTFPL	
	$(".reply").each(runFilter);
	
	$.ajax({
	url: "/settings.php?board="+thisBoard,
	async: true,
	cache: true,
	dataType: "json",
	success: function (response) {
		thisBoardAnonName = response.anonymous;
		$(".reply").each(runFilter);
	}
});
}

function initBRLocalStorage() { //Pashe, WTFPL
	if (!unsafeWindow.localStorage.hasOwnProperty("color_ids")) {
		var savedLocalStorage = getSetting("localStorage");
		unsafeWindow.localStorage.clear();
		for (var key in savedLocalStorage) {
			if (!savedLocalStorage.hasOwnProperty(key)) {continue;}
			unsafeWindow.localStorage[key] = savedLocalStorage[key];
		}
	} else {
		setSetting("localStorage", unsafeWindow.localStorage);
	}
}

function initClearLocalStorage() { //Pashe, WTFPL
	$("#chx_clearLocalStorage").click(function() {
		if (confirm("Are you sure you want to clear localStorage? This will delete ALL saved values in localStorage. This inludes your favorited boards, watched threads, and more.")) {
			unsafeWindow.localStorage.clear();
			GM_deleteValue("localStorage");
		}
	});
}

function initClearChxSettings() { //Pashe, WTFPL
	$("#chx_clearChxSettings").click(function() {
		if (confirm("Are you sure you want to clear 8chanX's settings? This will reset all 8chanX settings to their defaults. This inludes your filters, mascots, date format, and more.")) {
			var settingsList = GM_listValues();
			for (var i in settingsList) {
				if (!settingsList.hasOwnProperty(i)) {continue;}
				GM_deleteValue(settingsList[i]);
			}
		}
	});
}

////////////////
//INIT CALLS
////////////////
$(unsafeWindow.document).ready(function() { try {
	initSettings();
	initBRLocalStorage();
	initDefaultSettings();
	initMenu();
	initCatalog();
	initFilter();
	initFormattedTime();
	initMascot();
	initRevealImageSpoilers();
	initRISLinks();
	initParseTimestampImage();
	initNotifications();
	initFlagIcons();
	initKeyboardShortcuts();
	initpurgeDeadFavorites();
	initClearLocalStorage();
	initClearChxSettings();
	initFavicon();
} catch(e) {chxErrorHandler(e, "ready");}});

////////////////
//EVENT HANDLER FUNCTIONS
////////////////
function onNewPostRISLinks(post) { //Pashe, 7185, WTFPL
	$("#"+$(post).attr("id")+" img.post-image").each(function() {addRISLinks(this);}); 
}

function onNewPostNotifications(post) {
	var $post = $(post);
	if ($post.is('div.post.reply')) {
		$post.each(notifyReplies);
	} else {
		$post.find('div.post.reply').each(notifyReplies);
	}
}

function onNewPostFormattedTime() {
	initFormattedTime();
}

function onNewPostFilter(post) { //Pashe, WTFPL
	$(post).each(runFilter);
}

function intervalMenu() {
	updateMenuStats();
}

////////////////
//EVENT HANDLERS
////////////////
window.addEventListener('message', function(e) {
	try {
		if (typeof(e.data) != 'object') return;
		if (!("8chanXType" in e.data)) return;
		if (e.data["8chanXType"] !== "newpost") return;
		post = document.getElementById(e.data.postid);
		onNewPostRISLinks(post);
		onNewPostNotifications(post);
		onNewPostFormattedTime();
		onNewPostFilter(post);
	} catch(e) {chxErrorHandler(e, "newpost");}
});
contentEval(function() {
	$(document).on('new_post', function(e, post) {
		window.postMessage({'8chanXType': 'newpost', 'postid': post.id}, "*");
	});
});

setInterval(intervalMenu, (1.5*60*1000));
} catch(e) {chxErrorHandler(e, "global");}
