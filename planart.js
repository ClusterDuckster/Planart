//Variables for ThreeJS
var scene, camera, raycaster, renderer;
var geometry, material, mesh;
//Variables for Raycasting
var mouse = new THREE.Vector2(), INTERSECTED;
//Variables for getting position on window
var focusedObj, wHalf, hHalf, vector;
//Variables for Events
var lastMousedown, lastMouseup;
var planetWindow, pWinWidth;

init();
animate();

function init() {

	scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera( 30, window.innerWidth/window.innerHeight, 0.1, 1000 );

    raycaster = new THREE.Raycaster();

	renderer = new THREE.WebGLRenderer({antialias:true});
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.domElement.style.position = 'fixed';
	renderer.domElement.style.zIndex = '-10';
	document.body.appendChild( renderer.domElement );
	
	// TrackballControlls-> PAN:0 = Pan on left Mousebutton
	controls = new THREE.TrackballControls( camera, renderer.domElement );

	//OrbitControls möglicherweise einfacher zum temporeren schwänken der Kamera bei Bewegung
	//controls = new THREE.OrbitControls( camera, renderer.domElement);

	controls.noRotate = true;
	controls.addEventListener( 'change', render );

	//Licht
	var ambientLight = new THREE.AmbientLight(0xbbbbbb);
    scene.add(ambientLight);

	//Hintergrund
	bgGeometry = new THREE.PlaneGeometry(2, 2, 0);
	bgMaterial = new THREE.MeshLambertMaterial();



	//Create planet object
	var planet1 = createPlanet();
	planet1.mesh.position.x = -5;

	camera.position.z = 30;

    //Add Listeners
    renderer.domElement.addEventListener( 'mousedown', onCanvasMousedown, false);
	renderer.domElement.addEventListener( 'mouseup', onCanvasMouseup, false);
	renderer.domElement.addEventListener( 'click', onCanvasMouseclick, false);

    document.addEventListener( 'mousemove', onDocumentMouseMove, false );

    window.addEventListener( 'resize', onWindowResize, false );
}

//
function onDocumentMouseMove( event ) {

    event.preventDefault();

    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

    //console.log("x:"+mouse.x+"  y:"+mouse.y);

}

function onCanvasMousedown( event ) {
	lastMousedown = event;
}

function onCanvasMouseup( event ) {
	lastMouseup = event;
}

function onCanvasMouseclick( event ) {

	if(lastMouseup.timeStamp-lastMousedown.timeStamp<200){
		if(INTERSECTED instanceof THREE.Mesh){
			if(planetWindow!=null){
				document.body.removeChild(planetWindow);
			}

			focusedObj = INTERSECTED;

			planetWindow = document.createElement("div");
			planetWindow.id = "pWindow";
			planetWindow.style.top = event.clientY + "px";
			planetWindow.style.left = event.clientX + "px";
			planetWindow.style.width = "100px";
			planetWindow.style.height = "100px";
			planetWindow.style.background = "red";
			planetWindow.style.color = "white";
			planetWindow.innerHTML = "Hello";

			document.body.appendChild(planetWindow);
		}
    	console.log(event);
	}
}

function animate() {
	requestAnimationFrame( animate );
    render();
	controls.update();
}

function render() {

    camera.updateMatrixWorld();

	// calculate position of focused planet
	//http://stackoverflow.com/questions/27409074/three-js-converting-3d-position-to-2d-screen-position-r69
	if(planetWindow != null){

		vector = new THREE.Vector3();

		wHalf = 0.5*renderer.context.canvas.width;
		hHalf = 0.5*renderer.context.canvas.height;

		vector.setFromMatrixPosition(focusedObj.matrixWorld);
    	vector.project(camera);

		vector.x = ( vector.x * wHalf ) + wHalf;
    	vector.y = - ( vector.y * hHalf ) + hHalf;

		pWinWidth = $("#pWindow").width();

		if(vector.x + pWinWidth > wHalf*2-40){
			planetWindow.style.left = wHalf*2-40-pWinWidth + "px";
		} else {
			planetWindow.style.left = vector.x + "px";
		}

		if(vector.y + pWinWidth > hHalf*2-40){
			planetWindow.style.top = hHalf*2-40-pWinWidth + "px";
		} else {
			planetWindow.style.top = vector.y + "px";
		}

	}

    // find intersections
	//Source: http://threejs.org/examples/#webgl_interactive_cubes
    raycaster.setFromCamera( mouse, camera );

    var intersects = raycaster.intersectObjects( scene.children );

    if ( intersects.length > 0 ) {

        if ( INTERSECTED != intersects[ 0 ].object ) {

            if ( INTERSECTED ) INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );

            INTERSECTED = intersects[ 0 ].object;
            INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
            INTERSECTED.material.emissive.setHex( 0x003366 );

        }

    }

    else {

        if ( INTERSECTED ) INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );

            INTERSECTED = null;

    }

	renderer.render(scene, camera);
}

function createPlanet(){

	var newPlanet = new Planet();
	
    scene.add(newPlanet.mesh);

	return newPlanet;
}

function onWindowResize() {

    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}
