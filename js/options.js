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

// Saves options to chrome.storage
function save_options() {
    get_options(function (items) {

        var link = document.getElementById('newSite').value;
        validateUrl(link, function (cleanLink) {
            if(cleanLink != "" && cleanLink.localeCompare("gofuckingwork.com") != 0){
                console.log(cleanLink+cleanLink.localeCompare("gofuckingwork.com"));
            document.getElementById('newSite').value = "";
            var tempLinkList = items.linkList;
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
    get_options(function (items) {
        items.linkList.forEach(function (element, index, array) {
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

function get_options(callback) {
    chrome.storage.sync.get({
        linkList: []
    }, callback);
}

function remove_option(event) {
    var id = event.data.id;
    get_options(function (items) {
        var tempLinkList = items.linkList;
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

function clear_options() {
    chrome.storage.sync.clear(function () {
        var status = document.getElementById('status');
        restore_options();
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

function openShare (url){
    var newwindow=window.open(url,'name','height=550,width=700');
	if (window.focus) {newwindow.focus()}
	return false;    
}

chrome.storage.onChanged.addListener(function(changes, namespace) {
  restore_options();
});
document.getElementById('facebookShare').addEventListener('click', function () {
    openShare("https://www.facebook.com/sharer/sharer.php?u=https%3A//chrome.google.com/webstore/detail/go-fucking-work/hibmkkpfegfiinilnlabbfnjcopdiiig/");
});
document.getElementById('twitterShare').addEventListener('click', function () {
    openShare("https://twitter.com/home?status=It's%20time%20to%20get%20stop%20fucking%20procrastinating.%20Go%20Fucking%20Work%3A%20https%3A//goo.gl/Yufdv3");
});
document.getElementById('hiAlex').addEventListener('click', function () {
    openShare("https://twitter.com/home?status=%40hialexlam%20");
});
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('saveSite').addEventListener('click', save_options);
document.querySelector('#newSite').addEventListener('keypress', function (e) {
    var key = e.which || e.keyCode;
    if (key === 13) {
        save_options();
    }
});
//document.getElementById('clearSites').addEventListener('click', clear_options);

        // Standard Google Universal Analytics code
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','https://www.google-analytics.com/analytics.js','ga'); // Note: https protocol here
 
ga('create', 'UA-74648006-4', 'auto');
ga('set', 'checkProtocolTask', function(){}); // Removes failing protocol check. @see: http://stackoverflow.com/a/22152353/1958200
ga('require', 'displayfeatures');
ga('send', 'pageview', '/options.html');
