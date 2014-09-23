// ==UserScript==
// @name        Tux3's 8chan X
// @version     1.14
// @namespace   8chan-X
// @description Small userscript to improve 8chan
// @match       *://8chan.co/*
// @run-at      document-end
// @grant       none
// @updateURL 	 https://github.com/tux3/8chan-X/raw/master/8chan-x.meta.js
// @downloadURL  https://github.com/tux3/8chan-X/raw/master/8chan-x.user.js
// @icon         data:image/png;base64,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
// ==/UserScript==

/*********
GLOBALS
*********/
var originalPageTitle = document.title;
var unreadPosts = [];

/**************
GENERAL / MISC
**************/
function strEndsWith(str, s) {
  return str.length >= s.length && str.substr(str.length - s.length) == s;
}
  
function isOnCatalog() {
  return strEndsWith(window.location.pathname, "/catalog.html");
}

function isOnBoardIndex() {
  return strEndsWith(window.location.pathname, "/index.html");
}

function isOnThread() {
  return !isOnCatalog() && !isOnBoardIndex();
}

/**************
SETTINGS
**************/
if (typeof _ == 'undefined') {
  var _ = function (a) {
    return a;
  };
}
var tempSettings = {
};
var defaultSettings = {
  'relativetime': true,
  'imagehover': true,
  'cataloglinks': false
  //'inlineposts': false
};
var settingsMenu = document.createElement('div');
var prefix = '',suffix = '',style = '';
if (window.Options) {
  var tab = Options.add_tab('8chan X', 'times', _('8chan X'));
  $(settingsMenu) .appendTo(tab.content);
} 
settingsMenu.innerHTML = prefix
+ '<div style="' + style + '">'
+ '<label><input type="checkbox" name="relativetime">' + _('Use relative post times') + '</label><br>'
+ '<label><input type="checkbox" name="imagehover">' + _('Show full images on hover') + '</label><br>'
+ '<label><input type="checkbox" name="cataloglinks">' + _('Link to the catalog in the menu') + '</label><br>'
//+ '<label><input type="checkbox" name="inlineposts">' + _('Inline quoted posts on click') + '</label><br>'
+ suffix;
function setting(name) {
  if (localStorage) {
    if (localStorage[name] === undefined) return defaultSettings[name];
    return JSON.parse(localStorage[name]);
  } else {
    if (tempSettings[name] === undefined) return defaultSettings[name];
    return tempSettings[name];
  }
}
function changeSetting(name, value) {
  if (localStorage) {
    localStorage[name] = JSON.stringify(value);
  } else {
    tempSettings[name] = value;
  }
}
function refreshSettings() {
  var settingsItems = settingsMenu.getElementsByTagName('input');
  for (var i = 0; i < settingsItems.length; i++) {
    var control = settingsItems[i];
    if (control.type == 'checkbox')
      control.checked = setting(control.name);
  }
}
function setupControl(control) {
  if (control.addEventListener) control.addEventListener('change', function (e) {
    if (control.type == 'checkbox')
      changeSetting(control.name, control.checked);
  }, false);
}
refreshSettings();
var settingsItems = settingsMenu.getElementsByTagName('input');
for (var i = 0; i < settingsItems.length; i++) {
  setupControl(settingsItems[i]);
}
if (settingsMenu.addEventListener && !window.Options) {
  settingsMenu.addEventListener('mouseover', function (e) {
    refreshSettings();
    settingsMenu.getElementsByTagName('a') [0].style.fontWeight = 'bold';
    settingsMenu.getElementsByTagName('div') [0].style.display = 'block';
  }, false);
  settingsMenu.addEventListener('mouseout', function (e) {
    settingsMenu.getElementsByTagName('a') [0].style.fontWeight = 'normal';
    settingsMenu.getElementsByTagName('div') [0].style.display = 'none';
  }, false);
}

