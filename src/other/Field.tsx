import {useThree} from '@react-three/fiber';
import {useLayoutEffect, useMemo, useRef} from 'react';
import {useCurrentFrame} from 'remotion';
import * as THREE from 'three';
import {RoomEnvironment} from 'three/examples/jsm/environments/RoomEnvironment.js';
import {RoundedBoxGeometry} from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import {
  BEAT,
  COLS,
  ECG_ROW,
  HERO,
  ROWS,
  SPACING,
  VIGNETTES,
  cameraAt,
  cellX,
  cellZ,
  clamp01,
  ease,
  pop,
  smooth,
} from './timeline';

const WARM = new THREE.Color('#ff6a12').multiplyScalar(2.2);
const COUNT = COLS * ROWS;

const hash = (n: number) => {
  const s = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s);
};

/** Heartbeat trace along the ECG row: small p/t bumps and a tall QRS spike. */
const ecg = (i: number) => {
  const period = 22;
  const p = (((i - HERO.i + 4) % period) + period) % period;
  const g = (c: number, w: number, a: number) => a * Math.exp(-((p - c) ** 2) / (2 * w * w));
  return g(3, 1.1, 0.5) + g(8, 0.45, -0.6) + g(9.3, 0.5, 4.2) + g(10.6, 0.45, -0.9) + g(15, 1.6, 0.9);
};

/** Frame at which each cell lights up as part of the final pattern (Infinity if never). */
const buildPathTimes = () => {
  const times = new Float32Array(COUNT).fill(Infinity);
  const idx = (i: number, j: number) => j * COLS + i;
  const start = BEAT.wave + 22;
  VIGNETTES.forEach((v, k) => {
    const s = start + k * 5;
    const dir = Math.sign(ECG_ROW - v.j);
    for (let j = v.j, n = 0; j !== ECG_ROW; j += dir, n++) {
      times[idx(v.i, j)] = Math.min(times[idx(v.i, j)], s + n * 1.3);
    }
  });
  // Heartbeat row spreads out from the hero cube once the branches arrive.
  const rowStart = start + 16;
  for (let i = 0; i < COLS; i++) {
    times[idx(i, ECG_ROW)] = Math.min(times[idx(i, ECG_ROW)], rowStart + Math.abs(i - HERO.i) * 0.55);
  }
  return times;
};

const haloTexture = () => {
  const c = document.createElement('canvas');
  c.width = c.height = 256;
  const g = c.getContext('2d')!;
  const grad = g.createRadialGradient(128, 128, 0, 128, 128, 128);
  grad.addColorStop(0, 'rgba(255,214,160,1)');
  grad.addColorStop(0.18, 'rgba(255,160,80,0.55)');
  grad.addColorStop(0.5, 'rgba(255,120,50,0.12)');
  grad.addColorStop(1, 'rgba(255,100,40,0)');
  g.fillStyle = grad;
  g.fillRect(0, 0, 256, 256);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
};

// ---------- Vignette geometry ----------

const extrudeOpts = {depth: 0.32, bevelEnabled: true, bevelThickness: 0.1, bevelSize: 0.07, bevelSegments: 6, curveSegments: 40};

const moonGeometry = () => {
  const s = new THREE.Shape();
  s.absarc(0, 0, 1, Math.PI / 3, (5 * Math.PI) / 3, false);
  s.absarc(0.5, 0, Math.sqrt(3) / 2, (3 * Math.PI) / 2, Math.PI / 2, true);
  const g = new THREE.ExtrudeGeometry(s, extrudeOpts);
  g.center();
  return g;
};

const boltGeometry = () => {
  const pts = [
    [-0.05, 1.3],
    [-0.62, -0.08],
    [-0.08, -0.08],
    [-0.36, -1.3],
    [0.62, 0.28],
    [0.06, 0.28],
    [0.38, 1.3],
  ];
  const s = new THREE.Shape(pts.map(([x, y]) => new THREE.Vector2(x, y)));
  const g = new THREE.ExtrudeGeometry(s, {...extrudeOpts, bevelSegments: 4});
  g.center();
  return g;
};

const glossy = (color: string, extra: Partial<THREE.MeshPhysicalMaterialParameters> = {}) =>
  new THREE.MeshPhysicalMaterial({
    fog: false,
    color,
    roughness: 0.18,
    metalness: 0.05,
    clearcoat: 1,
    clearcoatRoughness: 0.06,
    envMapIntensity: 1.4,
    ...extra,
  });

