const Communication = function () {
	 
	 var url;
	 var auth_token;
	 var credentials;

	 this.initialize = function (nightech_url) {
	 	url = nightech_url ? nightech_url : "http://api.nightech_api.dev";
	 	auth_token = null;
	 	credentials = null;

	 	var deferred = $.Deferred();
        deferred.resolve();
        return deferred.promise();
	 }

	 this.logIn = function (parameters) {
	 	var user_params = parameters;
	 	 return $.ajax({
	 	 	url: url + '/sessions',
	 	 	type: 'POST',
	 	 	dataType: 'json',
	 	 	data: {session: user_params},
	 	 });
	 }


}