/*************************************************************************
JQUERY TIMEAGO STOLEN FROM http://timeago.yarp.com/jquery.timeago.js
*************************************************************************/
(function(e){if(typeof define==="function"&&define.amd){define(["jquery"],e)}else{e(jQuery)}})(function(e){function r(){var n=i(this);var r=t.settings;if(!isNaN(n.datetime)){if(r.cutoff==0||Math.abs(o(n.datetime))<r.cutoff){e(this).text(s(n.datetime))}}return this}function i(n){n=e(n);if(!n.data("timeago")){n.data("timeago",{datetime:t.datetime(n)});var r=e.trim(n.text());if(t.settings.localeTitle){n.attr("title",n.data("timeago").datetime.toLocaleString())}else if(r.length>0&&!(t.isTime(n)&&n.attr("title"))){n.attr("title",r)}}return n.data("timeago")}function s(e){return t.inWords(o(e))}function o(e){return(new Date).getTime()-e.getTime()}e.timeago=function(t){if(t instanceof Date){return s(t)}else if(typeof t==="string"){return s(e.timeago.parse(t))}else if(typeof t==="number"){return s(new Date(t))}else{return s(e.timeago.datetime(t))}};var t=e.timeago;e.extend(e.timeago,{settings:{refreshMillis:6e4,allowPast:true,allowFuture:false,localeTitle:false,cutoff:0,strings:{prefixAgo:null,prefixFromNow:null,suffixAgo:"ago",suffixFromNow:"from now",inPast:"any moment now",seconds:"less than a minute",minute:"about a minute",minutes:"%d minutes",hour:"about an hour",hours:"about %d hours",day:"a day",days:"%d days",month:"about a month",months:"%d months",year:"about a year",years:"%d years",wordSeparator:" ",numbers:[]}},inWords:function(t){function l(r,i){var s=e.isFunction(r)?r(i,t):r;var o=n.numbers&&n.numbers[i]||i;return s.replace(/%d/i,o)}if(!this.settings.allowPast&&!this.settings.allowFuture){throw"timeago allowPast and allowFuture settings can not both be set to false."}var n=this.settings.strings;var r=n.prefixAgo;var i=n.suffixAgo;if(this.settings.allowFuture){if(t<0){r=n.prefixFromNow;i=n.suffixFromNow}}if(!this.settings.allowPast&&t>=0){return this.settings.strings.inPast}var s=Math.abs(t)/1e3;var o=s/60;var u=o/60;var a=u/24;var f=a/365;var c=s<45&&l(n.seconds,Math.round(s))||s<90&&l(n.minute,1)||o<45&&l(n.minutes,Math.round(o))||o<90&&l(n.hour,1)||u<24&&l(n.hours,Math.round(u))||u<42&&l(n.day,1)||a<30&&l(n.days,Math.round(a))||a<45&&l(n.month,1)||a<365&&l(n.months,Math.round(a/30))||f<1.5&&l(n.year,1)||l(n.years,Math.round(f));var h=n.wordSeparator||"";if(n.wordSeparator===undefined){h=" "}return e.trim([r,c,i].join(h))},parse:function(t){var n=e.trim(t);n=n.replace(/\.\d+/,"");n=n.replace(/-/,"/").replace(/-/,"/");n=n.replace(/T/," ").replace(/Z/," UTC");n=n.replace(/([\+\-]\d\d)\:?(\d\d)/," $1$2");n=n.replace(/([\+\-]\d\d)$/," $100");return new Date(n)},datetime:function(n){var r=t.isTime(n)?e(n).attr("datetime"):e(n).attr("title");return t.parse(r)},isTime:function(t){return e(t).get(0).tagName.toLowerCase()==="time"}});var n={init:function(){var n=e.proxy(r,this);n();var i=t.settings;if(i.refreshMillis>0){this._timeagoInterval=setInterval(n,i.refreshMillis)}},update:function(n){var i=t.parse(n);e(this).data("timeago",{datetime:i});if(t.settings.localeTitle)e(this).attr("title",i.toLocaleString());r.apply(this)},updateFromDOM:function(){e(this).data("timeago",{datetime:t.parse(t.isTime(this)?e(this).attr("datetime"):e(this).attr("title"))});r.apply(this)},dispose:function(){if(this._timeagoInterval){window.clearInterval(this._timeagoInterval);this._timeagoInterval=null}}};e.fn.timeago=function(e,t){var r=e?n[e]:n.init;if(!r){throw new Error("Unknown function name '"+e+"' for timeago")}this.each(function(){r.call(this,t)});return this};document.createElement("abbr");document.createElement("time")})
$(document).ready(function() {
  if (setting('relativetime'))
    $("time").timeago();
});

