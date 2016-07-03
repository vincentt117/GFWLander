var TYPES = {
        'undefined': 'undefined',
        'number': 'number',
        'boolean': 'boolean',
        'string': 'string',
        '[object Function]': 'function',
        '[object RegExp]': 'regexp',
        '[object Array]': 'array',
        '[object Date]': 'date',
        '[object Error]': 'error'
    },
    TOSTRING = Object.prototype.toString;

function type(o) {
    return TYPES[typeof o] || TYPES[TOSTRING.call(o)] || (o ? 'object' : 'null');
};

// Saves linkList to chrome.storage
function saveLinkList() {
    getLinkList(function (items) {

        var link = document.getElementById('newSite').value;
        validateUrl(link, function (cleanLink) {
            if (cleanLink != "" && cleanLink.localeCompare("gofuckingwork.com") != 0) {
                console.log(cleanLink + cleanLink.localeCompare("gofuckingwork.com"));
                document.getElementById('newSite').value = "";
                var tempLinkList = items;
                console.log(type(tempLinkList) + ": " + tempLinkList.toString());
                tempLinkList.push(cleanLink);
                chrome.storage.sync.set({
                    linkList: tempLinkList
                }, function () {
                    // Update status to let user know options were saved.

                    var status = document.getElementById('status');
                    status.textContent = 'Options saved.';
                    setTimeout(function () {
                        status.textContent = '';
                    }, 750);
                });
            } else {
                var status = document.getElementById('status');
                status.textContent = 'Please enter a valid URL';
                setTimeout(function () {
                    status.textContent = '';
                }, 750);

            }
        });
    });
}

function saveWhiteTime() {
    //Get Input
    var rawWeeks = $("#weekSelector").weekLine('getSelected', 'indexes').split(',');
    var rawBegTime = $('.timepicker').wickedpicker('time', 0);
    var rawEndTime = $('.timepicker').wickedpicker('time', 1);

    var begTime = [Number(rawBegTime[0] + rawBegTime[1]), Number(rawBegTime[5] + rawBegTime[6])];
    var endTime = [Number(rawEndTime[0] + rawEndTime[1]), Number(rawEndTime[5] + rawEndTime[6])];

    var begDaystamp = begTime[0] * 60 + begTime[1];
    var endDaystamp = endTime[0] * 60 + endTime[1];

    if (begDaystamp >= endDaystamp) {
        var timeStatus = document.getElementById('timeStatus');
        timeStatus.textContent = 'Please enter a valid time.';
        setTimeout(function () {
            timeStatus.textContent = '';
        }, 750);
    } else if (rawWeeks[0] == "") {
        var timeStatus = document.getElementById('timeStatus');
        timeStatus.textContent = 'Please select weekdays.';
        setTimeout(function () {
            timeStatus.textContent = '';
        }, 750);
    } else {
        var weekDays = [0, 0, 0, 0, 0, 0, 0];

        for (var i = 0; i < rawWeeks.length; i++) {
            weekDays[rawWeeks[i]] = 1;
        }

        console.log("BEG: " + begTime + "END: " + endTime + "WEEKDAYS: " + weekDays);

        pushWhiteTime(begTime, endTime, weekDays, function () {
            var timeStatus = document.getElementById('timeStatus');
            timeStatus.textContent = 'Options saved.';
            //Set Alarms
            buildBreakAlarms()
            setTimeout(function () {
                timeStatus.textContent = '';
            }, 750);
        });

    }
}


function restoreOptions() {
    $('ul#blockedList').empty();
    getLinkList(function (items) {
        items.forEach(function (element, index, array) {
            $('ul#blockedList').append(
                $('<li>').append("<img src='img/delete.png' class='x buttons' alt='X' id='x-" + index + "'><span>" + element + "</span>")
            );
            var imgId = "img#x-" + index;
            $(imgId).on('click', {
                id: index
            }, removeLink);
        });
    });

    $('ul#breakList').empty();
    getWhiteTime(function (items) {
        items.forEach(function (element, index, array) {
            stringifyWhiteTime(element, function (timeText) {
                $('ul#breakList').append(
                    $('<li>').append("<img src='img/delete.png' class='x buttons' alt='Y' id='y-" + index + "'><span>" + timeText + "</span>")
                );
                var imgId = "img#y-" + index;
                $(imgId).on('click', {
                    id: index
                }, removeBreak);
            });
        });
    });

}