const Vignette: React.FC<{kind: string; i: number; j: number; at: number}> = ({kind, i, j, at}) => {
  const frame = useCurrentFrame();
  const mats = useMemo(
    () => ({
      moon: glossy('#f3e3c4', {emissive: '#6a5530', emissiveIntensity: 0.25}),
      plate: glossy('#f6f1ea'),
      rim: glossy('#d9b58a', {metalness: 0.6, roughness: 0.22}),
      steel: glossy('#c9c4bd', {metalness: 1, roughness: 0.25}),
      bolt: glossy('#ffb43a', {emissive: '#ff8a1f', emissiveIntensity: 0.35}),
      q: glossy('#ff6e55', {emissive: '#a02a18', emissiveIntensity: 0.3}),
    }),
    [],
  );
  const geo = useMemo(
    () => ({
      moon: moonGeometry(),
      bolt: boltGeometry(),
      plate: new THREE.CylinderGeometry(1.05, 0.8, 0.12, 64),
      rim: new THREE.TorusGeometry(1.02, 0.09, 24, 80),
      utensil: new THREE.BoxGeometry(0.1, 1.5, 0.05),
      qArc: new THREE.TorusGeometry(0.5, 0.17, 24, 64, Math.PI * 1.5),
      qStem: new THREE.CylinderGeometry(0.17, 0.17, 0.42, 24),
      qDot: new THREE.SphereGeometry(0.2, 32, 32),
    }),
    [],
  );

  const s = Math.max(0, pop(frame, at, 0.9));
  if (frame < at) return null;
  const t = frame - at;
  const rise = 1 - Math.exp(-t / 6);
  // Glow boost during the connecting wave.
  const lit = ease(frame, BEAT.wave + 16, 30) * (1 - 0.4 * ease(frame, BEAT.logo - 20, 20));
  Object.values(mats).forEach((m) => {
    (m as THREE.MeshPhysicalMaterial).emissiveIntensity = 0.45 + lit * 1.2;
  });

  const y = 1.2 + rise * 2.8 + Math.sin((frame + i * 7) / 18) * 0.12;
  const spin = (1 - rise) * Math.PI * 1.4 + Math.sin((frame + j * 5) / 34) * 0.35;

  return (
    <group position={[cellX(i), y, cellZ(j)]} scale={s * 1.7} rotation={[0, spin, 0]}>
      {kind === 'moon' && <mesh geometry={geo.moon} material={mats.moon} rotation={[0, 0, -0.35]} />}
      {kind === 'bolt' && <mesh geometry={geo.bolt} material={mats.bolt} rotation={[0, 0, 0.12]} />}
      {kind === 'plate' && (
        <group rotation={[1.05, 0, 0]}>
          <mesh geometry={geo.plate} material={mats.plate} />
          <mesh geometry={geo.rim} material={mats.rim} rotation={[Math.PI / 2, 0, 0]} position={[0, 0.06, 0]} />
          <mesh geometry={geo.utensil} material={mats.steel} position={[-1.35, 0, 0]} rotation={[Math.PI / 2, 0, 0]} />
          <mesh geometry={geo.utensil} material={mats.steel} position={[1.35, 0, 0]} rotation={[Math.PI / 2, 0, 0]} />
        </group>
      )}
      {kind === 'question' && (
        <group position={[0, -0.1, 0]}>
          <mesh geometry={geo.qArc} material={mats.q} position={[0, 0.55, 0]} rotation={[0, 0, -Math.PI / 2]} />
          <mesh geometry={geo.qStem} material={mats.q} position={[0, -0.16, 0]} />
          <mesh geometry={geo.qDot} material={mats.q} position={[0, -0.72, 0]} />
        </group>
      )}
    </group>
  );
};

// ---------- The field ----------

