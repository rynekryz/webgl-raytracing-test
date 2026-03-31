const VS = `
attribute vec2 p;
void main() { gl_Position = vec4(p, 0.0, 1.0); }
`;

const FS_BASE = `
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
`;

const FS_GI = `
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
`;

const canvas = document.getElementById('c');
const gl = canvas.getContext('webgl');

const compile = (type, src) => {
  const sh = gl.createShader(type);
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  return sh;
};

const vbo = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,3,-1,-1,3]), gl.STATIC_DRAW);

function buildProg(fsSrc) {
  const p = gl.createProgram();
  gl.attachShader(p, compile(gl.VERTEX_SHADER, VS));
  gl.attachShader(p, compile(gl.FRAGMENT_SHADER, fsSrc));
  gl.linkProgram(p);
  return p;
}

function setupProg(p) {
  gl.useProgram(p);
  gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
  const loc = gl.getAttribLocation(p, 'p');
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  return {
    uR:  gl.getUniformLocation(p, 'r'),
    uT:  gl.getUniformLocation(p, 't'),
    uS1: gl.getUniformLocation(p, 's1p'),
    uS2: gl.getUniformLocation(p, 's2p'),
  };
}

const progBase = buildProg(FS_BASE);
const progGI   = buildProg(FS_GI);
const uBase = setupProg(progBase);
const uGI   = setupProg(progGI);

let giOn = false;
let activeProg = progBase;
let u = uBase;

const ext = gl.getExtension('WEBGL_debug_renderer_info');
const gpuName = ext ? gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) : 'Unknown';
document.getElementById('v-gpu').textContent = gpuName.length > 18 ? gpuName.substring(0, 18) + '…' : gpuName;

const G_VAL = 0.022;
const AIR_DRAG = 0.992;
const RESTITUTION = 0.58;
const FRICTION = 0.80;
const BALL_RESTITUTION = 0.70;
const BOUNDS = { x: 5, y: 5, zNear: 0, zFar: -10 };
let balls = [
  { p:{x:0, y:-1, z:-6}, v:{x:0,y:0,z:0}, r:1.8 },
  { p:{x:1.5,y: 1, z:-7}, v:{x:0,y:0,z:0}, r:1.4 }
];
let physics = false;
let gravOn = false;
let gravityVec = { x:0, y:-G_VAL };

function onMotion(e) {
  const a = e.accelerationIncludingGravity;
  if (!a) return;
  gravityVec.x = -(a.x || 0) * 0.0022;
  gravityVec.y = -(a.y || 0) * 0.0022;
}
function startGrav() {
  gravOn = true;
  btnGrav.classList.add('active');
  btnGrav.textContent = 'Gravity On';
  window.addEventListener('devicemotion', onMotion);
}
function stopGrav() {
  gravOn = false;
  btnGrav.classList.remove('active');
  btnGrav.textContent = 'Gravity sensor';
  gravityVec = { x:0, y:-G_VAL };
  window.removeEventListener('devicemotion', onMotion);
}
function enableGrav() {
  if (typeof DeviceMotionEvent !== 'undefined' && typeof DeviceMotionEvent.requestPermission === 'function') {
    DeviceMotionEvent.requestPermission().then(s => { if (s === 'granted') startGrav(); }).catch(() => {});
  } else if ('DeviceMotionEvent' in window) {
    startGrav();
  }
}

const btnGI      = document.getElementById('btn-gi');
const btnPhysics = document.getElementById('btn-physics');
const btnGrav    = document.getElementById('btn-grav');
const hint       = document.getElementById('hint');

btnGI.onclick = () => {
  giOn = !giOn;
  btnGI.classList.toggle('active', giOn);
  activeProg = giOn ? progGI : progBase;
  u = giOn ? uGI : uBase;
  setupProg(activeProg);
};

btnPhysics.onclick = () => {
  physics = !physics;
  btnPhysics.classList.toggle('active', physics);
  btnGrav.disabled = !physics;
  if (!physics) stopGrav();
  hint.style.opacity = physics ? '1' : '0';
  if (physics) setTimeout(() => { hint.style.opacity = '0'; }, 3000);
};

btnGrav.onclick = () => { if (!gravOn) enableGrav(); else stopGrav(); };

