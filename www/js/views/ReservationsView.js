var ReservationsView = function (jsonData) {
	 
	 this.initialize = function () {
	 	 this.$el = $('<div/>') ;
	 	 this.$el.on('click', '.icon.icon-check.pull-right', function () {
	 	 });
	 	 this.render();
	 } 

	this.render = function () {
	 	this.$el.html(this.template(jsonData));
	 	return this;
	}

	 this.initialize();
}