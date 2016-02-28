var ReservationsView = function (jsonData) {
	 
	 this.initialize = function () {
	 	 this.$el = $('<div/>') ;
	 	 this.$el.on('click', '.icon.icon-check.pull-right', function () {
	 	 });
	 	 this.$el.on('change', '.datepicker', function (event) {
	 	 	const date = new Date(this.$el.find('.datepicker').val());
	 	 	events.emit('requestReservationsForDate', date);
	 	 })
	 	 this.render(jsonData);

	 } 

	this.render = function (jsonData) {
	 	this.$el.html(this.template(jsonData));
	 	this.$el.find('.datepicker').pickadate({});	 	
	 	return this;

	}
	 this.initialize();
}