export const Field: React.FC = () => {
  const frame = useCurrentFrame();
  const {scene, gl, camera} = useThree();
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const heroRef = useRef<THREE.Mesh>(null);
  const haloRef = useRef<THREE.Sprite>(null);
  const heroLight = useRef<THREE.PointLight>(null);
  const waveLight = useRef<THREE.PointLight>(null);

  const {geometry, material, glow, pathTimes, heroMat, heroGeo, halo, gridMat} = useMemo(() => {
    const geometry = new RoundedBoxGeometry(0.86, 0.86, 0.86, 2, 0.14);
    const glow = new THREE.InstancedBufferAttribute(new Float32Array(COUNT), 1);
    geometry.setAttribute('aGlow', glow);
    const material = new THREE.MeshPhysicalMaterial({
      color: '#1b1714',
      roughness: 0.28,
      metalness: 0.4,
      clearcoat: 0.8,
      clearcoatRoughness: 0.15,
      envMapIntensity: 0.35,
    });
    material.onBeforeCompile = (shader) => {
      shader.uniforms.uWarm = {value: WARM};
      shader.vertexShader = shader.vertexShader
        .replace('#include <common>', '#include <common>\nattribute float aGlow;\nvarying float vGlow;')
        .replace('#include <begin_vertex>', '#include <begin_vertex>\nvGlow = aGlow;');
      shader.fragmentShader = shader.fragmentShader
        .replace('#include <common>', '#include <common>\nuniform vec3 uWarm;\nvarying float vGlow;')
        .replace(
          '#include <emissivemap_fragment>',
          '#include <emissivemap_fragment>\ntotalEmissiveRadiance += uWarm * vGlow;',
        );
    };
    const heroGeo = new RoundedBoxGeometry(0.86, 0.86, 0.86, 5, 0.16);
    const heroMat = new THREE.MeshPhysicalMaterial({
      color: '#ff8a2a',
      emissive: '#ff5200',
      emissiveIntensity: 0,
      roughness: 0.12,
      metalness: 0.1,
      clearcoat: 1,
      clearcoatRoughness: 0.03,
      envMapIntensity: 1.5,
      fog: false,
    });
    // Faint grid lines glowing between the cubes.
    const gridMat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {uOpacity: {value: 0}, uCam: {value: new THREE.Vector3()}},
      vertexShader: `varying vec3 vW; void main(){ vec4 w = modelMatrix*vec4(position,1.0); vW=w.xyz; gl_Position=projectionMatrix*viewMatrix*w; }`,
      fragmentShader: `uniform float uOpacity; uniform vec3 uCam; varying vec3 vW;
        void main(){
          vec2 g = abs(fract(vW.xz/${SPACING.toFixed(2)} + 0.5) - 0.5) * ${SPACING.toFixed(2)};
          float l = 1.0 - smoothstep(0.0, 0.035, min(g.x, g.y));
          float d = length(vW.xz - uCam.xz);
          float fade = exp(-d*0.03);
          gl_FragColor = vec4(vec3(1.0,0.55,0.25) * l * fade * uOpacity, 1.0);
        }`,
    });
    return {geometry, material, glow, pathTimes: buildPathTimes(), heroGeo, heroMat, halo: haloTexture(), gridMat};
  }, []);

  // Scene setup (once).
  useLayoutEffect(() => {
    gl.toneMapping = THREE.ACESFilmicToneMapping;
    gl.toneMappingExposure = 1.05;
    scene.background = new THREE.Color('#050404');
    scene.fog = new THREE.FogExp2('#050404', 0.028);
    const pmrem = new THREE.PMREMGenerator(gl);
    scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  }, [gl, scene]);

  // Per-frame update.
  useLayoutEffect(() => {
    const {pos, target} = cameraAt(frame);
    camera.position.set(...pos);
    camera.lookAt(...target);
    (camera as THREE.PerspectiveCamera).fov = 38;
    camera.updateProjectionMatrix();
    gridMat.uniforms.uCam.value.set(...pos);
    (scene.fog as THREE.FogExp2).density = 0.028 - 0.016 * ease(frame, BEAT.wave, 50);
    gridMat.uniforms.uOpacity.value = ease(frame, 20, 60) * (0.35 + 0.35 * ease(frame, BEAT.wave, 40));

    const mesh = meshRef.current!;
    const m = new THREE.Matrix4();
    const q = new THREE.Quaternion();
    const e = new THREE.Euler();
    const p = new THREE.Vector3();
    const sc = new THREE.Vector3();

    const heroX = cellX(HERO.i);
    const heroZ = cellZ(HERO.j);
    const waveStart = BEAT.wave;
    const waveR = (frame - waveStart) * 2.6;
    const sweepPulse = ease(frame, BEAT.sweep + 10, 30) * (1 - ease(frame, BEAT.pops + 20, 30));
    const endFade = ease(frame, BEAT.logo - 14, 14);

    for (let j = 0; j < ROWS; j++) {
      for (let i = 0; i < COLS; i++) {
        const n = j * COLS + i;
        const x = cellX(i);
        const z = cellZ(j);
        const h = hash(n);

        // Beat 1: rows rise out of the dark, near to far.
        const arrive = clamp01((frame - (j * 0.9 + h * 14)) / 22);
        const a = smooth(arrive);
        let y = 0.43 - (1 - a) * 2.2;
        let s = 0.25 + 0.75 * a;
        let g = (1 - a) * a * 1.6 * (h > 0.7 ? 1 : 0.2); // sparkle on arrival

        // Ambient breathing, stronger during beat 3.
        const breath = 0.5 + 0.5 * Math.sin(frame / 11 + h * 40 + j * 0.25);
        g += breath * (0.015 + sweepPulse * 0.12);

        // Beat 6: radial wave of warm light.
        if (frame >= waveStart) {
          const d = Math.hypot(x - heroX, z - heroZ);
          const k = (d - waveR) / 3.2;
          g += Math.exp(-k * k) * 1.6;
          y += Math.exp(-k * k) * 0.35;
          // What the wave leaves behind: a soft warm residue.
          if (waveR > d) g += 0.02;
        }

        // Pattern: branches + heartbeat row.
        const pt = pathTimes[n];
        if (frame >= pt) {
          const on = clamp01((frame - pt) / 6);
          g += on * (1.1 + 0.3 * Math.sin((frame - pt) / 5));
          if (j === ECG_ROW) {
            const lift = ecg(i);
            y += on * Math.max(lift, -0.4) * 0.85;
            g += on * Math.max(0, lift) * 0.35;
          }
        }

        // Vignette cells lift slightly and glow.
        for (const v of VIGNETTES) {
          if (v.i === i && v.j === j && frame >= v.at) {
            const r = pop(frame, v.at - 4, 0.8);
            y += r * 0.7;
            g += 0.5 * clamp01(r);
          }
        }

        // The hero cube leaves the grid while it floats (beats 2–3).
        if (i === HERO.i && j === HERO.j && frame >= BEAT.hour && frame < BEAT.sweep + 60) s = 0;

        g *= 1 - endFade * 0.3;
        p.set(x, y, z);
        e.set(0, 0, 0);
        q.setFromEuler(e);
        sc.set(s, s, s);
        m.compose(p, q, sc);
        mesh.setMatrixAt(n, m);
        glow.array[n] = g;
      }
    }
    mesh.instanceMatrix.needsUpdate = true;
    glow.needsUpdate = true;

    // Hero cube: rises, ignites, then sinks back into the field.
    const hero = heroRef.current!;
    const up = ease(frame, BEAT.hour + 4, 44, (t) => 1 - Math.pow(1 - t, 3));
    const down = ease(frame, BEAT.sweep + 14, 44);
    const ignite = ease(frame, BEAT.hour + 26, 26) * (1 - 0.75 * down);
    const visible = frame >= BEAT.hour && frame < BEAT.sweep + 60;
    hero.visible = visible;
    const hy = 0.43 + (up - down) * 3.6 + Math.sin(frame / 20) * 0.08 * (up - down);
    const hs = 1 + 0.9 * (up - down) + 0.08 * Math.max(0, pop(frame, BEAT.hour + 26) - 1);
    hero.position.set(heroX, hy, heroZ);
    hero.scale.setScalar(hs);
    hero.rotation.set(0.35 * (up - down), frame / 40, 0.2 * (up - down));
    heroMat.emissiveIntensity = ignite * 1.5;
    const halo_ = haloRef.current!;
    halo_.visible = visible || frame >= BEAT.wave;
    halo_.position.set(heroX, visible ? hy : 1.2, heroZ);
    const haloAmt = visible ? ignite : 0.9 * ease(frame, BEAT.wave + 10, 20) * (1 - endFade);
    halo_.scale.setScalar((visible ? 7 : 14) * (0.6 + 0.4 * haloAmt) + Math.sin(frame / 9) * 0.2);
    (halo_.material as THREE.SpriteMaterial).opacity = haloAmt * 0.95;
    heroLight.current!.position.set(heroX, visible ? hy : 2, heroZ);
    heroLight.current!.intensity = visible ? ignite * 40 : 0;

    // Wave light travels with the front.
    const wl = waveLight.current!;
    const wOn = frame >= waveStart ? ease(frame, waveStart, 8) * (1 - ease(frame, waveStart + 60, 40)) : 0;
    wl.position.set(heroX, 3, heroZ);
    wl.intensity = wOn * 200;
    wl.distance = Math.max(10, waveR + 10);
  }, [frame, scene, camera, glow, gridMat, heroMat, pathTimes]);

  return (
    <>
      <ambientLight intensity={0.15} color="#ffe9d6" />
      <directionalLight position={[-20, 25, -40]} intensity={1.6} color="#ffb77a" />
      <directionalLight position={[20, 12, 20]} intensity={0.35} color="#d7e0ff" />
      <pointLight ref={heroLight} color="#ff9e52" distance={22} decay={1.6} />
      <pointLight ref={waveLight} color="#ff9a4a" decay={1.2} />

      <instancedMesh ref={meshRef} args={[geometry, material, COUNT]} frustumCulled={false} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.005, -40]} material={gridMat}>
        <planeGeometry args={[200, 140]} />
      </mesh>

      <mesh ref={heroRef} geometry={heroGeo} material={heroMat} />
      <sprite ref={haloRef}>
        <spriteMaterial map={halo} transparent depthWrite={false} blending={THREE.AdditiveBlending} />
      </sprite>

      {VIGNETTES.map((v) => (
        <Vignette key={v.kind} {...v} />
      ))}
    </>
  );
};
