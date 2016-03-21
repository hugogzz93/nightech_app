var AdministratorView = function (communication) {

	var reservationsListView
	var servicesListView
	var tables
	 
	 this.initialize = function () {
	 	 this.$el = $('<div/>') ;
         reservationsListView = new ReservationsListView(true);
         servicesListView = new ServicesListView();
	 	 this.$el.on('change', '.datepicker', $.proxy(this.datePickerChange, this));
	 	 this.$el.on('click', '.tab', function () {
	 	 	$('.tab-data').addClass('hidden')
	 	 	$("#" + $(this).attr("data-tab-id")).removeClass('hidden');
	 	 })
	 	 this.$el.on('click', '.service-submit', $.proxy(this.submitService, this));
	 	 this.$el.on('click', '.delete-btn', $.proxy(this.destroyService, this));
	 	 this.$el.on('click', '.accept-btn', $.proxy(this.acceptReservation, this));
	 	 this.findByDate(new Date());
	 	 this.render();
	 } 

	this.render = function () {
	 	this.$el.html(this.template());
	    $('#reservationsTabCol', this.$el).html(reservationsListView.$el);
	    $('#servicesTabCol', this.$el).html(servicesListView.$el);
	 	const $datepicker = this.$el.find('.datepicker');
	 	const $tabs = this.$el.find('ul.tabs');
	 	$datepicker.pickadate({});
		$datepicker.val( $datepicker.val() === "" ? new Date().toDateString() : $datepicker.val());
	 	$tabs.tabs();

	 	return this;
	}

	this.datePickerChange = function () {
		 const date = new Date(this.$el.find('.datepicker').val());
		 this.findByDate(date);
	}


	this.findByDate = function(date) {
		date.setHours(0,0,0,0);

		communication.getReservationsByDate(date).done(function(response) {
	        reservationsListView.setReservations(response.reservations);
	    });

	    communication.getTablesByDate(date).done(function(response) {
	        servicesListView.setTables(response.tables);
	    });
	}

	// ---------------------------Service functionality------------------------------

	this.submitService = function () {
		 const form = this.$el.find('.active form');
	 	 const clientName = form.find('#client-name').val();
	 	 const quantity = form.find('#quantity').val();
	 	 const comment = form.find('#comment').val();
	 	 const table_id = form.find('#table-id').val();
	 	 const date = new Date(this.$el.find('.datepicker').val());

	 	 const serviceJson = {client: clientName, comment: comment, quantity: quantity, date: date, table_id: table_id} 
	 	 const updateView = $.proxy(this.datePickerChange, this); 

	 	 communication.submitService(serviceJson).done(function () {
	 	 	 updateView();
	 	 	 events.emit("toastRequest", "Service Created!");
	 	 }); 
	}

	this.destroyService = function (event) {
		const serviceId = $(event.target).attr('data-service-id');
	 	const updateView = $.proxy(this.datePickerChange, this); 

		communication.destroyService(serviceId).done(function () {
			 updateView();
			 events.emit('toastRequest', "Service Destroyed"); 
		})
	}

	// ---------------------------Reservation functionality------------------------------

	this.acceptReservation = function (event) {
		const reservationId = $(event.target).attr('data-service-id');
	 	const updateView = $.proxy(this.datePickerChange, this); 

		communication.acceptReservation(reservationId).done(function () {
			 updateView();
			 events.emit('toastRequest', "Reservation Accepted!"); 
		})
	}


	 this.initialize();
}