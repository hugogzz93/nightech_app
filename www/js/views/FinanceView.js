var FinanceView = function (communication) {

	const TABLE_ICON_NAME = "view_array"
	const USER_ICON_NAME = "supervisor_account"
	const ADMINISTRATOR_CREDENTIAL = "administrator"
	const SUPER_CREDENTIAL = "super"
	const COORDINATOR_CREDENTIAL = "coordinator"

	var data = {}
	var prevData = {}
	var date
	var chartView
	var scope = "day";
	var credentials;
	var userList;
	var listToggle = false;

	labelString = "$"
	prevLabelString = "$"

	this.initialize = function () {
		this.$el = $('<div/>');
		credentials = {isSuper: communication.currentCredentials() === "super", id: communication.getUserId()};
		chartView = new ChartView(communication);
		userList = new UserFinanceList();

		this.$el.on('change', '.datepicker', $.proxy(this.datePickerChange, this));
		this.$el.on('click', '.tab', $.proxy(this.tabPicked, this));
		this.$el.on('click', '.user-li', function (e) {
			 for (var i = 0; i < data.coordinators.length; i++) {
			 	if(data.coordinators[i].id	== $(e.target).attr('data-user-id')) {
			 		events.emit('setData', data.coordinators[i]);
			 		events.emit('navigationRequest', '#administrator/super/finance/users/'+data.coordinators[i]);
			 		break;

			 	}
			 };	
		})
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

	this.render = function (date) {
		data.credentials = credentials;
		data.id = communication.getUserId;
		this.$el.html(this.template(data));
		$('#chartContent', this.$el).html(chartView.$el);
		$('#userList', this.$el).html(userList.$el);
	 	const $datepicker = this.$el.find('.datepicker');
	 	$datepicker.pickadate({container: 'body'});
		$datepicker.val( this.date.toDateString() || ($datepicker.val() === "" ? new Date().toDateString() : $datepicker.val()));
		const $tabs = this.$el.find('ul.tabs');
		$tabs.tabs();

		$('.tab a', this.$el).removeClass('active');
		if(scope === "day") 		{ $('#day-a', this.$el).addClass('active'); }
		else if(scope === "week") 	{ $('#week-a', this.$el).addClass('active'); }
		else if(scope === "month") 	{ $('#month-a', this.$el).addClass('active'); }

		$('.fixed-action-btn', '.page.transition.center').remove(); //fixes pageslider error
		$('#user-finance-btn').on('click', function(){
			 $('#tableList', this.$el).toggleClass("hidden");
			 $('#userList', this.$el).toggleClass("hidden");
			 $('#user-finance-btn-icon').html(listToggle ? USER_ICON_NAME: TABLE_ICON_NAME);
			 listToggle = !listToggle;
		})
		return this; 
	}

	this.dataHandler = function (users, services, prevServices, rps, tables, prevTables) {
		data = this.digestData(users, services, rps, tables);
		prevData = this.digestData(users, prevServices, rps, prevTables);
		labels = [];
		ticks = [], prevTicks = [];
		
		if(scope === "month") {
			labelString = "$"
			prevLabelString = "Past Month's $"
			for (var i = 0; i < Object.keys(data.days).length; i++) {
				day = data.days[Object.keys(data.days)[i]];
				prevDay = prevData.days[Object.keys(data.days)[i]];

				if(day > 0) {
					ticks.push(day);
					prevTicks.push(prevDay || 0);
					labels.push("Day: " + Object.keys(data.days)[i]);
				}
			};
		} else if(scope === "week") {
			labelString = "$"
			prevLabelString = "Past Week's $"
			var names = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
			for (var i = 0; i < Object.keys(data.days).length; i++) {
				day = data.days[Object.keys(data.days)[i]];
				prevDay = prevData.days[Object.keys(prevData.days)[i]];

				if(day > 0) {
					ticks.push(day);
					prevTicks.push(prevDay || 0);
					weekDate = new Date(this.date.getFullYear(), this.date.getMonth(), Object.keys(data.days)[i])
					labels.push("Day: " + names[weekDate.getDay()]);
				}
			};
		} else {
			labelString = "$"
			prevLabelString = "Yesterday's $"

			for (var i = 0; i < data.tables.length; i++) {
				var table = data.tables[i];
				if(table.totalAmmount > 0) {
					labels.push("Table: " + table.number);
					ticks.push(table.totalAmmount);
					prevTicks.push(prevData.tables[i].totalAmmount);
				}

			};
		}
		if(ticks.length > 0) {
			chartView.setData(ticks, labels, 'line', labelString);
			chartView.addData(prevTicks,'line', prevLabelString);
		}

		
		userList.setUsers(data.coordinators)
		this.render(this.date);
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

		var _data = {
			total: services.length,
			totalAmmount: 0,
			missingAmmount: 0,
			administrators: [],
			coordinators: [],
			tables: [],
			days: []
		}

		for (var i = 0; i < users.length; i++) {
			if (users[i].credentials === ADMINISTRATOR_CREDENTIAL || users[i].credentials === SUPER_CREDENTIAL) {
				_data.administrators.push({
					name: users[i].name,
					id: users[i].id,
					credentials: users[i].credentials,
					totalAmmount: 0,
					totalServices: 0
				})
				index.users[users[i].id] = _data.administrators.length - 1;
			} else if(users[i].credentials === COORDINATOR_CREDENTIAL) {
				_data.coordinators.push({
					name: users[i].name,
					id: users[i].id,
					totalAmmount: 0,
					totalServices: 0,
					reps:{"-1":{services:[]}}
				})
				index.users[users[i].id] = _data.coordinators.length - 1;
			}
		};

		for (var i = 0; i < tables.length; i++) {
			_data.tables.push({
				id: tables[i].id,
				number: tables[i].number,
				totalAmmount: 0,
				totalServices: 0,
				activeTime: 0,
			})
			index.tables[tables[i].id] = _data.tables.length - 1;
		};

	  	for (var i = 0; i < services.length; i++) {
	  		var service = services[i];
	  		if (service.ammount) {
	  			var administrator = _data.administrators[index.users[service.administrator_id]]
	  			var table = _data.tables[index.tables[service.table_id]]
	  			var date = new Date(service.date)
	  			var seatedDate, completeDate;
	  			seatedDate = new Date(service.seated_time); completeDate = new Date(service.completed_time);


	  			_data.totalAmmount += parseInt(service.ammount);
	  			// add stats to administrator
	  			administrator.totalAmmount += parseInt(service.ammount);
	  			administrator.totalServices++;
	  			// add stats to coordinator if it had a reservation
	  			if (service.administrator_id != service.coordinator_id) {
	  				var coordinator = _data.coordinators[index.users[service.coordinator_id]];
	  				coordinator.totalAmmount += parseInt(service.ammount);
		  			coordinator.totalServices++;
	  				if(service.representative) {
	  					var rep = coordinator.reps[service.representative.id];
			  			if(rep) {
			  				rep.services.push(service);
			  			}  else {
			  				coordinator.reps[service.representative.id] = {name: service.representative.name, services: [service]};
			  			}
	  				} else {
	  					coordinator.reps[-1].services.push(service)
	  				}
		  			
	  			};
	  			// add stats to table
	  			table.activeTime += Math.abs(seatedDate - completeDate);
	  			table.totalAmmount += parseInt(service.ammount);
	  			table.totalServices ++;

	  			// add day stats
	  			if(_data.days[date.getDate()]) { _data.days[date.getDate()] += parseInt(service.ammount); }
	  				else {  _data.days[date.getDate()] = parseInt(service.ammount); }

	  		} else {
	  			_data.missingAmmount++;
	  		}
	  	};
	  	return _data;
	}

	this.datePickerChange = function () {
		const dateVal = this.$el.find('.datepicker').val();
		var date;
		if(dateVal === "") {
			this.$el.find('.datepicker').val(new Date().toDateString());
			date = new Date(this.$el.find('.datepicker').val());
		} else {
			date = new Date(dateVal);
			
		}
		date.setHours(0,0,0,0);
		this.findByDate(date);
		const $tabs = this.$el.find('ul.tabs');
		$tabs.tabs();
	}

	this.findByDate = function(date, def) {
		this.date = date;
		const dataHandler = $.proxy(this.dataHandler, this);
		const digestUsers = $.proxy(this.digestUsers, this);
		const toggleLoading = $.proxy(this.toggleLoading, this);
		const digestServices = $.proxy(this.digestServices, this);
		const getUsers = communication.getUsers;
		const getServices = communication.getServices;
		const getRps = communication.getRepresentatives;
		const getTables = communication.getTablesByDate;
		const prevDate = this.getPrevious(date, scope);
		console.log(date)
		console.log(prevDate)



		toggleLoading();
		$.when(getUsers(), getServices(date, scope), getServices(prevDate, scope), getRps(), getTables(date), getTables(prevDate)).done(dataHandler)
		.always(toggleLoading);
	}

	// ----------------------------------- helpers -----------------------------------
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

	this.getPrevious = function (date, scope) {
		var newDate = new Date()
		newDate.setDate(date.getDate() - this.daysInScope(scope))
		return newDate;
	}

	this.toggleLoading = function () {
		const progressBar =  $('.progress', this.$el);
		if (progressBar) {
			progressBar.toggleClass('hidden');
		};
	}

	this.tabPicked = function (e) {
		scope = $(e.target).attr('data-scope');
		this.datePickerChange();
	}
	
	this.initialize();
}