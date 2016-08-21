var UserFinanceView = function (data) {

	this.initialize = function () {
		 this.$el = $('<div/>');
		 this.render();
	}

	this.render = function () {
		this.$el.html(this.template(data));
		return this;
	}
	 
	this.initialize(); 
}