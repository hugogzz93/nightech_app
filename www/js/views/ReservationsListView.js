var ReservationsListView = function (reservationList) {
	 
	 var reservations;

	 this.initialize = function () {
	 	 this.$el = $('<div/>') 
	 	 this.render();
	 } 

	 this.setReservations = function (list) {
	 	 reservations = list;
	 	 this.render();
	 }

	 this.render = function () {
	 	 this.$el.html(this.template(reservations));
		 	$('.collapsible').collapsible({
		      accordion : false // A setting that changes the collapsible behavior to expandable instead of the default accordion style
		    });
	 	 return this ;
	 }

	 this.initialize();
}