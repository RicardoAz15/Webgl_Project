//////////////////////////////////////////////////////////////////////////////
//
//  WebGL_game.js
//
//  Applying a texture and blending
//
//  Adapted from learningwebgl.com
//
//  J. Madeira - November 2015
//
//////////////////////////////////////////////////////////////////////////////


//----------------------------------------------------------------------------
//
// Global Variables
//

var gl = null; // WebGL context

var shaderProgram = null;

// NEW --- Buffers

var cubeVertexPositionBuffer = null;

var cubeVertexIndexBuffer = null;

var cubeVertexTextureCoordBuffer;

// The global transformation parameters

// velocity

var velocity = 0.0;
var velocity_dir = 1;

// on the move?

var is_moving = true;

// The translation vector

var tz = 0.0;

var tm = 0.0;

// To allow choosing the way of drawing the model triangles

var primitiveType = null;

// From learningwebgl.com

// NEW --- Storing the vertices defining the cube faces

vertices = [
    // Front face
    -1.0, -1.0, 1.0,
    1.0, -1.0, 1.0,
    1.0, 1.0, 1.0,
    -1.0, 1.0, 1.0,

    // Back face
    -1.0, -1.0, -1.0,
    -1.0, 1.0, -1.0,
    1.0, 1.0, -1.0,
    1.0, -1.0, -1.0,

    // Top face
    -1.0, 1.0, -1.0,
    -1.0, 1.0, 1.0,
    1.0, 1.0, 1.0,
    1.0, 1.0, -1.0,

    // Bottom face
    -1.0, -1.0, -1.0,
    1.0, -1.0, -1.0,
    1.0, -1.0, 1.0,
    -1.0, -1.0, 1.0,

    // Right face
    1.0, -1.0, -1.0,
    1.0, 1.0, -1.0,
    1.0, 1.0, 1.0,
    1.0, -1.0, 1.0,

    // Left face
    -1.0, -1.0, -1.0,
    -1.0, -1.0, 1.0,
    -1.0, 1.0, 1.0,
    -1.0, 1.0, -1.0
];

// Texture coordinates for the quadrangular faces

// Notice how they are assigne to the corresponding vertices

var textureCoords = [

    // Front face
    0.0, 0.0,
    5.0, 0.0,
    5.0, 5.0,
    0.0, 5.0,

    // Back face
    1.0, 0.0,
    1.0, 1.0,
    0.0, 1.0,
    0.0, 0.0,

    // Top face
    0.0, 1.0,
    0.0, 0.0,
    1.0, 0.0,
    1.0, 1.0,

    // Bottom face
    1.0, 1.0,
    0.0, 1.0,
    0.0, 0.0,
    1.0, 0.0,

    // Right face
    1.0, 0.0,
    1.0, 1.0,
    0.0, 1.0,
    0.0, 0.0,

    // Left face
    0.0, 0.0,
    1.0, 0.0,
    1.0, 1.0,
    0.0, 1.0,
];

// Vertex indices defining the triangles

var cubeVertexIndices = [

    0, 1, 2, 0, 2, 3,    // Front face

    4, 5, 6, 4, 6, 7,    // Back face

    8, 9, 10, 8, 10, 11,  // Top face

    12, 13, 14, 12, 14, 15, // Bottom face

    16, 17, 18, 16, 18, 19, // Right face

    20, 21, 22, 20, 22, 23  // Left face
];


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
var webGLTexture_2;
var color_texture;

function initTexture() {

    street_texture = gl.createTexture();
    street_texture.image = new Image();
    street_texture.image.onload = function () {
        handleLoadedTexture(street_texture)
    };

    street_texture.image.src = "texture/street.gif";

    webGLTexture_2 = gl.createTexture();
    webGLTexture_2.image = new Image();
    webGLTexture_2.image.onload = function () {
        handleLoadedTexture(webGLTexture_2)
    };

    webGLTexture_2.image.src = "Az.gif";

    color_texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, color_texture);
    var whitePixel = new Uint8Array([255, 255, 255, 255]);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0,
        gl.RGBA, gl.UNSIGNED_BYTE, whitePixel);


}

//----------------------------------------------------------------------------

// Handling the Buffers

function initBuffers() {

    // Coordinates

    cubeVertexPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexPositionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    cubeVertexPositionBuffer.itemSize = 3;
    cubeVertexPositionBuffer.numItems = vertices.length / 3;

    // Textures

    cubeVertexTextureCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexTextureCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoords), gl.STATIC_DRAW);
    cubeVertexTextureCoordBuffer.itemSize = 2;
    cubeVertexTextureCoordBuffer.numItems = 24;

    // Vertex indices

    cubeVertexIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeVertexIndexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(cubeVertexIndices), gl.STATIC_DRAW);
    cubeVertexIndexBuffer.itemSize = 1;
    cubeVertexIndexBuffer.numItems = 36;
}

