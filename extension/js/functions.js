/**
 * Checks if URL should be blocked
 * @param {string}   url      browser URL in "http://www.domain.tld"" format
 * @param {function} callback Callback taking a boolean for whether URL should be blocked
 */
function checkUrl(url, callback) {
    var cleanedUrl = url.replace("www.", "").replace(/(^.*?:\/\/)/, "").replace(/(\?.*)/, "").toLowerCase();
    var domain = url.replace("www.", "").replace(/(^.*?:\/\/)/, "").replace(/\/(.*)/, "").toLowerCase();
    var onWhiteList = false;
    getWhiteList(function (whiteList) {
        console.log(cleanedUrl);
        for (var i = 0; i < whiteList.length; i++) {
            if (cleanedUrl == whiteList[i]) {
                onWhiteList = true;
            }
            console.log(whiteList[i]);
        }
        /*
        whiteList.forEach(function (val, ind, arr) {
            if (cleanedUrl == val) {
                onWhiteList = true;
            }
            console.log(val);
        });
        */
        if (!onWhiteList) {
            if (!/twitter\.com\/intent\/tweet/.test(url) && !/facebook\.com\/sharer\/sharer\.php/.test(url)) {
                getLinkList(function (urls) {
                    urls.forEach(function (val, ind, arr) {
                        if (domain == val) {
                            callback(true);
                        }
                    });
                });
            }
        }

    });

}


/**
 * Get the linkList data
 * @param {function} callback function with paramater that receives the option value
 */
function getLinkList(callback) {
    chrome.storage.sync.get({
        linkList: []
    }, function (items) {
        callback(items.linkList);
    });

}
/**
 * Set the linkList data
 * @param {Array}    list     Array of URLs that should be blocked
 * @param {function} callback Function with paramater that receives the new option value
 */
function setLinkList(list, callback) {
    chrome.storage.sync.set({
        linkList: list
    }, function () {
        callback();
    });
}
/**
 * Get the whiteList data
 * @param {function} callback function with paramater that receives the whiteList value
 */
function getWhiteList(callback) {
    chrome.storage.sync.get({
        whiteList: []
    }, function (items) {
        callback(items.whiteList);
    });

}
/**
 * Set the whiteList data
 * @param {Array}    list     Array of URLs that should be allowed
 * @param {function} callback Function with paramater that receives the new whiteList value
 */
function setWhiteList(list, callback) {
    chrome.storage.sync.set({
        whiteList: list
    }, function () {
        callback();
    });
}
/**
 * Get the blockTime data
 * @param {function} callback Function with paramater that receives the blockTime value
 */
function getBlockTime(callback) {
    chrome.storage.sync.get({
        blockTime: 0
    }, function (items) {
        callback(items.blockTime)
    });
}
/**
 * Set the blockTime data
 * @param {number}   time     The time that the blacklist should be paused until 
 * @param {function} callback Function with paramater that receives the new blockTime value
 */
function setBlockTime(time, callback) {
    console.log(time);
    chrome.storage.sync.set({
        blockTime: time
    }, function () {
        callback();
    });
}
/**
 * Get the forceRefresh data
 * @param {function} callback function with paramater that receives the forceRefresh value
 */
function getForceRefresh(callback) {
    chrome.storage.sync.get({
        forceRefresh: 0
    }, function (items) {
        callback(items.forceRefresh);
    });
}
/**
 * Set the forceRefresh data
 * @param {number}   isForced 1 or 0 for whether refresh should be forced
 * @param {function} callback Function with paramater that receives the new forceRefresh value
 */
function setForceRefresh(isForced, callback) {
    chrome.storage.sync.set({
        forceRefresh: isForced
    }, function () {
        callback();
    });
}
/**
 * Get the noPause data
 * @param {function} callback function with paramater that receives the noPause value
 */
function getNoPause(callback) {
    chrome.storage.sync.get({
        noPause: 0
    }, function (items) {
        callback(items.noPause);
    });
}
/**
 * Set the noPause data
 * @param {number}   disablePause 1 or 0 for whether pause should be disabled
 * @param {function} callback Function with paramater that receives the new noPause value
 */
function setNoPause(disablePause, callback) {
    chrome.storage.sync.set({
        noPause: disablePause
    }, function () {
        callback();
    });
}

