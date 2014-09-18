precision mediump float;
           
varying vec2 t;

uniform sampler2D sampler;
                   
void main(){
  gl_FragColor = texture2D(sampler, vec2(t.s, t.t));
}
