var ChartView = function (communication) {

	var randomScalingFactor = function() {
	    return (Math.random() > 0.5 ? 1.0 : -1.0) * Math.round(Math.random() * 100);
	};
	var randomColorFactor = function() {
	    return Math.round(Math.random() * 255);
	};

	var barChartData = {
	    labels: ["January", "February", "March", "April", "May", "June", "July"],
	    datasets: [{
	        type: 'bar',
	        label: 'Dataset 1',
	        backgroundColor: "rgba(151,187,205,0.5)",
	        data: [randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor()],
	        borderColor: 'white',
	        borderWidth: 2
	    }, {
	        type: 'line',
	        label: 'Dataset 2',
	        backgroundColor: "rgba(151,187,205,0.5)",
	        data: [randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor()],
	        borderColor: 'white',
	        borderWidth: 2
	    }, {
	        type: 'bar',
	        label: 'Dataset 3',
	        backgroundColor: "rgba(220,220,220,0.5)",
	        data: [randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor()]
	    }, ]

	};

	this.initialize = function () {
		this.$el = $('<div/>');
		this.render();
	}

	this.render = function () {
		 this.$el.html(this.template());
		 this.$el.appendTo($('body'));
		 const showChart = $.proxy(this.showChart, this);
		 setTimeout(showChart, 2000);

		 return this;
	}

	this.showChart = function () {
		alert('done');
		 var ctx = this.$el.find('canvas')[0].getContext('2d')
 		 window.myBar = new Chart(ctx, {
 		     type: 'bar',
 		     data: barChartData,
 		     options: {
 		         responsive: true,
 		         title: {
 		             display: true,
 		             text: 'Chart.js Combo Bar Line Chart'
 		         }
 		     }
 		 }); 
	}

	this.initialize();
}