
/**
 * Based on code by Ikaros Kappler from http://int2byte.de/public/blog.20160129_Three.js_Basic_Scene_Setup/
 **/

// Create new scene
this.scene = new THREE.Scene();

// Create a camera to look through
this.camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);

// Initialize a new THREE renderer (you are also allowed
// to pass an existing canvas for rendering).
this.renderer = new THREE.WebGLRenderer( { antialias : true, alpha:true } );
this.renderer.setSize(1200, 600);

document.body.appendChild(renderer.domElement);

this.pointLight = new THREE.PointLight(0xFFFFFF);

this.pointLight.position.x = 10;
this.pointLight.position.y = 50;
this.pointLight.position.z = 130;

// add to the scene
this.scene.add( this.pointLight );


// Add grid helper
var gridHelper = new THREE.GridHelper( 90, 9 );
gridHelper.colorGrid = 0xE8E8E8;
this.scene.add( gridHelper );


// Add an axis helper
var ah = new THREE.AxisHelper(50);
ah.position.y -= 0.1;  // The axis helper should not interfere with the grid helper
this.scene.add( ah );


// Set the camera position
this.camera.position.set(50, 50, 50);
let originPoint = {x: 0, y: 0, z: 0}
this.camera.lookAt(originPoint);

// Finally we want to be able to rotate the whole scene with the mouse:
// Add an orbit control helper.
var _self = this;
this.orbitControls = new THREE.OrbitControls( this.camera, this.renderer.domElement );
// Always move the point light with the camera. Looks much better ;)
this.orbitControls.addEventListener( 'change',
    function() { _self.pointLight.position.copy(_self.camera.position); }
);
this.orbitControls.enableDamping = true;
this.orbitControls.dampingFactor = 1.0;
this.orbitControls.enableZoom    = true;
this.orbitControls.target.copy(originPoint);


// This is the basic render function. It will be called perpetual, again and again,
// depending on your machines possible frame rate.
this._render = function () {
    // Pass the render function itself
    requestAnimationFrame(this._render);
    this.renderer.render(this.scene, this.camera);
};

// Call the rendering function. This will cause an infinite recursion
this._render();

function doReset(){
    this.scene = new THREE.Scene();
    this.scene.add( this.pointLight );

    var gridHelper = new THREE.GridHelper( 90, 9 );
    gridHelper.colorGrid = 0xE8E8E8;
    this.scene.add( gridHelper );

    var ah = new THREE.AxisHelper(50);
    ah.position.y -= 0.1;  // The axis helper should not interfere with the grid helper
    this.scene.add( ah );
}

function buildEllipticalHelix(){
    var lineGeom1 = new THREE.Geometry();
    var a = parseFloat(document.getElementById('ellipticalHelixA').value);
    var b = parseFloat(document.getElementById('ellipticalHelixB').value);
    var c = parseFloat(document.getElementById('ellipticalHelixC').value);
    var t_from = parseFloat(document.getElementById('ellipticalHelix_t_from').value);
    var t_to = parseFloat(document.getElementById('ellipticalHelix_t_to').value);

    for (var t = t_from; t < t_to; t += 0.1) {
	    lineGeom1.vertices.push(new THREE.Vector3(a*Math.cos(t),c*t,b*Math.sin(t)));
    }

    let lineMat2 = new THREE.LineBasicMaterial( {
        color:  0x2300FF  // blue
    } );

    var line1 = new THREE.Line(lineGeom1, lineMat2, THREE.LineStrip );
    this.scene.add(line1);
}


function buildSpiralHelix(){
    var lineGeom2 = new THREE.Geometry();
    var a = parseFloat(document.getElementById('spiralHellixA').value);
    var b = parseFloat(document.getElementById('spiralHellixB').value);
    var t_from = parseFloat(document.getElementById('spiralHelix_t_from').value);
    var t_to = parseFloat(document.getElementById('spiralHelix_t_to').value);
    
    for (var t = t_from; t < t_to; t += 0.1) {
	    lineGeom2.vertices.push(new THREE.Vector3(a*t*Math.cos(t),b*t,a*t*Math.sin(t)));
    }

    let lineMat2 = new THREE.LineBasicMaterial( {
        color:  0xFF0000  // red
    } );

    var line2 = new THREE.Line(lineGeom2, lineMat2, THREE.LineStrip );
    this.scene.add(line2);
}