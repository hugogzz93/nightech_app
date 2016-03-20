var CreateReservationView = function (commmunication) {
	 
	 this.initialize = function () {
	 	 this.$el = $('<div/>') ;
	 	 this.render();
	 } 

	this.render = function () {
	 	this.$el.html(this.template());
	 	const $datepicker = this.$el.find('.datepicker');
	 	$datepicker.pickadate({});
	 	return this;
	}

	 this.initialize();
}