// Wai brand film — 30s vertical, 30fps. Cut points, dissolves and caption
// rhythm are taken frame-for-frame from the reference edit:
//   close-up → wide → paper checklist → phone ⤫ screen ⤫ hands ⤫ still life
//   → lacing → photo collage on a flat colour → document on screen
//   → the same document printed and taped up → end card.

export const WAI_FPS = 30;
export const WAI_DURATION = 900;
export const WAI_W = 1080;
export const WAI_H = 1920;

export type FootageId =
  | 'feet'
  | 'wide'
  | 'journal'
  | 'hands'
  | 'shoes'
  | 'lacing'
  | 'entry'
  | 'tennis'
  | 'outdoors'
  | 'clinic'
  | 'consult'
  | 'lunch';

/**
 * Real-life footage slots. Drop a clip at public/wai/footage/<id>.mp4 and it
 * replaces the placeholder automatically (graded to match on render).
 */
export const footage: Record<FootageId, {brief: string; tones: [string, string, string]}> = {
  feet: {brief: 'Tight close-up: trainers mid-stride, motion blur', tones: ['#4E3A2C', '#9C7656', '#D9BC98']},
  wide: {brief: 'Wide: legs walking or running, morning window light', tones: ['#5A4536', '#B98A5E', '#F3D9B5']},
  journal: {brief: 'Overhead: pen ticking off a paper habit list', tones: ['#8A7A69', '#DCCFBE', '#FBF4EA']},
  hands: {brief: 'Hands: vitamins and a glass of water on a wooden counter', tones: ['#6E5441', '#C9A988', '#F1E2CC']},
  shoes: {brief: 'Still life: trainers on a sunlit floor, long shadows', tones: ['#7C6552', '#D5C2AA', '#FBF4EA']},
  lacing: {brief: 'Low angle: lacing trainers by a window', tones: ['#6E5441', '#C9A988', '#F1E2CC']},
  entry: {brief: 'Two people walking into a bright clinic', tones: ['#7A6A5C', '#CFC0AE', '#F7F1E8']},
  tennis: {brief: 'Tennis high five, sunny court', tones: ['#5F4A3A', '#C89B6D', '#EBD7BD']},
  outdoors: {brief: 'Stepping out into warm afternoon light', tones: ['#4E3A2C', '#C08A58', '#F6D7AE']},
  clinic: {brief: 'Clinician at a desk, stethoscope, laptop', tones: ['#7A6A5C', '#CFC0AE', '#F7F1E8']},
  consult: {brief: 'Doctor listening, video consult', tones: ['#8A6F59', '#DCC5A8', '#FFF5E6']},
  lunch: {brief: 'Friends sharing lunch', tones: ['#5F4A3A', '#C89B6D', '#EBD7BD']},
};

/** `xfade` = frames of dissolve from the previous shot, centred on `from`. */
export type Shot = {from: number; to: number; xfade?: number} & (
  | {kind: 'footage'; id: FootageId}
  | {kind: 'tracker'}
  | {kind: 'insights'}
  | {kind: 'collage'}
  | {kind: 'screen'}
  | {kind: 'print'}
  | {kind: 'end'}
);

export const shots: Shot[] = [
  {kind: 'footage', id: 'feet', from: 0, to: 71},
  {kind: 'footage', id: 'wide', from: 71, to: 101},
  {kind: 'footage', id: 'journal', from: 101, to: 157},
  {kind: 'tracker', from: 157, to: 188},
  {kind: 'insights', from: 188, to: 240, xfade: 10},
  {kind: 'footage', id: 'hands', from: 240, to: 286, xfade: 12},
  {kind: 'footage', id: 'shoes', from: 286, to: 353, xfade: 10},
  {kind: 'footage', id: 'lacing', from: 353, to: 416},
  {kind: 'collage', from: 416, to: 582},
  {kind: 'screen', from: 582, to: 636},
  {kind: 'print', from: 636, to: 775},
  {kind: 'end', from: 775, to: 900},
];

/**
 * Collage photos pop on with hard cuts at the reference's beats. Positions are
 * in the 1080×1920 frame; photos stay square to the frame, no borders.
 */
export const collagePhotos: {id: FootageId; at: number; x: number; y: number; w: number; h: number}[] = [
  {id: 'entry', at: 416, x: 60, y: 430, w: 560, h: 420},
  {id: 'tennis', at: 442, x: 470, y: 560, w: 540, h: 400},
  {id: 'outdoors', at: 465, x: 520, y: 900, w: 500, h: 520},
  {id: 'clinic', at: 495, x: 110, y: 820, w: 520, h: 440},
  {id: 'consult', at: 525, x: 560, y: 1230, w: 440, h: 330},
  {id: 'lunch', at: 547, x: 90, y: 1180, w: 470, h: 350},
];

/** Lowercase white captions: one phrase at a time, hard on and off. */
export const captions: {from: number; to: number; text: string}[] = [
  {from: 33, to: 71, text: 'health isn’t'},
  {from: 71, to: 101, text: 'another app'},
  {from: 101, to: 157, text: 'it’s the'},
  {from: 157, to: 286, text: 'small things'},
  {from: 416, to: 465, text: 'tracked,'},
  {from: 495, to: 540, text: 'understood,'},
  {from: 540, to: 582, text: 'improved'},
  {from: 582, to: 636, text: 'one place'},
  {from: 636, to: 775, text: 'that actually gets it'},
];

export const tagline = 'medical intelligence, made personal';
