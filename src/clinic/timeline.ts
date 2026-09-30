// "18:00" — Wai clinical-assistant brand film. One doctor, one afternoon.
// Pure data and timing (no Remotion imports) so scripts/clinic-audio.ts can
// build the sound bed from the same timeline the picture uses.

export const FPS = 30;

export type Cut = 'master' | 'short' | 'vertical';

export const CUTS: Record<Cut, {w: number; h: number; seconds: number}> = {
  master: {w: 1920, h: 1080, seconds: 60},
  short: {w: 1920, h: 1080, seconds: 30},
  vertical: {w: 1080, h: 1920, seconds: 30},
};

// Window light is the clock: 14:10 daylight → warmer → amber → dusk.
export type Light = 'dusk' | 'corridor' | 'amber' | 'day' | 'warm' | 'late';

export type LiveId =
  | 'ext-window'
  | 'corridor-switch'
  | 'desk-1800'
  | 'switch-on'
  | 'bell-leaves'
  | 'nair-leaves'
  | 'kaur-leaves'
  | 'desk-close'
  | 'ext-exit';

export type Fx = 'windowOff' | 'lightOff' | 'lightOn' | 'door' | 'laptop' | 'none';

/**
 * Live-action slots. Drop a clip at public/wai/clinic/<id>.mp4 and it replaces
 * the placeholder on the next render, graded to match.
 */
export const live: Record<LiveId, {brief: string; light: Light; fx: Fx}> = {
  'ext-window': {brief: 'Exterior wide from across the street, locked off. One lit window goes dark.', light: 'dusk', fx: 'windowOff'},
  'corridor-switch': {brief: 'Corridor, medium, slow handheld drift back. Coat over arm, hand to the switch, light off.', light: 'corridor', fx: 'lightOff'},
  'desk-1800': {brief: 'Desk close-up, static, last amber light. Closed laptop, empty tray, pen squared.', light: 'amber', fx: 'none'},
  'switch-on': {brief: 'Match cut: same hand, same switch. Light on, blinds open to hard afternoon light.', light: 'day', fx: 'lightOn'},
  'bell-leaves': {brief: 'Consult room, medium wide. An older man leaves, the door clicks shut, the doctor turns back to the desk.', light: 'day', fx: 'door'},
  'nair-leaves': {brief: 'Medium, handheld. A woman in her forties shakes hands and leaves. The doctor jots one word on a pad.', light: 'warm', fx: 'door'},
  'kaur-leaves': {brief: 'Doorway, medium wide. A mother and child leave. The child waves, the doctor waves back.', light: 'warm', fx: 'door'},
  'desk-close': {brief: 'Desk, medium, static, low sun. The laptop closes, the pen is squared.', light: 'late', fx: 'laptop'},
  'ext-exit': {brief: 'Exterior wide at dusk, locked off. The window goes dark; the doctor walks out into the street.', light: 'dusk', fx: 'windowOff'},
};

// ---------------------------------------------------------------------------
// Product screens. Every workflow step is a draft the doctor edits, then approves.

export type DocId = 'note' | 'referral' | 'followup' | 'booking' | 'list';
export type Phase = 'read' | 'edit' | 'approve' | 'both';
export type Framing = 'ots' | 'cu' | 'ecu';

export type Edit = {old: string; neu: string};
export type Section = {label: string; text?: string; before?: string; after?: string};

export type Doc = {
  nav: number;
  title: string;
  patient: {name: string; meta: string};
  sections: Section[];
  edit?: Edit;
  button: string;
  done: string;
  calendar?: boolean;
};

export const clinic = {
  room: 'Room 3',
  date: 'Wednesday 14 October',
  doctor: 'Dr M. Okafor',
  initials: 'MO',
};

export const day = [
  {time: '14:00', name: 'Arthur Bell', item: 'Consultation note'},
  {time: '14:25', name: 'Priya Nair', item: 'Referral letter'},
  {time: '14:50', name: 'Maya Kaur', item: 'Message and booking'},
  {time: '15:30', name: 'Tom Reid', item: 'Consultation note'},
  {time: '16:10', name: 'Ama Osei', item: 'Repeat prescription'},
  {time: '16:50', name: 'Erik Lind', item: 'Consultation note'},
];

