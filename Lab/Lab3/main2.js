    /*
    * Part of this code is based on:
        * http://blogs.sitepoint.com/html5-canvas-draw-quadratic-curves/
        * http://blogs.sitepoint.com/html5-canvas-draw-bezier-curves/
    */

    var canvas1, context1, myTransformation, style, styleForInterpolatedCurve, styleForRealFunction, x_scale = 200, y_scale = 200;
    var numberOfPoints = 500;
    
    function init() {

        myTransformation = function(p){return p}; //Identity transform

        // default styles
        style = {
            curve:	{ width: 6, color: "#333" },
            line:	{ width: 1, color: "#C00" },
            point: { radius: 3, width: 2, color: "#900", fill: "rgba(200,200,200,0.5)", arc1: 0, arc2: 2 * Math.PI }
        }
        
        styleForRealFunction = {
            curve:  { width: 6, color: "#0000FF" }
        }

        styleForInterpolatedCurve = {
            curve:  { width: 6, color: "#FF0000" }
        }

        // line style defaults
        context1.lineCap = "round";
        context1.lineJoin = "round";

        context1.translate(canvas1.width/2, canvas1.height/2);
        drawCanvas();
    }


    function samplingFunction(x) {
        return 1 / (1 + 25*Math.pow(x,2))
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

        var realFunctionPoints = [];
        for (var i = 0; i <= numberOfPoints; i++) {
            var x = 2*i / numberOfPoints-1;
            var y = samplingFunction(x);
            realFunctionPoints.push({x: x, y: y});
        }

        var numberOfSamples = parseInt(document.getElementById('numberOfSamples').value) || 0;
        var controlPoints = [];
        for (var i = 0; i <= numberOfSamples; i++) {
            var x = 2*i / numberOfSamples-1;
            var y = samplingFunction(x);
            controlPoints.push({x: x, y: y});
        }

        drawCurve(context1, styleForRealFunction, realFunctionPoints); // Draw the given function, f
        drawCurve(context1, styleForInterpolatedCurve, computeUniformInterpolation(numberOfPoints, controlPoints)); // Draw uniform parametrization of interpolated curve

        drawVertices(context1, style, controlPoints); // Draw vertices as circles
    }


    // Draw a background grid
    function drawGrid(myContext,bw,bh){
        var delta = 50; // grid cell size

        for (var x = -bw/2; x <= bw/2; x += delta) {
            myContext.moveTo(x, -bh/2);
            myContext.lineTo(x, bh/2);
        }

        for (var y = -bh/2; y <= bh/2; y += delta) {
            myContext.moveTo(- bw/2, y);
            myContext.lineTo(bw/2, y);
        }

        myContext.lineWidth = 1;
        myContext.strokeStyle = "lightgray";
        myContext.stroke();

        myContext.strokeStyle = "black";
        myContext.font = "12px Arial";
        myContext.fillText("(0,0)",2,12);

    }

    // Draws a polygonal curve connecting the points, after applying the given transformation
    function drawCurve(ctx, style, points) {
        // Draw curve
        ctx.lineWidth = style.curve.width;
        ctx.strokeStyle = style.curve.color;
        ctx.beginPath();
        var firstPoint = points[0];
        var currentPoint;
        ctx.moveTo(x_scale*firstPoint.x, y_scale*firstPoint.y);
        for (var i = 0; i < points.length; i++) {
            currentPoint =  points[i];
            ctx.lineTo(x_scale*currentPoint.x, y_scale*currentPoint.y);
            ctx.moveTo(x_scale*currentPoint.x, y_scale*currentPoint.y);
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
            ctx.arc(x_scale*p.x, y_scale*p.y, style.point.radius, style.point.arc1, style.point.arc2, true);
            ctx.fill();
            ctx.stroke();
        }
    }


    /**
     * Start ("main method")
     */

    // Assign canvas and context variables
    canvas1 = document.getElementById("canvas1");
    context1 = canvas1.getContext("2d");

    init();