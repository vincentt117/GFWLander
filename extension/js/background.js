function reloadTabs() {
    getLinkList(function (storageObj) {
        var linkList = storageObj;
        linkList.forEach(matchTab);
    });

}

function matchTab(element, index, array) {
    var patternedUrl = ["http://*." + element + "/*", "https://*." + element + "/*"];
    chrome.tabs.query({
        url: patternedUrl
    }, function (tabArray) {

        if (typeof tabArray != 'undefined' && tabArray instanceof Array) {
            tabArray.forEach(reloadTab);
        }

    });

}

function reloadTab(element, index, array) {
    chrome.tabs.reload(element.id, function () {
        console.log(element.id + " reloaded");
    });
}


chrome.runtime.onInstalled.addListener(function (object) {
    chrome.runtime.openOptionsPage();
});

chrome.alarms.onAlarm.addListener(function (alarm) {
    getForceRefresh(function (refreshObj) {
        if (refreshObj == 1) {
            console.log("alarm fired");
            reloadTabs();
        }
    });
});

chrome.storage.onChanged.addListener(function (changes, namespace) {
    if (changes.noPause) {
        if (changes.noPause.newValue == 1) {
            getForceRefresh(function (refreshObj) {
                if (refreshObj == 1) {
                    console.log("noPause Changed");
                    reloadTabs();
                }
            });
        }
    }
    if (changes.forceRefresh) {
        if (changes.forceRefresh.newValue == 1) {
            console.log("Refresh On");
            getBlockTime(function (blockTime) {
                if (blockTime == 0) {
                    reloadTabs();
                }
            });
        }
    }


    if (changes.linkList) {
        console.log("List Changed");
        getBlockTime(function (blockTime) {
            if (blockTime == 0) {
                reloadTabs();
            }
        });

    }

});