export const docs: Record<DocId, Doc> = {
  note: {
    nav: 0,
    title: 'Consultation note',
    patient: {name: 'Arthur Bell', meta: '71 · Male · ID 40-2217'},
    sections: [
      {label: 'Reason for visit', text: 'Blood pressure review. Home readings higher in the mornings. No chest pain, no breathlessness.'},
      {label: 'Examination', text: 'BP 148/92 seated. Pulse 72, regular. Heart sounds normal. No ankle swelling.'},
      {label: 'Plan', before: 'Start amlodipine 5 mg ', after: '. Recheck blood pressure in 4 weeks. Bloods today for kidney function.'},
    ],
    edit: {old: 'twice daily', neu: 'once daily'},
    button: 'Approve & sign',
    done: 'Signed by Dr M. Okafor · 14:23',
  },
  referral: {
    nav: 1,
    title: 'Referral letter',
    patient: {name: 'Priya Nair', meta: '44 · Female · ID 40-5519'},
    sections: [
      {label: 'To', text: 'Cardiology outpatients'},
      {
        label: 'Letter',
        before:
          'Dear colleague, I would be grateful if you could see Ms Nair, who describes three months of intermittent palpitations, worse at night. ',
        after: ' ECG today shows sinus rhythm. No current medication.',
      },
    ],
    edit: {old: 'A routine appointment is fine.', neu: 'Please see within two weeks.'},
    button: 'Approve & send',
    done: 'Sent to Cardiology · 14:41',
  },
  followup: {
    nav: 2,
    title: 'Message to parent',
    patient: {name: 'Maya Kaur', meta: '8 · Female · ID 40-7730'},
    sections: [
      {label: 'To', text: 'Parent · text message'},
      {
        label: 'Message',
        before: 'Hi, here is a summary of today’s visit for ',
        after:
          '. Keep using the blue inhaler with the spacer, two puffs when needed. If breathing gets harder or the inhaler is not helping, call us the same day.',
      },
    ],
    edit: {old: 'the patient', neu: 'Maya'},
    button: 'Approve & send',
    done: 'Sent to parent · 15:06',
  },
  booking: {
    nav: 2,
    title: 'Follow-up booking',
    patient: {name: 'Maya Kaur', meta: '8 · Female · ID 40-7730'},
    sections: [
      {label: 'Appointment', text: 'Asthma review · 20 min · Dr M. Okafor'},
      {label: 'Time', before: '', after: ''},
    ],
    edit: {old: 'Wed 25 Nov, 14:30', neu: 'Fri 27 Nov, 09:00'},
    button: 'Approve & book',
    done: 'Booked · Fri 27 Nov, 09:00',
    calendar: true,
  },
  list: {
    nav: -1,
    title: 'Today',
    patient: {name: 'Wednesday 14 October', meta: '6 patients'},
    sections: [],
    button: '',
    done: 'No drafts waiting',
  },
};

// Beats inside a screen shot, as fractions of the edit (e) and approve (a) progress.
export const EDIT = {select: 0.12, selected: 0.3, typeFrom: 0.36, typeTo: 0.9};
export const APPROVE = {pan: 0.35, hover: 0.42, press: 0.58, done: 0.68};
const BOTH_SPLIT = 0.62;

const clamp = (x: number) => Math.min(1, Math.max(0, x));

export const phaseProgress = (phase: Phase, p: number): {e: number; a: number; read: number} => {
  switch (phase) {
    case 'read':
      return {e: 0, a: 0, read: p};
    case 'edit':
      return {e: p, a: 0, read: 0};
    case 'approve':
      return {e: 1, a: p, read: 0};
    case 'both':
      return {e: clamp(p / BOTH_SPLIT), a: clamp((p - BOTH_SPLIT) / (1 - BOTH_SPLIT)), read: 0};
  }
};

/** Characters of the new text typed at edit progress e. */
export const typedChars = (edit: Edit, e: number) =>
  Math.round(clamp((e - EDIT.typeFrom) / (EDIT.typeTo - EDIT.typeFrom)) * edit.neu.length);

// ---------------------------------------------------------------------------
// Edit decision lists.

type Spec =
  | {kind: 'live'; id: LiveId}
  | {kind: 'screen'; doc: DocId; phase: Phase; framing: Framing; light: Light}
  | {kind: 'end'};

export type Shot = Spec & {from: number; to: number; n: number};
export type Super = {from: number; to: number; text: string};

const L = (id: LiveId): Spec => ({kind: 'live', id});
const S = (doc: DocId, phase: Phase, framing: Framing, light: Light): Spec => ({kind: 'screen', doc, phase, framing, light});
const END: Spec = {kind: 'end'};

const build = (list: [number, Spec][]): Shot[] => {
  let t = 0;
  return list.map(([sec, spec], i) => {
    const from = Math.round(t * FPS);
    t += sec;
    return {...spec, from, to: Math.round(t * FPS), n: i + 1};
  });
};

