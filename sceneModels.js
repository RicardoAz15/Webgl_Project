//////////////////////////////////////////////////////////////////////////////
//
//  For instantiating the scene models.
//
//  J. Madeira - November 2018
//
//////////////////////////////////////////////////////////////////////////////

//----------------------------------------------------------------------------
//
//  Constructors
//


function emptyModelFeatures() {

	// EMPTY MODEL

	this.vertices = [];

	this.normals = [];

	this.textureCoords = [];

	// Transformation parameters

	// Displacement vector
	
	this.tx = 0.0;
	
	this.ty = 0.0;
	
	this.tz = 0;
	
	// Rotation angles	
	
	this.rotAngleXX = 0.0;
	
	this.rotAngleYY = 0.0;
	
	this.rotAngleZZ = 0.0;	

	// Scaling factors
	
	this.sx = 1.0;
	
	this.sy = 1.0;
	
	this.sz = 1.0;		
	
	// Animation controls
	
	this.rotXXOn = true;
	
	this.rotYYOn = true;
	
	this.rotZZOn = true;
	
	this.rotXXSpeed = 1.0;
	
	this.rotYYSpeed = 1.0;
	
	this.rotZZSpeed = 1.0;
	
	this.rotXXDir = 1;
	
	this.rotYYDir = 1;
	
	this.rotZZDir = 1;
	
	// Material features
	
	this.kAmbi = [ 0.2, 0.2, 0.2 ];
	
	this.kDiff = [ 0.7, 0.7, 0.7 ];

	this.kSpec = [ 0.7, 0.7, 0.7 ];

	this.nPhong = 100;

	// Textures Atributes

	this.TextureAlpha = 1;

	this.TextureColor = [1.0,1.0,1.0,1.0];

	this.texture_size = 4;
}

function Plane( ) {
	
	var plane = new emptyModelFeatures();
	
	plane.vertices = [

    -1.0, -1.0, 1.0,
     1.0, -1.0, 1.0,
     1.0,  1.0, 1.0,

	-1.0, -1.0, 1.0,
	1.0, 1.0, 1.0,
	-1.0, 1.0, 1,0,
	];

	plane.textureCoords = [
		0.0, 9.0,
		1.0, 9.0,
		1.0, 0.0,

		0.0, 9.0,
		1.0, 0.0,
		0.0, 0.0,

	];

	plane.texture_size = 2;

	computeVertexNormals( plane.vertices, plane.normals );

	return plane;
}

function simpleCubeModel( ) {
	
	var cube = new emptyModelFeatures();
	
	cube.vertices = [
		-1.000000, -1.000000,  1.000000, 
		 1.000000,  1.000000,  1.000000, 
		-1.000000,  1.000000,  1.000000,

		-1.000000, -1.000000,  1.000000,
		 1.000000, -1.000000,  1.000000, 
		 1.000000,  1.000000,  1.000000,
		///////////////// done
         1.000000, -1.000000,  1.000000, 
		 1.000000, -1.000000, -1.000000,
		 1.000000,  1.000000, -1.000000,

         1.000000, -1.000000,  1.000000, 
         1.000000,  1.000000, -1.000000, 
         1.000000,  1.000000,  1.000000,
		///////////////////////////// done
        -1.000000, -1.000000, -1.000000, 
        -1.000000,  1.000000, -1.000000,
         1.000000,  1.000000, -1.000000,

        -1.000000, -1.000000, -1.000000,
         1.000000,  1.000000, -1.000000, 
         1.000000, -1.000000, -1.000000,
		///////////////////////////////////// done
        -1.000000, -1.000000, -1.000000,
		-1.000000, -1.000000,  1.000000,
		-1.000000,  1.000000, -1.000000,

		-1.000000, -1.000000,  1.000000, 
		-1.000000,  1.000000,  1.000000, 
		-1.000000,  1.000000, -1.000000,
		/////////////////////////////// done
		-1.000000,  1.000000, -1.000000,
		-1.000000,  1.000000,  1.000000,
		 1.000000,  1.000000, -1.000000,

		-1.000000,  1.000000,  1.000000, 
		 1.000000,  1.000000,  1.000000,
		 1.000000,  1.000000, -1.000000,
		////////////////////////////////done
		-1.000000, -1.000000,  1.000000, 
		-1.000000, -1.000000, -1.000000,
		 1.000000, -1.000000, -1.000000,

		-1.000000, -1.000000,  1.000000, 
		 1.000000, -1.000000, -1.000000, 
		 1.000000, -1.000000,  1.000000, 	 
	];

	cube.textureCoords =
		[   1.0, 0.0,
			0.0, 1.0,
			0.0, 0.0,
//
		1.0, 0.0,
		1.0, 1.0,
		0.0, 1.0,
//////// done
		1.0, 0.0,
		1.0, 2.0,
		0.0, 2.0,
//
		1.0, 0.0,
		0.0, 2.0,
		0.0, 0.0,
//////// done
		1.0, 0.0,
		0.0, 0.0,
		0.0, 1.0,

		1.0, 0.0,
		0.0, 1.0,
		1.0, 1.0,
///////// done
		1.0, 0.0,
		1.0, 2.0,
		0.0, 0.0,

		1.0, 2.0,
		0.0, 2.0,
		0.0, 0.0,
//////// done
		0.0, 0.0,
		1.0, 0.0,
		0.0, 1.0,

		1.0, 0.0,
		1.0, 1.0,
		0.0, 1.0,
////////
		0.0, 0.0,
		0.0, 0.0,
		0.0, 0.0,

		0.0, 0.0,
		0.0, 0.0,
		0.0, 0.0,
///////
	];

	computeVertexNormals( cube.vertices, cube.normals );

	return cube;
}


