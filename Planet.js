function Planet(){
    
    var myPlanet = this;

	//Erstelle Planeten
	this.geometry = new THREE.SphereGeometry( 2, 16, 16 );
    //AUF KEINEN FALL THREE.MeshBasicMaterial() BENUTZEN!!! -> da kein emissive
    this.material = new THREE.MeshLambertMaterial( {color: 0xffffff} );
    this.mesh = new THREE.Mesh( this.geometry, this.material );

	//Lade Textur
	var loader = new THREE.TextureLoader();
	loader.load( 'textures/land_ocean_ice_cloud_2048.jpg', function ( texture ) {
		
        myPlanet.mesh.material.map = texture;
		myPlanet.mesh.material.needsUpdate = true;
        //myPlanet.mesh.material.color = none;

	},
	function (xhr) {
		console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );
	},
	function ( xhr ) {
		console.log( 'An error happened' );
	});
	
}
