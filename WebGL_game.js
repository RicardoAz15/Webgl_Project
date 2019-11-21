var gl = null;
var canvas = null;

// Buffers
var VertexPositionBuffer = null;
var VertexColorBuffer = null;
var VertexIndexBuffer = null;
var PlayerVertexIndexBuffer = null;

var shaderProgram = null;

var tx = 0;

var positional = [
    // Plane
    -0.65, -1.0,  1.0,
    0.65, -1.0,  1.0,
    0.65,  2.0,  1.0,
    -0.65,  2.0,  1.0,

    // Player
        -1.0, -1.0,  1.0,
        1.0, -1.0,  1.0,
        1.0,  1.0,  1.0,
        -1.0,  1.0,  1.0,

        -1.0, -1.0, -1.0,
        -1.0,  1.0, -1.0,
        1.0,  1.0, -1.0,
        1.0, -1.0, -1.0,

];

var colors = [
    0.00 ,   0.00 ,   1.00,
    0.00 ,   0.00 ,   1.00,
    0.00 ,   0.00 ,   1.00,
    0.00 ,   0.00 ,   1.00,

    0.00 ,   0.00 ,   1.00,
    0.00 ,   0.00 ,   1.00,
    0.00 ,   0.00 ,   1.00,
    0.00 ,   0.00 ,   1.00
];

var plane_vertices_index = [
    0, 1, 2,      0, 2, 3,    // plane

];

var player_vertices_index = [
    0, 1, 2,      0, 2, 3,    // Front face

    4, 5, 6,      4, 6, 7,    // Back face

    3, 2, 6,     3, 6, 5,  // Top face

    0, 1, 7,   0, 7, 4, // Bottom face

    1, 7, 6,   1, 6, 2, // Right face

    0, 4, 3,   3, 5, 4  // Left face

];

function initBuffers() {

    VertexPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, VertexPositionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positional), gl.STATIC_DRAW);
    VertexPositionBuffer.itemSize = 3;
    VertexPositionBuffer.numItems = positional.length / 3;

    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute,
        VertexPositionBuffer.itemSize,
        gl.FLOAT, false, 0, 0);

    VertexColorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, VertexColorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
    VertexColorBuffer.itemSize = 3;
    VertexColorBuffer.numItems = colors.length / 3;

    gl.vertexAttribPointer(shaderProgram.vertexColorAttribute,
        VertexColorBuffer.itemSize,
        gl.FLOAT, false, 0, 0);

    VertexIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, VertexIndexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(plane_vertices_index), gl.STATIC_DRAW);
    VertexIndexBuffer.itemSize = 1;
    VertexIndexBuffer.numItems = 6;

    PlayerVertexIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, PlayerVertexIndexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(player_vertices_index), gl.STATIC_DRAW);
    PlayerVertexIndexBuffer.itemSize = 1;
    PlayerVertexIndexBuffer.numItems = 6;

}


function initWebGL(canvas) {

    try {
        gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");

        gl.clearColor(1.0, 1.0, 1.0, 1.0);

        gl.enable( gl.CULL_FACE );

        gl.cullFace( gl.BACK );

        // Buttons
    } catch (e) {
    }

    if (!gl) {
        alert("WebGL not initialise :(");
    }

}

function changeColors(c1,c2,c3) {

    for(var i=0; i<colors.length;i+=3){
        colors[i] = c1;
        colors[i+1] = c2;
        colors[i+2] = c3;
    }

}

function drawScene() {

    var mvMatrix = mat4();

    mvMatrix = prepare_plane(mvMatrix);

    //plane
    changeColors(0.00,0.00,1.00);
    drawModel(1,1,1, tx, 0,  -3,
        mvMatrix);

    //player
    changeColors(0.00,1.00,1.00);
    drawModel(0.3,0.3,0.3, 0, 0,  -3,
        mvMatrix,);

}

function drawModel(sx,sy,sz,
                   tx, ty, tz,
                    mvMatrix) {

    // Pay attention to transformation order !!

    mvMatrix = mult( mvMatrix, translationMatrix( tx, -1, tz ) );
    mvMatrix = mult( mvMatrix, rotationXXMatrix( -60 ) );

    // Passing the Model View Matrix to apply the current transformation

    var mvUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");

    gl.uniformMatrix4fv(mvUniform, false, new Float32Array(flatten(mvMatrix)));

    // Passing the buffers

    gl.bindBuffer(gl.ARRAY_BUFFER, VertexPositionBuffer);

    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, VertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, VertexColorBuffer);

    gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, VertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, VertexIndexBuffer);

    // Drawing the triangles --- NEW --- DRAWING ELEMENTS

    gl.drawElements(gl.TRIANGLES, VertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
}

function prepare_plane(mvMatrix) {

    var pMatrix = perspective( 45, 1, 0.05, 15 );

    var pUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");

    gl.uniformMatrix4fv(pUniform, false, new Float32Array(flatten(pMatrix)));

    return mvMatrix;
}

function tick() {
    requestAnimationFrame(tick);

    handleKeys();

    render();
}

function render() {

    gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    drawScene()
}

var currentlyPressedKeys = {};
function handleKeys() {

    if(currentlyPressedKeys[38]){
        console.log("ON THE MOVE");
        tx -= 0.1;
    }
    if(currentlyPressedKeys[40]){
        tx += 0.1;
    }

}

function setEventListeners(canvas) {

    function handleKeyDown(event) {
        currentlyPressedKeys[event.keyCode] = true;
    }

    function handleKeyUp(event) {
        currentlyPressedKeys[event.keyCode] = false;
    }

    canvas.onkeyup = handleKeyUp;

    canvas.onkeydown = handleKeyDown;

    window.addEventListener('resize', runWebGL, false);

}

function runWebGL() {

    canvas = document.getElementById("game_window");

    canvas.width = window.innerWidth - 15;
    canvas.height = window.innerHeight - 22;

    initWebGL(canvas);

    shaderProgram = initShaders( gl );

    setEventListeners(canvas);

    initBuffers();

    tick()

}
