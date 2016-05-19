function changeButton(buttonHide, buttonShow) {
    document.getElementById(buttonHide).style.display = 'none';
    if (buttonShow != "") {
        document.getElementById(buttonShow).style.display = 'block';
    }
}

function pauseWork(time) {
    var curTime = Date.now();
    var blockTime = curTime + 60000 * time;
    console.log(curTime + ", " + blockTime);
    setBlockTime(blockTime, function () {
        changeButton("pauseButtons", "playButton");
        chrome.alarms.clearAll(function () {

            chrome.alarms.create("pauseAlarm", {
                when: blockTime
            });
            window.close();

        });

    });
}


function startWork() {
    setBlockTime(0, function () {

        chrome.alarms.clearAll(function () {
            var resetTime = Date.now() + 5;
            chrome.alarms.create("pauseAlarm", {
                when: resetTime
            });
            window.close();
        });
    });
}

function addToBlacklist() {
    var query = {
        active: true,
        currentWindow: true
    };
    chrome.tabs.query(query, saveOptions);
}

function saveOptions(linkArray) {
    getLinkList(function (items) {
        var link = linkArray[0].url;
        console.log(link);
        validateUrl(link, function (cleanLink) {
            if (cleanLink != "" && cleanLink.localeCompare("gofuckingwork.com") != 0) {
                var tempLinkList = items;
                tempLinkList.push(cleanLink);
                chrome.storage.sync.set({
                    linkList: tempLinkList
                }, function () {
                    // Update status to let user know options were saved.
                    var status = document.getElementById('status');
                    status.textContent = 'Options Saved.';
                    setTimeout(function () {
                        status.textContent = '';
                    }, 750);
                });
            } else {
                var status = document.getElementById('status');
                status.textContent = 'Not Valid URL';
                setTimeout(function () {
                    status.textContent = '';
                }, 750);

            }
        });
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

function updatePauseView() {
    chrome.storage.sync.get({
        noPause: 0
    }, function (pauseOption) {
        var pause = pauseOption.noPause;
        if (pause == 0) {
            document.getElementById('pauseButton').style.display = "block";
            document.getElementById('noPauseButton').style.display = "none";
        } else {
            setBlockTime(0, function () {
                document.getElementById('pauseButton').style.display = "none";
                document.getElementById('noPauseButton').style.display = "block";
            });

        }
    });
}

function updateBreakView() {
    isWhiteTimeNow(function (isBreak) {
        if (isBreak == true) {
            setBlockTime(0, function () {
                document.getElementById('breakButton').style.display = "block";
                document.getElementById('noPauseButton').style.display = "none";
                document.getElementById('pauseButton').style.display = "none";
            });
        } else {
            document.getElementById('breakButton').style.display = "none";
            updatePauseView();
        }
    });
}


document.getElementById('settingIcon').addEventListener('click', function () {
    chrome.runtime.openOptionsPage();
});
document.getElementById('blacklistIcon').addEventListener('click', function () {
    addToBlacklist();
});
document.getElementById('pauseButton-1').addEventListener('click', function () {
    changeButton("pauseButton-1", "pauseButton-2");
});

document.getElementById('pauseButton-2').addEventListener('click', function () {
    changeButton("pauseButton-2", "pauseButton-3");
});

document.getElementById('pauseButton-3').addEventListener('click', function () {
    changeButton("pauseButton-3", "pauseButtons");
});
document.getElementById('playButton').addEventListener('click', function () {
    startWork();
    changeButton("playButton", "pauseButton-1");
});

document.getElementById('5-mins').addEventListener('click', function () {
    pauseWork(5);
});

document.getElementById('20-mins').addEventListener('click', function () {
    pauseWork(20);
});

document.getElementById('60-mins').addEventListener('click', function () {
    pauseWork(60);
});

document.getElementById('180-mins').addEventListener('click', function () {
    pauseWork(180);
});
document.getElementById('360-mins').addEventListener('click', function () {
    pauseWork(360);
});
document.getElementById('720-mins').addEventListener('click', function () {
    pauseWork(720);
});
document.getElementById('1440-mins').addEventListener('click', function () {
    pauseWork(1440);
});
document.getElementById('2880-mins').addEventListener('click', function () {
    pauseWork(2880);
});

document.addEventListener('DOMContentLoaded', function () {
    getBlockTime(function (time) {
        if (time <= Date.now()) {
            document.getElementById("pauseButton-1").style.display = 'block';
        } else {
            document.getElementById("playButton").style.display = 'block';
        }
    });
    updatePauseView();
});

chrome.storage.onChanged.addListener(function (changes, namespace) {
    if (changes.noPause) {
        updatePauseView();
    }
});

window.onload = function() {
    updateBreakView();
};

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
ga('send', 'pageview', '/popup.html');