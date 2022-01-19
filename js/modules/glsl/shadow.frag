// https://github.com/mrdoob/three.js/blob/master/src/renderers/shaders/ShaderChunk/packing.glsl.js#L18
#include <packing>

void main(){
    gl_FragColor = packDepthToRGBA(gl_FragCoord.z);
}