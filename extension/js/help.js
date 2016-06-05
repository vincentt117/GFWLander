function openShare(url) {
    var newWindow = window.open(url, 'name', 'height=550,width=700');
    if (window.focus) {
        newWindow.focus()
    }
    return false;
}
document.getElementById('supportTweet').addEventListener('click', function () {
    openShare("https://twitter.com/home?status=%40hialexlam%20");
});
