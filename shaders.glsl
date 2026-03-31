// vertex
attribute vec2 p;
void main() { gl_Position = vec4(p, 0.0, 1.0); }


// fragment
precision highp float;
uniform vec2 r;
uniform float t;
uniform vec3 s1p;
uniform vec3 s2p;
struct Hit { float d; vec3 n; vec3 c; float rf; };
float box(vec3 p, vec3 b) {
    vec3 q = abs(p) - b;
    return length(max(q, 0.0)) + min(max(q.x, max(q.y, q.z)), 0.0);
}
Hit scene(vec3 p) {
    float d = -box(p, vec3(5.0, 5.0, 10.0));
    Hit h = Hit(d, vec3(0), vec3(0.4), 0.1);
    float d1 = length(p - s1p) - 1.8;
    if(d1 < h.d) h = Hit(d1, normalize(p - s1p), vec3(0.1, 0.4, 1.0), 0.7);
    float d2 = length(p - s2p) - 1.4;
    if(d2 < h.d) h = Hit(d2, normalize(p - s2p), vec3(1.0, 0.1, 0.1), 0.9);
    return h;
}
vec3 get_n(vec3 p) {
    vec2 e = vec2(0.002, 0);
    return normalize(vec3(
        scene(p+e.xyy).d-scene(p-e.xyy).d,
        scene(p+e.yxy).d-scene(p-e.yxy).d,
        scene(p+e.yyx).d-scene(p-e.yyx).d
    ));
}
void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * r.xy) / min(r.y, r.x);
    vec3 ro = vec3(0, 0, 4);
    vec3 rd = normalize(vec3(uv, -1.2));
    vec3 col = vec3(0);
    vec3 atten = vec3(1.0);
    for(int b = 0; b < 3; b++) {
        float td = 0.0;
        Hit h;
        for(int i = 0; i < 64; i++) {
            h = scene(ro + rd * td);
            if(h.d < 0.002 || td > 25.0) break;
            td += h.d;
        }
        if(td > 25.0) break;
        vec3 p = ro + rd * td;
        vec3 n = get_n(p);
        vec3 lp[2]; lp[0] = vec3(3, 4, -4); lp[1] = vec3(-3, -4, -8);
        vec3 lc[2]; lc[0] = vec3(1, 0.9, 0.7); lc[1] = vec3(0.7, 0.8, 1);
        vec3 ds = vec3(0.02);
        for(int i = 0; i < 2; i++) {
            vec3 ld = normalize(lp[i] - p);
            float diff = max(dot(n, ld), 0.0);
            float dist = length(lp[i] - p);
            ds += lc[i] * diff * (5.0 / (dist * dist));
        }
        col += atten * h.c * ds;
        atten *= h.rf;
        ro = p + n * 0.01;
        rd = reflect(rd, n);
    }
    gl_FragColor = vec4(pow(col, vec3(0.4545)), 1.0);
}

// fragment GI
precision highp float;
uniform vec2 r;
uniform float t;
uniform vec3 s1p;
uniform vec3 s2p;
struct Hit { float d; vec3 n; vec3 c; float rf; };
float box(vec3 p, vec3 b) {
    vec3 q = abs(p) - b;
    return length(max(q, 0.0)) + min(max(q.x, max(q.y, q.z)), 0.0);
}
Hit scene(vec3 p) {
    float d = -box(p, vec3(5.0, 5.0, 10.0));
    Hit h = Hit(d, vec3(0), vec3(0.4), 0.1);
    float d1 = length(p - s1p) - 1.8;
    if(d1 < h.d) h = Hit(d1, normalize(p - s1p), vec3(0.1, 0.4, 1.0), 0.7);
    float d2 = length(p - s2p) - 1.4;
    if(d2 < h.d) h = Hit(d2, normalize(p - s2p), vec3(1.0, 0.1, 0.1), 0.9);
    return h;
}
vec3 get_n(vec3 p) {
    vec2 e = vec2(0.002, 0);
    return normalize(vec3(
        scene(p+e.xyy).d-scene(p-e.xyy).d,
        scene(p+e.yxy).d-scene(p-e.yxy).d,
        scene(p+e.yyx).d-scene(p-e.yyx).d
    ));
}
vec3 bounceLight(vec3 p, vec3 n) {
    vec3 gi = vec3(0.0);
    vec3 toB1 = s1p - p;
    float distB1 = length(toB1);
    float facingB1 = max(dot(n, toB1 / distB1), 0.0);
    float fallB1 = 1.0 / (1.0 + distB1 * distB1 * 0.08);
    gi += vec3(0.1, 0.4, 1.0) * facingB1 * fallB1 * 0.8;
    vec3 toB2 = s2p - p;
    float distB2 = length(toB2);
    float facingB2 = max(dot(n, toB2 / distB2), 0.0);
    float fallB2 = 1.0 / (1.0 + distB2 * distB2 * 0.08);
    gi += vec3(1.0, 0.1, 0.1) * facingB2 * fallB2 * 0.8;
    return gi;
}
void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * r.xy) / min(r.y, r.x);
    vec3 ro = vec3(0, 0, 4);
    vec3 rd = normalize(vec3(uv, -1.2));
    vec3 col = vec3(0);
    vec3 atten = vec3(1.0);
    for(int b = 0; b < 3; b++) {
        float td = 0.0;
        Hit h;
        for(int i = 0; i < 64; i++) {
            h = scene(ro + rd * td);
            if(h.d < 0.002 || td > 25.0) break;
            td += h.d;
        }
        if(td > 25.0) break;
        vec3 p = ro + rd * td;
        vec3 n = get_n(p);
        vec3 lp[2]; lp[0] = vec3(3, 4, -4); lp[1] = vec3(-3, -4, -8);
        vec3 lc[2]; lc[0] = vec3(1, 0.9, 0.7); lc[1] = vec3(0.7, 0.8, 1);
        vec3 ds = vec3(0.02);
        for(int i = 0; i < 2; i++) {
            vec3 ld = normalize(lp[i] - p);
            float diff = max(dot(n, ld), 0.0);
            float dist = length(lp[i] - p);
            ds += lc[i] * diff * (5.0 / (dist * dist));
        }
        ds += bounceLight(p, n);
        col += atten * h.c * ds;
        atten *= h.rf;
        ro = p + n * 0.01;
        rd = reflect(rd, n);
    }
    gl_FragColor = vec4(pow(col, vec3(0.4545)), 1.0);
}