// Show the relative time for new posts
$(document).on('new_post', function (e, post) {
  if (setting('relativetime'))
    $("time").timeago();
});


/**************************************
MENU BAR
**************************************/
function getStyleName() {
  var matches = document.URL.match(/\/(\w+)\/($|res\/\d+\.html|index\.html|res\/\d+\+50\.html)/);
  var board_name;
  var style;
  if (matches) {
    board_name = matches[1];
  }
  if (!localStorage.board_stylesheets) {
    localStorage.board_stylesheets = '{}';
  }
  window.stylesheet_choices = JSON.parse(localStorage.board_stylesheets);
  if (board_name && stylesheet_choices[board_name]) {
    for (var styleName in styles) {
      if (styleName == stylesheet_choices[board_name]) {
        style = styleName;
        break;
      }
    }
  }
  return style;
}

function updateMenuStyle() {
  var menu = document.getElementsByClassName("boardlist")[0];
  var style = getStyleName();
  if (style == "Yotsuba")
    menu.style.backgroundColor = "#F5C5B5";
  else if (style == "Yotsuba B")
    menu.style.backgroundColor = "#CDD2E6";
  else if (style == "Dark")
    menu.style.backgroundColor = "#333";
  else if (style == "Photon")
    menu.style.backgroundColor = "#DDD";
  else
    menu.style.backgroundColor = "#CDD2E6";
}

function updateMenuStats() {
  var stats = document.getElementById("menuStats");
  var nPosts = document.getElementsByClassName("post reply").length+1;
  var nImages = document.getElementsByClassName("post-image").length;
  stats.innerHTML = "["+nPosts+" / "+nImages+"]";
}

function initMenu() {
  // Customize the menu
  var menu = document.getElementsByClassName("boardlist")[0];
  menu.style.textAlign = 'center';
  menu.style.position = 'fixed';
  menu.style.top = '0px';
  menu.style.left = '-8px';
  menu.style.width = "100%";
  menu.style.marginTop = "0px";
  menu.style.padding = "3px";
  menu.style.zIndex='50';
  updateMenuStyle();
  document.querySelector('[data-description="1"]').style.display = 'none';
  document.querySelector('[data-description="2"]').style.display = 'none';
  
  if (setting('cataloglinks'))
  {
    $('.favorite-boards a').each( function (index, data) {
      $(this).attr("href", $(this).attr("href")+"/catalog.html");
    });
  }
  
  if (isOnThread())
  {
    var nPosts = document.getElementsByClassName("post reply").length+1;
    var nImages = document.getElementsByClassName("post-image").length;
    var statsNode=document.createElement("SPAN");
    var statsTextNode=document.createTextNode("["+nPosts+" / "+nImages+"]");
    statsNode.appendChild(statsTextNode);
    statsNode.id = 'menuStats';
    menu.appendChild(statsNode);
  }
  
  // Hook style changes to update the menu's style
  if (!isOnCatalog())
  {
    var styles = document.getElementsByClassName("styles")[0].childNodes;
    for(i=0; i<styles.length; i++) {
        styles[i].onclick = function () {
          changeStyle(this.innerHTML.substring(1, this.innerHTML.length - 1), this);
          updateMenuStyle();
      };
    }
  }
  else
    menu.style.backgroundColor = "lightgrey";    
}

/****************
CUSTOM BACKLINKS
****************/

// Handler when a new post is fetched by the inline extension
$(document).on('new_post', function (e, post) {
  
});

/***********************
UNREAD POSTS
***********************/
// Returns true if we've just read a new post, and remove it
function checkFirstUnread() {
  if (unreadPosts.length == 0)
    return false;
  
  var postId = unreadPosts[0];
  var post = $("#reply_"+postId);
  if ($(window).scrollTop() + $(window).height() >= post.position().top + post.height())
  {
    unreadPosts.shift();
    return true;
  }
  else
    return false;
}
function checkUnreadPosts() {  
  while (checkFirstUnread());
  
  if (isOnThread())
  {
    if (unreadPosts.length != 0)
      document.title = "("+unreadPosts.length+") "+originalPageTitle;
    else
      document.title = originalPageTitle;
  }
}

