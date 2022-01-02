"use strict";

var gl;
var points=[];
var numTimesToSubdivides=3;
var angle=180.0;
var spin=Math.PI*angle/180.0;

window.onload = function init(){
    var canvas = document.getElementById( "triangle-canvas" );
    gl = WebGLUtils.setupWebGL(canvas);
    if(!gl){
        alert( "WebGL isn't available" );
    }

    var vertices = [
        // vec2(-0.5, 0.0),
        // vec2(0.0, 0.87),
        // vec2(0.5, 0.0),
         vec2(-0.5, 0.7),
         vec2(0.0, -1.0),
         vec2(0.5, 0.7),
    ];

    divideTriangle(vertices[0], vertices[1], vertices[2], numTimesToSubdivides);

    // Configure WebGL
    gl.viewport( 100, 100, canvas.width-100, canvas.height-100);//四个参数为画布左上角和右下角的坐标
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    // Load shaders and initialize attribute buffers
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram(program);

    // Load the data into the GPU
    var buffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, buffer);
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW);

    var FSIZE = vertices.BYTES_PER_ELEMENT;

    // Associate external shader variables with data buffer
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 5*FSIZE, 0 );
    gl.enableVertexAttribArray(vPosition);

    var thetaLoc = gl.getUniformLocation(program, "theta");
    gl.uniform1f(thetaLoc, spin);

    render();
}

function triangle(a, b, c) {
    points.push(a);
    points.push(b);
    points.push(b);
    points.push(c);
    points.push(c);
    points.push(a);

}

function divideTriangle(a, b, c, count) {
    if(count==0){
        triangle(a, b, c);
    } else {
        var ab = mix(a, b, 0.5);
        var bc = mix(b, c, 0.5);
        var ac = mix(a, c, 0.5);

        --count;

        divideTriangle(a, ab, ac, count);
        divideTriangle(ab, b, bc,count);
        divideTriangle(ac, bc, c, count);
        divideTriangle(ab, bc, ac, count);
    }
}

function render(){
    gl.clear( gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.LINES, 0, points.length);
}