/*function cubeModel( subdivisionDepth = 0 ) {
	
	var cube = new simpleCubeModel();
	
	midPointRefinement( cube.vertices, subdivisionDepth );
	
	computeVertexNormals( cube.vertices, cube.normals );
	
	return cube;
}*/


/*function simpleTetrahedronModel( ) {
	
	var tetra = new emptyModelFeatures();
	
	tetra.vertices = [

		-1.000000,  0.000000, -0.707000, 
         0.000000,  1.000000,  0.707000, 
         1.000000,  0.000000, -0.707000, 
         1.000000,  0.000000, -0.707000, 
         0.000000,  1.000000,  0.707000, 
         0.000000, -1.000000,  0.707000, 
        -1.000000,  0.000000, -0.707000, 
         0.000000, -1.000000,  0.707000, 
         0.000000,  1.000000,  0.707000, 
        -1.000000,  0.000000, -0.707000, 
         1.000000,  0.000000, -0.707000, 
         0.000000, -1.000000,  0.707000,
	];

	computeVertexNormals( tetra.vertices, tetra.normals );

	return tetra;
}*/

function sphereModel( subdivisionDepth = 4 ) {
	
	var sphere = new simpleCubeModel();
	
	midPointRefinement( sphere.vertices, subdivisionDepth );
	
	moveToSphericalSurface( sphere.vertices );
	
	computeVertexNormals( sphere.vertices, sphere.normals );

	sphere.textureCoords = new Array(sphere.vertices.length * 3).fill(0);
	
	return sphere;
}


//----------------------------------------------------------------------------
//
//  Instantiating scene models
//
var sceneModels = [];

function generate_model(){

	var available_Models = [new simpleCubeModel()];
	var available_positions = [0.6, -0.6, 0];
	
// Model 0 --- Top Left
	var model = available_Models[Math.round(random_number(0,0))];

	model.tx = random_number(-0.60,0.60); model.ty = 3.6;
	model.tz = -7;

	model.rotAngleXX = 30;

	model.sx = random_number(0.1,0.2);
	model.sy = random_number(0.2,0.4);
	model.sz = random_number(0.05,0.2);

		sceneModels.push(model);

	return model;
}


function detectHitBox(model){
    var minXX = 100;
    var maxXX = -100;
    var minZZ = 100;
    var maxZZ = -100;

    	for(var i = 0; i < model.vertices.length; i+=3){
    		var vector = vec4();
    		vector[0] = (model.vertices[i]   + model.tx);
    		vector[1] = (model.vertices[i+1] + model.ty);
    		vector[2] = (model.vertices[i+2] + model.tz);

	    	if(vector[0] > maxXX){
				maxXX = vector[0];
			}
			if(vector[0] < minXX){
				minXX = vector[0];
			}
			if(vector[2] > maxZZ){
				maxZZ = vector[2];
			}
			if(vector[2] < minZZ){
				minZZ = vector[2];
			}
    	}
    	
	var boxCenter = vec4();
	boxCenter[0] = (minXX + maxXX) / 2;
	boxCenter[2] = (minZZ + maxZZ) / 2;

	var widthXX = maxXX - minXX;
	var widthZZ = maxZZ - minZZ;

	var hit_position = [boxCenter[0], boxCenter[2], widthXX, widthZZ];
	
	return hit_position;
}
    



