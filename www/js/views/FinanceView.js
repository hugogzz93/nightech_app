var FinanceView = function (communication) {

	var data
	var chartView

	this.initialize = function () {
		this.$el = $('<div/>');
		chartView = new ChartView();
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
		this.$el.html(this.template());
		$('.chartContent', this.$el).html(chartView.$el);
	 	const $datepicker = this.$el.find('.datepicker');
	 	$datepicker.pickadate({container: 'body'});
		$datepicker.val( $datepicker.val() === "" ? new Date().toDateString() : $datepicker.val());
		return this; 
	}

	//takes a list of services
	// extracts information such as total ammount..etc
	this.digestData = function (usersRes, servicesRes, repsRes, tablesRes) {
		const services = servicesRes[0].services;
		const users = usersRes[0].users;
		const reps = repsRes[0].representatives;
		const tables = tablesRes[0].tables;
		var index = {
			users: {}
		}
		debugger
		data = {
			total: services.length,
			totalAmmount: 0,
			missingAmmount: 0,
			administrators: [],
			coordinators: [],
			reps: [],
			tables: [],
		}

		for (var i = 0; i < users.length; i++) {
			if (users[i].credentials == "administrator") {
				data.administrators.push({
					name: users[i].name,
					id: users[i].id,
					credentials: users[i].credentials,
					totalAmmount: 0,
					totalServices: 0
				})
				index.users[users[i]] = data.administrators.length;
			} else if(users[i].credentials == "coordinator") {
				data.coordinators.push({
					name: users[i].name,
					id: users[i].id,
					totalAmmount: 0,
					totalServices: 0
				})
				index.users[users[i]] = data.coordinators.length;
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
		};

	  	for (var i = 0; i < services.length; i++) {
	  		if (services[i].ammount) {
	  			data.totalAmmount += services[i].ammount;
	  			// add stats to administrator
	  			data.administrators[index.users[services[i].administrator_id]].totalAmmount += services[i].ammount;
	  			data.administrators[index.users[services[i].administrator_id]].totalServices++;
	  			// add stats to coordinator
	  			if (services[i].administrator_id != services[i].coordinator_id) {
	  				data.administrators[index.users[services[i].coordinator_id]].totalAmmount += services[i].ammount;
		  			data.administrators[index.users[services[i].coordinator_id]].totalServices++;
	  			};
	  			// add stats to table

	  		} else {
	  			data.missingAmmount++;
	  		}



	  	};
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

	this.findByDate = function(date) {
		const digestData = $.proxy(this.digestData, this);
		const digestUsers = $.proxy(this.digestUsers, this);
		const toggleLoading = $.proxy(this.toggleLoading, this);
		const digestServices = $.proxy(this.digestServices, this);
		const getUsers = communication.getUsers;
		const getServices = communication.getServices;
		const getRps = communication.getRepresentatives;
		const getTables = communication.getTablesByDate;
		toggleLoading();
		$.when(getUsers(), getServices(date, "month"), getRps(), getTables(date)).done(digestData)
		.always(toggleLoading);
	}
	
	this.initialize();
}