if (counter) throw counter.init(), "resetting";
$(document).keypress(function(e) {
  if (e.metaKey && (e.which === 13)) {
    $('#navigation-wrapper > button:nth-child(2)').click();
  }
});

var linkStyle = {
  cursor: "pointer",
  fontWeight: "bold",
  color: "#0017cb",
  'text-decoration': "underline"
};

function similarity(s1, s2) {
  var longer = s1;
  var shorter = s2;
  if (s1.length < s2.length) {
    longer = s2;
    shorter = s1;
  }
  var longerLength = longer.length;
  if (longerLength == 0) {
    return 1.0;
  }
  return (longerLength - editDistance(longer, shorter)) / parseFloat(longerLength);
}

function editDistance(s1, s2) {
  s1 = s1.toLowerCase();
  s2 = s2.toLowerCase();
  var costs = new Array();
  for (var i = 0; i <= s1.length; i++) {
    var lastValue = i;
    for (var j = 0; j <= s2.length; j++) {
      if (i == 0)
        costs[j] = j;
      else {
        if (j > 0) {
          var newValue = costs[j - 1];
          if (s1.charAt(i - 1) != s2.charAt(j - 1))
            newValue = Math.min(Math.min(newValue, lastValue),
              costs[j]) + 1;
          costs[j - 1] = lastValue;
          lastValue = newValue;
        }
      }
    }
    if (i > 0)
      costs[s2.length] = lastValue;
  }
  return costs[s2.length];
}

