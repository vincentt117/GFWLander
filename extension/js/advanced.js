
function saveWhiteList() {
    getWhiteList(function (items) {

        var link = document.getElementById('newSite').value;
        validateUrl(link, function (cleanLink) {
            if(cleanLink != "" && cleanLink.localeCompare("gofuckingwork.com") != 0){
            document.getElementById('newSite').value = "";
            var tempLinkList = items;
            tempLinkList.push(cleanLink);
            chrome.storage.sync.set({
                whiteList: tempLinkList
            }, function () {
                // Update status to let user know options were saved.
                var status = document.getElementById('status');
                status.textContent = 'Options saved.';
                setTimeout(function () {
                    status.textContent = '';
                }, 750);
            });
            }else{
              var status = document.getElementById('status');
                status.textContent = 'Please enter a valid URL';
                setTimeout(function () {
                    status.textContent = '';
                }, 750);  
                
            }
        });
    });
}


function restore_options() {
    $('ul#blockedList').empty();
    getWhiteList(function (items) {
        items.forEach(function (element, index, array) {
            $('ul#blockedList').append(
                $('<li>').append("<img src='img/delete.png' class='x buttons' alt='X' id='x-" + index + "'><span>" + element + "</span>")
            );
            var imgId = "img#x-" + index;
            $(imgId).on('click', {
                id: index
            }, remove_option);
        });
    });

}


function remove_option(event) {
    var id = event.data.id;
    getWhiteList(function (items) {
        var tempLinkList = items;
        if (id > -1) {
            tempLinkList.splice(id, 1);
        }
        chrome.storage.sync.set({
            whiteList: tempLinkList
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



function validateUrl(url, callback) {
    var cleanedUrl = url.replace("www.", "").replace(/(^.*?:\/\/)/, "").replace(/(\?.*)/, "").toLowerCase();

    if (cleanedUrl.indexOf('.') !== -1) {
        callback(cleanedUrl);
    } else {
        callback("");
    }


}

function toggleRefresh() {
    getForceRefresh(function (refreshOption) {
        var refresh = refreshOption;
        if (refresh == 0) {
            chrome.storage.sync.set({
                forceRefresh: 1
            });
        } else {
            chrome.storage.sync.set({
                forceRefresh: 0
            });
        }
    });
}

function togglePause() {
    getNoPause(function (pauseOption) {
        var pause = pauseOption;
        if (pause == 0) {
            chrome.storage.sync.set({
                noPause: 1
            });
        } else {
            chrome.storage.sync.set({
                noPause: 0
            });
        }
    });
}

function restoreOptions() {
    getForceRefresh(function (refreshOption) {
        var refresh = refreshOption;
        var refreshButton = document.getElementById("refreshButton");
        var refreshStatus = document.getElementById("refreshStatus");
        if (refresh == 0) {
            refreshButton.innerHTML = "FUCKING ENABLE FORCE REFRESHING";
            refreshStatus.innerHTML = "STATUS: DISABLED";
        } else {
            refreshButton.innerHTML = "FUCKING DISABLE FORCE REFRESHING";
            refreshStatus.innerHTML = "STATUS: ENABLED";
        }
    });

    getNoPause(function (pauseOption) {
        var pause = pauseOption;
        var pauseButton = document.getElementById("pauseButton");
        var pauseStatus = document.getElementById("pauseStatus");
        if (pause == 0) {
            pauseButton.innerHTML = "FUCKING DISABLE BLOCKER PAUSING";
            pauseStatus.innerHTML = "STATUS: ENABLED";
        } else {
            setBlockTime(0, function () {
                pauseButton.innerHTML = "FUCKING ENABLE BLOCKER PAUSING";
                pauseStatus.innerHTML = "STATUS: DISABLED";
            });
        }

    });
    
    $('ul#blockedList').empty();
    getWhiteList(function (items) {
        items.forEach(function (element, index, array) {
            $('ul#blockedList').append(
                $('<li>').append("<img src='img/delete.png' class='x buttons' alt='X' id='x-" + index + "'><span>" + element + "</span>")
            );
            var imgId = "img#x-" + index;
            $(imgId).on('click', {
                id: index
            }, remove_option);
        });
    });
}



chrome.storage.onChanged.addListener(function (changes, namespace) {
    restoreOptions();
});
document.getElementById('refreshButton').addEventListener('click', function () {
    toggleRefresh();
});
document.getElementById('pauseButton').addEventListener('click', function () {
    togglePause();
});
document.addEventListener('DOMContentLoaded', function () {
    restoreOptions();
});


document.getElementById('saveSite').addEventListener('click', saveWhiteList);
document.querySelector('#newSite').addEventListener('keypress', function (e) {
    var key = e.which || e.keyCode;
    if (key === 13) {
        save_options();
    }
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
ga('send', 'pageview', '/advanced.html');