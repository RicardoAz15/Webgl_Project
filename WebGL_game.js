//----------------------------------------------------------------------------
//
// Global Variables
//

var gl = null; // WebGL context

var shaderProgram = null;

var count = 0;

// NEW --- Buffers

var cubeVertexPositionBuffer = null;

var cubeVertexNormalPositionBuffer = null;

var cubeVertexTextureCoordBuffer = null;

// The global transformation parameters

var globalTz = -2.25;

// It has to be updated according to the projection type

var pos_Viewer = [ 0.0, 0.0, 0.0, 1.0 ];

// Movement
// velocity

var velocity = 0.0;
var velocity_dir = 0;

var on_wall =  false;

// on the move?

var is_moving = true;

// The translation vector

var tm = 0.0;

// Vertex indices defining the triangles
//----------------------------------------------------------------------------
//
// The WebGL code
//

//----------------------------------------------------------------------------
//
//  Rendering
//

// Handling the Textures

// From www.learningwebgl.com

function handleLoadedTexture(texture) {

    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.bindTexture(gl.TEXTURE_2D, null);
}


var street_texture;
var ice_texture;
var color_texture;
var wall_texture;

function initTexture() {

    street_texture = gl.createTexture();
    street_texture.image = new Image();
    street_texture.image.onload = function () {
        handleLoadedTexture(street_texture)
    };

    street_texture.image.src = "texture/street2.gif";

    ice_texture = gl.createTexture();
    ice_texture.image = new Image();
    ice_texture.image.onload = function () {
        handleLoadedTexture(ice_texture)
    };

    ice_texture.image.src = "texture/ice.gif";

    wall_texture = gl.createTexture();
    wall_texture.image = new Image();
    wall_texture.image.onload = function () {
        handleLoadedTexture(wall_texture)
    };

    wall_texture.image.src = "texture/wall.gif";

    color_texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, color_texture);
    var whitePixel = new Uint8Array([255, 255, 255, 255]);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0,
        gl.RGBA, gl.UNSIGNED_BYTE, whitePixel);

}

//----------------------------------------------------------------------------

// Handling the Buffers

function initBuffers(model) {

    // Coordinates

    cubeVertexPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexPositionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(model.vertices), gl.STATIC_DRAW);
    cubeVertexPositionBuffer.itemSize = 3;
    cubeVertexPositionBuffer.numItems = model.vertices.length / 3;

    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute,
        cubeVertexPositionBuffer.itemSize,
        gl.FLOAT, false, 0, 0);


    cubeVertexNormalPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexNormalPositionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(model.normals), gl.STATIC_DRAW);
    cubeVertexNormalPositionBuffer.itemSize = 3;
    cubeVertexNormalPositionBuffer.numItems = model.normals.length / 3;

    gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute,
        cubeVertexNormalPositionBuffer.itemSize,
        gl.FLOAT, false, 0, 0);

    // Textures
    cubeVertexTextureCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexTextureCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(model.textureCoords), gl.STATIC_DRAW);
    cubeVertexTextureCoordBuffer.itemSize = 2;
    cubeVertexNormalPositionBuffer.numItems = 24;

    gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, cubeVertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);
}

//----------------------------------------------------------------------------

//  Drawing the model

function drawModel(model,
                   mvMatrix,
                   image) {

    // Pay attention to transformation order !!

    mvMatrix = mult(mvMatrix, translationMatrix(model.tx, model.ty, model.tz));

     mvMatrix = mult(mvMatrix, rotationXXMatrix(model.rotAngleXX));

    mvMatrix = mult(mvMatrix, scalingMatrix(model.sx, model.sy, model.sz));

    // Passing the Model View Matrix to apply the current transformation

    var mvUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");

    gl.uniformMatrix4fv(mvUniform, false, new Float32Array(flatten(mvMatrix)));

    initBuffers(model);

    // Material properties

    gl.uniform3fv( gl.getUniformLocation(shaderProgram, "k_ambient"),
        flatten(model.kAmbi) );

    gl.uniform3fv( gl.getUniformLocation(shaderProgram, "k_diffuse"),
        flatten(model.kDiff) );

    gl.uniform3fv( gl.getUniformLocation(shaderProgram, "k_specular"),
        flatten(model.kSpec) );

    gl.uniform1f( gl.getUniformLocation(shaderProgram, "shininess"),
        model.nPhong );

    // Light Sources

    var numLights = lightSources.length;

    gl.uniform1i( gl.getUniformLocation(shaderProgram, "numLights"),
        numLights );

    //Light Sources

    gl.uniform1i( gl.getUniformLocation(shaderProgram, "allLights[" + String(0) + "].isOn"),
        lightSources[0].isOn );

    gl.uniform4fv( gl.getUniformLocation(shaderProgram, "allLights[" + String(0) + "].position"),
        flatten(lightSources[0].getPosition()) );

    gl.uniform3fv( gl.getUniformLocation(shaderProgram, "allLights[" + String(0) + "].intensities"),
        flatten(lightSources[0].getIntensity()) );

    // NEW --- Textures

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, image);

    gl.uniform1i(shaderProgram.samplerUniform, 0);

    // NEW --- Blending
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE);

    gl.uniform1f(shaderProgram.alphaUniform, model.TextureAlpha);
    gl.uniform4fv(shaderProgram.vertexColorUniform, model.TextureColor);

    gl.drawArrays(gl.TRIANGLES, 0, cubeVertexPositionBuffer.numItems);
}

