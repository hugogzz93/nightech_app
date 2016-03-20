var AdministratorView = function (communication) {

	var reservationsListView
	var seviceListView
	 
	 this.initialize = function () {
	 	 this.$el = $('<div/>') ;
         reservationsListView = new ReservationsListView();
         servicesListView = new ServicesListView();
	 	 this.$el.on('change', '.datepicker', $.proxy(this.datePickerChange, this));
	 	 this.$el.on('click', '.tab', function () {
	 	 	$('.tab-data').addClass('hidden')
	 	 	$("#" + $(this).attr("data-tab-id")).removeClass('hidden');
	   		 // $('ul.tabs').tabs('select_tab', $(this).attr("data-tab-id"));
	 	 })
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

	    communication.getServicesByDate(date).done(function(response) {
	        servicesListView.setServices(response.services);
	    });
	}


	 this.initialize();
}