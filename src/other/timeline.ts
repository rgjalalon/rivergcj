import {Easing, interpolate} from 'remotion';

export const FPS = 30;
export const W = 1920;
export const H = 1080;
export const DURATION = 990; // 33s

/** Beat boundaries in frames (30fps). */
export const BEAT = {
  field: 0, // 1: the field of 8,760 cubes
  hour: 120, // 2: one cube ignites
  sweep: 285, // 3: back over the dark field
  pops: 390, // 4: vignettes pop up
  signals: 510, // 5: "It happens in the other 8,759"
  wave: 630, // 6: wave of warm light, noise -> signal
  tagline: 750, // 7a: Wai. Care for the other 8,759 hours.
  logo: 858, // 7b: logo end card
};

// Field: 120 x 73 = 8,760 cubes, one per hour of the year.
export const COLS = 120;
export const ROWS = 73;
export const SPACING = 1.2;
export const cellX = (i: number) => (i - (COLS - 1) / 2) * SPACING;
export const cellZ = (j: number) => -j * SPACING;

// The hero cube and the heartbeat row it belongs to.
export const HERO = {i: 60, j: 17};
export const ECG_ROW = HERO.j;

export const VIGNETTES = [
  {kind: 'moon', i: 48, j: 9, at: 398, label: 'restless night'},
  {kind: 'plate', i: 70, j: 7, at: 414, label: 'skipped meal'},
  {kind: 'bolt', i: 54, j: 28, at: 430, label: 'stress spike'},
  {kind: 'question', i: 75, j: 25, at: 446, label: '2:00 am'},
] as const;

export const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

export const ease = (
  frame: number,
  start: number,
  duration: number,
  easing: (t: number) => number = Easing.bezier(0.45, 0, 0.2, 1),
) =>
  interpolate(frame, [start, start + duration], [0, 1], {
    easing,
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

/** Damped spring 0 -> 1 with a playful overshoot. */
export const pop = (frame: number, start: number, stiffness = 1) => {
  const t = (frame - start) / 30;
  if (t <= 0) return 0;
  const w = 14 * stiffness;
  return 1 - Math.exp(-6.5 * t) * Math.cos(w * t);
};

export const smooth = (t: number) => t * t * (3 - 2 * t);

// Camera keyframes: [frame, position, target]
type V3 = [number, number, number];
const KEYS: [number, V3, V3][] = [
  [0, [0, 2.6, 16], [0, 1.2, -40]],
  [112, [6, 4.2, 7], [0, 1.4, -30]],
  [158, [4.6, 4.3, -8.6], [-1.6, 3.7, -20.4]],
  [280, [3.4, 4.5, -11.2], [-1.4, 3.9, -20.4]],
  [336, [-7, 13, 11], [0, 0, -30]],
  [388, [-4.5, 13.5, 12.5], [0, 0, -32]],
  [428, [0.5, 16.5, 18], [1.5, 0, -21]],
  [505, [1.5, 15.5, 15], [1.5, 0.5, -21]],
  [625, [1.5, 13, 10], [2, 1, -21]],
  [700, [0, 33, 13], [0.6, 0, -23]],
  [800, [0, 37, 9], [0.6, 0, -25]],
  [846, [0, 21, -4], [0.6, 0, -20.4]],
  [862, [0.6, 4, -18.6], [0.6, 0, -20.4]],
];

const inOut = Easing.bezier(0.55, 0, 0.25, 1);

export const cameraAt = (frame: number): {pos: V3; target: V3} => {
  let k = 0;
  while (k < KEYS.length - 2 && frame > KEYS[k + 1][0]) k++;
  const [f0, p0, t0] = KEYS[k];
  const [f1, p1, t1] = KEYS[k + 1];
  const t = inOut(clamp01((frame - f0) / (f1 - f0)));
  const lerp = (a: V3, b: V3): V3 => [0, 1, 2].map((n) => a[n] + (b[n] - a[n]) * t) as V3;
  const pos = lerp(p0, p1);
  // Gentle floating drift so the camera never feels locked off.
  pos[0] += Math.sin(frame / 47) * 0.25;
  pos[1] += Math.sin(frame / 61 + 1) * 0.15;
  return {pos, target: lerp(t0, t1)};
};