//----------------------------------------------------------------------------

//  Drawing the 3D scene

var point = 0;


function drawScene() {

    gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);

    var pMatrix;

    var mvMatrix;

    // Clearing with the background color

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // A standard view volume.

    // Viewer is at (0,0,0)

    // Ensure that the model is "inside" the view volume

    pMatrix = perspective(45, 1, 0.05, 10);

    pos_Viewer[0] = pos_Viewer[1] = pos_Viewer[2] = 0.0;

    pos_Viewer[3] = 1.0;

    // Passing the Projection Matrix to apply the current projection

    var pUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");

    gl.uniformMatrix4fv(pUniform, false, new Float32Array(flatten(pMatrix)));

    gl.uniform4fv(gl.getUniformLocation(shaderProgram, "viewerPosition"),flatten(pos_Viewer));

    mvMatrix = translationMatrix(0,0,globalTz);

    var t_total = tm + velocity;
    on_wall = our_abs(t_total) >= 0.6;

    if (!is_moving && !on_wall  && !game_over_var) {
		velocity += velocity_dir*0.005;
	}

    for(var i = 0; i < lightSources.length; i++ )
    {
        // Animating the light source, if defined

        var lightSourceMatrix = mat4();

        // NEW Passing the Light Souree Matrix to apply

        var lsmUniform = gl.getUniformLocation(shaderProgram, "allLights["+ String(i) + "].lightSourceMatrix");

        gl.uniformMatrix4fv(lsmUniform, false, new Float32Array(flatten(lightSourceMatrix)));
    }

    var plane = Plane();
    plane.rotAngleXX = -60; plane.sx = 1; plane.sy = 8; plane.sz = 0.60;
    plane.tx = 0; plane.ty = 0; plane.tz = globalTz;
    drawModel(plane,
        mvMatrix,
        ice_texture);

    var wall1 = simpleCubeModel(2);
    var wall2 = simpleCubeModel(2);

    wall1.sx =0.1; wall1.sy = 4; wall1.sz = 0.1;
    wall2.sx =0.1; wall2.sy = 4; wall2.sz = 0.1;

    wall1.rotAngleXX = -60;
    wall2.rotAngleXX = -60;

    wall1.tx = -0.9; wall1.ty = 1; wall1.tz = globalTz;

    wall2.tx = 0.9; wall2.ty = 1; wall2.tz = globalTz;

     drawModel(wall1,
        mvMatrix,
        ice_texture);

    drawModel(wall2,
        mvMatrix,
        ice_texture);

    var player = sphereModel(3);
    player.sx = 0.05; player.sy = 0.10; player.sz = 0.1;
    player.rotAngleXX = 30;
    player.tx = tm +velocity;
    player.ty = -0.30;
    player.tz = 0.6;
    player.TextureColor = [0.0,0.5,1.0,1.0];
    drawModel(player,
        mvMatrix,
        color_texture);

    for(var i = 0; i < sum; i++ )
    {
        if(count >= 256){
            generate_model();
            count = 0;
        }
        count++;
    }

    for(var j = 0; j < sceneModels.length; j++){

        drawModel( sceneModels[j],
            mvMatrix,
            ice_texture );

        sceneModels[j].tz += 0.04;
        sceneModels[j].ty -= 0.02;

        if(sceneModels[j].tz >= 2.7){
            point+=50;
            sceneModels.splice(j,1);
            document.getElementById('points').innerHTML = 'points:' + parseInt(point);
        }
    }

    player_hit = detectHitBox(player);

    var player_left = 0;
    var player_right = 0;
    var player_front = 0;
    var player_rear =  0;

    for(var k = 0; k<sceneModels.length ; k++) {
        player_left = player_hit[0] - (player_hit[2] / 2) - sceneModels[0].sx + 0.96;
        player_right = (player_hit[0] + (player_hit[2] / 2)) + sceneModels[0].sx - 0.96;
        player_front = player_hit[1] - (player_hit[3] / 2) - globalTz - sceneModels[0].sz - sceneModels[0].sy;
        player_rear = player_hit[1] + (player_hit[3] / 2) + globalTz + sceneModels[0].sz + sceneModels[0].sy;

        var object_hit = detectHitBox(sceneModels[k]);
        var obj_left = object_hit[0] - (object_hit[2] / 2) + 1;
        var obj_right = object_hit[0] + (object_hit[2] / 2) - 1;
        var obj_front = object_hit[1] - (object_hit[3] / 2);
        var obj_rear = object_hit[1] + (object_hit[3] / 2);

        if((player_right >= obj_left) && (obj_right >= player_left)){
            sceneModels[k].TextureColor = [1.0, 0.0, 0.0, 1.0];
        }
        else{
            sceneModels[k].TextureColor = [1.0,1.0,1.0,1.0];
        }

        if ((player_right < obj_left) || (obj_right < player_left) || (player_rear < obj_front) || obj_rear < player_front) {
        } else {
            game_over();
        }
    }
    
    countFrames();
}

