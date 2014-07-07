var rotationMatrix = mat4.create();

// Minor rounding errors make for inaccurate rotation matrices, so things need to be fudged a bit.
test(' Checking trackball transformations.', function(){
   
   var t = new Trackball(true);

   t.push(0, 0);
   t.move(1, 0);

   t.release();

   rotationMatrix = t.rotation();

   ok(
      Math.abs(
         mat4.determinant([rotationMatrix[0] - 0, rotationMatrix[1] - 0, rotationMatrix[2] + 1, rotationMatrix[3] - 0,
            rotationMatrix[0] - 0, rotationMatrix[1] - 1, rotationMatrix[2] - 0, rotationMatrix[3] - 0,
            rotationMatrix[0] - 1, rotationMatrix[1] - 0, rotationMatrix[2] - 0, rotationMatrix[3] - 0,
            rotationMatrix[0] - 0, rotationMatrix[1] - 0, rotationMatrix[2] - 0, rotationMatrix[3] - 1 ])
         ) < 0.001, ' The transformation was correct.'
      );

   t = new Trackball(true);

   t.push(0, 0);
   t.move(0, 1);

   t.release();

   rotationMatrix = t.rotation();

   ok(
      Math.abs(
         mat4.determinant([rotationMatrix[0] - 1, rotationMatrix[1] - 0, rotationMatrix[2] + 1, rotationMatrix[3] - 0,
            rotationMatrix[0] - 0, rotationMatrix[1] + 1, rotationMatrix[2] - 0, rotationMatrix[3] - 0,
            rotationMatrix[0] - 1, rotationMatrix[1] - 0, rotationMatrix[2] - 0, rotationMatrix[3] - 0,
            rotationMatrix[0] - 0, rotationMatrix[1] - 0, rotationMatrix[2] - 0, rotationMatrix[3] - 1 ])
         ) < 0.001, ' The transformation was correct.'
      );
});