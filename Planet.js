var geometry, material, planetMesh;
var bla;

function Planet(){
    
	var loader = new THREE.TextureLoader();
	loader.load( 'textures/land_ocean_ice_cloud_2048.jpg', function ( texture ) {

        geometry = new THREE.SphereGeometry( 2, 16, 16 );
        //material = new THREE.MeshBasicMaterial( {map: texture, overdraw: 0.5} );
        material = new THREE.MeshBasicMaterial( {color: 0x00ff00, wireframe: true} );
        planetMesh = new THREE.Mesh( geometry, material );
		
		bla = "bla";
		
	});
    
	this.texture = bla;
	
    this.planetMesh = new THREE.Mesh( geometry, material );
}