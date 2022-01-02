"use strict";

var gl;
var vertices;
var theta = 0.0;
var thetaLoc;
var direction=1;

function changeDir() {
    direction*=-1;
}

function init(){
    var canvas = document.getElementById( "triangle-canvas" );
    gl = WebGLUtils.setupWebGL(canvas);
    if( !gl ){
        alert( "WebGL isn't available" );
    }

    // Three Vertices
    vertices = new Float32Array([
        -0.2, 0.0, 0.0, 0.0, 1.0,
        -0.3, 0.5, 0.0, 0.0, 1.0,
        -0.4, 0.0, 0.0, 0.0, 1.0,
        -1.0, -1.0, 0.0, 1.0, 0.0,
        -1.0, 0.0, 0.0, 1.0, 0.0,
        0.2, 0.0, 0.0, 1.0, 0.0,
        1.0, -1.0, 0.0, 1.0, 0.0,
        -1.0, -1.0, 0.0, 1.0, 0.0,

        0.4, 0.0, 0.0, 0.0, 1.0,
        0.3, 0.5, 0.0, 0.0, 1.0,
        0.2, 0.0, 0.0, 0.0, 1.0,
        1.0, -1.0, 0.0, 1.0, 0.0,
        1.0, 0.0, 0.0, 1.0, 0.0,

        0.4, 0.0, 0.0, 1.0, 0.0,
        1.0, 0.0, 0.0, 1.0, 0.0,
        1.0, -1.0, 0.0, 1.0, 0.0,
        0.2, 0.0, 0.0, 1.0, 0.0,

        -0.1, -0.8, 1.0, 0.0, 0.0,
        -0.1, -0.6, 1.0, 0.0, 0.0,
        0.1, -0.6, 1.0, 0.0, 0.0,
        0.1, -0.8, 1.0, 0.0, 0.0,

        -0.5, -0.5, 1.0, -0.7, 0.5,
        0.5, -0.5, 1.0, -0.7, 0.5,
    ]);

    // Configure WebGL
    gl.viewport( 5.0, 5.0, canvas.width, canvas.height);
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    // Load shaders and initialize attribute buffers
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram(program);

    // Load the data into the GPU
    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW );

    var FSIZE = vertices.BYTES_PER_ELEMENT;

    // Associate external shader variables with data buffer
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 5*FSIZE, 0 );
    gl.enableVertexAttribArray(vPosition);

    var vColor=gl.getAttribLocation(program, "vColor");
    gl.vertexAttribPointer(vColor, 3, gl.FLOAT, false, 5*FSIZE, 2*FSIZE);
    gl.enableVertexAttribArray(vColor);

    thetaLoc = gl.getUniformLocation( program, "theta" );
    render();

}

function render(){
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 5);
    gl.drawArrays(gl.TRIANGLE_STRIP, 3, 5);
    gl.drawArrays(gl.TRIANGLE_FAN, 8, 5);
    gl.drawArrays(gl.TRIANGLE_FAN, 13, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 17, 4);

    theta += direction*0.1;
    if(theta > 2 * Math.PI)
        theta -= (2 * Math.PI);

    gl.uniform1f(thetaLoc, theta);
    gl.drawArrays(gl.POINTS, 21, 2);

    // update and render
    window.requestAnimFrame(render);
}