//----------------------------------------------------------------------------

// Handling keyboard events

// Adapted from www.learningwebgl.com

var currentlyPressedKeys = {};

function handleKeys() {

    if (currentlyPressedKeys[37]) {

        // Left cursor key

        if (!is_moving) {
            is_moving = true
        }

        if(!on_wall || velocity_dir != -1)
            tm -= 0.01;

        velocity_dir = -1;
    }
    if (currentlyPressedKeys[39]) {

        // Right cursor key

        if (!is_moving) {
            is_moving = true
        }

        if(!on_wall || velocity_dir != 1)
            tm += 0.01;

        velocity_dir = 1;
    }
}

//----------------------------------------------------------------------------

// Timer

function tick() {

    requestAnimFrame(tick);

    drawScene();

    handleKeys();
}


//----------------------------------------------------------------------------

function setEventListeners() {

    function handleKeyDown(event) {

        currentlyPressedKeys[event.keyCode] = true;
    }

    function handleKeyUp(event) {

        currentlyPressedKeys[event.keyCode] = false;
        if (is_moving) {
            is_moving = false
        }
    }

    document.onkeydown = handleKeyDown;

    document.onkeyup = handleKeyUp;
}


//----------------------------------------------------------------------------
//
// WebGL Initialization
//

function initWebGL(canvas) {
    try {

        // Create the WebGL context

        // Some browsers still need "experimental-webgl"

        gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");

        gl.clearColor(0.0,0.5,1.0,1.0);

        gl.enable(gl.CULL_FACE);

        gl.cullFace(gl.BACK);

        gl.enable(gl.DEPTH_TEST)

    } catch (e) {
    }
    if (!gl) {
        alert("Could not initialise WebGL, sorry! :-(");
    }
}

//----------------------------------------------------------------------------

function runWebGL() {

    var canvas = document.getElementById("game_window");

    canvas.width = window.innerWidth - 15;
    canvas.height = window.innerHeight - 150;

    window.addEventListener('resize', runWebGL, false);

    initWebGL(canvas);

    shaderProgram = initShaders(gl);

    setEventListeners();

    initTexture();

    tick();		// A timer controls the rendering / animation
}

var elapsedTime = 0;

var frameCount = 0;

var lastfpsTime = new Date().getTime();


function countFrames() {

    var now = new Date().getTime();

    frameCount++;

    elapsedTime += (now - lastfpsTime);

    lastfpsTime = now;

    if (elapsedTime >= 1000) {

        fps = frameCount;

        frameCount = 0;

        elapsedTime -= 1000;

        document.getElementById('fps').innerHTML = 'fps:' + fps;
    }
}

var sum = 8;
var game_over_var = false;

function game_over() {
    sum = 0;
    game_over_var = true;
    sceneModels = [];
    tm = 0;

    document.onkeydown = null;
    document.onkeyup = null;

    document.getElementById("game_over").style.visibility = "visible";
    document.getElementById("game_over_span").innerHTML= "GAME OVER \n POINTS: " + point;
}
