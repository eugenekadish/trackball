/**
  * A simple static scene is displayed when the page is loaded with click and drag UI functionality.
  */
(function(){

   // Check the if the web browser can display 3D graphics.
   try {
      var gl = document.getElementById('scene').getContext('webgl');
   } catch(e){
      if(!gl){
         alert(' WebGL could not be initialized.');
      }
   }

   var windowWidth  = document.getElementById('scene').clientWidth;
   var windowHeight = document.getElementById('scene').clientHeight;

   gl.enable(gl.DEPTH_TEST);

   // Buffer containing coordinate data of a unit cube centered about the origin.
   var vertexBuffer = gl.createBuffer();
    
   gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
   gl.bufferData(gl.ARRAY_BUFFER,
                     new Float32Array([
                          -0.5, -0.5,  0.5,  1.0,  0.5, -0.5,  0.5,  1.0,  0.5,  0.5,  0.5,  1.0,
                           0.5,  0.5,  0.5,  1.0, -0.5,  0.5,  0.5,  1.0, -0.5, -0.5,  0.5,  1.0,
                          -0.5,  0.5, -0.5,  1.0,  0.5,  0.5, -0.5,  1.0,  0.5, -0.5, -0.5,  1.0, 
                          -0.5,  0.5, -0.5,  1.0,  0.5, -0.5, -0.5,  1.0, -0.5, -0.5, -0.5,  1.0,
                           0.5,  0.5,  0.5,  1.0,  0.5,  0.5, -0.5,  1.0,  0.5, -0.5, -0.5,  1.0,
                           0.5,  0.5,  0.5,  1.0,  0.5, -0.5, -0.5,  1.0,  0.5, -0.5,  0.5,  1.0,
                          -0.5,  0.5, -0.5,  1.0, -0.5,  0.5,  0.5,  1.0, -0.5, -0.5,  0.5,  1.0, 
                          -0.5, -0.5,  0.5,  1.0, -0.5, -0.5, -0.5,  1.0, -0.5,  0.5, -0.5,  1.0,
                           0.5,  0.5,  0.5,  1.0,  0.5,  0.5, -0.5,  1.0, -0.5,  0.5, -0.5,  1.0,
                          -0.5,  0.5,  0.5,  1.0,  0.5,  0.5,  0.5,  1.0, -0.5,  0.5, -0.5,  1.0,
                           0.5, -0.5,  0.5,  1.0, -0.5, -0.5,  0.5,  1.0, -0.5, -0.5, -0.5,  1.0,
                          -0.5, -0.5, -0.5,  1.0,  0.5, -0.5, -0.5,  1.0,  0.5, -0.5,  0.5,  1.0 
                                       ]),
                              gl.STATIC_DRAW);
   
   var textureBuffer = gl.createBuffer();
          
   gl.bindBuffer(gl.ARRAY_BUFFER, textureBuffer);
   gl.bufferData(gl.ARRAY_BUFFER, 
                      new Float32Array([
                            0.00, 0.00, 0.35, 0.00, 0.35, 0.50,
                            0.35, 0.50, 0.00, 0.50, 0.00, 0.00,
                            0.36, 0.50, 0.67, 0.50, 0.67, 0.00,
                            0.36, 0.50, 0.67, 0.00, 0.36, 0.00,
                            0.35, 1.00, 0.00, 1.00, 0.00, 0.50,
                            0.35, 1.00, 0.00, 0.50, 0.35, 0.50, 
                            0.35, 1.00, 0.65, 1.00, 0.65, 0.50,
                            0.65, 0.50, 0.35, 0.50, 0.35, 1.00,
                            0.99, 0.50, 0.99, 1.00, 0.66, 1.00,
                            0.66, 0.50, 0.99, 0.50, 0.66, 1.00,
                            1.00, 0.50, 0.66, 0.50, 0.66, 0.00,
                            0.66, 0.00, 1.00, 0.00, 1.00, 0.50
                                      ]), 
                            gl.STATIC_DRAW);

   // Define and create the shaders.
   var sources = [];
   var shaders = [];

   sources[0] = 'attribute vec4 vertex;' +
                'attribute vec2 texture;' +
                
                'uniform mat4 projection;' +
                'uniform mat4 modelview;' + 
                
                'varying vec2 t;' +

                'void main(){' +
                '  t = texture;' +
                '  gl_Position = projection * modelview * vertex;' +
                '}';

   sources[1] = 'precision mediump float;' +
           
                'varying vec2 t;' +

                'uniform sampler2D sampler;' +
                   
                'void main(){' +
                '  gl_FragColor = texture2D(sampler, vec2(t.s, t.t));' +
                '}';

   shaders[0] = gl.createShader(gl.VERTEX_SHADER);
   shaders[1] = gl.createShader(gl.FRAGMENT_SHADER);

   gl.shaderSource(shaders[0], sources[0]);
   gl.compileShader(shaders[0]);

   gl.shaderSource(shaders[1], sources[1]);
   gl.compileShader(shaders[1]);

   // Check to see that the shaders compiled.
   for(var i = 0; i < shaders.length; i++){
      var shader = shaders[i];
      if(!gl.getShaderParameter(shader, gl.COMPILE_STATUS)){
         alert(gl.getShaderInfoLog(shader));
      }
   }

   var shaderProgram = gl.createProgram();
      
   gl.attachShader(shaderProgram, shaders[0]);
   gl.attachShader(shaderProgram, shaders[1]);
   gl.linkProgram(shaderProgram);

   // Check to see if the program linked.
   if(!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)){
      alert(' The shaders could not be initialized.');
   }

   gl.clearColor(0.0, 0.0, 0.0, 1.0);

   gl.viewport(0, 0, windowWidth, windowHeight);
      
   gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

   gl.useProgram(shaderProgram);

   // Set up the matrices for the viewing transformation.
   var eye    = vec3.create();
   var center = vec3.create();
   var up     = vec3.create();

   vec3.set(eye, 0.0, 0.0, 3.0);
   vec3.set(center, 0.0, 0.0, 0.0);
   vec3.set(up, 0.0, 1.0, 0.0);
  
   var projectionMatrix         = mat4.create();
   var modelviewMatrix          = mat4.create();
   var temporaryModelviewMatrix = mat4.create();
   var rotationMatrix           = mat4.create();

   mat4.frustum(projectionMatrix, -0.5, 0.5, -0.5, 0.5, 1.0, 15.0);
   mat4.lookAt(modelviewMatrix, eye, center, up);

   shaderProgram.vertexAttribute  = gl.getAttribLocation(shaderProgram, 'vertex'); 
   shaderProgram.textureAttribute = gl.getAttribLocation(shaderProgram, 'texture');

   // Set the attribute locations and point them to the corresponding buffer data.
   gl.enableVertexAttribArray(shaderProgram.vertexAttribute);
   gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
   gl.vertexAttribPointer(shaderProgram.vertexAttribute, 4, gl.FLOAT, false, 0, 0);

   gl.enableVertexAttribArray(shaderProgram.textureAttribute);
   gl.bindBuffer(gl.ARRAY_BUFFER, textureBuffer);
   gl.vertexAttribPointer(shaderProgram.textureAttribute, 2, gl.FLOAT, false, 0, 0);

   // Set the locations and data of uniform variables.
   shaderProgram.projectionUniform = gl.getUniformLocation(shaderProgram, 'projection');
   shaderProgram.modelviewUniform  = gl.getUniformLocation(shaderProgram, 'modelview');
   shaderProgram.samplerUniform    = gl.getUniformLocation(shaderProgram, "sampler");

   gl.uniformMatrix4fv(shaderProgram.projectionUniform, false, projectionMatrix);
   gl.uniformMatrix4fv(shaderProgram.modelviewUniform, false, modelviewMatrix);

    // Set up the texture.
   var texture = gl.createTexture();
          
   texture.image     = new Image();
   texture.image.onload = function(){
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
      gl.bindTexture(gl.TEXTURE_2D, null);

      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, texture);
      
      gl.uniform1i(shaderProgram.samplerUniform, 0);
   }

   texture.image.src = "images/icons.jpg";
   
   gl.drawArrays(gl.TRIANGLES, 0, 36);

   // Enable click and drag functionality for the triangles in the buffer.
   var t = new Trackball(true);

   var cursor;

   $('#scene').mousedown(function(event){

      cursor = t.interpolate(event.clientX, event.clientY);

      // t.stop();
      t.push(cursor[0], cursor[1]);
   });

   $('#scene').mousemove(function(event){

      cursor = t.interpolate(event.clientX, event.clientY);

      t.move(cursor[0], cursor[1]);

      // Get the updated rotation matrix.
      mat4.multiply(temporaryModelviewMatrix, modelviewMatrix, t.rotation());

      // Update the modelview matrix.
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      gl.uniformMatrix4fv(shaderProgram.modelviewUniform, false, temporaryModelviewMatrix);
      
      gl.drawArrays(gl.TRIANGLES, 0, 36);
   });

   $('body').mouseup(function(event){
      
      t.release();
      // t.start();
   });
})();