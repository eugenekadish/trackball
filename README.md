# Trackball
> Accurately rotate a 3D scene. 

## What's this for?

Naively stacking rotation matrices result in some unintended effects as numeric errors pile up when very large numbers of rotation matrices are multiplied. The *Trackball* overcomes this with the use of a quaternion to represent the rotation. Using a quaternion has the added advantage that it can be normalized, which effectively resets the numerical error associated with the rotation.

## Set Up and Usage

In order to use *trackball.js* and run all the tests and examples it comes with, download [jquery](http://jquery.com/), [qunit](http://qunitjs.com/), and the [gl-matrix](https://github.com/toji/gl-matrix) matrix and vector javascript library. To avoid having to get these manually run

    bower install

to download the libraries into a folder called *components* at the root directory. Next, simply include the javascript file that contains this module in your page.

```html
   <script src="path/to/trackball.js"> </script>
```

*Trackball* provides methods to call when first pressing, moving, and releasing the mouse on the widget. For emulating the rotation the internal representation can be switched between the quaternion and a naive rotation matrix representation by setting the *mode* when initially creating the object. For example the following code will use a quaternion for the trackball.

```javascript
   var t = new Trackball(true);
```

Pass in *false* for the other mode and compare the great benefits that come with quaternions.