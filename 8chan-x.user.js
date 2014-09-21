// ==UserScript==
// @name        Tux3's cheap 8chan-X userscript
// @version     1.1
// @namespace   8chan-X
// @description Userscript for productive 8chan browsing
// @match       *://8chan.co/*
// @run-at      document-end
// @grant       none
// ==/UserScript==

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
  else
    menu.style.backgroundColor = "#333";
}

function updateMenuStats() {
  var stats = document.getElementById("menuStats");
  var nPosts = document.getElementsByClassName("post reply").length+1;
  var nImages = document.getElementsByClassName("post-image").length;
  stats.innerHTML = "["+nPosts+" / "+nImages+"]";
}

window.onload = function() {
  // Customize the menu
  var menu = document.getElementsByClassName("boardlist")[0];
  menu.style.textAlign = 'center';
  menu.style.position = 'fixed';
  menu.style.top = '0px';
  menu.style.left = '-8px';
  menu.style.width = "100%";
  menu.style.marginTop = "0px";
  menu.style.padding = "3px";
  updateMenuStyle();
  document.querySelector('[data-description="1"]').style.display = 'none';
  document.querySelector('[data-description="2"]').style.display = 'none';
  
  var nPosts = document.getElementsByClassName("post reply").length+1;
  var nImages = document.getElementsByClassName("post-image").length;
  var statsNode=document.createElement("SPAN");
  var statsTextNode=document.createTextNode("["+nPosts+" / "+nImages+"]");
  statsNode.appendChild(statsTextNode);
  statsNode.id = 'menuStats';
  menu.appendChild(statsNode);
  
  // Hook style changes to update the menu's style
  var styles = document.getElementsByClassName("styles")[0].childNodes;
  for(i=0; i<styles.length; i++) {
      styles[i].onclick = function () {
        changeStyle(this.innerHTML.substring(1, this.innerHTML.length - 1), this);
        updateMenuStyle();
    };
  }
    
}


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
  }
});


/*******************************************
AUTO UPDATES
*******************************************/
// Try to disable the official auto updater (bad hack but I can't see anything better)
var highestTimeoutId = setTimeout("clearAllTimers");
for (var i = 0 ; i < highestTimeoutId ; i++) {
    clearTimeout(i); 
}
$(window).off('scroll');

// Then implement our own patched auto-updater
auto_reload_enabled = true;
$(document) .ready(function () {
  if ($('div.banner') .length == 0)
  return ;
  if ($('.post.op') .size() != 1)
  return ;
  var poll_interval;
  var settings = new script_settings('auto-reload');
  var poll_interval_mindelay_bottom = settings.get('min_delay_bottom', 3000);
  var poll_interval_mindelay_top = settings.get('min_delay_top', 10000);
  var poll_interval_maxdelay = settings.get('max_delay', 600000);
  var poll_interval_shortdelay = settings.get('quick_delay', 100);
  var poll_interval_delay = poll_interval_mindelay_bottom;
  var end_of_page = false;
  var new_posts = 0;
  var first_new_post = null;
  if (typeof update_title == 'undefined') {
    var update_title = function () {
    };
  }
  if (typeof add_title_collector != 'undefined')
  add_title_collector(function () {
    return new_posts;
  });
  var window_active = true;
  $(window) .focus(function () {
    window_active = true;
    recheck_activated();
    if (settings.get('reset_focus', true)) {
      poll_interval_delay = end_of_page ? poll_interval_mindelay_bottom : poll_interval_mindelay_top;
    }
  });
  $(window) .blur(function () {
    window_active = false;
  });
  var recheck_activated = function () {
    if (new_posts && window_active && $(window) .scrollTop() + $(window) .height() >= $(first_new_post) .position() .top) {
      new_posts = 0;
    }
    update_title();
  };
  var poll = function () {
    $.ajax({
      url: document.location,
      success: function (data) {
        $(data) .find('div.post.reply') .each(function () {
          var id = $(this) .attr('id');
          if ($('#' + id) .length == 0) {
            if (!new_posts) {
              first_new_post = this;
            }
            $(this) .insertAfter($('div.post:last') .next()) .after('<br class="clear">');
            new_posts++;
            $(document) .trigger('new_post', this);
            recheck_activated();
          }
        });
        time_loaded = Date.now();
        updateMenuStats();
      }
    });
    clearTimeout(poll_interval);
    if (new_posts == 0) {
      poll_interval_delay *= 2;
      if (poll_interval_delay > poll_interval_maxdelay) {
        poll_interval_delay = poll_interval_maxdelay;
      }
    } else {
      poll_interval_delay = end_of_page ? poll_interval_mindelay_bottom : poll_interval_mindelay_top;
    }
    poll_interval = setTimeout(poll, poll_interval_delay);
  };
  $(window) .scroll(function () {
    recheck_activated();
    if ($(this) .scrollTop() + $(this) .height() < $('div.post:last') .position() .top + $('div.post:last') .height()) {
      end_of_page = false;
      return ;
    }
    clearTimeout(poll_interval);
    poll_interval = setTimeout(poll, poll_interval_shortdelay);
    end_of_page = true;
  }) .trigger('scroll');
  poll_interval = setTimeout(poll, poll_interval_delay);
});
