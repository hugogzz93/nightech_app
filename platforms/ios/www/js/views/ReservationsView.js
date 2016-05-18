var ReservationsView = function (communication) {

	var reservationsListView
	 
	 this.initialize = function () {
	 	 this.$el = $('<div/>') ;
         reservationsListView = new ReservationsListView(false);
	 	 this.$el.on('change', '.datepicker', $.proxy(this.datePickerChange, this));
	 	 this.$el.on('click', '.mod-btn', function () {
			 window.scrollTo(0) //else the modal will not be always viewable
	 	 	 $('#modal1').openModal(); 
	 	 });
 	 	 this.$el.on('click', '.btn', function () {
	 	 	 console.log('deleted') 
	 	 });
	 	 this.findByDate(new Date());

	 	 this.render();
	 } 

	this.render = function () {
	 	this.$el.html(this.template());
	    $('.content', this.$el).html(reservationsListView.$el);
	 	
	 	const $datepicker = this.$el.find('.datepicker');
	 	$datepicker.pickadate({});
		$datepicker.val( $datepicker.val() === "" ? new Date().toDateString() : $datepicker.val());

		const $dropdown = this.$el.find('.dropdown-button');
	 	$dropdown.dropdown({hover:false});

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
	}


	 this.initialize();
}