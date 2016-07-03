var CronJob = require('cron').CronJob;

try {
	new CronJob('2,8,14,20,26,32,38,44,50,56 * * * * *', function() {
		console.log('this should not be printed');
	})
} catch(ex) {
	console.log("cron pattern not valid");
}
