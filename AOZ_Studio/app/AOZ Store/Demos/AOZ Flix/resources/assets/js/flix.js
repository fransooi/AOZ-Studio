var Flix = function()
{
	this.frames = [];
	this.frames.push({elements: [], index: -1});
};

Flix.prototype.createElement = function(frameIndex, type, options) {

	this.frames[frameIndex].elements.splice(this.frames[frameIndex].index + 1, this.frames[frameIndex].elements.length - this.frames[frameIndex].index);

	if (type === 'path') {
		var path = [];
		path.push({x: options.x, y: options.y});
		this.frames[frameIndex].elements.push({ path, type, options });
	} else if (type === 'rectangle' || type === 'filled_rectangle' || type === 'line') {
		this.frames[frameIndex].elements.push({ type, x1: options.x1, y1: options.y1, x2: options.x2, y2: options.y2, options });
	} else if (type === 'circle' || type === 'filled_circle') {
		this.frames[frameIndex].elements.push({ type, x: options.x, y: options.y, radius: options.radius, options });
	}

	this.frames[frameIndex].index = this.frames[frameIndex].elements.length - 1;
}

Flix.prototype.updateCircle = function(frameIndex,x2, y2) {
	var index = this.frames[frameIndex].elements.length -1;
	var x1 = this.frames[frameIndex].elements[index].x;
	var y1 = this.frames[frameIndex].elements[index].y;

	var a = x1 - x2;
	var b = y1 - y2;

	var r = Math.sqrt( a*a + b*b );

	this.frames[frameIndex].elements[index].radius = r;
}

Flix.prototype.updateRectangle = function(frameIndex,x, y) {
	var index = this.frames[frameIndex].elements.length -1;
	this.frames[frameIndex].elements[index].x2 = x;
	this.frames[frameIndex].elements[index].y2 = y;
}

Flix.prototype.addPath = function(frameIndex,x, y) {
	var index = this.frames[frameIndex].elements.length -1;
	this.frames[frameIndex].elements[index].path.push({x, y});
}

Flix.prototype.addFrame = function() {
	this.frames.push({elements: [], index: -1});
}

Flix.prototype.getElement = function(frameIndex, index) {
	return this.frames[frameIndex].elements[index];
}

Flix.prototype.undo = function(frameIndex) {
	if (this.frames[frameIndex].index >= 0) {
		this.frames[frameIndex].index--;
	}
}

Flix.prototype.redo = function(frameIndex) {
	if (this.frames[frameIndex].index < this.frames[frameIndex].elements.length - 1) {
		this.frames[frameIndex].index++;
	}
}

Flix.prototype.clear = function() {
	this.frames = [];
	this.frames.push({elements: [], index: -1});
}

Flix.prototype.getJson = function() {
	return JSON.stringify(this.frames);
}

Flix.prototype.setJson = function(json) {
	this.frames = [];
	this.frames.push({elements: [], index: -1});
	if (json && json !== ''){
		this.frames = JSON.parse(json);
	}
	return this.frames.length;
}

var flix = new Flix();
