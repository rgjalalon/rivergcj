// Builds the sound bed for the "18:00" film: room tone plus soft keys, mouse
// clicks, door latches and light switches placed from the picture timeline.
// No music, no voiceover. Run: node --experimental-strip-types scripts/clinic-audio.ts
import {writeFileSync} from 'node:fs';
import {CUTS, edits, soundEvents, type Cut, FPS} from '../src/clinic/timeline.ts';

const RATE = 48000;

// Deterministic noise so renders are repeatable.
let seed = 7;
const rand = () => {
  seed = (seed * 1664525 + 1013904223) >>> 0;
  return seed / 2 ** 32;
};

const burst = (out: Float32Array, t: number, len: number, gain: number, tone: number, lp: number) => {
  const start = Math.floor(t * RATE);
  const n = Math.floor(len * RATE);
  let y = 0;
  for (let i = 0; i < n && start + i < out.length; i++) {
    const env = Math.exp(-i / (n / 5));
    y += lp * (rand() * 2 - 1 - y);
    const body = Math.sin((2 * Math.PI * tone * i) / RATE) * 0.35;
    out[start + i] += (y + body) * env * gain;
  }
};

const build = (cut: Exclude<Cut, 'vertical'>) => {
  const seconds = CUTS[cut].seconds;
  const out = new Float32Array(seconds * RATE);
  // Room tone: low brown noise with a faint ventilation hum.
  let b = 0;
  for (let i = 0; i < out.length; i++) {
    b = (b + 0.02 * (rand() * 2 - 1)) / 1.02;
    out[i] = b * 0.9 + Math.sin((2 * Math.PI * 100 * i) / RATE) * 0.0025;
  }
  // Exteriors carry a little more low street air; the end card fades to silence.
  const endFrom = edits[cut].shots[edits[cut].shots.length - 1].from / FPS;
  for (let i = 0; i < out.length; i++) {
    const t = i / RATE;
    if (t > endFrom) out[i] *= Math.max(0, 1 - (t - endFrom) / 2.2);
  }
  for (const ev of soundEvents(cut)) {
    const j = (rand() - 0.5) * 0.012;
    if (ev.kind === 'key') burst(out, ev.t + j, 0.035, 0.09 + rand() * 0.04, 180 + rand() * 60, 0.55);
    if (ev.kind === 'mouse') burst(out, ev.t, 0.02, 0.14, 900, 0.8);
    if (ev.kind === 'switch') burst(out, ev.t, 0.03, 0.2, 700, 0.7);
    if (ev.kind === 'laptop') burst(out, ev.t + 0.35, 0.12, 0.16, 90, 0.2);
    if (ev.kind === 'door') {
      burst(out, ev.t + 0.2, 0.18, 0.2, 70, 0.12);
      burst(out, ev.t + 0.24, 0.03, 0.12, 1200, 0.8);
    }
  }
  // 16-bit mono WAV.
  const data = Buffer.alloc(out.length * 2);
  for (let i = 0; i < out.length; i++) data.writeInt16LE(Math.round(Math.max(-1, Math.min(1, out[i])) * 32767), i * 2);
  const header = Buffer.alloc(44);
  header.write('RIFF', 0);
  header.writeUInt32LE(36 + data.length, 4);
  header.write('WAVEfmt ', 8);
  header.writeUInt32LE(16, 16);
  header.writeUInt16LE(1, 20);
  header.writeUInt16LE(1, 22);
  header.writeUInt32LE(RATE, 24);
  header.writeUInt32LE(RATE * 2, 28);
  header.writeUInt16LE(2, 32);
  header.writeUInt16LE(16, 34);
  header.write('data', 36);
  header.writeUInt32LE(data.length, 40);
  const file = `public/wai/clinic/sound-${cut}.wav`;
  writeFileSync(file, Buffer.concat([header, data]));
  console.log(`wrote ${file}`);
};

build('master');
build('short');
