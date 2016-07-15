var FinanceView = function (communication) {

	var services;
	var coordinators;
	var representatives;

	this.initialize = function () {
		this.$el = $('<div/>');
		this.$el.on('change', '.datepicker', $.proxy(this.datePickerChange, this));
		this.$el.on('click', '.button-collapse', function (e) {
 	 		if ($('.button-collapse').attr('data-triggered') == undefined) {
 		 		$('.button-collapse').attr('data-triggered', 1);
 				$('.button-collapse').sideNav();
 	 		};
 			$('.button-collapse').sideNav('show');
 	 	});

	 	this.findByDate(new Date());
		this.render();
	}

	this.render = function () {
		this.$el.html(this.template());

	 	const $datepicker = this.$el.find('.datepicker');
	 	$datepicker.pickadate({container: 'body'});
		$datepicker.val( $datepicker.val() === "" ? new Date().toDateString() : $datepicker.val());

		return this; 
	}

	this.datePickerChange = function () {
		const date = new Date(this.$el.find('.datepicker').val());
		this.findByDate(date);
	}

	this.findByDate = function(date) {
		date.setHours(0,0,0,0);
		const progressBar = ('.progress', this.$el);
		if (progressBar) {
			progressBar.removeClass('hidden');
		};
		
		communication.getServices(date, "month").done(function (response) {
			 debugger
		}).always(function () {
			 progressBar.addClass('hidden');
		})
	}
	
	this.initialize();
}