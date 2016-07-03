/*TODO:
Add Listeners for web intent popups
make sure gfw doesnt block these popups
clean console logging*/

$(document).ready(function () {
    var guid = getGuid();
    $('.vote-button').click(function () {
        var tweetId = $(this).attr('data-id');
        var ajaxurl = 'vote.php';
        var voteValue = 1;
        var classList = $(this).attr('class').split(/\s+/);
        $.each(classList, function (index, item) {
            if (item === 'voted') {
                voteValue = -1;
            }
        });
        var data = {
            'id': tweetId,
            'vote': voteValue,
            'guid': guid
        };

        changeVote(tweetId, voteValue);
        $.post(ajaxurl, data, function (response) {
            
            if (response == true) {
                //changeVote(tweetId, voteValue);
                console.log("Success");
            } else {
                //alert("Something went wrong :( Please email me@alexanderlam.ca if the error persists.");
                console.log("Failed");
            }
        });
    });

    $('.fav-button').click(function () {
        var tweetID = $(this).attr('data-id');
        openShare("https://twitter.com/intent/like?tweet_id=" + tweetID + "&related=gofuckingwork,hialexlam");
    });
    $('.rt-button').click(function () {
        var tweetID = $(this).attr('data-id');
        openShare("https://twitter.com/intent/retweet?tweet_id=" + tweetID + "&related=gofuckingwork,hialexlam");
    });

});