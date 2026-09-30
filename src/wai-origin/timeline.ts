// Wai: origin film — 30fps vertical. Same beat count and pacing as the
// reference edit (a documentary-style "history of an idea" montage), rewritten
// end to end as Wai's own story instead of borrowed footage of real people
// and other companies' logos: the history of medicine, a breakthrough
// moment, Wai's own product taking shape, and the human care it protects.

export const ORIGIN_FPS = 30;
export const ORIGIN_DURATION = 3168; // 105.6s, matching the reference's runtime
export const ORIGIN_W = 1080;
export const ORIGIN_H = 1920;

export type OriginClipId =
  | 'lab_microscope'
  | 'brain_illustration'
  | 'cells_micro'
  | 'team_collab'
  | 'hands_code'
  | 'flame'
  | 'sun_rays'
  | 'earth_space'
  | 'hand_drawing'
  | 'drone_hills'
  | 'scientist_scope'
  | 'hands_care'
  | 'drone_valley'
  | 'dentist_portrait'
  | 'factory_assembly'
  | 'drone_flying'
  | 'celebration';

export const clipBrief: Record<OriginClipId, string> = {
  lab_microscope: 'A microscope on a bench, dramatic single-source light — the instrument, not the book',
  brain_illustration: 'An artist sketching a human brain — the anatomy plate that stands in for the patent drawing',
  cells_micro: 'A cellular environment under magnification — the data the punch card once stood for',
  team_collab: 'Colleagues working intently around a screen, unremarkable and unidentifiable — building, not posing',
  hands_code: 'Close on hands typing — the software breakthrough, in hands rather than a face',
  flame: 'A flame unfurling on black — the spark',
  sun_rays: 'Sun breaking through — the spark catching',
  earth_space: 'Earth seen from orbit — the scale of who it reaches',
  hand_drawing: 'A hand sketching — an idea taking its first shape',
  drone_hills: 'Drone over green hills — distance covered',
  scientist_scope: 'A scientist bent over a microscope — the close read behind the wide shot',
  hands_care: 'A hand holding a smaller hand — what all the intelligence is actually for',
  drone_valley: 'Drone over a river valley and snowy peaks — the long view',
  dentist_portrait: 'A clinician, steady and sure, looking back at camera — the person behind the intelligence',
  factory_assembly: 'Precision assembly — the machinery of getting this right at scale',
  drone_flying: 'A drone lifting away — momentum',
  celebration: 'A toast among friends — the milestone, kept human-sized',
};

export type OriginShot =
  | {kind: 'clip'; id: OriginClipId; from: number; to: number}
  | {kind: 'recordUi'; from: number; to: number}
  | {kind: 'chatUi'; from: number; to: number}
  | {kind: 'end'; from: number; to: number};

export const originShots: OriginShot[] = [
  // B1 — the instrument, not the book. Slow push on a single object.
  {kind: 'clip', id: 'lab_microscope', from: 0, to: 198},
  // B2 — rapid flash of "what came before": an illustration, then the data itself.
  {kind: 'clip', id: 'brain_illustration', from: 198, to: 234},
  {kind: 'clip', id: 'cells_micro', from: 234, to: 270},
  // B3 — the builders. Unremarkable people, doing the work.
  {kind: 'clip', id: 'team_collab', from: 270, to: 579},
  // B4 — hands close on the work.
  {kind: 'clip', id: 'hands_code', from: 579, to: 621},
  // B5 — the first version of the product, taking shape.
  {kind: 'recordUi', from: 621, to: 657},
  // B6 — the symbolic sequence: spark, light, scale.
  {kind: 'clip', id: 'flame', from: 657, to: 748},
  {kind: 'clip', id: 'sun_rays', from: 748, to: 839},
  {kind: 'clip', id: 'earth_space', from: 839, to: 930},
  // B7 — an idea taking its first shape, by hand.
  {kind: 'clip', id: 'hand_drawing', from: 930, to: 1131},
  // B8 — distance covered, then the product today.
  {kind: 'clip', id: 'drone_hills', from: 1131, to: 1311},
  {kind: 'chatUi', from: 1311, to: 1467},
  // B9 — the close read behind the wide shot.
  {kind: 'clip', id: 'scientist_scope', from: 1467, to: 1752},
  // B10 — what it's for.
  {kind: 'clip', id: 'hands_care', from: 1752, to: 1989},
  // B11 — the long view, then the person behind it.
  {kind: 'clip', id: 'drone_valley', from: 1989, to: 2104},
  {kind: 'clip', id: 'dentist_portrait', from: 2104, to: 2220},
  // B12 — the machinery of doing this at scale, then momentum.
  {kind: 'clip', id: 'factory_assembly', from: 2220, to: 2365},
  {kind: 'clip', id: 'drone_flying', from: 2365, to: 2505},
  // B13 — the milestone, kept human-sized.
  {kind: 'clip', id: 'celebration', from: 2505, to: 2676},
  // B14 — the light returns, a callback into the reveal.
  {kind: 'clip', id: 'sun_rays', from: 2676, to: 2865},
  // B15 — end card.
  {kind: 'end', from: 2865, to: 3168},
];
