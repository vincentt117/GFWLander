function getQuote(callback) {
    //var quotes = ["GO FUCKING WORK.", "FUCK YOU. WORK.", "TICK TOCK. FUCKING WORK.", "YOU'RE DYING SOON. WORK.", "REMEMBER WORK? FUCKING DO IT.", "WORK YOU FUCKING FAILURE.", "FUCKING WORK. NOW.", "WHAT THE FUCK? GO WORK.", "WORK YOU FUCKITY FUCK.", "YOU LOSER. FUCKING WORK."];
    getLocalizedQuoteList(function (quotes) {
        var min = 0;
        var max = quotes.length - 1;
        var delay = 3;
        var response = quotes[Math.floor(Math.random() * (max - min + 1)) + min];


        //Check if refreshing. Tells you to GET BACK TO FUCKING WORK. Contributed by Giles Wells: MediaGearhead.com
        if (typeof localStorage.getItem('lastLoad') == "string" && document.referrer.localeCompare("") == 0) {
            if (parseInt(localStorage.getItem('lastLoad')) + delay > Math.floor(Date.now() / 1000)) {
                response = "STOP FUCKING REFRESHING. WORK.";
            }
        }

        localStorage.setItem('lastLoad', Math.floor(Date.now() / 1000));
        callback(response);
    });
}

function getLocalizedQuoteList(callback) {
    loadJSON(function (response) {
        var quoteList = JSON.parse(response);
        var locale = getParameterByName("lang", window.location.href);

        if (!quoteList.language[locale]) {
            callback(quoteList.language.en);
        } else {
            callback (quoteList.language[locale]);
        }

    });
}

function openShare(url) {
    var newwindow = window.open(url, 'name', 'height=550,width=700');
    if (window.focus) {
        newwindow.focus()
    }
    return false;
}

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function loadJSON(callback) {

    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', '../quotes.json', true);
    xobj.onreadystatechange = function () {
        if (xobj.readyState == 4 && xobj.status == "200") {
            callback(xobj.responseText);
        }
    };
    xobj.send(null);
}

/*
document.getElementById('facebook-share').addEventListener('click', function () {
    openShare("https://www.facebook.com/sharer/sharer.php?u=https%3A//chrome.google.com/webstore/detail/go-fucking-work/hibmkkpfegfiinilnlabbfnjcopdiiig/");
});
*/
document.getElementById('twitter-share').addEventListener('click', function () {
    var quote = encodeURIComponent(document.getElementById('quote').innerHTML);
    openShare("https://twitter.com/home?status=" + quote + "%20https%3A%2F%2Fwww.gofuckingwork.com");
});