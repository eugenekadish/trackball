/**
 * Widget that displays a dynamic graphic with click and drag mouse functionality.
 */
(function(){
  
  var gl;
  var cursor;
  
  var scene = document.getElementById('scene');

  // Enable click and drag functionality for the triangles in the buffer.
  var t = new Trackball(true, scene);  
  
  // Check that the browser has WebGL support.
  try {
    gl = scene.getContext('webgl');
  } catch(e){
    if(!gl){
      alert(' WebGL could not be initialized.');
    }
  }
  
  var modeOne = document.getElementById('modeOne');
  var modeTwo = document.getElementById('modeTwo');

  var windowWidth  = scene.width;
  var windowHeight = scene.height;

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
  
  var shaderProgram = shaderImport(['shaders/vertex.glsl', 'shaders/fragment.glsl'], gl);
  
  gl.clearColor(0.0, 0.0, 0.8, 1.0);
  gl.viewport(0, 0, windowWidth, windowHeight);
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
 
  gl.uniform1i(shaderProgram.samplerUniform, 0);
  
  // Set up a texture.
  var texture = gl.createTexture(); 
  
  gl.activeTexture(gl.TEXTURE0);
 
  gl.bindTexture(gl.TEXTURE_2D, texture);
  
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
          
  texture.image = new Image(); 
  texture.image.src = "images/icons.jpg";
  
  /**
   * Store an image as a 2D texture.
   */ 
  texture.image.onload = function(){
    
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); 
    
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image);    
    gl.drawArrays(gl.TRIANGLES, 0, 36);
  }

  /**
   * Event handler of mouse press events for the widget.
   *
   * @param event Object representing a mouse press event.
   */
  scene.onmousedown = function(event){

    cursor = t.interpolate(event.clientX, event.clientY);

    // t.stop();
    t.push(cursor[0], cursor[1]);
  };

  /**
   * Event handler of mouse move events for the widget.
   *
   * @param event Object representing a mouse move event.
   */ 
  scene.onmousemove = function(event){

    cursor = t.interpolate(event.clientX, event.clientY);

    t.move(cursor[0], cursor[1]);
 
    // Get the updated rotation matrix.
    mat4.multiply(temporaryModelviewMatrix, modelviewMatrix, t.rotation());

    // Update the modelview matrix.
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.uniformMatrix4fv(shaderProgram.modelviewUniform, false, temporaryModelviewMatrix);
      
    gl.drawArrays(gl.TRIANGLES, 0, 36);
  };

  /**
   * Event handler of mouse release events for the page.
   *
   * @param event Object representing a mouse release event.
   */
  document.onmouseup = function(event){
      
    t.release();
    // t.start();
  };
  
  /**
   * Event handler for enabling accurate rotations.
   *
   * @param event Object representing a button press event.
   */
  modeOne.onclick = function(event){
    
    modeOne.setAttribute("disabled", "true");
    modeTwo.removeAttribute("disabled");
    
    t.setMode(true);
 
    gl.clearColor(0.1, 0.1, 0.8, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, 36);
  };
 
  /**
   * Event handler for enabling default rotations.
   *
   * @param event Object representing a button press event.
   */
  modeTwo.onclick = function(event){
    
    modeTwo.setAttribute("disabled", "true");
    modeOne.removeAttribute("disabled");    

    t.setMode(false);
    
    gl.clearColor(0.8, 0.1, 0.1, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, 36);
 };

})();
