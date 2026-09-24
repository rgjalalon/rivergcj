// Wai brand film — 30s vertical, 30fps. Pacing mirrors the reference edit:
// quick footage cuts → app screen → footage → collage → app screen → hero shot → end card.

export const WAI_FPS = 30;
export const WAI_DURATION = 900;
export const WAI_W = 1080;
export const WAI_H = 1920;

export type FootageId =
  | 'lacing'
  | 'run'
  | 'water'
  | 'stretch'
  | 'breakfast'
  | 'clinic'
  | 'outdoors';

/**
 * Real-life footage slots. Drop a clip at public/wai/footage/<id>.mp4 and it
 * replaces the placeholder automatically (graded to match on render).
 */
export const footage: Record<FootageId, {brief: string; tones: [string, string, string]}> = {
  lacing: {brief: 'Close-up: lacing trainers, soft morning light', tones: ['#6E5441', '#C9A988', '#F1E2CC']},
  run: {brief: 'Tracking shot: feet on a path at sunrise', tones: ['#5A4536', '#B98A5E', '#F3D9B5']},
  water: {brief: 'Macro: pouring a glass of water on a wooden counter', tones: ['#7C6552', '#D5C2AA', '#FBF4EA']},
  stretch: {brief: 'Morning stretch by a window, linen, warm light', tones: ['#8A6F59', '#DCC5A8', '#FFF5E6']},
  breakfast: {brief: 'Overhead: breakfast bowl, berries, hands', tones: ['#5F4A3A', '#C89B6D', '#EBD7BD']},
  clinic: {brief: 'Clinician and client, bright clinic, relaxed smiles', tones: ['#7A6A5C', '#CFC0AE', '#F7F1E8']},
  outdoors: {brief: 'Walking outdoors at golden hour, easy smile', tones: ['#4E3A2C', '#C08A58', '#F6D7AE']},
};

export type Shot =
  | {kind: 'footage'; id: FootageId; from: number; to: number}
  | {kind: 'tracker'; from: number; to: number}
  | {kind: 'collage'; from: number; to: number}
  | {kind: 'insights'; from: number; to: number}
  | {kind: 'end'; from: number; to: number};

export const shots: Shot[] = [
  {kind: 'footage', id: 'lacing', from: 0, to: 72},
  {kind: 'footage', id: 'run', from: 72, to: 126},
  {kind: 'footage', id: 'water', from: 126, to: 180},
  {kind: 'tracker', from: 180, to: 252},
  {kind: 'footage', id: 'stretch', from: 252, to: 306},
  {kind: 'footage', id: 'breakfast', from: 306, to: 360},
  {kind: 'footage', id: 'clinic', from: 360, to: 420},
  {kind: 'collage', from: 420, to: 582},
  {kind: 'insights', from: 582, to: 648},
  {kind: 'footage', id: 'outdoors', from: 648, to: 774},
  {kind: 'end', from: 774, to: 900},
];

/** Lowercase white captions. `parts` build up within one line, like the reference. */
export const captions: {from: number; to: number; parts: {at: number; text: string}[]}[] = [
  {from: 14, to: 68, parts: [{at: 14, text: 'health isn’t'}]},
  {from: 76, to: 124, parts: [{at: 76, text: 'another app'}]},
  {from: 134, to: 178, parts: [{at: 134, text: 'it’s the small things'}]},
  {
    from: 368,
    to: 578,
    parts: [
      {at: 368, text: 'tracked,'},
      {at: 470, text: ' understood,'},
      {at: 520, text: ' improved'},
    ],
  },
  {from: 656, to: 704, parts: [{at: 656, text: 'one place'}]},
  {from: 712, to: 770, parts: [{at: 712, text: 'that actually gets it'}]},
];

export const tagline = 'medical intelligence, made personal';
