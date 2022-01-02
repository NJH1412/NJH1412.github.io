"use strict";
const { vec3 } = glMatrix;
var gl;
var points=[];
var colors=[];

var vertices = [
    vec3.fromValues(0.0000, 0.0000, -1.0000),
    vec3.fromValues(0.0000, 0.9428, 0.3333),
    vec3.fromValues(-0.8165, -0.4714, 0.3333),
    vec3.fromValues( 0.8165, -0.4714, 0.3333)
];

var baseColors = [
    vec3.fromValues(1.0, 0.0, 0.0),
    vec3.fromValues(0.0, 1.0, 0.0),
    vec3.fromValues(0.0, 0.0, 1.0),
    vec3.fromValues(0.0, 0.0, 0.0)
];

function init(){

    var canvas = document.getElementById( "triangle-canvas" );
    gl = WebGLUtils.setupWebGL(canvas);
    if(!gl){
        alert( "WebGL isn't available" );
    }

    var numTimesToSubdivides=document.getElementById("num").value;
    divideTetra(vertices[0], vertices[1], vertices[2], vertices[3], numTimesToSubdivides);

    // Configure WebGL
    gl.viewport( 50, 50, canvas.width-100, canvas.height-60);
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );
    gl.enable(gl.DEPTH_TEST);

    // Load shaders and initialize attribute buffers
    var program = initShaders(gl, "vertex-shader", "fragment-shader" );
    gl.useProgram(program);

    // Load the data into the GPU
    var vbuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vbuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(points), gl.STATIC_DRAW);

    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray(vPosition);

    var cbuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cbuffer);
    gl.bufferData( gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);//flatten()把数据转为一维

    // Associate external shader variables with data buffer
    var vColor = gl.getAttribLocation(program, "vColor");
    gl.vertexAttribPointer(vColor, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vColor);

    render();
}

function triangle(a, b, c, color){
    colors.push(baseColors[color][0], baseColors[color][1], baseColors[color][2]);
    points.push(a[0], a[1], a[2]);
    colors.push(baseColors[color][0], baseColors[color][1], baseColors[color][2]);
    points.push(b[0], b[1],  b[2]);
    colors.push(baseColors[color][0], baseColors[color][1], baseColors[color][2]);
    points.push(c[0], c[1], c[2]);
}

function tetra(a, b, c, d) {
    triangle(a, c, b, 0);
    triangle(a, c, d, 1);
    triangle(a, b, d, 2);
    triangle(b, c, d, 3);
}

function divideTetra(a, b, c, d, count) {
    if(count==0){
        tetra(a, b, c, d);
    } else {
        var ab = mix(a, b);
        var ac = mix(a, c);
        var ad = mix(a, d);
        var bc = mix(b, c);
        var bd = mix(b, d);
        var cd = mix(c, d);

        --count;

       divideTetra(a, ab, ac, ad, count);
       divideTetra(ab, b, bc, bd, count);
       divideTetra(ac, bc, c, cd, count);
       divideTetra(ad, bd, cd, d, count);
    }
}

function render(){
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, points.length);
}

function  mix(a, b) {
    var ab = vec3.create();
    vec3.lerp(ab, a, b, 0.5);
    return ab;
}