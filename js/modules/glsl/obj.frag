uniform vec3 uColor;
uniform sampler2D uDepthMap;
uniform vec3 uLightPos;
uniform vec4 uIntensity_0;

varying vec3 vNormal;

varying vec4 vShadowCoord;

// https://github.com/mrdoob/three.js/blob/master/src/renderers/shaders/ShaderChunk/packing.glsl.js#L24
#include <packing>

void main(){
    float depth_shadowCoord = (vShadowCoord.z / vShadowCoord.w * 0.5 + 0.5);

    vec2 depthMapUv = vShadowCoord.xy / vShadowCoord.w * 0.5 + 0.5;
    float depth_depthMap = unpackRGBAToDepth(texture2D(uDepthMap, depthMapUv));

    float outShadowClip = step(0.999, depth_shadowCoord);
    float shadowFactor = min(1.0, step(depth_shadowCoord, depth_depthMap) + outShadowClip);

    float lighting = dot(normalize(uLightPos), vNormal);
    lighting = max(0.0, lighting);

    float shading = shadowFactor * lighting;
    
    vec3 color = vec3(0.0);

    if(uIntensity_0.x == 1.0){
        color = mix(uColor - 0.1, uColor + 0.1, shading);
    } 
    else if(uIntensity_0.y == 1.0){
        color = vec3(shading);
    }
    else if(uIntensity_0.z == 1.0){
        color = vec3(shadowFactor);
    }
    else if(uIntensity_0.w == 1.0){
        color = vec3(lighting);
    }


    gl_FragColor = vec4(color, 1.0);
}