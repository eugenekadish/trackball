var t              = new Trackball(true, document.getElementById('scene'));
var rotationMatrix = mat4.create();

/**
 * Check that transformations are calculated correctly.
 */
QUnit.test(' Checking internal state of transformations.', function(assert){
   
  var t = new Trackball(true);

  t.push(0, 0);
  t.move(1, 0);

  t.release();

  rotationMatrix = t.rotation();
  
  // Minor rounding errors make for inaccurate rotation matrices, so things need to be fudged a bit.
  assert.ok(
    Math.abs(
      mat4.determinant([
                         rotationMatrix[0] - 0.0, rotationMatrix[1] - 0.0, rotationMatrix[2] + 1.0, rotationMatrix[3] - 0.0,
                         rotationMatrix[0] - 0.0, rotationMatrix[1] - 1.0, rotationMatrix[2] - 0.0, rotationMatrix[3] - 0.0,
                         rotationMatrix[0] - 1.0, rotationMatrix[1] - 0.0, rotationMatrix[2] - 0.0, rotationMatrix[3] - 0.0,
                         rotationMatrix[0] - 0.0, rotationMatrix[1] - 0.0, rotationMatrix[2] - 0.0, rotationMatrix[3] - 1.0 
                       ])
    ) < 0.001, ' The transformation was checked.'
  );

  assert.equal(2, t.orientation(vec3.fromValues(0, 1, 0)), ' The orientation was checked.');

  t = new Trackball(true);

  t.push(0, 0);
  t.move(0, 1);

  t.release();

  rotationMatrix = t.rotation();

  assert.ok(
    Math.abs(
      mat4.determinant([
                         rotationMatrix[0] - 1.0, rotationMatrix[1] - 0.0, rotationMatrix[2] + 1.0, rotationMatrix[3] - 0.0,
                         rotationMatrix[0] - 0.0, rotationMatrix[1] + 1.0, rotationMatrix[2] - 0.0, rotationMatrix[3] - 0.0,
                         rotationMatrix[0] - 1.0, rotationMatrix[1] - 0.0, rotationMatrix[2] - 0.0, rotationMatrix[3] - 0.0,
                         rotationMatrix[0] - 0.0, rotationMatrix[1] - 0.0, rotationMatrix[2] - 0.0, rotationMatrix[3] - 1.0 
                       ])
    ) < 0.001, ' The transformation was correct.'
  );

  assert.equal(3, t.orientation(vec3.fromValues(0, 0, 1)), ' The orientation was checked.');
});
