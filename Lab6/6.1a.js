"use strict";

var wireSphere = function() {
    var canvas;
    var gl;

    var numTimesToSubdivide = 3;

    var index = 0;

    var positionsArray = [];

    function triangle(a, b, c) {
        positionsArray.push(a);
        positionsArray.push(b);
        positionsArray.push(c);
        index += 3;
    }


    function divideTriangle(a, b, c, count) {
        if (count > 0) {

            var ab = normalize(mix( a, b, 0.5), true);
            var ac = normalize(mix( a, c, 0.5), true);
            var bc = normalize(mix( b, c, 0.5), true);


            divideTriangle(a, ab, ac, count - 1);
            divideTriangle(ab, b, bc, count - 1);
            divideTriangle(bc, c, ac, count - 1);
            divideTriangle(ab, bc, ac, count - 1);
        }
        else { // draw tetrahedron at end of recursion
            triangle(a, b, c);
        }
    }

    function tetrahedron(a, b, c, d, n) {
        divideTriangle(a, b, c, n);
        divideTriangle(d, c, b, n);
        divideTriangle(a, d, b, n);
        divideTriangle(a, c, d, n);
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

        var va = vec4(0.0, 0.0, -1.0, 1);
        var vb = vec4(0.0, 0.942809, 0.333333, 1);
        var vc = vec4(-0.816497, -0.471405, 0.333333, 1);
        var vd = vec4(0.816497, -0.471405, 0.333333, 1);

        tetrahedron(va, vb, vc, vd, numTimesToSubdivide);

        var vBuffer = gl.createBuffer();
        gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer);
        gl.bufferData( gl.ARRAY_BUFFER, flatten(positionsArray), gl.STATIC_DRAW);

        var positionLoc = gl.getAttribLocation( program, "aPosition");
        gl.vertexAttribPointer( positionLoc, 4, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(positionLoc);

        document.getElementById("Button4").onclick = function(){
            numTimesToSubdivide++;
            index = 0;
            positionsArray = [];
            init();
        };
        document.getElementById("Button5").onclick = function(){
            if(numTimesToSubdivide) numTimesToSubdivide--;
            index = 0;
            positionsArray = [];
            init();
        };
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
