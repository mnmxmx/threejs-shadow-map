float nGon(in float n, in vec2 p, in float r) {
    // these 2 lines can be precomputed
    float an = 6.2831853 / n;
    float he = r * tan(0.5 * an);

    // rotate to first sector
    p = -p.yx; // if you want the corner to be up
    float bn = an * floor((atan(p.y, p.x) + 0.5 * an) / an);
    vec2 cs = vec2(cos(bn), sin(bn));
    p = mat2(cs.x, -cs.y, cs.y, cs.x) * p;

    // side of polygon
    return length(p - vec2(r, clamp(p.y, -he, he))) * sign(p.x-r);
}

#pragma glslify: export(nGon)