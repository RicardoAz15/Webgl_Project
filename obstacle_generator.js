
const obstacles_type = ["cube","sphere","wall"];

const initial_Coordinates = [
    1.00,1.00,10.00,

    -1.00,1.00,10.00,

    1.00,-1.00,10.00,

    -1.00,-1.00,10.00,

    1.00,1.00,8.00,

    -1.00,1.00,8.00,

    1.00,-1.00,8.00,

    -1.00,-1.00,8.00
];
const initial_Vertices = [
    0, 1, 2,      0, 2, 3,    // Front face

    4, 5, 6,      4, 6, 7,    // Back face

    3, 2, 6,     3, 6, 5,  // Top face

    0, 1, 7,   0, 7, 4, // Bottom face

    1, 7, 6,   1, 6, 2, // Right face

    0, 4, 3,   3, 5, 4  // Left face
];

// Usar random_number do ficheiro math

var obstacle = null;

/*
Seleciona o proximo obstaculo
 */
function next_obstacle() {

    var number = random_number(0,2);

    var obstacles_type_selected = obstacles_type[number]

}

/*
Coloca o obstaculo no lugar pretendido
 */
function put_in_place() {

}

/*
Devolve o obstaculo para ser renderizado
 */
function summon() {

}









