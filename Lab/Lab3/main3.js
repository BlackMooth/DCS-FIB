    /*
    * Part of this code is based on:
        * http://blogs.sitepoint.com/html5-canvas-draw-quadratic-curves/
        * http://blogs.sitepoint.com/html5-canvas-draw-bezier-curves/
    */

    var canvas1, context1, myTransformation, style, points, vectors, drag = null, draggedPoint;
    var numberOfPoints = 500;
    points = [{ x:300, y:300 },{ x:200, y:200 },{ x:400, y:300 },{ x:500, y:300 }];
	vectors = [{ x:points[0].x - points[1].x, y: points[0].y - points[1].y }, { x:points[2].x - points[3].x, y: points[2].y - points[3].y }];
    
    function init() {

        myTransformation = function(p){return p}; //Identity transform

        // default styles
        style = {
            curve:	{ width: 3, color: "#0000FF" },
            line:	{ width: 1, color: "#C00" },
            point: { radius: 5, width: 2, color: "#900", fill: "rgba(200,200,200,0.5)", arc1: 0, arc2: 2 * Math.PI }
        }

		style2 = {
            curve:  { width: 3, color: "green" },
            line:   { width: 1, color: "green" },
            point: { radius: 10, width: 2, color: "#900", fill: "rgba(200,200,200,0.5)", arc1: 0, arc2: 2 * Math.PI }
        }
		
        // line style defaults
        context1.lineCap = "round";
        context1.lineJoin = "round";

        // event handlers (only canvas1)
        canvas1.onmousedown = dragStart;
        canvas1.onmousemove = dragging;
        canvas1.onmouseup = canvas1.onmouseout = dragEnd;
		
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

        // Curve through points and vertices
        drawCurve(context1, style, points, vectors); // Draw curve
        drawVertices(context1, style, points); // Draw vertices as circles
    }


    // Draw a background grid
    function drawGrid(myContext,bw,bh){
        var delta = 50; // grid cell size

        for (var x = 0; x <= bw; x += delta) {
            myContext.moveTo(x, 0);
            myContext.lineTo(x, bh);
        }

        for (var y = 0; y <= bh; y += delta) {
            myContext.moveTo(0, y);
            myContext.lineTo(bw , y);
        }

        myContext.lineWidth = 1;
        myContext.strokeStyle = "lightgray";
        myContext.stroke();

        myContext.strokeStyle = "black";
        myContext.font = "12px Arial";
        myContext.fillText("(0,0)",2,12);

    }


    // Draws a polygonal curve connecting the points, after applying the given transformation
    function drawCurve(ctx, style, points, vectors) {
        ctx.lineWidth = style2.curve.width;
        ctx.strokeStyle = style2.curve.color;
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        ctx.lineTo(points[1].x, points[1].y);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(points[2].x, points[2].y);
        ctx.lineTo(points[3].x, points[3].y);
        ctx.stroke();

        // Draw curve
        ctx.lineWidth = style.curve.width;
        ctx.strokeStyle = style.curve.color;
        ctx.beginPath();
        var currentPoint;
        
		vectors = [{ x:points[0].x - points[1].x, y: points[0].y - points[1].y }, { x:points[2].x - points[3].x, y: points[2].y - points[3].y }];
        var interpolatedPoints = computeCubicHermiteInterpolation(numberOfPoints, points[1], points[2], vectors[0], vectors[1]);

		for (var i = 0; i < interpolatedPoints.length; i++) {
            currentPoint =  interpolatedPoints[i];
            ctx.lineTo(currentPoint.x, currentPoint.y);
            ctx.moveTo(currentPoint.x, currentPoint.y);
        }
        ctx.stroke();
		
		var markPositionAtOneHalf = document.getElementById('markPositionAtOneHalf').checked;
        if (markPositionAtOneHalf) {
            var pointAtOneHalf = cubicHermiteInterpolationPoint(0.5, points[1], points[2], vectors[0], vectors[1]);
            drawVertices(context1, style, [pointAtOneHalf]);
        }
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


    /**
     Methods to allow dragging transformedPoints around
     **/

    // start dragging
    function dragStart(e) {
        e = mousePos(e);
        var dx, dy;
        for (var i=0; i<points.length;i++) {
            dx = points[i].x - e.x;
            dy = points[i].y - e.y;
            if ((dx * dx) + (dy * dy) < style.point.radius * style.point.radius) {
                drag = i;
                draggedPoint = e;
                canvas1.style.cursor = "move";
                return;
            }
        }
    }

    // dragging
    function dragging(e) {
        if (drag!=null) {
            e = mousePos(e);
            points[drag].x += e.x - draggedPoint.x;
            points[drag].y += e.y - draggedPoint.y;
            draggedPoint = e;
            drawCanvas();
        }
    }

    // end dragging
    function dragEnd(e) {
        drag = null;
        canvas1.style.cursor = "default";
        drawCanvas();
    }

    // event parser
    function mousePos(event) {
        event = (event ? event : window.event);
        return {
            x: event.pageX - canvas1.offsetLeft,
            y: event.pageY - canvas1.offsetTop
        }
    }
	
	
    /**
     * Start ("main method")
     */

    // Assign canvas and context variables
    canvas1 = document.getElementById("canvas1");
    context1 = canvas1.getContext("2d");

    init();