// Handler when a new post is fetched by the inline extension
$(document).on('new_post', function (e, post) {
  var postId = $(post).attr('id').replace(/^reply_/, '');
  unreadPosts[unreadPosts.length] = postId;
  //alert(unreadPosts);
  updateMenuStats();
  checkUnreadPosts();
});

// Prepare initial unread posts
function initUnreadPosts() {
  // First mark all posts as unread
  $('.post.reply').each( function (index, data) {
    var postId = $(this).attr('id').replace(/^reply_/, '');
    unreadPosts[unreadPosts.length] = postId;
  });
  checkUnreadPosts();
  
  $(window).scroll(function() {
   checkUnreadPosts();
  });
}

/************
IMAGE HOVER
************/
var imghoverMMove = function(e) {
  if (!setting('imagehover'))
    return;
  var picUrl = $(this).attr("src");
  var picTimestamp = picUrl.substr(picUrl.indexOf("/thumb/")+7);
  var picTimestamp = picTimestamp.substr(0, picTimestamp.indexOf("."));
  var picId = "post-image-"+picTimestamp;
  var hoverPic = $("#"+picId);
  // Create the hovering image if needed, otherwise just update it's position
  if (!hoverPic.length)
  {
    var newpic = $(this).clone();
    newpic.attr("id",picId);
    newpic.css('display', 'block').css('position', 'absolute').css('z-index', '100');
    newpic.attr("src",picUrl.replace("/thumb/","/src/"));
    newpic.css('left', e.pageX).css('top', top);
    newpic.css('width', 'auto').css('height', 'auto');
    newpic.css('pointer-events','none');
    newpic.css('max-height',$(window).height());
    newpic.css('max-width',$(window).width());
    newpic.insertAfter($(this));
  }
  else
  {
    var scrollTop = $(window).scrollTop();
    var epy = e.pageY;
    var top = epy;
    if (epy < scrollTop + 15) {
      top = scrollTop;
    } else if (epy > scrollTop + $(window).height() - hoverPic.height() - 15) {
      top = scrollTop + $(window).height() - hoverPic.height() - 15;
    }
    hoverPic.css('left', e.pageX).css('top', top);
  }
};

var imghoverMOut = function(e) {
  // Delete the hovering image
  var picUrl = $(this).attr("src");
  var picTimestamp = picUrl.substr(picUrl.indexOf("/thumb/")+7);
  var picTimestamp = picTimestamp.substr(0, picTimestamp.indexOf("."));
  var picId = "post-image-"+picTimestamp;
  var hoverPic = $("#"+picId);
  if (hoverPic.length)
    hoverPic.remove();
};

function initImageHover() {
  if (!setting('imagehover'))
    return;
  $('.post-image').each( function (index, data) {
    if ($(this).parent().data("expanded") != "true")
    {
      $(this).mousemove(imghoverMMove);
      $(this).mouseout(imghoverMOut);
      $(this).click(imghoverMOut);
    }
  });
}

$(document).on('new_post', function (e, post) {
  if (!setting('imagehover'))
    return;
  $('#'+$(post).attr('id')+' .post-image').each( function (index, data) {
    if ($(this).parent().data("expanded") != "true")
    {
      $(this).mousemove(imghoverMMove);
      $(this).mouseout(imghoverMOut);
      $(this).click(imghoverMOut);
    }
  });
});

