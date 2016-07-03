
function changeVote(id, value) {
    var voteElement = document.getElementById("vote-count-" + id);
    var curCount = parseInt(voteElement.innerHTML);
    var newCount = curCount + value;
    voteElement.innerHTML = newCount;
    setVoteButton(id, value);
}

function setVoteButton(id, value) {
    var voteButton = document.getElementById("vote-button-" + id);
    voteButton.className = "";
    if (value == 1) {
        voteButton.className = "vote-button voted";
    } else {
        voteButton.className = "vote-button animate-flicker";
    }
}


function getGuid() {
    var guid = Cookies.get('guid');
    if (!guid) {
        guid = guidGenerator();
        Cookies.set('guid', guid, {
            expires: 180
        });
    }
    return guid;
}


function guidGenerator() {
    var S4 = function () {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
    return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
}

function openShare (url){
    var newwindow = window.open(url, 'name', 'height=420,width=550');
    if (window.focus) {
        newwindow.focus()
    }
    return false;
}