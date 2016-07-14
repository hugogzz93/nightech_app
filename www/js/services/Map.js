var Map = function (el) {
	 var canvas;
	 var width, height;
	 var ratioX, ratioY;
	 const planeX = 100, planeY = 100;


	 t = [
	 	{
	 		C: "M",
	 		X: 20,
	 		Y: 15
	 	},
	 	{
	 		C: "L",
	 		X: 30,
	 		Y: 7
	 	},
	 	{
	 		C: "L",
	 		X: 90,
	 		Y: 7
	 	},
	 	{
	 		C: "M",
	 		X: 90,
	 		Y: 70
	 	},
	 	{
	 		C: "L",
	 		X: 65,
	 		Y: 70
	 	},
	 	{
	 		C: "L",
	 		X: 65,
	 		Y: 30
	 	},
	 	{
	 		C: "L",
	 		X: 90,
	 		Y: 30
	 	}
	 ]

	 this.initialize = function () {
	 	 canvas = Raphael(el);
	 	 width = $(el).width();
	 	 height = $(el).height();
	 	 ratioX = planeX/width;
	 	 ratioY = planeY/height;
	 	 this.transformLine(t);

	 	 // canvas.setViewBox(0,0, $(el).width(), $(el).height())
	 } 

	 this.addCircle = function (x, y, status, text) {
	 	var red = "#ee6e73", blue = "#0000cc", green = "#2bbbad", black = "#000", white = "#fff"
	 	 var circle = canvas.circle(x, y, 10);
	 	 var text = canvas.text(x, y, text);
	 	 const color = status == 0 ? green : status == 1 ? red : blue ;
	 	 // const textColor = status == 2 ? white : black ;
	 	 // circle.attr("fill", color);
	 	 circle.attr("stroke", color);
	 	 circle.attr("stroke-width", 3);
	 	 circle.attr("class", "table");
	 	 // text.attr("fill", textColor);

	 }

	 this.addLines = function (commands) {
	 	var lines = canvas.path(commands);	
	 }

	 this.createFromList = function (list) {
	 	 for (var i = list.length - 1; i >= 0; i--) {
	 	 	if (list[i].services.length == 0) {
	 	 		var status = 0;
	 	 	} else if (list[i].services[0].status == "incomplete") {
	 	 		var status = 1;	
	 	 	} else if (list[i].services[0].status == "seated") {
	 	 		var status = 2;
	 	 	} else if (list[i].services[0].status == "complete") {
	 	 		var status = 0;
	 	 	}
	 	 	this.addCircle(list[i].x/ratioX, list[i].y/ratioY, status, list[i].number); 
	 	 };
	 }

	 this.transformLine = function (commands) {
	 	var command = "";
	 	for (var i = 0; i < commands.length; i++) {
	 		command += this.parseCommand(commands[i]);
	 	};
	 	this.addLines(command);
	 }

	 this.parseCommand = function (command) {
	 	var string;
	 	 if (command.C == "M") {
	 	 	string = "M " + command.X/ratioX + "," + command.Y/ratioY + " "
	 	 } else if (command.C == "L") {
	 	 	string = "L " + command.X/ratioX + "," + command.Y/ratioY + " "
	 	 };
	 	 return string
	 }

	 this.initialize();
}