function checkUtts() {
  utt = $('[class=utterance-text]:eq(1)').text().replace(/([^\w]*company:[^\w]*)+|([^\w]*contact:[^\w]*)+|([^\w]*unsure:[^\w]*)+|([^\w]*artist:[^\w]*)+|([^\w]*scene:[^\w]*)+|([^\w]*truncated:[^\w]*)+|([^\w]*zone:[^\w]*)+|([^\w]*group:[^\w]*)+|([^\w]*appname:[^\w]*)+|([^\w]*room:[^\w]*)+|([^\w]*device[^\w]*)+|[^a-zA-Z0-9']+/g, " ").replace(/\s\s+/g, ' ').trim().toLowerCase()
  $('.parse').each(function() {
    u = $(this).clone()
    u.find('.span-grade-selector, .entity-user-data, .label').remove().text().trim().toLowerCase();
    strippedUtt = u.text().replace(/\s\s+/g, ' ').trim().toLowerCase();
    if (utt === strippedUtt) {
      $(this).css("color", "blue");
    } else {
      $(this).find(".sims").length > 0
    }
    if ($(this).find('.sims').length > 0) {
      //console.log("already has percent")
    } else {
      $(this).append("<p class='sims'>" + similarity(utt, strippedUtt).toFixed(2) + "</p>")
    }
  })
};
checkUtts();

function sortRows() {
  var divs = $("[class=transitions]:eq(1) div.rank-choice");
  var $divs = $("[class=transitions]:eq(1) div.rank-choice");
  alphabeticallyOrderedDivs = $divs.sort(function(a, b) {
    return $(a).find('div.domain-verb').text().toLowerCase() > $(b).find('div.domain-verb').text().toLowerCase();
  });
  $("[class=transitions]:eq(1)").html(alphabeticallyOrderedDivs);
	hoverRank();
        hoverTag();
        hoverMark();
}
sortRows();

function google() {
  base = "https://www.google.com/search?q=";
  queryD = utt.replace('hey siri ', '');
  $('[class=utterance-text]:eq(1)').css(linkStyle);
  $('[class=utterance-text]:eq(1)').click(function() {
    window.open(base + queryD, "_blank")
  })
}
google();

function goLingo() {
  var e = "https://lingo.siri.apple.com/production-en/ontology/";
  $('.domain-verb').each(function() {
    d = $(this).text().split(' ')[12].trim();
    v = $(this).text().replace(/(\r\n|\n|\r)/gm, "", " ").split("verb: ").pop().split('  ')[0];

    if (v === "") {
      $('  <a href="' + e + '' + d + '/description"target="_blank" class="lingoLink">Lingo</a>  ').appendTo(this);
    } else {
      $('<a href="' + e + '' + d + '/labels/verb-label/' + v + '/description" target="_blank" class="lingoLink">Lingo</a>').appendTo(this);
    }
  });
}
goLingo();

var checkProbes = function() {
$('.kv-bubble:contains("failure")').addClass("fail");

$('.kv-bubble:contains("success")').addClass("succeed")

var fails = $('.kv-bubble.fail').parent().find(".key-label").text().replace(/(\r\n|\n|\r)/gm, "", " ").split("  ").filter(item => item);

var succs = $('.kv-bubble.succeed').parent().find(".key-label").text().replace(/(\r\n|\n|\r)/gm, "", " ").split("  ").filter(item => item);

$(".domain-verb").each(function() {
  probe = $(this).text().replace(/(\r\n|\n|\r)/gm, "", " ").split("probe: ").pop().split('  ')[0];
if (succs.includes(probe)) {
    $(this).css("color", "green");
  }  
else if (fails.includes(probe)) {
    $(this).css("color", "red");
  } 
});
}
checkProbes();

function copyActual() {
  $("#widget-wrapper > div.user-utterance-wrapper > div > table > tr:nth-child(2) > td.utterance-text").clone().appendTo(".context-container");
}
copyActual();

function hoverRank(){
function handler(e) {
    var target = $(e.target);
    if( target.is(".rank select") ) {
       target.focus();
    }
}
$(".rank select").mouseover(handler)
}
hoverRank();

function hoverTag(){
function handler(e) {
    var target = $(e.target);
    if( target.is(".span-grade-selector") ) {
       target.focus();
    }
}
$(".span-grade-selector").mouseover(handler)
}
hoverTag();

function hoverMark(){
function handler(e) {
    var target = $(e.target);
    if( target.is(".entity-missing input[type=checkbox]") ) {
       target.focus();
    }
}
$(".entity-missing input[type=checkbox]").mouseover(handler)
}
hoverMark();

function searchLinks() {
  $('.parse').each(function() {
    u = $(this).clone()
    u.find('.span-grade-selector, .entity-user-data, .label, .sims').remove().text().trim().toLowerCase();
    strippedUtt = u.text().replace(/\s\s+/g, ' ').trim().toLowerCase().replace('hey siri ', '');

    $(this).append("<div class='searchBlock'></div>");

    if ($(this).find('.goog').length > 0) {
      console.log("goog dupe")
    } else {
      $(this).find('.searchBlock').append("<a href='https://www.google.com/search?q=" + strippedUtt + "' class='goog' target='blank'>Google</a>")
    }
    if ($(this).find('.wolf').length > 0) {
      console.log("wolf dupe")
    } else {
      $(this).find('.searchBlock').append("<a href='https://www.wolframalpha.com/input/?i=" + strippedUtt + "' class='wolf' target='blank'>Wolfram Alpha</a> ")
    }
    if ($(this).find('.wiki').length > 0) {
      console.log("wiki dupe")
    } else {
      $(this).find('.searchBlock').append("<a href='https://en.wikipedia.org/wiki/Special:Search?search=" + strippedUtt + "' class='wiki' target='_blank'>Wikipedia</a> ")
    }
  });
}
searchLinks();

(function() {
  var proxied = window.XMLHttpRequest.prototype.send;
  window.XMLHttpRequest.prototype.send = function() {
    if (this.__sentry_xhr__.url.includes("views")) {
      //console.log("New Utterance Loaded");
      setTimeout(function() {
        checkUtts();
        sortRows();
        google();
        goLingo();
        checkProbes();
        copyActual();
        ghost();
	searchLinks();
      }, 2000);
    }
    var pointer = this
    var intervalId = window.setInterval(function() {
      if (pointer.readyState != 4) {
        return;
      }
      clearInterval(intervalId);
    }, 1);
    return proxied.apply(this, [].slice.call(arguments));
  };
})();




var counter = {
    docObj: $("<span contenteditable='true' tabindex='-1' style='padding: 6px 8px;border-radius:5px;border:1px solid lightgray; margin: 0px 10px;'>0</span"),
    projectName: $("#project-name").text(),
    skip: !0,
    id: "",
    init: function() {
      this.docObj.insertBefore("#skip"), localStorage.getItem(this.projectName) ? this.docObj.text(localStorage.getItem(this.projectName)) : localStorage.setItem(this.projectName, this.docObj.text()), this.onload()
    },
    incr: function() {
      this.docObj.text(String(parseInt(this.docObj.text()) + 1)), localStorage.setItem(this.projectName, this.docObj.text())
    },
    onload: function() {
      this.incr();
      totalSeconds = 0;

    }
  },
  s_ajaxListener = {
    tempOpen: XMLHttpRequest.prototype.open,
    tempSend: XMLHttpRequest.prototype.send,
    callback: function() {
      this.url.includes("save_grade") && counter.onload()

    }
  };
XMLHttpRequest.prototype.open = function(e, t) {
  if (!e) e = "";
  if (!t) t = "";
  s_ajaxListener.tempOpen.apply(this, arguments), s_ajaxListener.method = e, s_ajaxListener.url = t, "get" == e.toLowerCase() && (s_ajaxListener.data = t.split("?"), s_ajaxListener.data = s_ajaxListener.data[1])
}, XMLHttpRequest.prototype.send = function(e, t) {
  if (!e) e = "";
  if (!t) t = "";
  s_ajaxListener.tempSend.apply(this, arguments), "post" == s_ajaxListener.method.toLowerCase() && (s_ajaxListener.data = e), s_ajaxListener.callback()
}, hideParseSetting = !1, counter.init();

$('#widget-container').append('<div class="btns"><button onclick="sortRows()">SORT </button><button onclick="checkUtts()">RECHECK</button><button onclick="goLingo()">LINGO</button><button onclick="checkProbes()">PROBES</button></div>')
//keyboard shortcuts
document.addEventListener("keydown", function(e) {
  switch (e.key) {
    case "s":
	sortRows();	
      break;
    case "r":
      checkUtts();
      break;
    case "l":
      goLingo();
      break;
    case "p":
      checkProbes();      
      break;
    case "x":
      searchLinks();      
      break;  
  }
});
