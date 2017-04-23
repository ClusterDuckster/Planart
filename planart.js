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
var activeMenu = null;
var menues, buildMenu, researchMenu, productionMenu, fleetMenu;
//Textures
//Texture Source: http://planetpixelemporium.com/planets.html
var texPaths = [
		"textures/earthmap1k.jpg",
		"textures/jupitermap.jpg",
		"textures/mars_1k_color.jpg",
		"textures/mercurymap.jpg",
		"textures/plutomap1k.jpg",
		"textures/saturnmap.jpg",
		"textures/uranusmap.jpg",
		"textures/venusmap.jpg",
	];
var textures = [];
//Planet Construction
var AnzahlPlaneten = 5;
var planets = [];
var minDistance = 7;
var noSpaceAvailableCount = 0;
var maxIterations = 10;
//Buttons
var buildingsButton = document.getElementById("buildingsBtn");
var researchButton = document.getElementById("researchBtn");
var productionButton = document.getElementById("productionBtn");
var fleetButton = document.getElementById("fleetBtn");


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



	//Create planet objects
	initPlanets();

	camera.position.z = 30;
	
	//Create Window Menues
	buildMenu = document.createElement("div");
    buildMenu.id = "buildMenu";
    buildMenu.className = "window menu";
	buildMenu.innerHTML = "BUILDINGS";

	researchMenu = document.createElement("div");
	researchMenu.id = "researchMenu";
    researchMenu.className = "window menu";
	researchMenu.innerHTML = "RESEARCH";
	
	productionMenu = document.createElement("div");
	productionMenu.id = "productionMenu";
    productionMenu.className = "window menu";
	productionMenu.innerHTML = "PRODUCTION";
	
	fleetMenu = document.createElement("div");
	fleetMenu.id = "fleetMenu";
    fleetMenu.className = "window menu";
	fleetMenu.innerHTML = "FLEET";
	
	menues = [ buildMenu, researchMenu, productionMenu, fleetMenu ];
	
    //Add Listeners
    buildingsButton.addEventListener( 'click', onBuildingsButton, false);
	researchButton.addEventListener( 'click', onResearchButton, false);
	productionButton.addEventListener( 'click', onProductionButton, false);
	fleetButton.addEventListener( 'click', onFleetButton, false);
    
    renderer.domElement.addEventListener( 'mousedown', onCanvasMousedown, false);
	renderer.domElement.addEventListener( 'mouseup', onCanvasMouseup, false);
	renderer.domElement.addEventListener( 'click', onCanvasMouseclick, false);

    document.addEventListener( 'mousemove', onDocumentMouseMove, false );

    window.addEventListener( 'resize', onWindowResize, false );
}

//Fenser anzeigen zum Bauen von Gebäuden
function onBuildingsButton( event ) {
	openWindowMenu(0);
}

//Fenster anzeigen zum durchführen von Forschungen
function onResearchButton( event ) {
	openWindowMenu(1);
}

//Fenster anzeigen zur Produktion von Einheiten
function onProductionButton( event ) {
	openWindowMenu(2);
}

//Fenster anzeigen zur Produktion von Einheiten
function onFleetButton( event ) {
	openWindowMenu(3);
}

function openWindowMenu( i ){
	//Wenn das Fenster schon offen ist schließe es
	if(activeMenu === menues[i]){
		document.body.removeChild(activeMenu);
		
		activeMenu = null;
	} else {
		//Wenn ein anderes Fenster da ist schließe es
		if(activeMenu !== null){
			document.body.removeChild(activeMenu);
		}
		document.body.appendChild(menues[i]);
		activeMenu = menues[i];
	}
	
} 

