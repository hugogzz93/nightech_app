var UserView = function (communication, user) {
	 var userDigest;

	 this.initialize = function () {
	 	 this.$el = $('<div/>') ;
	 	 userDigest = this.digestUser(user);
	 	 this.render();
	 }

	 this.render = function () {
	 	 this.$el.html(this.template(userDigest)) ;
	 	 return this;
	 }

	 this.digestUser = function (user) {
	 	 var administeredServices = [];

	 	 for (var i = user.administered_services.length - 1; i >= 0; i--) {
	 	 	service = user.administered_services[i];
	 	 	if (service.administrator_id != service.coordinator_id) {
	 	 		administeredServices.push(service);
	 	 	};
	 	 };

	 	 user.administered_services = administeredServices ;
	 	 return user;
	 }

	 this.initialize(); 
}