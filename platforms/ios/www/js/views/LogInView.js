var LogInView = function (communication) {
	 
	 this.initialize = function () {
	 	this.$el = $('<div/>');
	 	this.$email = this.$el.find('#email-field');
	 	this.$password = this.$el.find('#password-field');
	 	this.$el.on('click', '.btn.btn-negative', this.logIn.bind(this));
        this.render();
	 };

	 this.render = function () {
	 	 this.$el.html(this.template());
	 	 return this;
	 }

	 this.logIn = function () {
	 	const email = this.$el.find('#email-field').val();
	 	const password = this.$el.find('#password-field').val();

	 	events.emit("logInAttempt", { email: email, password: password });
	 }


	 this.initialize();
}