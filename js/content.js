var curUrl = window.location.href;

checkUrl(curUrl, function(response){
    getBlockTime(function(time){
    if (response && time <= Date.now()){
        window.location.href = "https://www.gofuckingwork.com";
    }
});
});