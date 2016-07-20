var ChartView = function (communication) {

	var data, type, labels;
	var active = false
	const options = { 
 		         	responsive: true,
 		        	maintainAspectRatio: false
 		    	}



	var randomScalingFactor = function() {
	    return (Math.random() > 0.5 ? 1.0 : -1.0) * Math.round(Math.random() * 100);
	};
	var randomColorFactor = function() {
	    return Math.round(Math.random() * 255);
	};

	this.initialize = function () {
		this.$el = $('<div/>');
		this.render();
	}

	this.render = function () {
		 this.$el.html(this.template());
		 if (active) {
		 	this.showChart();
		 };
		 return this;
	}

	this.setData = function (data, labels, type, labelString) {
		active = true;
	 	chartData = {
	 		labels: labels,
	 		datasets: [{
	 			type: type,
	 			label: labelString,
		        data: data,
		        borderWidth: 1,
		        borderColor: '#10d09f',
		        pointBackgroundColor: '#10d09f'
	 		}]
	 	}
		this.render();
	}

	this.showChart = function () {
		var ctx = this.$el.find('canvas')[0].getContext('2d')
		var height = $('canvas', this.$el).height()
		var max = Math.max(...chartData.datasets[0].data);
		var gradient = ctx.createLinearGradient(0, 0, 0, height + height*.05);
		gradient.addColorStop(0, 'rgba(208,251,241,1)');
		gradient.addColorStop(1, 'rgba(208,251,241,0)');
		chartData.datasets[0].backgroundColor = gradient;
 		window.myBar = new Chart(ctx, {
 		 	type: 'line',
 		 	data: chartData,
 		 	options: { 
 		         	responsive: true,
 		        	maintainAspectRatio: false,
 		        	scales: {
        	            xAxes: [{
                            display: false
                        }],
    	                yAxes: [{
    	                	display: false,
                            gridLines: {
                                display:false
                            },
                            ticks: {
                            	display: false,
                            	max: max + max*.25
                            }   
                        }]
	                },
        	        legend: {
	                    display: false
	                }
		    	}
 		}); 
	}

	this.initialize();
}