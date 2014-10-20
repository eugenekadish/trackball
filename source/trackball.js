/**
 * Gives a static scene click and drag functionality.
 *
 * @param {Boolean} mode  Sets the way the transformation is kept track of.
 * @param {Object}  scene WebGL DOM element.
 */
function Trackball(mode, scene){

  // var beta          = 1.0;
  var mousePressed  = false;

  // For implementing a spin effect after the mouse is released.
  // var date;
  // var angularVelocity;
  
  // var finalTime;
  // var initialTime;

  var angle;
  var cosine;

  var rotationAxis    = vec3.create();
  var finalPosition   = vec3.create();
  var initialPosition = vec3.create();

  var initialRotationMatrix = mat4.create();
  var finalRotationMatrix   = mat4.create();

  var finalRotation   = quat.create();
  var initialRotation = quat.create();

  var orientations = [];

  orientations.push(vec3.fromValues(  1,  0,  0 ));
  orientations.push(vec3.fromValues( -1,  0,  0 )); 
  orientations.push(vec3.fromValues(  0,  1,  0 ));
  orientations.push(vec3.fromValues(  0, -1,  0 ));
  orientations.push(vec3.fromValues(  0,  0,  1 ));
  orientations.push(vec3.fromValues(  0,  0, -1 ));

  /**
   * Returns the rectilinear orientation relative to the vector from
   * the focus point to the view point.
   *
   * @param  {vec3}    v     Unit vector from the focus point to the view point.
   * @return {Integer} index An index in the array of the six rectilinear unit vectors.
   */
  this.orientation = function(v){
    
    var unit = orientations[0];
    
    var largest = vec3.dot(vec3.transformQuat(vec3.create(), unit, finalRotation), v);
    var tempLargest;
    
    var index     = 0;
    var tempIndex = 0;
    
    orientations.forEach(function(unit){
      
      tempLargest = vec3.dot(vec3.transformQuat(vec3.create(), unit, finalRotation),  v);

      if(tempLargest > largest){
        largest = tempLargest;
        index = tempIndex;
      }

      tempIndex++;
    });

    return index;
  }

  /**
   * Maps the horizontal and vertical components of the pixel position of the cursor to the interval [-1, 1].
   * 
   * @param  {Number} xPos The horizontal pixel position of the cursor in the widget.
   * @param  {Number} yPos The vertical pixel position of the cursor in the widget.
   * @return {Array}       A two element array of the horizontal and vertical coordinates
   *                       of the cursor mapped to the range [-1, 1].
   */
  this.interpolate = function(xPos, yPos){
      
    var windowWidth  = scene.width;
    var windowHeight = scene.height;
    var leftEdge     = scene.getBoundingClientRect().left;
    var topEdge      = scene.getBoundingClientRect().top;
   
     // Map the coordinates of where the moused was clicked to the
     // interval [-1, 1] in the horizontal and vertical directions.      
     return [(xPos - leftEdge - windowWidth / 2.0) / (windowWidth / 2.0), 
                (windowHeight / 2.0 + topEdge - yPos) / (windowHeight / 2.0)];
  }
   
  /**
   * Sets up the initial configuration for rotating objects in the scene.
   * 
   * @param {Number} xPos The horizontal position of the cursor mapped to the interval [-1, 1].
   * @param {Number} yPos The vertical position of the cursor mapped to the interval [-1, 1].
   */
  this.push = function(xPos, yPos){

    mousePressed = true;
      
    if(Math.sqrt(Math.pow(xPos, 2.0) + Math.pow(yPos, 2.0)) > 1.0){
      initialPosition = [xPos, yPos, 0.0];
    } else { 
      initialPosition = [xPos, yPos, Math.sqrt(1.0 - Math.pow(xPos, 2.0) - Math.pow(yPos, 2.0))];
    }

    vec3.normalize(initialPosition, initialPosition);

    // date = new Date();
    // initialTime = date.getTime();
  } 
   
  /**
   * Updates the configuration of the scene as the cursor is dragged across the widget.
   * 
   * @param {Number} xPos The horizontal position of the cursor mapped to the interval [-1, 1].
   * @param {Number} yPos The vertical position of the cursor mapped to the interval [-1, 1].
   */
  this.move = function(xPos, yPos){

    if(mousePressed){

      if(Math.sqrt(Math.pow(xPos, 2.0) + Math.pow(yPos, 2.0)) > 1.0){
        finalPosition = [xPos, yPos, 0.0];
      } else { 
        finalPosition = [xPos, yPos, Math.sqrt(1.0 - Math.pow(xPos, 2.0) - Math.pow(yPos, 2.0))];
      }

      vec3.normalize(finalPosition, finalPosition);
      
      // angle = vec3.angle(initialPosition, finalPosition);
      cosine = vec3.dot(initialPosition, finalPosition);

      if(cosine > 1.0){
        angle = 0.0;
      } else {
        angle = Math.acos(cosine);
      }

      vec3.cross(rotationAxis, initialPosition, finalPosition);
      vec3.normalize(rotationAxis, rotationAxis);

      if(mode){

        quat.setAxisAngle(initialRotation, rotationAxis, angle);
        quat.multiply(finalRotation,
                          initialRotation,
                              finalRotation);
        quat.normalize(finalRotation,
                          finalRotation);

        mat4.fromQuat(finalRotationMatrix, finalRotation);

      } else {
                        
        mat4.rotate(finalRotationMatrix, initialRotationMatrix, angle, rotationAxis);
        initialRotationMatrix = finalRotationMatrix;
      }

      initialPosition = finalPosition;

      // date = new Date();

      // finalTime = date.getTime();
      // angularVelocity = angle / (finalTime - initialTime);
      // initialTime = finalTime;
    }
  }

  /**
   * Sets a variable to stop keeping track of the mouse motion.
   */
  this.release = function(){
    mousePressed = false;
  }

  /**
   * Updates the configuration of the scene as the cursor is dragged across the widget.
   *
   * @return {Array} The current state of the rotation matrix.
   */
  this.rotation = function(){
    return finalRotationMatrix;
  }

  // this.start = function(){

  //  var xDelta;
  //  var yDelta;

  //  mousePressed = true;

  //  if(angularVelocity > 0){
       
  //    intervalID = setInterval(function(){
      
  //      xDelta = angularVelocity * 500 * vec3.dot(rotationAxis, [1, 0, 0]);
  //      yDelta = angularVelocity * 500 * vec3.dot(rotationAxis, [0, 1, 0]);

  //      move(finalPosition[0] + xDelta, finalPosition[1] + yDelta);
  //    }, 500);
  //  }
  // }

  // this.stop = function(){
  //  clearInterval(intervalID);
  // }
}