/*************
QUICK REPLY
*************/
var settings = new script_settings('quick-reply');
var doQRCSS = function () {
    $('#quick-reply-css') .remove();
    var dummy_reply = $('<div class="post reply"></div>') .appendTo($('body'));
    var reply_background = dummy_reply.css('backgroundColor');
    var reply_border_style = dummy_reply.css('borderStyle');
    var reply_border_color = dummy_reply.css('borderColor');
    var reply_border_width = dummy_reply.css('borderWidth');
    dummy_reply.remove();
    $('<style type="text/css" id="quick-reply-css">\t\t#quick-reply {\t\t\tposition: fixed;\t\t\tright: 5%;\t\t\ttop: 5%;\t\t\tfloat: right;\t\t\tdisplay: block;\t\t\tpadding: 0 0 0 0;\t\t\twidth: 300px;\t\t\tz-index: 100;\t\t}\t\t#quick-reply table {\t\t\tborder-collapse: collapse;\t\t\tbackground: '
    + reply_background + ';\t\t\tborder-style: '
    + reply_border_style + ';\t\t\tborder-width: '
    + reply_border_width + ';\t\t\tborder-color: '
    + reply_border_color + ';\t\t\tmargin: 0;\t\t\twidth: 100%;\t\t}\t\t#quick-reply tr td:nth-child(2) {\t\t\twhite-space: nowrap;\t\t\ttext-align: right;\t\t\tpadding-right: 4px;\t\t}\t\t#quick-reply tr td:nth-child(2) input[type="submit"] {\t\t\twidth: 100%;\t\t}\t\t#quick-reply th, #quick-reply td {\t\t\tmargin: 0;\t\t\tpadding: 0;\t\t}\t\t#quick-reply th {\t\t\ttext-align: center;\t\t\tpadding: 2px 0;\t\t\tborder: 1px solid #222;\t\t}\t\t#quick-reply th .handle {\t\t\tfloat: left;\t\t\twidth: 100%;\t\t\tdisplay: inline-block;\t\t}\t\t#quick-reply th .close-btn {\t\t\tfloat: right;\t\t\tpadding: 0 5px;\t\t}\t\t#quick-reply input[type="text"], #quick-reply select {\t\t\twidth: 100%;\t\t\tpadding: 2px;\t\t\tfont-size: 10pt;\t\t\tbox-sizing: border-box;\t\t\t-webkit-box-sizing:border-box;\t\t\t-moz-box-sizing: border-box;\t\t}\t\t#quick-reply textarea {\t\t\twidth: 100%;\t\t\tbox-sizing: border-box;\t\t\t-webkit-box-sizing:border-box;\t\t\t-moz-box-sizing: border-box;\t\t\tfont-size: 10pt;\t\t\tresize: vertical;\t\t}\t\t#quick-reply input, #quick-reply select, #quick-reply textarea {\t\t\tmargin: 0 0 1px 0;\t\t}\t\t#quick-reply input[type="file"] {\t\t\tpadding: 5px 2px;\t\t}\t\t#quick-reply .nonsense {\t\t\tdisplay: none;\t\t}\t\t#quick-reply td.submit {\t\t\twidth: 1%;\t\t}\t\t#quick-reply td.recaptcha {\t\t\ttext-align: center;\t\t\tpadding: 0 0 1px 0;\t\t}\t\t#quick-reply td.recaptcha span {\t\t\tdisplay: inline-block;\t\t\twidth: 100%;\t\t\tbackground: white;\t\t\tborder: 1px solid #ccc;\t\t\tcursor: pointer;\t\t}\t\t#quick-reply td.recaptcha-response {\t\t\tpadding: 0 0 1px 0;\t\t}\t\t@media screen and (max-width: 800px) {\t\t\t#quick-reply {\t\t\t\tdisplay: none !important;\t\t\t}\t\t}\t\t</style>'
    ) .appendTo($('head'));
  };
