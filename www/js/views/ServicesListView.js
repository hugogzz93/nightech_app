var ServicesListView = function (reservationList) {
	 
	 var services;

	 this.initialize = function () {
	 	 this.$el = $('<div/>') 
	 	 this.render();
	 } 

	 this.setServices = function (list) {
	 	 services = list;
	 	 this.render();
	 }

	 this.render = function () {
	 	 this.$el.html(this.template(services));
		 	$('.collapsible').collapsible({
		      accordion : false // A setting that changes the collapsible behavior to expandable instead of the default accordion style
		    });
	 	 return this ;
	 }

	 this.initialize();
}