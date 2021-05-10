


#pragma glslify: hsv2rgb = require("./hsv2rgb.glsl")
#pragma glslify: random = require("./random.glsl")



vec3 sandy(vec2 st, float time){
    float snownoise = random(st + sin(time)) - 0.5;
    vec3 noiseHSV = vec3(snownoise, 1.0, 1.0);
    vec3 noiseRGB = hsv2rgb(noiseHSV);
    

    return noiseRGB;
}

#pragma glslify: export(sandy)