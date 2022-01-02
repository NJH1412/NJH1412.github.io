"use strict";

var gl;
var points;

//顶点着色器程序
var VSHADER_SOURCE =
    'attribute vec4 vPosition;\n' + // attribute variable
    'attribute vec4 vColor;\n' +
    'varying vec4 v_Color;\n' +
    'void main() {\n' +
    '  gl_Position = vPosition;\n' + // Set the vertex coordinates of the point
    '  v_Color = v_Color;\n' +
    '}\n';

// 片元着色器程序
var FSHADER_SOURCE =
    'precision mediump float;\n' +
    'varying vec4 v_Color;\n' +
    'void main() {\n' +
    '  gl_FragColor = v_Color;\n' +
    '}\n';

window.onload = function init(){
    var canvas = document.getElementById( "triangle-canvas" );
    gl = WebGLUtils.setupWebGL( canvas );
    if( !gl ){
        alert( "WebGL isn't available" );
    }


    // Three Vertices
    var vertices = new Float32Array([
        /*-1.0, -1.0,
        0.0,  1.0,
        1.0, -1.0, *///第一个图形

        // -0.5, 0.5, -0.5, -0.5, 0.5, 0.5, 0.5, -0.5,//第二个图形

        // -0.5, 0.5, 1.0, 0.0, 0.0,
        // -0.5, -0.5, 1.0, 0.0, 0.0,
        // 0.5, 0.5, 1.0, 0.0, 0.0,
        // 0.5, -0.5, 1.0, 0.0, 0.0,
        // 0.5, -0.5, 0.0, 0.0, 1.0,
        // 0.7, -0.5, 0.0, 0.0, 1.0,
        // 0.7, 0.7, 0.0, 0.0, 1.0, //第三个图形

        0.0, 0.5, 1.0, 0.0, 0.0,
        -0.5, -0.5, 0.0, 1.0, 0.0,
        0.5, -0.5, 0.0, 0.0, 1.0, //第四个图形


        /*0.0, -1.0,
        1.0, -1.0,
        1.0,  1.0,
        0.0, -1.0,
        1.0,  1.0,
        0.0,  1.0*/
        /*-0.5, -0.5,
        0.0, 0.5,
        0.5, -0.5*/
    ]);

    // Configure WebGL
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    // Load shaders and initialize attribute buffers
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram(program);

    // Load the data into the GPU
    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER,  vertices, gl.STATIC_DRAW );

    var FSIZE = vertices.BYTES_PER_ELEMENT;

    // Associate external shader variables with data buffer
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 5*FSIZE, 0 );
    gl.enableVertexAttribArray( vPosition );

    var vColor=gl.getAttribLocation(program, 'vColor');
    gl.vertexAttribPointer(vColor, 3, gl.FLOAT, false, 5*FSIZE, FSIZE*2);
    gl.enableVertexAttribArray(vColor);

    render();
}

function render(){
    gl.clear( gl.COLOR_BUFFER_BIT );
    //gl.drawArrays( gl.TRIANGLE_FAN, 0, 4 );
    gl.drawArrays( gl.TRIANGLES, 0, 3 );
    //gl.drawArrays( gl.TRIANGLE_FANS, 3, 6 );

    // gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    // gl.drawArrays(gl.TRIANGLE_FAN, 4, 3);
}