var scene, camera, raycaster, renderer;
var geometry, material, mesh;
//Variables for Raycasting
var mouse = new THREE.Vector2(), INTERSECTED;

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
	controls.noRotate = true;
	controls.addEventListener( 'change', render );

	var ambientLight = new THREE.AmbientLight(0xbbbbbb);
    scene.add(ambientLight);


    // Planet 1
    geometry = new THREE.SphereGeometry( 2, 16, 16 );
    material = new THREE.MeshLambertMaterial( {color: 0x00ff00} );
    mesh = new THREE.Mesh ( geometry, material );

    scene.add(mesh);


	// Planet 2
    var geometry2 = new THREE.SphereGeometry( 2, 16, 16 );
    var material2 = new THREE.MeshLambertMaterial( {} );
    var sphere2 = new THREE.Mesh ( geometry2, material2 );

    sphere2.position.x = 5;

    scene.add(sphere2);
	
	var loader = new THREE.TextureLoader();
	loader.load( 'textures/land_ocean_ice_cloud_2048.jpg', function ( event ) {

        var texture = event;
        //texture.image.crossOrigin='';

		sphere2.material.map = texture;
        //sphere2.material.overdraw = 0.5;
        sphere2.material.needsUpdate = true;

        console.log(sphere2);



	},
	function (xhr) {
		console.log( (xhr.loaded / xhr.total * 100) + "% loaded" );
	},
	function ( xhr ) {
		console.log( "An error happened" );
	});


	//Create planet object
	var planet1 = createPlanet();
	planet1.mesh.position.x = -5;

	camera.position.z = 30;

    //Add Listeners
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

function animate() {
	requestAnimationFrame( animate );
    render();
	controls.update();
}

function render() {

    camera.updateMatrixWorld();



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