let drag = null, dragZ = -6, mx = 0, my = 0, pmx = 0, pmy = 0, downX = 0, downY = 0, downT = 0, lastMoveT = 0;
function getXY(e) {
  const rect = canvas.getBoundingClientRect();
  const src = e.touches ? e.touches[0] : e;
  return {
    x: (src.clientX - rect.left) * canvas.width / rect.width,
    y: (src.clientY - rect.top) * canvas.height / rect.height
  };
}
function getRay(x, y) {
  const uvx = (x - 0.5 * canvas.width) / Math.min(canvas.height, canvas.width);
  const uvy = -(y - 0.5 * canvas.height) / Math.min(canvas.height, canvas.width);
  const len = Math.sqrt(uvx*uvx + uvy*uvy + 1.44);
  return { o:{x:0,y:0,z:4}, d:{x:uvx/len, y:uvy/len, z:-1.2/len} };
}
function intersect(ro, rd, center, r) {
  const ox=ro.x-center.x, oy=ro.y-center.y, oz=ro.z-center.z;
  const b = ox*rd.x + oy*rd.y + oz*rd.z;
  const c = ox*ox + oy*oy + oz*oz - r*r;
  const disc = b*b - c;
  if (disc < 0) return -1;
  const sq = Math.sqrt(disc);
  const t0 = -b - sq;
  return t0 > 0.001 ? t0 : -b + sq;
}
function onDown(e) {
  e.preventDefault();
  const {x,y} = getXY(e);
  downX = pmx = mx = x;
  downY = pmy = my = y;
  downT = lastMoveT = performance.now();
  if (!physics) return;
  const ray = getRay(x, y);
  let best = Infinity; drag = null;
  balls.forEach(b => {
    const t = intersect(ray.o, ray.d, b.p, b.r);
    if (t > 0 && t < best) { best = t; drag = b; dragZ = b.p.z; }
  });
  if (drag) drag.v = {x:0,y:0,z:0};
}
function onMove(e) {
  e.preventDefault();
  const {x,y} = getXY(e);
  pmx = mx; pmy = my; mx = x; my = y; lastMoveT = performance.now();
  if (!drag) return;
  const ray = getRay(mx, my);
  const tPlane = (4 - dragZ) / (-ray.d.z || 0.0001);
  drag.p.x = ray.o.x + ray.d.x * tPlane;
  drag.p.y = ray.o.y + ray.d.y * tPlane;
  drag.p.z = dragZ;
  drag.v = {x:0,y:0,z:0};
}
function onUp(e) {
  e.preventDefault();
  if (!physics) return;
  const now = performance.now();
  const dx = mx - downX, dy = my - downY;
  const moveDist = Math.sqrt(dx*dx + dy*dy);
  const duration = now - downT;
  if (drag) {
    const age = now - lastMoveT;
    const isTap = moveDist < 12 && duration < 220;
    if (isTap) {
      drag.v.x = (Math.random() - 0.5) * 0.08;
      drag.v.y = (Math.random() - 0.5) * 0.08;
      drag.v.z = -(2.5 + Math.random() * 1.0);
    } else {
      if (age < 100) {
        const scale = Math.min(1.0, 80 / Math.max(age, 1));
        drag.v.x = (mx - pmx) * 0.07 * scale;
        drag.v.y = -(my - pmy) * 0.07 * scale;
      }
    }
    drag = null;
  }
}
canvas.addEventListener('mousedown', onDown, {passive:false});
canvas.addEventListener('mousemove', onMove, {passive:false});
canvas.addEventListener('mouseup', onUp, {passive:false});
canvas.addEventListener('touchstart', onDown, {passive:false});
canvas.addEventListener('touchmove', onMove, {passive:false});
canvas.addEventListener('touchend', onUp, {passive:false});

