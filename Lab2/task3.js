"use strict";

var gl;
var points=[];

function init(){

    var canvas = document.getElementById( "triangle-canvas" );
    gl = WebGLUtils.setupWebGL(canvas);
    if(!gl){
        alert( "WebGL isn't available" );
    }

    var vertices = [
        vec2(-1.0, -1.0),
        vec2(0.0, 1.0),
        vec2(1.0, -1.0),
    ];

    var numTimesToSubdivides = document.getElementById("num").value;
    divideTriangle(vertices[0], vertices[1], vertices[2], numTimesToSubdivides);

    // Configure WebGL
    gl.viewport( 0, 0, canvas.width, canvas.height);
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    // Load shaders and initialize attribute buffers
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram(program);

    // Load the data into the GPU
    var buffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, buffer);
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW);//flatten()把数据转为一维

    // Associate external shader variables with data buffer
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray(vPosition);

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
    gl.clear( gl.COLOR_BUFFER_BIT );
    gl.drawArrays(gl.LINES, 0, points.length);
}