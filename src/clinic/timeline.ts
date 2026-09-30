// "18:00" — Wai clinical-assistant brand film. One doctor, one afternoon.
// Pure data and timing (no Remotion imports) so scripts/clinic-audio.ts can
// build the sound bed from the same timeline the picture uses.

export const FPS = 30;

/**
 * Score: "A New Life" by Eugenio Mininni (Mixkit Stock Music Free License),
 * fetched to public/wai/clinic/music/. It opens near-silent and builds from
 * about 25s, so the master starts at the top and the 30s cuts start later.
 */
export const MUSIC = {id: '543', startMaster: 0, startShort: 16, volume: 0.9};

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
  | 'walk-away'
  | 'desk-1800'
  | 'office-1410'
  | 'back-to-desk'
  | 'jots'
  | 'high-five'
  | 'laptop-close'
  | 'lean-back'
  | 'walk-home';

export type Fx = 'windowOff' | 'lightOff' | 'lightOn' | 'door' | 'laptop' | 'none';

/**
 * Live-action shots. Each plays real footage from public/wai/clinic/footage/<clip>.mp4
 * (fetched by scripts/fetch-clinic-footage.sh), starting `start` seconds into the
 * clip. `focus` is the horizontal centre (%) kept in frame for the 9:16 crop.
 * `event` is the clip time (s) of a sound-worthy action (door, laptop lid).
 * Without the file, a lit placeholder of the shot renders instead.
 */
/** A soft blur over a third-party logo in the source clip (position and size in % of the clip frame, from clip time `from`). */
export type Hide = {x: number; y: number; w: number; h: number; from?: number; tint?: string};

// Manufacturer logo on the laptop lid once it is shut, blurred and tinted to the lid.
const LID_LOGO: Hide = {x: 65.4, y: 58, w: 15, h: 12, from: 6.15, tint: 'rgba(118,132,146,0.4)'};

export const live: Record<
  LiveId,
  {clip: string; start: number; focus: number; brief: string; light: Light; fx: Fx; event?: number; hide?: Hide[]}
> = {
  'ext-window': {clip: '22255', start: 0, focus: 50, brief: 'Windows across the building going dark at nightfall. Locked off.', light: 'dusk', fx: 'windowOff'},
  'walk-away': {clip: '4629', start: 0, focus: 60, brief: 'Silhouette at sunset, walking away along the railing: the doctor, leaving on time.', light: 'dusk', fx: 'none'},
  'desk-1800': {clip: '42653', start: 5.8, focus: 50, brief: 'The laptop lid comes down and stays shut.', light: 'amber', fx: 'none', hide: [LID_LOGO]},
  'office-1410': {clip: '6434', start: 0, focus: 48, brief: 'The consulting room in afternoon light. The doctor at the desk.', light: 'day', fx: 'lightOn'},
  'back-to-desk': {clip: '15048', start: 0.5, focus: 36, brief: 'The patient has gone. The doctor turns back to the monitor.', light: 'day', fx: 'door', event: 0.7},
  'jots': {clip: '29975', start: 2, focus: 42, brief: 'Close on the doctor’s hand writing on a pad after the patient leaves.', light: 'warm', fx: 'none'},
  'high-five': {clip: '6595', start: 6.8, focus: 40, brief: 'The doctor high-fives the girl as she and her mother get up to go.', light: 'warm', fx: 'none'},
  'laptop-close': {clip: '42653', start: 4.3, focus: 50, brief: 'Hands on the keyboard, then the laptop lid closes.', light: 'late', fx: 'laptop', event: 6.4, hide: [LID_LOGO]},
  'lean-back': {clip: '15048', start: 11, focus: 36, brief: 'Nothing left on the list. The doctor sits back from the desk.', light: 'late', fx: 'none'},
  'walk-home': {clip: '4629', start: 3.2, focus: 62, brief: 'The silhouette walks on into the evening.', light: 'dusk', fx: 'none'},
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
  {time: '14:50', name: 'Maya Kaur', item: 'Follow-up'},
  {time: '15:30', name: 'Tom Reid', item: 'Consultation note'},
  {time: '16:10', name: 'Ama Osei', item: 'Prescription'},
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
  | {kind: 'live'; id: LiveId; start: number}
  | {kind: 'screen'; doc: DocId; phase: Phase; framing: Framing; light: Light}
  | {kind: 'end'};

export type Shot = Spec & {from: number; to: number; n: number};
export type Super = {from: number; to: number; text: string};

const L = (id: LiveId, start = live[id].start): Spec => ({kind: 'live', id, start});
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
  [3, L('walk-away')],
  [2, L('desk-1800')],
  [2, L('office-1410')],
  [3, L('back-to-desk')],
  [3, S('note', 'read', 'ots', 'day')],
  [3, S('note', 'edit', 'ecu', 'day')],
  [3, S('note', 'approve', 'cu', 'day')],
  [3, L('jots')],
  [4, S('referral', 'edit', 'ots', 'warm')],
  [3, S('referral', 'approve', 'ecu', 'warm')],
  [3, L('high-five')],
  [3, S('followup', 'edit', 'cu', 'warm')],
  [3, S('followup', 'approve', 'cu', 'warm')],
  [3, S('booking', 'edit', 'ots', 'late')],
  [3, S('booking', 'approve', 'ecu', 'late')],
  [2, S('list', 'read', 'cu', 'late')],
  [3, L('laptop-close')],
  [3, L('lean-back')],
  [2, L('walk-home')],
  [3, END],
]);

const short = build([
  [3, L('walk-away')],
  [2, L('office-1410')],
  [1, L('back-to-desk')],
  [4, S('note', 'both', 'ecu', 'day')],
  [5, S('referral', 'both', 'cu', 'warm')],
  [1, L('high-five', 7.9)],
  [4, S('followup', 'both', 'cu', 'warm')],
  [4, S('booking', 'both', 'cu', 'late')],
  [1.5, L('laptop-close', 5.3)],
  [1.5, L('walk-home')],
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
      const {fx, event} = live[s.id];
      if (event !== undefined && event >= s.start && event < s.start + dur) {
        out.push({t: t0 + event - s.start, kind: fx === 'laptop' ? 'laptop' : 'door'});
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
