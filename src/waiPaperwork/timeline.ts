// Wai "paperwork" film — 1920×1080, 30fps, white and Open Sans throughout.
// A re-edit of the original 39s cut. The intro keeps the original headline
// shots, restaged as a pile of cards with a highlighter punch. From SRC_START
// onwards the source runs continuously (its music and typing sounds stay in
// sync), so every later cue is written in source seconds and converted with
// `src()`.

export const PW_FPS = 30;
export const PW_W = 1920;
export const PW_H = 1080;

/** Intro length, in frames. The source picks up right after it. */
export const HOOK = 96;
/** Where the source is picked up (seconds): the first laptop frame. */
export const SRC_START = 1.8;
const OFFSET = HOOK - SRC_START * PW_FPS;

/** Source time (seconds) → film frame. */
export const src = (seconds: number) => Math.round(seconds * PW_FPS + OFFSET);

export const PW_DURATION = src(39.2);

export const scenes = {
  hook: {from: 0, to: HOOK},
  footage: {from: HOOK, to: src(4.5)},
  cards: {from: src(4.5), to: src(6.9)},
  logo: {from: src(6.9), to: src(9.4)},
  lockup: {from: src(9.4), to: src(12.9)},
  product: {from: src(12.9), to: src(31.3)},
  papers: {from: src(31.3), to: src(35.0)},
  end: {from: src(35.0), to: PW_DURATION},
};

/** Headline stills from the original intro (public/wai-paperwork/headlines). */
export const HEADLINES = 13;
/** Frames between headline slams: starts deliberate, then accelerates. */
export const headlineGaps = [7, 6, 6, 5, 5, 4, 4, 4, 3, 3, 3, 3];
/** Frame where the pile steps back and the title lands. */
export const TITLE_AT = 62;

export const copy = {
  title: ['Paperwork', 'is driving', 'doctors out.'],
  question: 'What if AI could carry some of the load?',
  notReplace: 'Not replace the clinician.',
  support: 'But support them.',
  lockup: ['drafts', 'while', 'you', 'carry', 'on.'],
  endLine: 'Less paperwork. More medicine.',
};

/**
 * The product capture is retimed under the (untouched) music: each pair maps
 * film time to capture time, both in source seconds. Slower where the UI has
 * something to read (worklist filling in, the note drafting), faster through
 * idle stretches and the letter scroll, so the section keeps its length.
 */
export const retime: [number, number][] = [
  [12.9, 12.9],
  [13.3, 13.3],
  [15.8, 15.0],
  [17.6, 16.4],
  [18.2, 17.1],
  [20.6, 18.8],
  [21.8, 20.3],
  [22.4, 21.0],
  [23.6, 22.4],
  [25.0, 23.9],
  [25.8, 25.9],
  [26.3, 26.4],
  [30.6, 31.1],
  [35.0, 35.0],
];

/** Product captions (source seconds). `mark` gets the highlighter. */
export const captions: {from: number; to: number; text: string; mark?: string}[] = [
  {from: 14.3, to: 17.5, text: 'Your whole list, already moving.', mark: 'already moving.'},
  {from: 18.5, to: 20.5, text: 'Consult notes, drafted for you.', mark: 'drafted'},
  {from: 20.7, to: 22.3, text: 'Checked. Signed. Filed.', mark: 'Filed.'},
  {from: 22.7, to: 25.7, text: 'Letters written while you see the next patient.', mark: 'the next patient.'},
  {from: 26.7, to: 30.7, text: 'Ready for your signature.', mark: 'signature.'},
  {from: 31.3, to: 33.3, text: 'Every note. Every letter. Every referral.'},
];

/**
 * Virtual camera over the product capture: focus point in source pixels and
 * zoom, plus a small tilt that settles as each view lands.
 */
export const camera: {at: number; x: number; y: number; z: number; rx: number; ry: number}[] = [
  {at: 12.9, x: 960, y: 560, z: 0.86, rx: 5, ry: -3},
  {at: 15.2, x: 860, y: 580, z: 0.95, rx: 1, ry: -1},
  {at: 17.6, x: 800, y: 590, z: 1.02, rx: 0, ry: 0},
  {at: 18.5, x: 900, y: 520, z: 0.9, rx: 2, ry: 2},
  {at: 21.8, x: 760, y: 590, z: 1.03, rx: 0, ry: 0},
  {at: 22.6, x: 960, y: 520, z: 0.92, rx: 1, ry: -2},
  {at: 25.0, x: 760, y: 700, z: 1.02, rx: 0, ry: 0},
  {at: 25.8, x: 820, y: 620, z: 1.04, rx: 0, ry: 0},
  {at: 26.6, x: 960, y: 380, z: 0.92, rx: 4, ry: 0},
  {at: 29.6, x: 960, y: 600, z: 0.95, rx: 0, ry: 0},
  {at: 30.6, x: 960, y: 600, z: 0.98, rx: 0, ry: 0},
  {at: 31.3, x: 960, y: 540, z: 1.06, rx: 0, ry: 0},
  {at: 35.0, x: 960, y: 560, z: 0.9, rx: 2, ry: 0},
];
