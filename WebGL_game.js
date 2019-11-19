var gl = null;
var canvas = null;
var triangle_Vertex_Position_Buffer = null;
var triangleVertexColorBuffer = null;
var shaderProgram = null;

var vertices = [
    -0.25, 0.90, -0.75,
    -0.75, -1.00, -0.75,
    0.75, -1.00, -0.75,

    -0.25, 0.90, -0.75,
    0.75, -1.00, -0.75,
    0.25, 0.90, -0.75,
];

var colors = [
    0.00 ,   0.00 ,   1.00,
    0.00 ,   0.00 ,   1.00,
    0.00 ,   0.00 ,   1.00,

    0.00 ,   0.00 ,   1.00,
    0.00 ,   0.00 ,   1.00,
    0.00 ,   0.00 ,   1.00
];

function initBuffers() {

    triangle_Vertex_Position_Buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, triangle_Vertex_Position_Buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    triangle_Vertex_Position_Buffer.itemSize = 3;
    triangle_Vertex_Position_Buffer.numItems = vertices.length / 3;

    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute,
        triangle_Vertex_Position_Buffer.itemSize,
        gl.FLOAT, false, 0, 0);

    triangleVertexColorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexColorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
    triangleVertexColorBuffer.itemSize = 3;
    triangleVertexColorBuffer.numItems = colors.length / 3;

    gl.vertexAttribPointer(shaderProgram.vertexColorAttribute,
        triangleVertexColorBuffer.itemSize,
        gl.FLOAT, false, 0, 0);

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

function render() {

    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);

    var pMatrix = perspective( 45, 1, 0.05, 10 );
    var pUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
    gl.uniformMatrix4fv(pUniform, false, new Float32Array(flatten(pMatrix)));


    gl.drawArrays(gl.TRIANGLES,0, triangle_Vertex_Position_Buffer.numItems);

}

function runWebGL() {

    canvas = document.getElementById("game_window");

    canvas.width = window.innerWidth - 15;
    canvas.height = window.innerHeight - 22;
    window.addEventListener('resize', runWebGL, false);

    initWebGL(canvas);

    shaderProgram = initShaders( gl );

    initBuffers();

    render();

}
