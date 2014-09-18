# Trackball

> Enables accurate 3D rotations.

## Summary

When applying transformations in 3D space, stacking rotation matrices can lead to unintended consequences as a result of numerical error. The rotations become imprecise occasionally falling a full 180 degrees out of phase, and may cause additional anomalies such as gimbal lock. A solution to these and other unintended consequences is the use of a mathematical construct called [quaternions](http://en.wikipedia.org/wiki/Quaternion). These are four element tuples that extend the complex numbers. Each such four dimensional vector can represent a rotation in three dimensions, and can be converted to the associated rotation matrix. The quaternion offers several advantages for handling compositions of rotations over straight forward matrix multiplication, including ease of computation, compact representation, and solves the inaccuracies mentioned. Two rotations represented by quaternions can be composed into one by a vector product, a calculation that requires a fraction of the operations needed to perform the corresponding matrix multiplication. Also, since changing the magnitude of a quaternion will not affect the rotation it represents, after each composition of two rotations the resultant vector can be normalized before cast as a rotation matrix. This additional step removes the issues experienced with a straightforward matrix products, as numerical errors are smoothed out during normalization and do not accumulate. This module abstracts away the mathematics and applies quaternions to enable accurate user interaction of a rotation transform in a 3D scene. Additionally, vertex and fragment shaders are provided in the *example* that perform texturing.

## Setup

The dependencies are the [gl-matrix](https://github.com/toji/gl-matrix) matrix and javascript library, along with the [qunit](http://qunitjs.com) unit testing framework. To run the tests and verify everything is working correctly, navigate to the *runner.html* file in the tests directory with any modern browser. To avoid downloading these packages manually, the command

    bower install

will fetch the required libraries and place them into the *components* folder at the root directory. The [bower](http://bower.io) command requires [node.js](http://nodejs.org) to be installed.

    npm install bower

will download the package.

## Viewing

To checkout how this module can be used, open the contents of the *example* folder after all the dependencies have been successfully downloaded or just peep [demo](http://eugenekadish.github.io/trackball).

## Documentation

    __Trackball(__*mode*__,__*scene*__)__

    Wrapper for emulating rotation transformations. This method must be called in order to instantiate and make available all other functions. The transformation is internally stored based on the boolean *mode* parameter. Setting it to __true__ uses the intended quaternion representation. With __false__ the transformations will be done solely with matrix multiplication. This functionality could be used to quickly compare the advantages of the quaternion approach. The second parameter, *scene*, is the *canvas* tag the transformations will be used in. It provides dimensional parameters that are needed to accurately interpolate the cursor position.
    
    __this.orientation(__*v*__)__
    
    Calculates the angular proximity of six rectilinear unit vectors from *v*. Where *v* is a three dimensional vector represented simply as a three element array. The value returned is the index of the unit vector closest to *v* as enumerated in the list.

    0 : <  1,  0,  0 >
    1 : < -1,  0,  0 >
    2 : <  0,  1,  0 >
    3 : <  0, -1,  0 >
    4 : <  0,  0,  1 >
    5 : <  0,  0, -1 >

    This function can be useful in determining the relative state of the current transformation.

    __this.interpolate(__*xPos*__,__*yPos*__)__
    
    Maps the horizontal and vertical raw pixel coordinates of the cursor position to the range [-1, 1]. *xPos* and *yPos* are the horizontal and vertical pixel position of the cursor in the window respectively. The return value is a two element tuple, which is the horizontal and vertical pixel positions of the cursor mapped to the range [-1, 1].

    __this.push(__*xPos*__,__ *yPos*__)__
    
    Initializes internal state of the rotation transformation. *xPos* and *yPos* are the interpolated horizontal and vertical positions of the cursor each mapped to be in the range [-1, 1]. 

    this.move(*xPos*, *yPos*)
    
    Updates the internal state of the rotation transformation. *xPos* and *yPos* are the interpolated horizontal and vertical positions of the cursor, each have to be interpolated to be in the range [-1, 1]. 

    this.release()
    
    Disables updating of the internal state of the transformation.

## Usage

Include the source file

```html
   <script src="path/to/trackball.js"></script>
```

in the page. Typically the functions provided would be used in conjunction with native javascript or [jQuery](http://jquery.com) methods that enable user interaction. Here is a small snippet from the example using the package.

```javascript
  
  var scene = document.getElementById('scene');
    . . .

  var t = new Trackball(true);
```

```javascript
  
  var cursor;

  scene.onmousedown = function(event){

    cursor = t.interpolate(event.clientX, event.clientY);

    // t.stop();
    t.push(cursor[0], cursor[1]);
  };

  scene.onmousemove = function(event){

    cursor = t.interpolate(event.clientX, event.clientY);

    t.move(cursor[0], cursor[1]);
      
      . . .
  };

  document.onmouseup = function(event){
      
    t.release();
    // t.start();
  };

```