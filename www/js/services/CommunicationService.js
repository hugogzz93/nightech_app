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
	 	// event registration
	 	events.on("logInAttempt", function (parameters) {
	 		 this.logIn(parameters);
	 	}.bind(this));

	 	events.on("reservationSubmitted", function (parameters) {
	 		 this.submitReservation(parameters);
	 	}.bind(this));


	 this.startSession = function (user) {
	 	 auth_token = user.auth_token;
	 	 credentials = user.credentials; 
	 	 console.log(credentials);
	 }

	 this.logIn = function (parameters) {
	 	const logIn = $.proxy(this.startSession, this);

	 	$.ajax({
	 	 	url: url + '/sessions',
	 	 	type: 'POST',
	 	 	dataType: 'json',
	 	 	data: {session: parameters},
	 	 }).done(function (response) {
	 	 	 events.emit("logInSuccess", response.user);
	 	 	 logIn(response.user);
	 	 }).fail(function (response) {
	 		alert(JSON.parse(response.responseText).errors);
	 	 });

	 }

	 this.getReservationsByDate = function (date) {
	 	 const dateString = date.toISOString();
	 	 return $.ajax({
	 	  	url: url + '/reservations',
	 	  	type: 'GET',
	 	  	dataType: 'json',
	 	  	data: {date : dateString},
	 	  	beforeSend: function (request)
            {
                request.setRequestHeader("Authorization", auth_token);
            }
	 	  })
	 	  .fail(function() {
	 		alert("Connection Error 001");
	 	  });
	 	   
	 }

	this.getRepresentatives = function () {
		 return $.ajax({
		 	url: url + '/representatives',
		 	type: 'GET',
		 	dataType: 'json',
		 	beforeSend: function (request)
            {
                request.setRequestHeader("Authorization", auth_token);
            }
		 })
		 .fail(function() {
	 		alert("Connection Error 002");
		 });	  
	}

	this.submitReservation = function (reservationJson) {
	 	$.ajax({
	 	 	url: url + '/reservations',
	 	 	type: 'POST',
	 	 	dataType: 'json',
	 	 	data: {reservation: reservationJson},
	 	 	beforeSend: function (request)
            {
                request.setRequestHeader("Authorization", auth_token);
            }
	 	 }).done(function (response) {
	 		 events.emit('reservationCreated', response);
	 	 }).fail(function (response) {
	 		alert(JSON.parse(response.responseText).errors);
	 	 });
	 	
	}







}