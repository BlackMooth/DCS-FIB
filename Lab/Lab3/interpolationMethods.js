/* Lagrange interpolation */
function interpolatePointByLagrange(t, controlPoints, tValues) {
    var numberOfControlPoints = controlPoints.length;
    var p = {x: 0, y: 0};
    for (var i = 0; i < numberOfControlPoints; i++) {
        var controlPoint = controlPoints[i];
        var enumerator = 1, denominator = 1;

        for (var j = 0; j < numberOfControlPoints; j++) {
            if (j !== i) {
                enumerator *= t - tValues[j];
                denominator *= tValues[i] - tValues[j];
            }
        }
        var quocient = enumerator / denominator;
        p.x += quocient * controlPoint.x;
        p.y += quocient * controlPoint.y;
    }
    return p;
}


function computeLagrangeInterpolationCurve(numberOfPoints, controlPoints, tValues) {
    var interpolatedPoints = [];
    for (var i = 0; i <= numberOfPoints; i++) {
        var t = i / numberOfPoints;
        interpolatedPoints.push(interpolatePointByLagrange(t, controlPoints, tValues));
    }
    return interpolatedPoints;
}

function computeUniformInterpolation(numberOfPoints, points) {
    var numberOfControlPoints = points.length;
    var tInterval = 1 / (numberOfControlPoints - 1);
    var tValuesUniform = new Array(numberOfControlPoints);
    for (var i = 0; i < numberOfControlPoints; i++)
        tValuesUniform[i] = i*tInterval;
    return computeLagrangeInterpolationCurve(numberOfPoints, points, tValuesUniform);
}

function computeNonUniformInterpolation(numberOfPoints, points) {
    var numberOfControlPoints = points.length;
    function distanceBetweenPoints(P1, P2) {
        return Math.sqrt(Math.pow(P2.x - P1.x,2) + Math.pow(P2.y - P1.y,2))
    }
    var tValuesNonUniform = [0]; // t0 = 0
    for (var i = 1; i < numberOfControlPoints; i++) {
        tValuesNonUniform.push(distanceBetweenPoints(points[i-1], points[i]));
    }

    var totalDistance = tValuesNonUniform.reduce((a,b) => a + b);
    var distanceSoFar = 0;

    for (var i = 1; i < numberOfControlPoints; i++) {
        distanceSoFar += tValuesNonUniform[i];
        tValuesNonUniform[i] = distanceSoFar / totalDistance;
    }
    return computeLagrangeInterpolationCurve(numberOfPoints, points, tValuesNonUniform);
}


function cubicHermiteInterpolationPoint(t, P0, P1, v0, v1) {
    // Hermite blending functions: A,B,C,D
    var A = 2*Math.pow(t,3) - 3*Math.pow(t,2) + 1;
    var B = Math.pow(t,3) - 2*Math.pow(t,2) + t;
    var C = -2*Math.pow(t,3) + 3*Math.pow(t,2);
    var D = Math.pow(t,3) - Math.pow(t,2);
    return {
        x: A*P0.x + B*v0.x + C*P1.x + D*v1.x,
        y: A*P0.y + B*v0.y + C*P1.y + D*v1.y
    }
}

function computeCubicHermiteInterpolation(numberOfPoints, P0, P1, v0, v1) {
    var interpolatedPoints = [];
    // t from 0 to 1
    for (var i = 0; i <= numberOfPoints; i++) {
        var t = i / numberOfPoints;
        interpolatedPoints.push(cubicHermiteInterpolationPoint(t, P0, P1, v0, v1));
    }
    return interpolatedPoints;
}
