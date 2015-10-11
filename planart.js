var scene, camera, renderer;

init();
animate();

function init() {
	scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );

	controls = new THREE.TrackballControls( camera );
	controls.addEventListener( 'change', render );

	renderer = new THREE.WebGLRenderer();
	renderer.setSize( window.innerWidth, window.innerHeight );
	document.body.appendChild( renderer.domElement );

	// Planet 1
	var geometry1 = new THREE.SphereGeometry( 2, 16, 16 );
	var material1 = new THREE.MeshBasicMaterial( {color: 0xffff00, wireframe: true} );
	var sphere1 = new THREE.Mesh( geometry1, material1 );
	sphere1.position.x = -3;

	// Planet 2
	var geometry2 = new THREE.SphereGeometry( 2, 16, 16 );
	var material2 = new THREE.MeshBasicMaterial( {color: 0x00ff00, wireframe: true} );
	var sphere2 = new THREE.Mesh( geometry2, material2 );
	sphere2.position.x = 3;

	scene.add( sphere1 );
	scene.add( sphere2 );

	camera.position.z = 5;

	render();
}

function animate() {
	requestAnimationFrame( animate );
	controls.update();
}

function render() {
	renderer.render(scene, camera);
}