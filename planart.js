var scene, camera, renderer;

init();
animate();

function init() {
	scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera( 30, window.innerWidth/window.innerHeight, 0.1, 1000 );

	renderer = new THREE.WebGLRenderer();
	renderer.setSize( window.innerWidth, window.innerHeight );
	document.body.appendChild( renderer.domElement );
	
	//TrackballControlls-> PAN:0 = Pan auf Linksklick
	controls = new THREE.TrackballControls( camera, renderer.domElement );
	controls.noRotate = true;
	controls.addEventListener( 'change', render );

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

	camera.position.z = 30;

	render();
}

function animate() {
	requestAnimationFrame( animate );
	controls.update();
}

function render() {
	renderer.render(scene, camera);
}