const supers = (list: [number, number, string][]): Super[] =>
  list.map(([a, b, text]) => ({from: Math.round(a * FPS), to: Math.round(b * FPS), text}));

const master = build([
  [3, L('ext-window')],
  [3, L('corridor-switch')],
  [2, L('desk-1800')],
  [2, L('switch-on')],
  [3, L('bell-leaves')],
  [3, S('note', 'read', 'ots', 'day')],
  [3, S('note', 'edit', 'ecu', 'day')],
  [3, S('note', 'approve', 'cu', 'day')],
  [3, L('nair-leaves')],
  [4, S('referral', 'edit', 'ots', 'warm')],
  [3, S('referral', 'approve', 'ecu', 'warm')],
  [3, L('kaur-leaves')],
  [3, S('followup', 'edit', 'cu', 'warm')],
  [3, S('followup', 'approve', 'cu', 'warm')],
  [3, S('booking', 'edit', 'ots', 'late')],
  [3, S('booking', 'approve', 'ecu', 'late')],
  [2, S('list', 'read', 'cu', 'late')],
  [3, L('desk-close')],
  [3, L('corridor-switch')],
  [2, L('ext-exit')],
  [3, END],
]);

const short = build([
  [3, L('corridor-switch')],
  [2, L('switch-on')],
  [1, L('bell-leaves')],
  [4, S('note', 'both', 'ecu', 'day')],
  [5, S('referral', 'both', 'cu', 'warm')],
  [1, L('kaur-leaves')],
  [4, S('followup', 'both', 'cu', 'warm')],
  [4, S('booking', 'both', 'cu', 'late')],
  [1.5, L('desk-close')],
  [1.5, L('ext-exit')],
  [3, END],
]);

export const edits: Record<Cut, {shots: Shot[]; supers: Super[]}> = {
  master: {
    shots: master,
    supers: supers([
      [6.2, 8, '18:00'],
      [8.2, 10, '14:10'],
      [16.3, 19.8, 'You read every line.'],
      [25.3, 29, 'You change what’s wrong.'],
      [38.3, 41, 'You approve every word.'],
      [55.1, 57, '18:00'],
    ]),
  },
  short: {
    shots: short,
    supers: supers([
      [0.4, 3, '18:00'],
      [3.2, 5, '14:10'],
      [6.2, 9.9, 'You read every line.'],
      [10.2, 14.9, 'You change what’s wrong.'],
      [16.2, 19.9, 'You approve every word.'],
      [25.6, 27, '18:00'],
    ]),
  },
  vertical: {shots: short, supers: []},
};
edits.vertical.supers = edits.short.supers;

// ---------------------------------------------------------------------------
// Sound events (seconds) for the room-tone bed: keys, mouse clicks, doors, switches.

export type SoundEvent = {t: number; kind: 'key' | 'mouse' | 'door' | 'switch' | 'laptop'};

export const soundEvents = (cut: Cut): SoundEvent[] => {
  const out: SoundEvent[] = [];
  for (const s of edits[cut].shots) {
    const t0 = s.from / FPS;
    const dur = (s.to - s.from) / FPS;
    if (s.kind === 'live') {
      const fx = live[s.id].fx;
      const at = {windowOff: -1, lightOff: 0.6, lightOn: 0.3, door: 0.4, laptop: 0.45, none: -1}[fx];
      if (at >= 0) {
        const kind = fx === 'door' ? 'door' : fx === 'laptop' ? 'laptop' : 'switch';
        out.push({t: t0 + at * dur, kind});
      }
      continue;
    }
    if (s.kind !== 'screen') continue;
    const doc = docs[s.doc];
    let prevChars = -1;
    let selected = false;
    let pressed = false;
    const frames = s.to - s.from;
    for (let f = 0; f < frames; f++) {
      const {e, a} = phaseProgress(s.phase, f / frames);
      const t = t0 + f / FPS;
      if (doc.edit && s.phase !== 'approve' && s.phase !== 'read') {
        if (!selected && e >= EDIT.selected) {
          selected = true;
          out.push({t, kind: 'mouse'});
        }
        const n = typedChars(doc.edit, e);
        if (prevChars >= 0 && n > prevChars) out.push({t, kind: 'key'});
        prevChars = n;
      }
      if (!pressed && a >= APPROVE.press) {
        pressed = true;
        out.push({t, kind: 'mouse'});
      }
    }
  }
  return out;
};
