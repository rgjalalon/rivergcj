// Wai "paperwork" film — 42s, 1920×1080, 30fps.
// A re-edit of the original 39s cut: new cold-open hook, then the original
// footage, music and product capture restyled on top. From SRC_START onwards
// the source runs continuously (its music and typing sounds stay in sync), so
// every later cue is written in source seconds and converted with `src()`.

export const PW_FPS = 30;
export const PW_W = 1920;
export const PW_H = 1080;
export const PW_DURATION = 1260;

/** New hook length, in frames. The source picks up right after it. */
export const HOOK = 135;
/** Where the source is picked up (seconds): just before the typing footage. */
export const SRC_START = 1.8;
const OFFSET = HOOK - SRC_START * PW_FPS;

/** Source time (seconds) → film frame. */
export const src = (seconds: number) => Math.round(seconds * PW_FPS + OFFSET);

export const scenes = {
  hook: {from: 0, to: HOOK},
  footage: {from: HOOK, to: src(4.5)},
  cards: {from: src(4.5), to: src(6.3)},
  logo: {from: src(6.3), to: src(9.8)},
  lockup: {from: src(9.8), to: src(12.9)},
  product: {from: src(12.9), to: src(31.3)},
  papers: {from: src(31.3), to: src(35.0)},
  end: {from: src(35.0), to: PW_DURATION},
};

export const copy = {
  hookLabel1: 'For every',
  hookLine1: 'hour with a patient,',
  hookLabel2: 'doctors spend nearly',
  hookLine2: 'hours on paperwork.',
  citation: 'Sinsky et al., Annals of Internal Medicine, 2016',
  hookOut: 'It’s driving doctors out.',
  question: 'What if AI could carry some of the load?',
  notReplace: 'Not replace the clinician.',
  support: 'But support them.',
  lockup: ['drafts', 'while', 'you', 'carry', 'on.'],
  endLine: 'Less paperwork. More medicine.',
};

/** Product captions (source seconds). `em` is set in caramel italic. */
export const captions: {from: number; to: number; text: string; em?: string}[] = [
  {from: 13.8, to: 16.8, text: 'Your whole list, already moving.', em: 'already moving.'},
  {from: 17.2, to: 19.3, text: 'Consult notes, drafted for you.', em: 'drafted'},
  {from: 19.4, to: 20.9, text: 'Checked. Signed. Filed.', em: 'Filed.'},
  {from: 21.2, to: 25.4, text: 'Letters written while you see the next patient.', em: 'the next patient.'},
  {from: 26.4, to: 31.1, text: 'Ready for your signature.', em: 'signature.'},
  {from: 31.6, to: 33.4, text: 'Every note. Every letter. Every referral.'},
];

/**
 * Virtual camera over the product capture: focus point in source pixels and
 * zoom, plus a small tilt that settles as each view lands.
 */
export const camera: {at: number; x: number; y: number; z: number; rx: number; ry: number}[] = [
  {at: 12.9, x: 960, y: 560, z: 0.86, rx: 8, ry: -6},
  {at: 14.6, x: 860, y: 580, z: 0.94, rx: 2, ry: -2},
  {at: 16.8, x: 800, y: 590, z: 1.02, rx: 0, ry: 0},
  {at: 17.6, x: 900, y: 520, z: 0.9, rx: 3, ry: 3},
  {at: 20.8, x: 760, y: 590, z: 1.04, rx: 0, ry: 1},
  {at: 21.6, x: 960, y: 520, z: 0.9, rx: 2, ry: -3},
  {at: 23.4, x: 760, y: 700, z: 1.0, rx: 0, ry: -1},
  {at: 25.6, x: 820, y: 620, z: 1.04, rx: 0, ry: 0},
  {at: 26.4, x: 960, y: 380, z: 0.92, rx: 7, ry: 0},
  {at: 29.8, x: 960, y: 600, z: 0.95, rx: 0, ry: 0},
  {at: 31.0, x: 960, y: 600, z: 0.98, rx: 0, ry: 0},
  {at: 31.6, x: 960, y: 540, z: 1.06, rx: 0, ry: 0},
  {at: 35.0, x: 960, y: 560, z: 0.9, rx: 4, ry: 0},
];
