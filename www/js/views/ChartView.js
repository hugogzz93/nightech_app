var ChartView = function (communication) {

	var randomScalingFactor = function() {
	    return (Math.random() > 0.5 ? 1.0 : -1.0) * Math.round(Math.random() * 100);
	};
	var randomColorFactor = function() {
	    return Math.round(Math.random() * 255);
	};

	// var barChartData = {
	//     labels: ["January", "February", "March", "April", "May", "June", "July"],
	//     datasets: [{
	//         type: 'bar',
	//         label: 'Dataset 1',
	//         backgroundColor: "rgba(151,187,205,0.5)",
	//         data: [randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor()],
	//         borderColor: 'white',
	//         borderWidth: 2
	//     }, {
	//         type: 'line',
	//         label: 'Dataset 2',
	//         backgroundColor: "rgba(151,187,205,0.5)",
	//         data: [randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor()],
	//         borderColor: 'white',
	//         borderWidth: 2
	//     }, {
	//         type: 'bar',
	//         label: 'Dataset 3',
	//         backgroundColor: "rgba(220,220,220,0.5)",
	//         data: [randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor()]
	//     }, ]

	// };

	var data = {
		labels: [".", ".", "."],
		datasets: [{
			type: "bar",
			data: [ 0,0,0 ],
			borderWidth: 0,
			backgroundColor: "rgba(151,187,205,0.5)"
		}]
	};

	this.initialize = function () {
		this.$el = $('<div/>');
		this.render();
	}

	this.render = function () {
		 this.$el.html(this.template());
		 this.showChart();
		 return this;
	}

	this.setData = function (data, labels, type) {
		 data = {
		 	labels: labels,
		 	datasets: [{
		 		type: type,
		 		data: data,
		 		borderWidth: 2
		 	}]
		 }
		 this.render();
	}

	this.showChart = function () {
		debugger
		 var ctx = this.$el.find('canvas')[0].getContext('2d')
 		 window.myBar = new Chart(ctx, {
 		     type: 'bar',
 		     data: data,
 		     options: {
 		         responsive: true,
 		         maintainAspectRatio: false
 		     }
 		 }); 
	}

	this.initialize();
}