"use strict";

var wireSphere = function() {
    var canvas;
    var gl;

    var numTimesToSubdivide = 4;

    var index = 0;

    // var theta = 60;
    var theta = Math.PI * 120 / 180.0;

    var positionsArray = [];


    function triangle(a, b, c) {
        // console.log(a+" "+b+" "+c);
        positionsArray.push(a);
        positionsArray.push(b);
        positionsArray.push(c);
        index += 3;
    }


    function divideTriangle(a, b, c, count) {
        if (count > 0) {

            var ab = mix( a, b, 0.5);
            var ac = mix( a, c, 0.5);
            var bc = mix( b, c, 0.5);


            divideTriangle(a, ab, ac, count - 1);
            divideTriangle(ab, b, bc, count - 1);
            divideTriangle(bc, c, ac, count - 1);
            divideTriangle(ab, bc, ac, count - 1);
        }
        else { // draw tetrahedron at end of recursion
            triangle(a, b, c);
        }
    }

    window.onload = function init() {
        canvas = document.getElementById("gl-canvas");

        gl = canvas.getContext('webgl2');
        if (!gl) alert("WebGL 2.0 isn't available");


        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.clearColor(1.0, 1.0, 1.0, 1.0);

        //
        //  Load shaders and initialize attribute buffers
        //
        var program = initShaders(gl, "vertex-shader", "fragment-shader");
        gl.useProgram(program);

        var va = vec2(-0.5, 0.7);
        var vb = vec2(0.0, -1.03);
        var vc = vec2(0.5, 0.7);

        divideTriangle(va, vb, vc, numTimesToSubdivide);

        var vBuffer = gl.createBuffer();
        gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer);
        gl.bufferData( gl.ARRAY_BUFFER, flatten(positionsArray), gl.STATIC_DRAW);

        var positionLoc = gl.getAttribLocation( program, "aPosition");
        gl.vertexAttribPointer( positionLoc, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(positionLoc);

        var thetaLoc = gl.getUniformLocation(program, "theta");
        // console.log(theta);
        gl.uniform1f(thetaLoc, theta);

        render();
    }


    function render() {

        gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        for( var i=0; i<index; i+=3)
            gl.drawArrays(gl.LINE_LOOP, i, 3);

        requestAnimationFrame(render);
    }

}

wireSphere();
