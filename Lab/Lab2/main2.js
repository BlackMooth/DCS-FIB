/*
* Part of this code is based on:
    * http://blogs.sitepoint.com/html5-canvas-draw-quadratic-curves/
    * http://blogs.sitepoint.com/html5-canvas-draw-bezier-curves/
*/

//<button type="button" onclick="doReset()">Reset</button>
//<button type="button" onclick="computeConic()">Draw some conic</button>

var canvas1, context1, points, myTransformation, style, drag = null, draggedPoint;

var numberOfRays = 10;
var a_coefficient = 1/200;

// A random vector of colors
var colors = ['#FF6633', '#FFB399',  '#00B3E6',
    '#E6B333', '#3366E6', '#999966', '#99FF99', '#B34D4D',
    '#80B300', '#809900', '#E6B3B3', '#6680B3', '#66991A',
    '#FF99E6', '#FF1A66', '#E6331A', '#33FFCC',
    '#66994D', '#B366CC', '#4D8000', '#B33300', '#CC80CC',
    '#66664D', '#991AFF', '#E666FF', '#4DB3FF', '#1AB399',
    '#E666B3', '#33991A', '#CC9999', '#B3B31A',
    '#4D8066', '#809980', '#999933',
    '#FF3380', '#4D80CC', '#9900B3',
    '#E64D66', '#4DB380', '#FF4D4D', '#99E6E6', '#6666FF'];

points = [];

function parabolaFunction(x) {
    return a_coefficient * x * x;
}

function computeConicPoints() {
    for (let i = -300; i < 300; i++) {
        points.push({x: i, y: parabolaFunction(i)})
    }
}

function init() {

    // default styles
    style = {
        curve:	{ width: 2, color: "#FF0000" },
        line:	{ width: 2, color: "#C00" },
        point: { radius: 10, width: 2, color: "#900", fill: "rgba(200,200,200,0.5)", arc1: 0, arc2: 2 * Math.PI }
    };

    computeConicPoints();
    myTransformation = translationFunction;

    // line style defaults
    context1.lineCap = "round";
    context1.lineJoin = "round";

    // Translate origin to center of canvas
    context1.translate(300,450);

    // Flip y-axis, so it looks like in standard math axes
    context1.scale(1,-1) // Reversed y-axis

    drawCanvas();
}

/**
Basic drawing methods
**/

// draw canvas
function drawCanvas() {
    // Clear everything
    context1.clearRect(0, 0, canvas1.width, canvas1.height);  // Clear canvas

    // Background grids
    drawGrid(context1,canvas1.width, canvas1.height); // Draw background grid

    // Original points and vertices
    drawCurve(context1, style, points, myTransformation); // Draw curve
}

// Draw a background grid
function drawGrid(myContext,bw,bh){
    var delta = 50; // grid cell size

    var half_width = bw/2;
    var half_height = bh/2+150;
    for (var x = -half_width; x <= half_width; x += delta) {
        myContext.moveTo(x, -half_height);
        myContext.lineTo(x, half_height);
    }
    for (var y = -half_height; y <= half_height; y += delta) {
        myContext.moveTo(-half_width, y);
        myContext.lineTo(half_width, y);
    }

    myContext.lineWidth = 1;
    myContext.strokeStyle = "lightgray";
    myContext.stroke();

    myContext.strokeStyle = "black";
    myContext.font = "12px Arial";
    myContext.fillText("(0,0)",2,-5);

}

// Draws a polygonal curve connecting the points, after applying the given transformation
function drawCurve(ctx, style, points, transformation) {
    // The transformation is optional. If none provided, use identity transform
    if (transformation===undefined) {
        transformation = function(p){return p}; //Identity transform
    }

    // Draw curve
    ctx.lineWidth = style.curve.width;
    ctx.strokeStyle = style.curve.color;
    ctx.beginPath();
    var firstPoint = transformation(points[0]);
    var currentPoint;
    ctx.moveTo(firstPoint.x, firstPoint.y);
    for (var i = 0; i < points.length; i++) {
        currentPoint =  transformation(points[i]);
        ctx.lineTo(currentPoint.x, currentPoint.y);
        ctx.moveTo(currentPoint.x, currentPoint.y);
    }
    ctx.stroke();
}

// Draw circles around vertices to facilitate drag and drop
function drawVertices (ctx, style, points) {
    for (var i = 0; i < points.length; i++) {
        var p = points[i];
        ctx.lineWidth = style.point.width;
        ctx.strokeStyle = style.point.color;
        ctx.fillStyle = style.point.fill;
        ctx.beginPath();
        ctx.arc(p.x, p.y, style.point.radius, style.point.arc1, style.point.arc2, true);
        ctx.fill();
        ctx.stroke();
    }
}

function drawSegment(ctx, style, color, pointFrom, pointTo){
    ctx.lineWidth = style.line.width;
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.moveTo(pointFrom.x, pointFrom.y);

    ctx.lineTo(pointTo.x, pointTo.y);
    ctx.moveTo(pointTo.x, pointTo.y);
    // }
    ctx.stroke();
}

/**
* Start ("main method")
*/

// Assign canvas and context variables
canvas1 = document.getElementById("canvas1");
context1 = canvas1.getContext("2d");

// Axes
context1.beginPath();
context1.lineWidth = 2;
context1.strokeStyle="black";

// x-axis
context1.moveTo(0,3*canvas1.height/4);
context1.lineTo(canvas1.width,3*canvas1.height/4);
// y-axis
context1.moveTo(canvas1.width/2,0);
context1.lineTo(canvas1.width/2,canvas1.height);

context1.stroke();

init();
drawVerticalLines();


function drawVerticalLines(){
    let focusPoint = {x: 0, y:1/ (4 * a_coefficient)};
    for(let i=0; i < numberOfRays; i++){
        let randomXValue = Math.floor(Math.random() * 600) - 300;
        let conicValue = parabolaFunction(randomXValue);
        let color = colors[Math.floor(Math.random() * colors.length)];
        drawSegment(context1, style, color, {x: randomXValue, y: 450}, {x: randomXValue, y: conicValue})
        drawSegment(context1, style, color, {x: randomXValue, y: conicValue}, focusPoint)
    }

}

/**
* Auxiliary functions
*/

function doReset () {
    myTransformation = function(p){return p}; //Identity transform
    drawCanvas();
}

var translationFunction = function(point) {
	var x_translation = 2;
	var y_translation = -135;
	var matrix = math.matrix([[1,0,x_translation],[0,1,y_translation]]);
	var pointAsArray = [point.x, point.y,1];
	var result = math.multiply(matrix,pointAsArray);
	var transformedPoint = {x: result.get([0]),y: result.get([1])};		
	return transformedPoint;
}