 var AdministratorView = function (communication) {

	var pendingReservationsListView
	var acceptedReservationsListView
	var servicesListView
	var tableChooseModalView
	var tables
	var currentUser
	 
	this.initialize = function () {
	 	this.$el = $('<div/>') ;
        this.setEventHandlers()
        pendingReservationsListView = new ReservationsListView(true);
        acceptedReservationsListView = new ReservationsListView(true);
        servicesListView = new ServicesListView();
        tableChooseModalView = new TableChooseModalView();

	 	this.findByDate(new Date());
	 	this.render();
	} 

	this.render = function () {
		const credentials = {isSuper: communication.currentCredentials() === "super"};

	 	this.$el.html(this.template(credentials));
	 	this.$el.append(tableChooseModalView.$el);

	    $('#pendingTab', this.$el).html(pendingReservationsListView.$el);
	    $('#acceptedTab', this.$el).html(acceptedReservationsListView.$el);
	    $('#servicesTab', this.$el).html(servicesListView.$el);

	 	const $datepicker = this.$el.find('.datepicker');
	 	const $tabs = this.$el.find('ul.tabs');

	 	$datepicker.pickadate({});
		$datepicker.val( $datepicker.val() === "" ? new Date().toDateString() : $datepicker.val());
	 	$tabs.tabs();

	 	$('input', this.$el).focus(); //fixes bug with input css
	 	return this;
	}

	this.datePickerChange = function () {
		const date = new Date(this.$el.find('.datepicker').val());
		this.findByDate(date);
	}

	this.findByDate = function(date) {
		date.setHours(0,0,0,0);

		communication.getReservationsByDate(date).done(function(response) {
			const pendingReservations = response.reservations.filter(function (e) {
				 return e.status === "pending";
			});
			const acceptedReservations = response.reservations.filter(function (e) {
				 return e.status === "accepted" || e.status === "seated";
			});
			debugger
	        pendingReservationsListView.setReservations(pendingReservations);
	        acceptedReservationsListView.setReservations(acceptedReservations);
	    });

	    communication.getTablesByDate(date).done(function(response) {
	        servicesListView.setTables(response.tables);
	        tableChooseModalView.setTables(response.tables);
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
			 events.emit('toastRequest', "Service Canceled"); 
		})
	}

	this.handleServiceAction = function (event) {
		event.stopPropagation();
		service = $(event.target);
		const status = service.attr('data-service-status');
		const serviceId = service.attr('data-service-id');

		 if (status === "complete") {
		 	this.displayAmmountModal(serviceId);
		 } else if(status === "seated") {
		 	this.completeService(serviceId);
		 } else if(status === "incomplete") {
		 	this.seatService(serviceId);
		 }
	}

	this.displayAmmountModal = function (serviceId) {
		window.scrollTo(0) //else the modal will not be always viewable
		const modal = $('#service-ammount-modal', this.$el);
		$('#service-ammount', modal).attr('data-service-id', serviceId);
		modal.openModal();
	}

	this.completeService = function (serviceId) {
	 	const updateView = $.proxy(this.datePickerChange, this); 
	 	const serviceJson = { status: "complete" };

		communication.updateService(serviceId, serviceJson).done(function () {
		 	updateView(); 
			events.emit('toastRequest', "Reservation Accepted!"); 
		});
	}

	this.seatService = function (serviceId) {
		const updateView = $.proxy(this.datePickerChange, this); 
	 	const serviceJson = { status: "seated" };

		communication.updateService(serviceId, serviceJson).done(function () {
		 	updateView(); 
			events.emit('toastRequest', "Seated!"); 
		});
	}

	this.submitAmmount = function (event) {
		const field = $('#service-ammount', this.$el);
		const ammount = field.val();
		const serviceId = field.attr('data-service-id');
	 	const updateView = $.proxy(this.datePickerChange, this); 

	 	const serviceJson = {ammount: ammount}

		communication.updateService(serviceId, serviceJson).done(function () {
			 updateView(); 
			 events.emit('toastRequest', "Ammount Updated!"); 
		})
	}

	// ---------------------------Reservation functionality------------------------------

	this.acceptReservation = function (event) {
		const reservationId = $(event.target).attr('data-reservation-id');
		const tableId = $('#tableNumber[data-reservation-id=' + $(event.target).attr('data-reservation-id') + ']').val();
	 	const updateView = $.proxy(this.datePickerChange, this); 
	 	debugger

		communication.acceptReservation(reservationId, tableId).done(function () {
			 updateView();
			 events.emit('toastRequest', "Reservation Accepted!"); 
		})
	}

	this.saveTableNumber = function (event) {
		const tableId = $(event.target).attr('data-table-number');
		const reservationId = $(event.target).attr('data-reservation-id');
		$('#tableNumber[data-reservation-id=' + $(event.target).attr('data-reservation-id') + ']').val(tableId);
		$('#chooseTableModal').closeModal();
		$('label[for="tableNumber"][data-reservation-id="' + reservationId + '"]').addClass('active')
	}

	this.displayTablesModal = function (event) {
		window.scrollTo(0) //else the modal will not be always viewable
   		const reservationId = $(event.target).attr('data-reservation-id');
		$('#chooseTableModal .table-option', this.$el).attr('data-reservation-id', reservationId);

		this.$el.find('#chooseTableModal').openModal();
	}

	this.toggleReservationVisibility = function (event) {
		const $target = $(event.target);
		const id = $target.attr('data-reservation-id');
		const json = {visible: $target.attr('data-visibility') === "true" ? "false" : "true"};
	 	const updateView = $.proxy(this.datePickerChange, this); 

		communication.updateReservation(id, json).done(updateView);
	}

	// ---------------------------Other functionality------------------------------

	this.setEventHandlers = function () {
		this.$el.on('change', '.datepicker', $.proxy(this.datePickerChange, this));
	 	this.$el.on('click', '.tab', function () {
	 	 	$('.tab-data').addClass('hidden')
	 	 	$("#" + $(this).attr("data-tab-id")).removeClass('hidden');
	 	})

	 	const submitService =  $.proxy(this.submitService, this)
		const destroyService =  $.proxy(this.destroyService, this)
		const displayTablesModal =  $.proxy(this.displayTablesModal, this)
		const acceptReservation =  $.proxy(this.acceptReservation, this)
		const handleServiceAction =  $.proxy(this.handleServiceAction, this)
		const submitAmmount =  $.proxy(this.submitAmmount, this)
		const toggleReservationVisibility =  $.proxy(this.toggleReservationVisibility, this)
		const saveTableNumber = $.proxy(this.saveTableNumber, this);

	 	this.$el.on('click', '.service-submit', function (e) {
	 		 submitService(e);
	 	});
	 	this.$el.on('click', '.delete-btn', function (e) {
	 		 destroyService(e);
	 	});
	 	this.$el.on('click', '.accept-btn', function (e) {
	 		 acceptReservation(e);
	 	});
	 	this.$el.on('click', '#tableNumber.validate', function (e) {
	 		 displayTablesModal(e);
	 	});
	 	this.$el.on('click', '.modal-content .table-option.blue', function (e) {
	 		 saveTableNumber(e);
	 	});
	 	this.$el.on('click', '.service-btn', function (e) {
	 		e.stopPropagation();
	 		handleServiceAction(e);
	 	});
	 	this.$el.on('click', '#ammount-submit-btn', function (e) {
	 		 submitAmmount(e);
	 	});
	 	this.$el.on('click', '.visibility-btn', function (e) {
	 		 toggleReservationVisibility(e);
	 	});
	}
	this.initialize();
}