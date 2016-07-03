<?php
include 'functions.php';


if ($_POST['vote'] && $_POST['id']) {
    $voteValue     = (is_numeric($_POST['vote']) ? (int) $_POST['vote'] : 0);
    $tweetID       = (is_numeric($_POST['id']) ? (int) $_POST['id'] : 0);
    $guid          = $mysqli->real_escape_string($_POST['guid']);
    $voteSubmitted = hasVoted($tweetID);
    $sumVotes      = $mysqli->query("SELECT SUM(value) FROM " . $voteTable . " WHERE tweet_id = " . $tweetID . " AND guid = '" . $guid . "'")->fetch_row()[0];
    
    if ((($sumVotes == 1 && $voteValue == -1 && $voteSubmitted) || (($sumVotes == 0 || !$sumVotes) && $voteValue == 1 && !$voteSubmitted)) && $tweetID != 0) {
        
        $ip           = $_SERVER['REMOTE_ADDR'];
        $userAgent    = $_SERVER['HTTP_USER_AGENT'];
        $addVote      = $mysqli->query("INSERT INTO " . $voteTable . " (ip_address,user_agent,guid,tweet_id,value) VALUES ('" . $ip . "','" . $userAgent . "','" . $guid . "','" . $tweetID . "','" . $voteValue . "')");
        $addVoteCount = $mysqli->query("UPDATE " . $tweetTable . " SET count_clicks = count_clicks + " . $voteValue . " WHERE id = " . "'" . $tweetID . "'");
        setTweetCookie($tweetID, $voteValue);
        echo $addVote && $addVoteCount;
    } else {
        //echo "Sum Votes: " . $sumVotes . "Vote Value: " . $voteValue . "Vote Submitted: " . $voteSubmitted . "Tweet ID: " . $tweetID;
        echo false;
    }
} else {
    echo false;
}



?>