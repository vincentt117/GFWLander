<?php

$mysqli = mysqli_connect("mysql.lamify.com", "alexanderlam", "//aaeTFa57Pe", "gfw_voting");
if (mysqli_connect_errno($mysqli)) {
    echo "Failed to connect to MySQL: " . mysqli_connect_error();
}
$voteTable  = "votes";
$tweetTable = "tweets";



function createVoteOptions()
{
    $tweets = getTweets();
    
    foreach ($tweets as $tweet) {
        
        $tweetID      = $tweet['id'];
        $text         = $tweet['text'];
        $creditHandle = $tweet['credit_handle'];
        $voteCount    = $tweet['count_clicks'] + $tweet['count_favs'] * 5 + $tweet['count_rts'] * 10;
        $voted = hasVoted($tweetID);
        
        echo createVoteOption($tweetID, $text, $voteCount, $creditHandle, $voted);
    }
    
}
function createVoteOption($tweetID, $text, $voteCount, $creditHandle, $voted)
{
    $credits = "";
    if ($creditHandle != "") {
        $credits = "<p class='credits'><a href='https://www.twitter.com/" . $creditHandle . "' target='_blank'>@" . $creditHandle . "</a></p>";
    }
    $voteButtonClasses = "vote-button animate-flicker";
    if ($voted) {
        $voteButtonClasses = "vote-button voted";
    }
    
    $voteOption = "<div class='vote-body'>
            " . $credits . "
            <div class='row vote-wrapper'>
                <div class='col-xs-3 vote-left-wrapper'>
                    <div class='col-xs-3'>
                        <div class='" . $voteButtonClasses . "' data-id='" . $tweetID . "' id='vote-button-" . $tweetID . "'>▲</div></div>
                    <div class='col-xs-9 vote-count-wrapper'>
                            <h2 class='vote-count-num' data-id='" . $tweetID . "' id='vote-count-" . $tweetID . "'>" . $voteCount . "</h2>
                            <p>votes</p>
                    </div>
                </div>
                <div class='col-xs-9'>
                    <div class='row'>
                        <h3>" . $text . "</h3>
                        <p>
                            <button class='fav-button' data-id='" . $tweetID . "' id='fav-button-" . $tweetID . "'>5 Extra Votes: <i class='fa fa-twitter' aria-hidden='true'></i> / <i class='fa fa-heart' aria-hidden='true'></i></button>
                            <button class='rt-button' data-id='" . $tweetID . "' id='rt-button-" . $tweetID . "'>10 Extra Votes: <i class='fa fa-twitter' aria-hidden='true'></i> / <i class='fa fa-retweet' aria-hidden='true'></i></button></p>
                    </div>
                </div>
            </div>
        </div>";
    return $voteOption;
}

function getTweets()
{
    global $mysqli;
    global $tweetTable;
    
    return $mysqli->query("SELECT id, text, credit_handle, count_favs, count_rts, count_clicks FROM " . $tweetTable . " ORDER BY count_clicks + count_favs*5 + count_rts*10 DESC")->fetch_all(MYSQLI_ASSOC);
}

function hasVoted($tweetID)
{
    $voteCookie = (is_numeric($_COOKIE[$tweetID]) ? (int) $_COOKIE[$tweetID] : 0);
    return $voteCookie === 1;
}

function setTweetCookie($tweetID, $val)
{
    setcookie($tweetID, $val, time() + (86400 * 30 * 180), '/');
}



?>