var showQR = function () {
  if ($('div.banner') .length == 0)
    return ;
  if ($('#quick-reply') .length != 0)
    return ;
  doQRCSS();
  var $postForm = $('form[name="post"]') .clone();
  $postForm.clone();
  $dummyStuff = $('<div class="nonsense"></div>') .appendTo($postForm);
  $postForm.find('table tr') .each(function () {
    var $th = $(this) .children('th:first');
    var $td = $(this) .children('td:first');
    if ($th.length && $td.length) {
      $td.attr('colspan', 2);
      if ($td.find('input[type="text"]') .length) {
        $td.find('input[type="text"]') .removeAttr('size') .attr('placeholder', $th.clone() .children() .remove() .end() .text());
      }
      $th.contents() .filter(function () {
        return this.nodeType == 3;
      }) .remove();
      $th.contents() .appendTo($dummyStuff);
      $th.remove();
      if ($td.find('input[name="password"]') .length) {
        $(this) .hide();
      }
      if ($td.find('input[type="submit"]') .length) {
        $td.removeAttr('colspan');
        $('<td class="submit"></td>') .append($td.find('input[type="submit"]')) .insertAfter($td);
      }
      if ($td.find('#recaptcha_widget_div') .length) {
        var $captchaimg = $td.find('#recaptcha_image img');
        $captchaimg.removeAttr('id') .removeAttr('style') .addClass('recaptcha_image') .click(function () {
          $('#recaptcha_reload') .click();
        });
        $('#recaptcha_response_field') .focus(function () {
          if ($captchaimg.attr('src') != $('#recaptcha_image img') .attr('src')) {
            $captchaimg.attr('src', $('#recaptcha_image img') .attr('src'));
            $postForm.find('input[name="recaptcha_challenge_field"]') .val($('#recaptcha_challenge_field') .val());
            $postForm.find('input[name="recaptcha_response_field"]') .val('') .focus();
          }
        });
        $postForm.submit(function () {
          setTimeout(function () {
            $('#recaptcha_reload') .click();
          }, 200);
        });
        var $newRow = $('<tr><td class="recaptcha-response" colspan="2"></td></tr>');
        $newRow.children() .first() .append($td.find('input') .removeAttr('style'));
        $newRow.find('#recaptcha_response_field') .removeAttr('id') .addClass('recaptcha_response_field') .attr('placeholder', $('#recaptcha_response_field') .attr('placeholder'));
        $('#recaptcha_response_field') .addClass('recaptcha_response_field')
        $td.replaceWith($('<td class="recaptcha" colspan="2"></td>') .append($('<span></span>') .append($captchaimg)));
        $newRow.insertAfter(this);
      }
      if ($td.find('input[type="file"]') .length) {
        if ($td.find('input[name="file_url"]') .length) {
          $file_url = $td.find('input[name="file_url"]');
          if (settings.get('show_remote', false)) {
            var $newRow = $('<tr><td colspan="2"></td></tr>');
            $file_url.clone() .attr('placeholder', _('Upload URL')) .appendTo($newRow.find('td'));
            $newRow.insertBefore(this);
          }
          $file_url.parent() .remove();
          $td.find('label') .remove();
          $td.contents() .filter(function () {
            return this.nodeType == 3;
          }) .remove();
          $td.find('input[name="file_url"]') .removeAttr('id');
        }
        if ($(this) .find('input[name="spoiler"]') .length) {
          $td.removeAttr('colspan');
        }
      }
      if (!settings.get('show_embed', false) && $td.find('input[name="embed"]') .length) {
        $(this) .remove();
      }
      if ($(this) .is('#oekaki')) {
        $(this) .remove();
      }
      if ($td.is('#upload_selection')) {
        $(this) .remove();
      }
      if ($td.find('input[type="checkbox"]') .length) {
        var tr = this;
        $td.find('input[type="checkbox"]') .each(function () {
          if ($(this) .attr('name') == 'spoiler') {
            $td.find('label') .remove();
            $(this) .attr('id', 'q-spoiler-image');
            $postForm.find('input[type="file"]') .parent() .removeAttr('colspan') .after($('<td class="spoiler"></td>') .append(this, ' ', $('<label for="q-spoiler-image">') .text(_('Spoiler Image'))));
          } else if ($(this) .attr('name') == 'no_country') {
            $td.find('label,input[type="checkbox"]') .remove();
          } else {
            $(tr) .remove();
          }
        });
      }
      $td.find('small') .hide();
    }
  });
  $postForm.find('textarea[name="body"]') .removeAttr('id') .removeAttr('cols') .attr('placeholder', _('Comment'));
  $postForm.find('textarea:not([name="body"]),input[type="hidden"]') .removeAttr('id') .appendTo($dummyStuff);
  $postForm.find('br') .remove();
  $postForm.find('table') .prepend('<tr><th colspan="2">\t\t\t<span class="handle">\t\t\t\t<a class="close-btn" href="javascript:void(0)">X</a>\t\t\t\t'
                                   + _('Quick Reply') + '\t\t\t</span>\t\t\t</th></tr>'
                                  );
  $postForm.attr('id', 'quick-reply');
  $postForm.appendTo($('body')) .hide();
  $origPostForm = $('form[name="post"]:first');
  $origPostForm.find('textarea[name="body"]') .on('change input propertychange', function () {
    $postForm.find('textarea[name="body"]') .val($(this) .val());
  });
  $postForm.find('textarea[name="body"]') .on('change input propertychange', function () {
    $origPostForm.find('textarea[name="body"]') .val($(this) .val());
  });
  $postForm.find('textarea[name="body"]') .focus(function () {
    $origPostForm.find('textarea[name="body"]') .removeAttr('id');
    $(this) .attr('id', 'body');
  });
  $origPostForm.find('textarea[name="body"]') .focus(function () {
    $postForm.find('textarea[name="body"]') .removeAttr('id');
    $(this) .attr('id', 'body');
  });
  $origPostForm.find('input[type="text"],select') .on('change input propertychange', function () {
    $postForm.find('[name="' + $(this) .attr('name') + '"]') .val($(this) .val());
  });
  $postForm.find('input[type="text"],select') .on('change input propertychange', function () {
    $origPostForm.find('[name="' + $(this) .attr('name') + '"]') .val($(this) .val());
  });
  if (typeof $postForm.draggable != 'undefined') {
    if (localStorage.quickReplyPosition) {
      var offset = JSON.parse(localStorage.quickReplyPosition);
      if (offset.top < 0)
        offset.top = 0;
      if (offset.right > $(window) .width() - $postForm.width())
        offset.right = $(window) .width() - $postForm.width();
      if (offset.top > $(window) .height() - $postForm.height())
        offset.top = $(window) .height() - $postForm.height();
      $postForm.css('right', offset.right) .css('top', offset.top);
    }
    $postForm.draggable({
      handle: 'th .handle',
      containment: 'window',
      distance: 10,
      scroll: false,
      stop: function () {
        var offset = {
          top: $(this) .offset() .top - $(window) .scrollTop(),
          right: $(window) .width() - $(this) .offset() .left - $(this) .width(),
        };
        localStorage.quickReplyPosition = JSON.stringify(offset);
        $postForm.css('right', offset.right) .css('top', offset.top) .css('left', 'auto');
      }
    });
    $postForm.find('th .handle') .css('cursor', 'move');
  }
  $postForm.find('th .close-btn') .click(function () {
    $origPostForm.find('textarea[name="body"]') .attr('id', 'body');
    $postForm.remove();
    floating_link();
  });
  $postForm.show();
  $postForm.width($postForm.find('table') .width());
  $postForm.hide();
  $(window) .trigger('quick-reply');
  $(window) .ready(function () {
    if (settings.get('hide_at_top', true)) {
      $(window) .scroll(function () {
        if ($(this) .width() <= 800)
          return ;
        if ($(this) .scrollTop() < $origPostForm.offset() .top + $origPostForm.height() - 100)
          $postForm.fadeOut(100);
        else
          $postForm.fadeIn(100);
      }) .scroll();
    } else {
      $postForm.show();
    }
    $(window) .on('stylesheet', function () {
      doQRCSS();
      if ($('link#stylesheet') .attr('href')) {
        $('link#stylesheet') [0].onload = doQRCSS;
      }
    });
  });
};

/***************************************
KEYBOARD EVENTS
***************************************/
document.addEventListener('keydown', function(event) {
  var activeElem = document.activeElement;
  
  // Most events should be ignored if we're just trying to write text
  if (activeElem.nodeName == "INPUT"
     || activeElem.nodeName == "TEXTAREA")
    return;
  
  if (event.keyCode === event.DOM_VK_R) {
      document.location.reload(); 
  } else if (event.keyCode === event.DOM_VK_Q) {
      showQR();
  }
});


/*********
INIT
*********/
function addLoadEvent(func) {
  var oldonload = window.onload;
  if (typeof window.onload != 'function') {
    window.onload = func;
  } else {
    window.onload = function() {
      if (oldonload) {
        oldonload();
      }
      func();
    }
  }
}
// When all is loaded
//addLoadEvent(initMenu);
// As soon as the DOM is ready
$(document).ready(function() {
  initMenu();
  initUnreadPosts();
  initImageHover();
});
