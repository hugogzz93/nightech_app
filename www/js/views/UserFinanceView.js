var UserFinanceView = function (data) {

	this.initialize = function () {
		 this.$el = $('<div/>');
		var reps = data.reps;
		var keys = Object.keys(reps);
		var repArray = []

		data.services = keys.reduce(function(sum, rep){return sum + reps[rep].services
			.reduce(function(s,ser){return s+parseInt(ser.ammount);},0)},0);
		data.selfAmmount = reps["-1"].services.reduce(function(sum,serv){return sum + serv.ammount},0);
		data.rpAmmount = data.services - data.selfAmmount;
		data.selfPercent = data.selfAmmount / data.services * 100;
		data.rpPercent = data.rpAmmount / data.services * 100;
		debugger
		for (var i = 0; i < keys.length; i++) {
			repArray.push(reps[keys[i]]);
		};
		data.repArray = repArray;
		this.render();

	}

	this.render = function () {
		this.$el.html(this.template(data));
		$(document).ready(function(){
		    $('.collapsible').collapsible({
		      accordion : false // A setting that changes the collapsible behavior to expandable instead of the default accordion style
		    });
	  	});
		return this;
	}
	 
	this.initialize(); 
}