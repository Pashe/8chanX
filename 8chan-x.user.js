// ==UserScript==
// @name        Pashe's 8chanX v2
// @version     2.0.0.pa-1418198610
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
var originalPageTitle = unsafeWindow.document.title;
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
+ '<label><input type="checkbox" name="revealImageSpoilers">' + 'Reveal image spoilers' + '</label><br>'
+ '<label><input type="checkbox" name="imageHover">' + 'Image hover' + '</label><br>'
+ '<label><input type="checkbox" name="catalogImageHover">' + 'Image hover on catalog' + '</label><br>'
+ '</div>';

var defaultSettings = {
	'precisePages': true,
	'relativeTime': true,
	'hideTopBoards': true,
	'catalogLinks': true,
	'revealImageSpoilers': false,
	'imageHover': true,
	'catalogImageHover': true
};

function getSetting(key) {
	return GM_getValue(key, defaultSettings[key]);
}

function setting(key) {
	console.log(sprintf("setting('%s') is deprecated", key));
	return getSetting(key);
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
//IMAGE HOVER
////////////////
var imghoverMMove = function(e) { //TODO: Cleanup
	if (!getSetting('imageHover') && !getSetting('catalogImageHover')) {return;}
	
	var pic;
	if ($(this)[0].tagName == "IMG") {pic = $(this);}
	else if ($(this)[0].tagName == "CANVAS") {pic = $(this).next();}
	
	var picUrl = pic.attr("src");
	if (picUrl.indexOf('spoiler.png') >= 0) {picUrl = $(this).parent().attr("href");}
	
	pic.parent().removeData("expanded");
	if (pic.parent().data("expanded")) {
		return;
	}
	
	picUrl = picUrl.replace("/src/","/thumb/");
	if (picUrl.indexOf('/thumb/') == -1) {
		return;
	}
	
	var picTimestamp = picUrl.substr(picUrl.indexOf("/thumb/")+7);
	var picTimestamp = picTimestamp.substr(0, picTimestamp.lastIndexOf("."));
	
	var picId = "post-image-"+picTimestamp;
	var hoverPic = $("#"+picId);
	
	var picRightEdge = hoverPic.width() + e.pageX;
	var windowWidth = $(window).width();
	
	if (!hoverPic.length) {
		var newpic = pic.clone();
		newpic.attr("id",picId);
		newpic.css('display', 'block').css('position', 'absolute').css('z-index', '200').css("margin", "0px").css("padding", "0px");
		newpic.attr("src",picUrl.replace("/thumb/","/src/"));
		
		if (picRightEdge > windowWidth) {
			newpic.css('left', (e.pageX + (windowWidth - picRightEdge))).css('top', top);
		} else {
			newpic.css('left', e.pageX).css('top', top);
		}
		
		newpic.css('width', 'auto').css('height', 'auto');
		newpic.css('pointer-events','none');
		newpic.css('max-height',$(window).height());
		newpic.css('max-width',$(window).width());
		newpic.insertAfter(pic);
	} else {
		var scrollTop = $(window).scrollTop();
		var epy = e.pageY;
		var top = epy;
		if (epy < scrollTop + 15) {
		  top = scrollTop;
		} else if (epy > scrollTop + $(window).height() - hoverPic.height() - 15) {
		  top = scrollTop + $(window).height() - hoverPic.height() - 15;
		}
		
		if (picRightEdge > windowWidth) {
			hoverPic.css('left', (e.pageX + (windowWidth - picRightEdge))).css('top', top);
		} else {
			hoverPic.css('left', e.pageX).css('top', top);
		}
	}
}

var imghoverMOut = function(e) {
	var pic;
	if ($(this)[0].tagName == "IMG") {pic = $(this);}
	else if ($(this)[0].tagName == "CANVAS") {pic = $(this).next();}
	
	var picUrl = pic.attr("src");
	if (picUrl.indexOf('spoiler.png') >= 0) {picUrl = $(this).parent().attr("href");}
	picUrl = picUrl.replace("/src/","/thumb/");
	
	var picTimestamp = picUrl.substr(picUrl.indexOf("/thumb/")+7);
	var picTimestamp = picTimestamp.substr(0, picTimestamp.lastIndexOf("."));
	var picId = "post-image-"+picTimestamp;
	
	var hoverPic = $("#"+picId);
	if (hoverPic.length) {hoverPic.remove();}
	
	if ($(this).hasClass('unanimated')) {
		$($(this).parent().children()).each( function (index, data) { //Oh Jesus what the fuck
			if ($(this).parent().data("expanded") != "true") {
				$(this).mousemove(imghoverMMove);
				$(this).mouseout(imghoverMOut);
				$(this).click(imghoverMOut);
			}
		});
	}
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

function initImprovedPageTitles() {
	if (isOnThread()) {
		try {
			unsafeWindow.document.title = unsafeWindow.document.location.pathname.match(/\/(.*?)\//)[0] + " - " + (function(){
				var op = $(".op").text();
				var subject = op ? $(".subject").text() : null;
				var body = op ? $(".body").text() : null;
				return subject ? subject : body ? body.length > 128 ? body.substr(0, 128) + "..." : body : "8chan";
			})();
		} catch (e) {
			unsafeWindow.document.title = originalPageTitle;
		}
	}
}

function initRevealImageSpoilers() {
	if (!getSetting('revealImageSpoilers')) {return;}
	
	$('.post-image').each(function() {
		var pic;
		if ($(this)[0].tagName == "IMG") {pic = $(this);}
		else if ($(this)[0].tagName == "CANVAS") {pic = $(this).next();}
		
		var picUrl = pic.attr("src");
		if (picUrl.indexOf('spoiler.png') >= 0) {
			pic.attr("src", $(this).parent().attr("href"));
			pic.addClass("8chanx-spoilered-image");
		}
	});
}

function initImageHover() { //TODO: Cleanup
	if (!getSetting("imageHover") && !getSetting("catalogImageHover")) {return;}
	
	var selector = '';
	if (getSetting("imageHover")) selector += "img.post-image, canvas.post-image";
	
	if (getSetting('catalogimagehover') && isOnCatalog()) {
		if (selector != '') {selector += ', ';}
		selector += '.thread-image';
		$('.theme-catalog div.thread').each(function() {
			$(this).css('position','inherit');
		});
	}
	
	$(selector).each( function (index, data) {
		if ($(this).parent().data("expanded") != "true") {
			$(this).mousemove(imghoverMMove);
			$(this).mouseout(imghoverMOut);
			$(this).click(imghoverMOut);
		}
	});
}

////////////////
//INIT CALLS
////////////////
initSettings();

$(unsafeWindow.document).ready(function() {
	initRelativeTime();
	initMenu();
	//initImprovedPageTitles();
	initRevealImageSpoilers();
	initImageHover();
});

////////////////
//EVENT HANDLERS
////////////////
function onNewPostRelativeTime() {
	if (getSetting('relativeTime')) {$("time").timeago();}
}

function onNewPostImageHover() {
	if (!setting('imagehover')) {return;}
	$('#'+$(post).attr('id')+' .post-image').each( function (index, data) {
		if ($(this).parent().data("expanded") != "true") {
			$(this).mousemove(imghoverMMove);
			$(this).mouseout(imghoverMOut);
			$(this).click(imghoverMOut);
		}
	});
}

$(document).on('new_post', function (e, post) {  //TODO: Fix this
	onNewPostRelativeTime();
	onNewPostImageHover();
});