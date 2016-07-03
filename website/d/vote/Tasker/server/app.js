var Twit = require('twit');
var Mysql = require('mysql');
var CronJob = require('cron').CronJob;


var connection = Mysql.createConnection({
    host: 'mysql.lamify.com',
    user: 'gfw_api',
    password: '//aaeTFa54Pe',
    database: 'gfw_voting'
});

var T = new Twit({
    consumer_key: 'B6wUjvyZ9wq5bmO7XBHR5EGRU',
    consumer_secret: '6qMnQR8YeHEKStNgMm54QKXIB9UAlmoX3zVZiT1W6cAKMC93Ql',
    access_token: '22854837-Gp6W2NfcLocYeVFmqmZ267zCEBIbqvVOvi9pZh5rg',
    access_token_secret: 'JKdbvuTmIYMSurLEohjo9QhKgxjc3XdwcF6ezSmdkv7AJ',
    timeout_ms: 60 * 1000, // optional HTTP request timeout to apply to all requests.
});

connection.connect();

var job = new CronJob('2,8,14,20,26,32,38,44,50,56 * * * * *', function () {
        updateTweets();
        console.log("Job Run");
    }, function () {
        console.log("Job has run");
    },
    true, /* Start the job right now */
    'America/Los_Angeles' /* Time zone of this job. */
);

function updateTweets() {
    T.get('statuses/lookup', {
        'id': '748355917708673028,748369983902781441,748444485080748032,748494109833302017,748524167826382852,748550465873391617,748566490467737600,748593744623079426,748630552887103488,748669518298349568'
    }, function (err, data, response) {

        for (var i = 0; i < data.length; i++) {
            saveStats(data[i]);
        }
    });
}

function saveStats(tweet) {
    var favCount = tweet["favorite_count"];
    var rtCount = tweet["retweet_count"];
    var tweetID = tweet["id_str"];

    connection.query('UPDATE tweets SET count_favs = ' + favCount + ' WHERE id = ' + tweetID + ' AND (count_favs <> ' + favCount + ' OR count_favs IS NULL)', function (err, rows, fields) {
        if (err) throw err;
        console.log("Fav Update Complete: " + tweetID);
    });
    connection.query('UPDATE tweets SET count_rts = ' + rtCount + ' WHERE id = ' + tweetID + ' AND (count_rts <> ' + rtCount + ' OR count_rts IS NULL)', function (err, rows, fields) {
        if (err) throw err;
        console.log("RT Update Complete: " + tweetID);
    });
}