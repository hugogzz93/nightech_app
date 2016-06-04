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

	 this.addCircle = function (x, y, status) {
	 	 var circle = canvas.circle(x, y, 10);
	 	 const color = status ? "#f00" : "#fff" ;
	 	 circle.attr("fill", color);
	 	 circle.attr("class", "table");
	 }

	 this.addLines = function (commands) {
	 	var lines = canvas.path(commands);	
	 }

	 this.createFromList = function (list) {
	 	 for (var i = list.length - 1; i >= 0; i--) {
	 	 	this.addCircle(list[i].x/ratioX, list[i].y/ratioY, list[i].status); 
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


