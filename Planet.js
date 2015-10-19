function Planet(){
	var planetMesh;
	
	this.texture = "bla";
	
	var loader = new THREE.TextureLoader();
	loader.load( 'textures/land_ocean_ice_cloud_2048.jpg', function ( texture ) {

	var geometry = new THREE.SphereGeometry( 2, 16, 16 );
	var material = new THREE.MeshBasicMaterial( {map: texture, overdraw: 0.5} );
	this.planetMesh = new THREE.Mesh( geometry, material );
		
	
	});
}