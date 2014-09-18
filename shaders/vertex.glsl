attribute vec4 vertex;
attribute vec2 texture;
                
uniform mat4 projection;
uniform mat4 modelview; 
                
varying vec2 t;

void main(){
  t = texture;
  gl_Position = projection * modelview * vertex;
}
