const Communication = function () {
	 var url;

	 this.initialize = function (nightech_url) {
	 	this.url = nightech_url ? nightech_url : "http://api.nightech_api.dev";
	 	var deferred = $.Deferred();
        deferred.resolve();
        return deferred.promise();
	 }
}