function collide(a, b) {
  const dx=b.p.x-a.p.x, dy=b.p.y-a.p.y, dz=b.p.z-a.p.z;
  const dist = Math.sqrt(dx*dx+dy*dy+dz*dz);
  const minD = a.r + b.r;
  if (dist >= minD || dist < 0.0001) return;
  const nx=dx/dist, ny=dy/dist, nz=dz/dist;
  const overlap = (minD - dist) * 0.5;
  a.p.x -= nx*overlap; a.p.y -= ny*overlap; a.p.z -= nz*overlap;
  b.p.x += nx*overlap; b.p.y += ny*overlap; b.p.z += nz*overlap;
  const dvx=a.v.x-b.v.x, dvy=a.v.y-b.v.y, dvz=a.v.z-b.v.z;
  const vn = dvx*nx + dvy*ny + dvz*nz;
  if (vn <= 0) return;
  const imp = vn * (1 + BALL_RESTITUTION) * 0.5;
  a.v.x -= imp*nx; a.v.y -= imp*ny; a.v.z -= imp*nz;
  b.v.x += imp*nx; b.v.y += imp*ny; b.v.z += imp*nz;
  const tx=dvx-vn*nx, ty=dvy-vn*ny, tz=dvz-vn*nz;
  const fr = 0.08;
  a.v.x -= tx*fr; a.v.y -= ty*fr; a.v.z -= tz*fr;
  b.v.x += tx*fr; b.v.y += ty*fr; b.v.z += tz*fr;
}
function bounce(b, axis, wallV, sign) {
  b.v[axis] = Math.abs(b.v[axis]) * sign * RESTITUTION;
  b.p[axis] = wallV;
  const axes = ['x','y','z'].filter(a => a !== axis);
  axes.forEach(a => { b.v[a] *= FRICTION; });
}
function update() {
  balls.forEach(b => {
    if (drag === b) return;
    b.v.x += gravityVec.x; b.v.y += gravityVec.y;
    b.v.x *= AIR_DRAG; b.v.y *= AIR_DRAG; b.v.z *= AIR_DRAG;
    b.p.x += b.v.x; b.p.y += b.v.y; b.p.z += b.v.z;
    const bx = BOUNDS.x - b.r, by = BOUNDS.y - b.r;
    if (b.p.x > bx) bounce(b, 'x', bx, -1);
    if (b.p.x < -bx) bounce(b, 'x', -bx, 1);
    if (b.p.y > by) bounce(b, 'y', by, -1);
    if (b.p.y < -by) bounce(b, 'y', -by, 1);
    const zN = BOUNDS.zNear - b.r, zF = BOUNDS.zFar + b.r;
    if (b.p.z > zN) bounce(b, 'z', zN, -1);
    if (b.p.z < zF) bounce(b, 'z', zF, 1);
    const s = Math.abs(b.v.x)+Math.abs(b.v.y)+Math.abs(b.v.z);
    if (s < 0.0005) { b.v.x=0; b.v.y=0; b.v.z=0; }
  });
  collide(balls[0], balls[1]);
}

let lt=0, frames=0, ft=0;
const vFps = document.getElementById('v-fps'), vMs = document.getElementById('v-ms'), vRes = document.getElementById('v-res');
function resize() {
  if (canvas.width!==window.innerWidth || canvas.height!==window.innerHeight) {
    canvas.width = window.innerWidth; canvas.height = window.innerHeight;
    gl.viewport(0, 0, canvas.width, canvas.height);
  }
}
function draw(now) {
  const dt = now - lt; lt = now;
  frames++;
  if (now > ft + 1000) {
    vFps.textContent = frames; vMs.textContent = dt.toFixed(2) + ' ms';
    vRes.textContent = `${canvas.width}×${canvas.height}`;
    ft = now; frames = 0;
  }
  resize();
  const T = now * 0.001;
  if (!physics) {
    balls[0].p = {x: 2.5*Math.sin(T), y:-3, z:-6};
    balls[1].p = {x: 2.5*Math.cos(T), y: 2, z:-8};
  } else {
    update();
  }
  gl.useProgram(activeProg);
  gl.uniform2f(u.uR, canvas.width, canvas.height);
  gl.uniform1f(u.uT, T);
  gl.uniform3f(u.uS1, balls[0].p.x, balls[0].p.y, balls[0].p.z);
  gl.uniform3f(u.uS2, balls[1].p.x, balls[1].p.y, balls[1].p.z);
  gl.drawArrays(gl.TRIANGLES, 0, 3);
  requestAnimationFrame(draw);
}
resize();
requestAnimationFrame(draw);