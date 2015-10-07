Planets = new Mongo.Collection("planets");

if (Meteor.isClient) {	
	Template.space.rendered = function() {
		var container;
		var scene, canera, renderer, element, geometry, material, cube, star, light;

		init();
		render();

		function init(){
			//Field of View
			var FOV = 75;
			//Aspect ratio
			var ASPECT = window.innerWidth / window.innerHeight;
			//Border of frustum close to camera
			var NEAR = 0.1;
			//Border of frustum far away from the camera
			var FAR = 1000;
			
			scene = new THREE.Scene();
			camera = new THREE.PerspectiveCamera( FOV, ASPECT, NEAR, FAR );
			camera.position.z = 5;
			
			controls = new THREE.OrbitControls( camera );
			controls.damping = 0.2;
			controls.addEventListener( 'change', render );
			
			var light = new THREE.PointLight( 0xff0000, 1, 100 );
			light.position.set( 50, 50, 50 );
			scene.add( light );
		
			//Create Objects and add them to the Scene
			geometry = new THREE.SphereGeometry( 2, 10, 10 );
			material = new THREE.MeshBasicMaterial( { color: 0x00ff00, wireframe: true } );
			cube = new THREE.Mesh( geometry, material );
			
			starA = addStar(0xff00ff, 1, 3, 3);
			starA.position.x = 3;
			starB = addStar(0x2255ff, 1, 3, 3);
			starB.position.x = -3;
			starC = addStar(0x77773f, 1, 3, 3);
			starC.position.x = 3;
			starC.position.z = -3;
			starD = addStar(0xff0841, 1, 3, 3);
			starD.position.x = -3;
			starD.position.z = -3;
			scene.add(starA);
			scene.add(starB);
			scene.add(starC);
			scene.add(starD);
			
			//Renderer and size of output
			renderer = new THREE.WebGLRenderer();
			renderer.setClearColor(0x000000);
			renderer.shadowMapEnabled = true;
			renderer.setSize( window.innerWidth, window.innerHeight);
					
			container = document.body;
	        container.appendChild( renderer.domElement );
		}
				
		function render() {
			requestAnimationFrame( render );
			
			cube.rotation.x += 0.01;
			cube.rotation.y += 0.01;
			
			renderer.render( scene, camera );
			update();
		}
				
		function addStar (color, radius, widthsegments, heightsegments) {
			var starGeo, material, shape;

			starGeo = new THREE.SphereGeometry( radius, widthsegments, heightsegments);
			material = new THREE.MeshLambertMaterial({
				emissive: color,
				color: color,
				transparent: true,
				opacity: 0.8,
				wireframe: true
			});
			shape = new THREE.Mesh(geometry, material);

			return shape;
		}
	};
}