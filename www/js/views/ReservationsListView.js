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
	 	 return this ;
	 }

	 this.initialize();
}