/*
* Part of this code is based on:
    * http://blogs.sitepoint.com/html5-canvas-draw-quadratic-curves/
    * http://blogs.sitepoint.com/html5-canvas-draw-bezier-curves/
*/

var canvas1, context1, points, style, drag = null, draggedPoint;
points = [{ x:0, y:0 }];
var radius = 30;

function init() {

    // default styles
    style = {
        curve:	{ width: 2, color: "#FF0000" },
        line:	{ width: 2, color: "#C00" },
        point: { radius: 10, width: 2, color: "#900", fill: "rgba(200,200,200,0.5)", arc1: 0, arc2: 2 * Math.PI }
    };

    // line style defaults
    context1.lineCap = "round";
    context1.lineJoin = "round";

    // Translate origin to center of canvas
    context1.translate(50,canvas1.height/2+50);

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
    drawCurve(context1, style, points); // Draw curve
}


// Draw a background grid
function drawGrid(myContext,bw,bh){
    var delta = 50; // grid cell size

    var half_width = bw/2;
    var half_height = bh/2+100;
    for (var x = -half_width; x <= 2*half_width; x += delta) {
        myContext.moveTo(x, -half_height);
        myContext.lineTo(x, half_height);
    }
    for (var y = -half_height; y <= half_height; y += delta) {
        myContext.moveTo(-half_width, y);
        myContext.lineTo(2*half_width, y);
    }

    myContext.lineWidth = 1;
    myContext.strokeStyle = "lightgray";
    myContext.stroke();

    myContext.strokeStyle = "black";
    myContext.font = "12px Arial";
    myContext.fillText("(0,0)",2,-5);

}

// Draws a polygonal curve connecting the points, after applying the given transformation
function drawCurve(ctx, style, points) {
    ctx.lineWidth = style.curve.width;
    ctx.strokeStyle = style.curve.color;
    ctx.beginPath();
    var firstPoint = points[0];
    var currentPoint;
    ctx.moveTo(firstPoint.x, firstPoint.y);
    for (var i = 0; i < 10*math.pi; i+=0.02) {
        currentPoint = {x: radius*(i-Math.sin(i)), y: radius*(1-Math.cos(i))};
        ctx.lineTo(currentPoint.x, currentPoint.y);
        ctx.moveTo(currentPoint.x, currentPoint.y);
    }
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
context1.moveTo(50,0);
context1.lineTo(50,canvas1.height);

context1.stroke();

init();