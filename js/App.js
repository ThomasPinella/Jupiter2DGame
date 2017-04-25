// App constructor
var App = function(canvas, overlay) {

	// set a pointer to our canvas
	this.canvas = canvas;
	this.overlay = overlay;

	// if no GL support, cry
	this.gl = canvas.getContext("experimental-webgl");
	if (this.gl === null) {
		console.log( ">>> Browser does not support WebGL <<<" );
		return;
	}
	this.gl.pendingResources = {};

	// create a simple scene
	this.scene = new Scene(this.gl);
	this.keysPressed = {};
	this.mouse = false;
	this.mX = 0;
	this.mY = 0;

	this.resize();
};

// match WebGL rendering resolution and viewport to the canvas size
App.prototype.resize = function(){
	this.canvas.width = this.canvas.clientWidth;
	this.canvas.height = this.canvas.clientHeight;
	this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
	this.scene.camera.setAspectRatio(this.canvas.clientWidth/this.canvas.clientHeight);	
};


App.prototype.registerEventHandlers = function() {
	var theApp = this;
	document.onkeydown = function(event) {
		theApp.keysPressed[keyboardMap[event.keyCode]] = true;
	};
	document.onkeyup = function(event) {
		theApp.keysPressed[keyboardMap[event.keyCode]] = false;
	};
	this.canvas.onmousedown = function(event) {
		//jshint unused:false
		//theApp.scene.mouseDown(event);
		theApp.mouse = true;
		theApp.mX = event.x;
		theApp.mY = event.y;
	};
	this.canvas.onmousemove = function(event) {
		//jshint unused:false
		event.stopPropagation();
		//theApp.scene.mouseMove(event);
	};
	this.canvas.onmouseout = function(event) {
		//jshint unused:false
		//theApp.scene.mouseUp(event);
	};
	this.canvas.onmouseup = function(event) {
		//jshint unused:false
		//theApp.scene.mouseUp(event);
		theApp.mouse = false;
	};
	window.addEventListener('resize', function() {
		theApp.resize();
		//theApp.scene.resize(theApp.canvas);
	});
	window.requestAnimationFrame(function() {
		theApp.update();
	});		
};

// animation frame update
App.prototype.update = function() {

	var pendingResourceNames = Object.keys(this.gl.pendingResources);
	if(pendingResourceNames.length === 0) {
		// animate and draw scene
		this.scene.update(this.gl, this.keysPressed, this.mouse, this.mX, this.mY);
		this.overlay.innerHTML = "Ready.";
	} else {
		this.overlay.innerHTML = "Loading: " + pendingResourceNames;
	}

	// refresh
	var theApp = this;
	window.requestAnimationFrame(function() {
		theApp.update();
	});	
};

// entry point from HTML
window.addEventListener('load', function() {

	var canvas = document.getElementById("canvas");
	var overlay = document.getElementById("overlay");
	overlay.innerHTML = "WebGL";

	this.canvas.width = this.canvas.clientWidth;
	this.canvas.height = this.canvas.clientHeight;

	var app = new App(canvas, overlay);
	app.registerEventHandlers();
});