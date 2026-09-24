// Wai story film — 33s vertical, 30fps. Structure follows the reference edit:
// letterboxed cinematic questions → phone close-up that answers them →
// the same people, lighter → end card. One grade and grain throughout.

export const STORY_FPS = 30;
export const STORY_DURATION = 990;
export const STORY_W = 1080;
export const STORY_H = 1920;

// Letterboxed picture area, like the reference (black bars top and bottom).
export const PICTURE_H = 1040;
export const PICTURE_TOP = (STORY_H - PICTURE_H) / 2;

export type SceneId = 'labs' | 'temples' | 'runner' | 'sunlight' | 'stretch' | 'coffee';

/**
 * Cinematic footage slots. Drop a clip at public/wai/story/<id>.mp4 and it
 * replaces the animatic scene automatically, graded to match on render.
 */
export const scenes: Record<SceneId, {brief: string}> = {
  labs: {brief: 'Over the shoulder: lab results PDF on a laptop, dark room, screen glow'},
  temples: {brief: '2am, desk lamp: a woman rubbing her temples, eyes closed'},
  runner: {brief: 'Dusk path: a runner stopped mid-run, hands on knees, catching her breath'},
  sunlight: {brief: 'Morning sunlight through a window, same woman, eyes open, calm'},
  stretch: {brief: 'Slow morning stretch by the window, arms up, linen, warm light'},
  coffee: {brief: 'Two mugs, steam, a genuine laugh over coffee, soft focus'},
};

export type Shot =
  | {kind: 'scene'; id: SceneId; from: number; to: number}
  | {kind: 'phone'; from: number; to: number}
  | {kind: 'end'; from: number; to: number};

export const shots: Shot[] = [
  // 1. Cinematic open (0–10s)
  {kind: 'scene', id: 'labs', from: 0, to: 100},
  {kind: 'scene', id: 'temples', from: 100, to: 200},
  {kind: 'scene', id: 'runner', from: 200, to: 300},
  // 2. The turn (10–18s)
  {kind: 'phone', from: 300, to: 540},
  // 3. Payoff (18–27s)
  {kind: 'scene', id: 'sunlight', from: 540, to: 630},
  {kind: 'scene', id: 'stretch', from: 630, to: 720},
  {kind: 'scene', id: 'coffee', from: 720, to: 810},
  // 4. End card (27–33s)
  {kind: 'end', from: 810, to: 990},
];

/** Lowercase white captions, quiet and small, near the bottom of the picture. */
export const captions: {from: number; to: number; parts: {at: number; text: string}[]}[] = [
  {from: 14, to: 96, parts: [{at: 14, text: 'you ever feel something’s off...'}]},
  {from: 112, to: 196, parts: [{at: 112, text: '...but every test says you’re ‘normal’?'}]},
  {from: 212, to: 296, parts: [{at: 212, text: 'what is my body actually telling me?'}]},
  {from: 474, to: 536, parts: [{at: 474, text: 'finally, an answer'}]},
  {
    from: 560,
    to: 804,
    parts: [
      {at: 560, text: 'when someone actually reads'},
      {at: 650, text: '\nthe whole picture'},
    ],
  },
];

// Phone chat beats, in frames.
export const chat = {
  question: 'every test says i’m normal. so why am i exhausted all the time?',
  questionIn: 318,
  typingIn: 346,
  answerIn: 364,
  // Characters revealed per frame while the answer types out.
  cps: 2.1,
  answer:
    'Your ferritin is 18 – that’s technically ‘in range’, but far from optimal. That could be why you’re exhausted.',
  rangeIn: 430,
};

export const tagline = 'wai – medical intelligence, made personal';
