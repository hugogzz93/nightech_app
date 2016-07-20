var FinanceView = function (communication) {

	var data
	var chartView
	var scope = "month";
	var credentials;
	const administratorCred = "administrator"
	const superCred = "super"
	const coordinatorCred = "coordinator"

	this.initialize = function () {
		this.$el = $('<div/>');
		credentials = {isSuper: communication.currentCredentials() === "super", id: communication.getUserId()};
		chartView = new ChartView(communication);
		this.$el.on('change', '.datepicker', $.proxy(this.datePickerChange, this));
		this.$el.on('click', '.button-collapse', function (e) {
 	 		if ($('.button-collapse').attr('data-triggered') == undefined) {
 		 		$('.button-collapse').attr('data-triggered', 1);
 				$('.button-collapse').sideNav();
 	 		};
 			$('.button-collapse').sideNav('show');
 	 	});

	 	this.findByDate(new Date());
		this.render();
	}

	this.render = function () {
		this.$el.html(this.template(credentials));
		$('.chartContent', this.$el).html(chartView.$el);
	 	const $datepicker = this.$el.find('.datepicker');
	 	$datepicker.pickadate({container: 'body'});
		$datepicker.val( $datepicker.val() === "" ? new Date().toDateString() : $datepicker.val());
		return this; 
	}

	this.daysInScope = function (scope) {
		 var days;
		 if (scope === "month") {
		 	var currentDate = new Date();
		 	days = new Date(currentDate.getYear(), currentDate.getMonth() + 1, 0).getDate();
		 } else if(scope === "week") {
		 	days = 7;
		 } else if(scope === "day") {
		 	days = 1;
		 }

		 return days;

	}



	this.dataHandler = function (users, services, rps, tables) {
		data = this.digestData(users, services, rps, tables);
		labels = [];
		for (var i = 0; i < data.tables.length; i++) {
			table = data.tables[i];
			if (table.totalAmmount > 0) {
				labels.push(table.number);
			};
		};
		activeTables = data.tables.map(function(e){return e.totalAmmount}).filter(function(a) {return a > 0})
		chartView.setData(activeTables, labels, 'line', "$");
	}

	//takes a list of services
	// extracts information such as total ammount..etc
	this.digestData = function (usersRes, servicesRes, repsRes, tablesRes) {
		const daysInScope = $.proxy(this.daysInScope, this);
		const services = servicesRes[0].services;
		const users = usersRes[0].users;
		const reps = repsRes[0].representatives;
		const tables = tablesRes[0].tables;

		var index = {
			users: {},
			tables: {}
		}

		var data = {
			total: services.length,
			totalAmmount: 0,
			missingAmmount: 0,
			administrators: [],
			coordinators: [],
			reps: [],
			tables: [],
			days: Array.apply(null, Array(daysInScope(scope))).map(function() {return 0})
		}

		for (var i = 0; i < users.length; i++) {
			if (users[i].credentials === administratorCred || users[i].credentials === superCred) {
				data.administrators.push({
					name: users[i].name,
					id: users[i].id,
					credentials: users[i].credentials,
					totalAmmount: 0,
					totalServices: 0
				})
				index.users[users[i].id] = data.administrators.length - 1;
			} else if(users[i].credentials === coordinatorCred) {
				data.coordinators.push({
					name: users[i].name,
					id: users[i].id,
					totalAmmount: 0,
					totalServices: 0
				})
				index.users[users[i].id] = data.coordinators.length - 1;
			}
		};

		for (var i = 0; i < tables.length; i++) {
			data.tables.push({
				id: tables[i].id,
				number: tables[i].number,
				totalAmmount: 0,
				totalServices: 0,
				activeTime: 0,
			})
			index.tables[tables[i].id] = data.tables.length - 1;
		};

	  	for (var i = 0; i < services.length; i++) {
	  		var service = services[i];
	  		if (service.ammount) {
	  			var date = new Date(service.date)

	  			data.totalAmmount += service.ammount;
	  			// add stats to administrator
	  			data.administrators[index.users[service.administrator_id]].totalAmmount += parseInt(service.ammount);
	  			data.administrators[index.users[service.administrator_id]].totalServices++;
	  			// add stats to coordinator
	  			if (service.administrator_id != service.coordinator_id) {
	  				data.administrators[index.users[service.coordinator_id]].totalAmmount += parseInt(service.ammount);
		  			data.administrators[index.users[service.coordinator_id]].totalServices++;
	  			};
	  			// add stats to table
	  			var seatedDate, completeDate;
	  			seatedDate = new Date(service.seated_time);
	  			completeDate = new Date(service.completed_time);
	  			data.tables[index.tables[service.table_id]].activeTime += Math.abs(seatedDate - completeDate);
	  			data.tables[index.tables[service.table_id]].totalAmmount += parseInt(service.ammount);
	  			data.tables[index.tables[service.table_id]].totalServices ++;
	  			// add day stats
	  			data.days[date.getDate()] += service.ammount


	  		} else {
	  			data.missingAmmount++;
	  		}
	  	};
	  	return data;
	}

	this.datePickerChange = function () {
		const date = new Date(this.$el.find('.datepicker').val());
		date.setHours(0,0,0,0);
		this.findByDate(date);
	}

	this.toggleLoading = function () {
		const progressBar =  $('.progress', this.$el);
		if (progressBar) {
			progressBar.toggleClass('hidden');
		};
	}

	this.findByDate = function(date, def) {
		const dataHandler = $.proxy(this.dataHandler, this);
		const digestUsers = $.proxy(this.digestUsers, this);
		const toggleLoading = $.proxy(this.toggleLoading, this);
		const digestServices = $.proxy(this.digestServices, this);
		const getUsers = communication.getUsers;
		const getServices = communication.getServices;
		const getRps = communication.getRepresentatives;
		const getTables = communication.getTablesByDate;
		toggleLoading();
		$.when(getUsers(), getServices(date, scope), getRps(), getTables(date)).done(dataHandler)
		.always(toggleLoading);
	}
	
	this.initialize();
}