function onPWinClose( event ){
    document.body.removeChild(planetWindow);
    planetWindow = null;
}

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
    //Damit kein Klick beim PAN entsteht
	if(lastMouseup.timeStamp-lastMousedown.timeStamp<500){
        if(planetWindow!=null && INTERSECTED == null){
            document.body.removeChild(planetWindow);
            planetWindow = null;
        }
		if(INTERSECTED instanceof THREE.Mesh){
			if(planetWindow!=null){
				document.body.removeChild(planetWindow);
			}

            //Such dir das angeklickte Objekt aus der DB
            for(var i = 0; i<planets.length; i++){
                if(INTERSECTED == planets[i].mesh){
                    focusedObj = planets[i];
                }
            }
            
            console.log(focusedObj);

			planetWindow = document.createElement("div");
			planetWindow.id = "pWindow";
            planetWindow.className = "window";
            
			planetWindow.innerHTML = "<h2>Planet: "+focusedObj.name+"</h2>"
                                    + "<div id='pWinCloseBtn' class='closeBtn'></div>"
                                    + "<div class='pButton'>ATTACK</div>"
                                    + "<div class='pButton'>SEND</div>"
                                    + "<div class='pButton'>FOCUS</div>";

			planetWindow.style.top = event.clientY + "px";
			planetWindow.style.left = event.clientX + "px";
			planetWindow.style.minWidth = "100px";
			planetWindow.style.minHeight = "100px";

            planetWindow.addEventListener("click", onPWinClose, false);

			document.body.appendChild(planetWindow);
		}
		//console.log(event);
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

		vector.setFromMatrixPosition(focusedObj.mesh.matrixWorld);
    	vector.project(camera);

		vector.x = ( vector.x * wHalf ) + wHalf;
    	vector.y = - ( vector.y * hHalf ) + hHalf;

		pWinWidth = $("#pWindow").width();
		pWinHeight = $("#pWindow").height();

		//don't let it get over the borders
		if(vector.x + pWinWidth > wHalf*2-40){
			planetWindow.style.left = wHalf*2-40-pWinWidth + "px";
		} else if (vector.x < 250){
			planetWindow.style.left = 250;
		} else {
			planetWindow.style.left = vector.x + "px";
		}

		if(vector.y + pWinWidth > hHalf*2-40){
			planetWindow.style.top = hHalf*2-40-pWinHeight + "px";
		} else if (vector.y < 20){
			planetWindow.style.top = 20;
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

function createPlanet( textureNr ){

	var newPlanet = new Planet( textureNr );
	
    scene.add(newPlanet.mesh);

	return newPlanet;
}

function createRandomPlanet (){

	var invalidPosition = false;
	var xPos = Math.floor(Math.random()*20-10);
	var yPos = Math.floor(Math.random()*20-10);
	var posVec = new THREE.Vector3(xPos, yPos, 0);

	//Check if position is valid
	for(var i = 0; i<planets.length; i++){

		if(posVec.distanceTo(planets[i].mesh.position) < minDistance){
			invalidPosition = true;
		}

	}

	if(invalidPosition==false){

		noSpaceAvailableCount = 0;

		var newPlanet = new Planet( Math.floor(Math.random()*texPaths.length) );

		newPlanet.mesh.position.x = xPos;
		newPlanet.mesh.position.y = yPos;

    	scene.add(newPlanet.mesh);

		return newPlanet;

	} else if(noSpaceAvailableCount <= maxIterations){

		noSpaceAvailableCount++;

		return createRandomPlanet();

	} else {
		return "No Space available";
	}
}

function initPlanets(){

	for(var i = 0; i<AnzahlPlaneten; i++){

		var newPlanet = createRandomPlanet();

		//basically try/catch
		if( typeof newPlanet == "object"){
			planets.push(newPlanet);
		} else {
			console.log(newPlanet);
		}

	}

	/*
	for(var i = 0; i<AnzahlPlaneten; i++){
		planets[i] = createPlanet(Math.floor(Math.random()*texPaths.length));
		planets[i].mesh.position.x = Math.floor(Math.random()*20-10);
		planets[i].mesh.position.y = Math.floor(Math.random()*20-10);
	}
	*/

	//Texturen laden
	var loader = new THREE.TextureLoader();
	for(var i = 0; i < texPaths.length; i++){
		loader.load( texPaths[i], function ( texture ) {
			//Texturen im Array speichern
			textures.push(texture);
			
			//Texturen müssen warum auch immer im loader zu den Objekten hinzugefügt werden
			if(textures.length == texPaths.length){
				for(var j = 0; j < planets.length; j++){
					planets[j].material.map = textures[planets[j].textureNr];
					planets[j].material.needsUpdate = true;

				}
			}

		});
	}
}

function onWindowResize() {

    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}
