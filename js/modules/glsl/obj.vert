varying vec3 vNormal;

uniform mat4 uShadowCameraP;
uniform mat4 uShadowCameraV;

varying vec4 vShadowCoord;

void main(){
    vNormal = normal;
    vec3 pos = position;

    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(pos, 1.0);
    vShadowCoord = uShadowCameraP * uShadowCameraV * modelMatrix * vec4(pos, 1.0);
}