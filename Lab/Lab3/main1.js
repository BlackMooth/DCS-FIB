    /*
    * Part of this code is based on:
        * http://blogs.sitepoint.com/html5-canvas-draw-quadratic-curves/
        * http://blogs.sitepoint.com/html5-canvas-draw-bezier-curves/
    */

    var canvas1, context1, points, myTransformation, style, styleUniformParametrization, styleNonUniformParametrization, drag = null, draggedPoint;
    var numberOfPoints = 500;
    points = [{ x:100, y:100 },{ x:200, y:300 },{ x:350, y:200 }, { x:600, y:350 }];

    function init() {

        myTransformation = function(p){return p}; //Identity transform

        // default styles
        style = {
            curve:	{ width: 6, color: "#333" },
            line:	{ width: 1, color: "#C00" },
            point: { radius: 10, width: 2, color: "#900", fill: "rgba(200,200,200,0.5)", arc1: 0, arc2: 2 * Math.PI }
        }
        
        styleUniformParametrization = {
            curve:  { width: 6, color: "#FF0000" }
        }

        styleNonUniformParametrization = {
            curve:  { width: 6, color: "#0000FF" }
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
        drawCurve(context1, styleUniformParametrization, computeUniformInterpolation(numberOfPoints, points)); // Draw uniform parametrization
        drawCurve(context1, styleNonUniformParametrization, computeNonUniformInterpolation(numberOfPoints, points)); // Draw non-uniform parametrization

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
    function drawCurve(ctx, style, points) {
        // Draw curve
        ctx.lineWidth = style.curve.width;
        ctx.strokeStyle = style.curve.color;
        ctx.beginPath();
        var firstPoint = points[0];
        var currentPoint;
        ctx.moveTo(firstPoint.x, firstPoint.y);
        for (var i = 0; i < points.length; i++) {
            currentPoint = points[i];
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