//----------------------------------------------------------------------------

//  Drawing the model

function drawModel(angleXX,
                   sx, sy, sz,
                   tx, ty, tz,
                   mvMatrix,
                   primitiveType, image, bol) {

    // Pay attention to transformation order !!

    mvMatrix = mult(mvMatrix, translationMatrix(tx, ty, tz));

    mvMatrix = mult(mvMatrix, rotationXXMatrix(angleXX));

    mvMatrix = mult(mvMatrix, scalingMatrix(sx, sy, sz));

    // Passing the Model View Matrix to apply the current transformation

    var mvUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");

    gl.uniformMatrix4fv(mvUniform, false, new Float32Array(flatten(mvMatrix)));

    // Passing the buffers

    gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexPositionBuffer);

    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, cubeVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

    // NEW --- Textures

    gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexTextureCoordBuffer);
    gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, cubeVertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, image);

    gl.uniform1i(shaderProgram.samplerUniform, 0);

    // NEW --- Blending

    gl.blendFunc(gl.SRC_ALPHA, gl.ONE);

    var alpha = 1;

    var color = new Float32Array([1.0, 1.0, 1.0, 1.0]);
    if (bol) {
        alpha = 1;
        color = new Float32Array([0.0, 0.0, 1.0, 1.0]);
    }
    gl.uniform1f(shaderProgram.alphaUniform, alpha);
    gl.uniform4fv(shaderProgram.vertexColorUniform, color);

    // The vertex indices

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeVertexIndexBuffer);

    // Drawing the triangles --- NEW --- DRAWING ELEMENTS

    gl.drawElements(gl.TRIANGLES, cubeVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
}

//----------------------------------------------------------------------------

//  Drawing the 3D scene

function drawScene() {

    gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);

    var pMatrix;

    var mvMatrix = mat4();

    // Clearing with the background color

    gl.clear(gl.COLOR_BUFFER_BIT);

    // A standard view volume.

    // Viewer is at (0,0,0)

    // Ensure that the model is "inside" the view volume

    pMatrix = perspective(45, 1, 0.05, 10);

    tz = -2.25;

    // Passing the Projection Matrix to apply the current projection

    var pUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");

    gl.uniformMatrix4fv(pUniform, false, new Float32Array(flatten(pMatrix)));

    // NEW --- Instantianting the same model more than once !!

    // And with diferent transformation parameters !!

    // Call the drawModel function !!

    // Instance 1 --- RIGHT TOP


	if (!is_moving) {
		velocity += velocity_dir*0.005;
	}

    drawModel(-60,
        0.60, 0.90, 0.60,
        0, -0.60, tz,
        mvMatrix,
        primitiveType, street_texture, false);

    // Instance 2 --- LEFT TOP

	console.log(velocity);

    drawModel(0,   // CW rotations
        0.10, 0.10, 0.10,
        tm + velocity, -0.80, tz,
        mvMatrix,
        primitiveType, color_texture, true);
    /*
    // Instance 3 --- LEFT BOTTOM

    drawModel( angleXX, angleYY, -angleZZ,
               sx, sy, sz,
               tx + 0.5, ty - 0.5, tz,
               mvMatrix,
               primitiveType );

    // Instance 4 --- RIGHT BOTTOM

    drawModel( angleXX, -angleYY, angleZZ,  // CW rotations
               sx, sy, sz,
               tx - 0.5, ty - 0.5, tz,
               mvMatrix,
               primitiveType );*/

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

        velocity_dir = -1;

        tm -= 0.01;
    }
    if (currentlyPressedKeys[39]) {

        // Right cursor key

        if (!is_moving) {
            is_moving = true
        }

        tm += 0.01;
        velocity_dir = +1;
    }
}

//----------------------------------------------------------------------------

// Timer

function tick() {

    requestAnimFrame(tick);

    // NEW --- Processing keyboard events

    handleKeys();

    drawScene();
}


//----------------------------------------------------------------------------

function setEventListeners(canvas) {

    // NEW ---Handling the mouse

    // From learningwebgl.com

    // NEW ---Handling the keyboard

    // From learningwebgl.com

    function handleKeyDown(event) {

        currentlyPressedKeys[event.keyCode] = true;
    }

    function handleKeyUp(event) {

        currentlyPressedKeys[event.keyCode] = false;
        is_moving = false;
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

        // DEFAULT: The viewport occupies the whole canvas

        // DEFAULT: The viewport background color is WHITE

        // NEW - Drawing the triangles defining the model

        primitiveType = gl.TRIANGLES;

        // DEFAULT: Blending is DISABLED

        // Enable it !

        gl.enable(gl.CULL_FACE);

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
    canvas.height = window.innerHeight - 70;

    window.addEventListener('resize', runWebGL, false);

    initWebGL(canvas);

    shaderProgram = initShaders(gl);

    setEventListeners(canvas);

    initBuffers();

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