function removeLink(event) {
    var id = event.data.id;
    getLinkList(function (items) {
        var tempLinkList = items;
        if (id > -1) {
            tempLinkList.splice(id, 1);
        }
        chrome.storage.sync.set({
            linkList: tempLinkList
        }, function () {
            // Update status to let user know options were saved.

            var status = document.getElementById('status');
            status.textContent = 'Option removed.';
            setTimeout(function () {
                status.textContent = '';
            }, 750);
        });
    });
}

function removeBreak(event) {
    var id = event.data.id;
    getWhiteTime(function (items) {
        var tempWhiteTime = items;
        if (id > -1) {
            tempWhiteTime.splice(id, 1);
        }
        chrome.storage.sync.set({
            whiteTime: tempWhiteTime
        }, function () {
            // Update status to let user know options were saved.
            var timeStatus = document.getElementById('timeStatus');
            timeStatus.textContent = 'Option removed.';
            //Rebuild Breaks
            buildBreakAlarms();
            setTimeout(function () {
                timeStatus.textContent = '';
            }, 750);
        });
    });
}

function clearOptions() {
    chrome.storage.sync.clear(function () {
        var status = document.getElementById('status');
        restoreOptions();
        status.textContent = 'Options Cleared.';
        setTimeout(function () {
            status.textContent = '';
        }, 750);
    });
}

function validateUrl(url, callback) {
    var cleanedUrl = url.replace("www.", "").replace(/(^.*?:\/\/)/, "").replace(/\/(.*)/, "").toLowerCase();

    if (cleanedUrl.indexOf('.') !== -1) {
        callback(cleanedUrl);
    } else {
        callback("");
    }


}

function openShare(url) {
    var newWindow = window.open(url, 'name', 'height=550,width=700');
    if (window.focus) {
        newWindow.focus()
    }
    return false;
}

chrome.storage.onChanged.addListener(function (changes, namespace) {
    restoreOptions();
});
document.getElementById('facebookShare').addEventListener('click', function () {
    openShare("https://www.facebook.com/sharer/sharer.php?u=https%3A//chrome.google.com/webstore/detail/go-fucking-work/hibmkkpfegfiinilnlabbfnjcopdiiig/");
});
document.getElementById('twitterShare').addEventListener('click', function () {
    openShare("https://twitter.com/home?status=It's%20time%20to%20get%20stop%20fucking%20procrastinating.%20Go%20Fucking%20Work%3A%20https%3A//goo.gl/Yufdv3");
});
document.getElementById('hiAlex-2').addEventListener('click', function () {
    openShare("https://twitter.com/home?status=%40hialexlam%20");
});
document.getElementById('hiAlex-1').addEventListener('click', function () {
    openShare("https://twitter.com/home?status=%40hialexlam%20");
});
document.getElementById('expandUpdates').addEventListener('click', function () {
    document.getElementById('expandUpdates').style.display = "none";
    document.getElementById('hideUpdates').style.display = "block";
    document.getElementById('oldUpdates').style.display = "block";
});
document.getElementById('hideUpdates').addEventListener('click', function () {
    document.getElementById('expandUpdates').style.display = "block";
    document.getElementById('hideUpdates').style.display = "none";
    document.getElementById('oldUpdates').style.display = "none";
});
document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('saveSite').addEventListener('click', saveLinkList);
document.getElementById('saveTime').addEventListener('click', saveWhiteTime);
document.querySelector('#newSite').addEventListener('keypress', function (e) {
    var key = e.which || e.keyCode;
    if (key === 13) {
        saveLinkList();
    }
});
//document.getElementById('clearSites').addEventListener('click', clearOptions);


$(document).ready(function () {
    $('.timepicker').wickedpicker({
        twentyFour: true
    });
    $("#weekSelector").weekLine();
});

// Standard Google Universal Analytics code
(function (i, s, o, g, r, a, m) {
    i['GoogleAnalyticsObject'] = r;
    i[r] = i[r] || function () {
        (i[r].q = i[r].q || []).push(arguments)
    }, i[r].l = 1 * new Date();
    a = s.createElement(o),
        m = s.getElementsByTagName(o)[0];
    a.async = 1;
    a.src = g;
    m.parentNode.insertBefore(a, m)
})(window, document, 'script', 'https://www.google-analytics.com/analytics.js', 'ga'); // Note: https protocol here

ga('create', 'UA-74648006-4', 'auto');
ga('set', 'checkProtocolTask', function () {}); // Removes failing protocol check. @see: http://stackoverflow.com/a/22152353/1958200
ga('require', 'displayfeatures');
ga('send', 'pageview', '/options.html');