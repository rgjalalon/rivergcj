import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {
  APPROVE,
  clinic,
  day,
  DocId,
  docs,
  EDIT,
  Framing,
  Light,
  Phase,
  phaseProgress,
  typedChars,
} from './timeline';

// The product as it looks on the doctor's monitor: a plain, legible clinical UI
// with no product name anywhere on it. Laid out at 1280×800 and filmed by a
// virtual camera (framing, slow push, handheld sway).
export const CANVAS_W = 1280;
export const CANVAS_H = 800;

const ui = {
  bg: '#F4F5F2',
  panel: '#FFFFFF',
  ink: '#1E2724',
  muted: '#66726D',
  line: '#E1E4DF',
  accent: '#2E6B5E',
  accentSoft: '#DCEBE6',
  select: '#B7D6CE',
  draft: '#8A5A12',
  draftSoft: '#F6EAD4',
  font: 'Inter, -apple-system, "Helvetica Neue", Arial, sans-serif',
};

// Camera targets in canvas pixels (measured from the laid-out monitor): the
// edit, and the approve button.
const editTarget: Record<DocId, [number, number]> = {
  note: [790, 432],
  referral: [650, 340],
  followup: [950, 290],
  booking: [760, 330],
  list: [760, 330],
};
const buttonTarget: Record<DocId, [number, number]> = {
  note: [1142, 531],
  referral: [1140, 471],
  followup: [1140, 438],
  booking: [1139, 453],
  list: [1139, 453],
};
const center: [number, number] = [CANVAS_W / 2 + 60, 360];

const clamp = (x: number) => Math.min(1, Math.max(0, x));
const smooth = (x: number) => {
  const c = clamp(x);
  return c * c * (3 - 2 * c);
};
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

const lightTint: Record<Light, string> = {
  day: 'linear-gradient(115deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0) 40%)',
  warm: 'linear-gradient(115deg, rgba(255,214,160,0.16) 0%, rgba(255,214,160,0) 45%)',
  late: 'linear-gradient(115deg, rgba(255,170,90,0.24) 0%, rgba(255,170,90,0.04) 55%)',
  amber: 'linear-gradient(115deg, rgba(255,170,90,0.24) 0%, rgba(255,170,90,0.04) 55%)',
  dusk: 'none',
  corridor: 'none',
};

const Pointer: React.FC<{x: number; y: number; down: boolean}> = ({x, y, down}) => (
  <svg
    width="26"
    height="34"
    viewBox="0 0 26 34"
    style={{position: 'absolute', left: x - 3, top: y - 2, transform: `scale(${down ? 0.88 : 1})`, transformOrigin: '3px 2px'}}
  >
    <path d="M3 2 L3 26 L9 20 L13.5 30 L17.5 28.2 L13 18.5 L21 18.5 Z" fill="#111" stroke="#fff" strokeWidth="1.6" strokeLinejoin="round" />
  </svg>
);

const Check: React.FC<{size?: number; color?: string}> = ({size = 14, color = ui.accent}) => (
  <svg width={size} height={size} viewBox="0 0 16 16">
    <path d="M3 8.5l3.2 3L13 4.8" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/** The inline edit: old text → selected → new text typed, with a caret. */
const EditSpan: React.FC<{old: string; neu: string; e: number; frame: number}> = ({old, neu, e, frame}) => {
  const blink = Math.floor(frame / 15) % 2 === 0;
  const caret = <span style={{display: 'inline-block', width: 2, height: '1.1em', background: ui.ink, verticalAlign: '-0.15em', marginLeft: 1, opacity: blink ? 1 : 0}} />;
  if (e < EDIT.select) return <span>{old}</span>;
  if (e < EDIT.typeFrom) {
    const sel = e >= EDIT.selected ? 1 : (e - EDIT.select) / (EDIT.selected - EDIT.select);
    const n = Math.round(sel * old.length);
    return (
      <span>
        <span style={{background: ui.select}}>{old.slice(0, n)}</span>
        {old.slice(n)}
      </span>
    );
  }
  const n = typedChars({old, neu}, e);
  const typing = n < neu.length;
  return (
    <span style={{textDecoration: typing ? 'none' : `underline 2px ${ui.accent}`, textUnderlineOffset: 5}}>
      {neu.slice(0, n)}
      {typing || e < 1 ? caret : null}
    </span>
  );
};

const Sidebar: React.FC<{active: number; allDone: boolean}> = ({active, allDone}) => (
  <div style={{width: 280, borderRight: `1px solid ${ui.line}`, background: ui.bg, padding: '22px 0'}}>
    <div style={{padding: '0 24px 14px', fontSize: 13, letterSpacing: 1.2, textTransform: 'uppercase', color: ui.muted, fontWeight: 600}}>
      Today
    </div>
    {day.map((p, i) => {
      const done = allDone || i < active;
      const on = i === active;
      return (
        <div
          key={p.name}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '12px 24px',
            background: on ? ui.panel : 'transparent',
            borderLeft: `3px solid ${on ? ui.accent : 'transparent'}`,
          }}
        >
          <span style={{fontSize: 14, color: ui.muted, width: 44, fontVariantNumeric: 'tabular-nums'}}>{p.time}</span>
          <span style={{flex: 1, fontSize: 15.5, color: ui.ink, fontWeight: on ? 600 : 400}}>{p.name}</span>
          {done ? <Check /> : null}
        </div>
      );
    })}
  </div>
);

const TopBar: React.FC = () => (
  <div
    style={{
      height: 56,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 24px',
      borderBottom: `1px solid ${ui.line}`,
      background: ui.panel,
      fontSize: 15,
      color: ui.muted,
    }}
  >
    <span>
      {clinic.room} · {clinic.date}
    </span>
    <span style={{display: 'flex', alignItems: 'center', gap: 10, color: ui.ink}}>
      {clinic.doctor}
      <span style={{width: 32, height: 32, borderRadius: 16, background: ui.accentSoft, color: ui.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 600}}>
        {clinic.initials}
      </span>
    </span>
  </div>
);

const Calendar: React.FC<{e: number; approved: boolean}> = ({e, approved}) => {
  const days = ['Mon 23', 'Tue 24', 'Wed 25', 'Thu 26', 'Fri 27'];
  const moved = e >= EDIT.typeTo;
  const pick = moved ? 4 : 2;
  return (
    <div style={{display: 'flex', gap: 10, marginTop: 6}}>
      {days.map((d, i) => {
        const on = i === pick;
        return (
          <div
            key={d}
            style={{
              flex: 1,
              height: 74,
              borderRadius: 8,
              border: on ? `2px ${approved ? 'solid' : 'dashed'} ${ui.accent}` : `1px solid ${ui.line}`,
              background: on && approved ? ui.accentSoft : ui.panel,
              padding: '8px 10px',
              fontSize: 13.5,
              color: ui.muted,
            }}
          >
            <div>{d} Nov</div>
            {on ? (
              <div style={{marginTop: 8, color: ui.accent, fontWeight: 600, fontSize: 13.5}}>{moved ? '09:00' : '14:30'} · Maya K.</div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
};

const DocCard: React.FC<{doc: DocId; e: number; a: number; read: number; frame: number}> = ({doc, e, a, read, frame}) => {
  const d = docs[doc];
  const approved = a >= APPROVE.done;
  const edited = d.edit && e >= EDIT.typeTo;
  const readRow = Math.min(d.sections.length - 1, Math.floor(read * d.sections.length));
  return (
    <div style={{flex: 1, display: 'flex', flexDirection: 'column', padding: '26px 36px 28px', gap: 18, minWidth: 0}}>
      <div style={{display: 'flex', alignItems: 'baseline', gap: 16}}>
        <span style={{fontSize: 28, fontWeight: 600, color: ui.ink}}>{d.patient.name}</span>
        <span style={{fontSize: 15, color: ui.muted}}>{d.patient.meta}</span>
        <span style={{marginLeft: 'auto', fontSize: 14, color: ui.muted}}>No known allergies</span>
      </div>
      <div style={{background: ui.panel, border: `1px solid ${ui.line}`, borderRadius: 10, display: 'flex', flexDirection: 'column'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 12, padding: '16px 22px', borderBottom: `1px solid ${ui.line}`}}>
          <span style={{fontSize: 18, fontWeight: 600, color: ui.ink}}>{d.title}</span>
          <span
            style={{
              fontSize: 13,
              fontWeight: 600,
              padding: '4px 10px',
              borderRadius: 12,
              color: approved ? ui.accent : ui.draft,
              background: approved ? ui.accentSoft : ui.draftSoft,
            }}
          >
            {approved ? 'Approved' : 'Draft · needs your approval'}
          </span>
          {edited ? <span style={{fontSize: 13.5, color: ui.muted}}>Edited by you · 1 change</span> : null}
        </div>
        <div style={{padding: '10px 12px 18px', display: 'flex', flexDirection: 'column', gap: 4}}>
          {d.sections.map((s, i) => (
            <div
              key={s.label}
              style={{
                display: 'flex',
                gap: 20,
                padding: '12px 10px',
                borderRadius: 6,
                background: read > 0 && i === readRow ? '#F2F6F4' : 'transparent',
              }}
            >
              <span style={{width: 150, flexShrink: 0, fontSize: 14, color: ui.muted, paddingTop: 2}}>{s.label}</span>
              <div style={{flex: 1, fontSize: 21, lineHeight: 1.55, color: ui.ink}}>
                {s.text ?? (
                  <>
                    {s.before}
                    {d.edit ? <EditSpan old={d.edit.old} neu={d.edit.neu} e={e} frame={frame} /> : null}
                    {s.after}
                  </>
                )}
                {d.calendar && s.label === 'Time' ? <Calendar e={e} approved={approved} /> : null}
              </div>
            </div>
          ))}
        </div>
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 20, padding: '14px 22px', borderTop: `1px solid ${ui.line}`, minHeight: 68, boxSizing: 'border-box'}}>
          {approved ? (
            <span style={{display: 'flex', alignItems: 'center', gap: 8, fontSize: 16, color: ui.accent, fontWeight: 600}}>
              <Check size={18} /> {d.done}
            </span>
          ) : (
            <>
              <span style={{fontSize: 15, color: ui.muted}}>Discard draft</span>
              <span
                style={{
                  fontSize: 16,
                  fontWeight: 600,
                  color: '#fff',
                  padding: '11px 20px',
                  borderRadius: 8,
                  background: a >= APPROVE.hover ? '#245A4E' : ui.accent,
                  transform: `scale(${a >= APPROVE.press ? 0.97 : 1})`,
                }}
              >
                {d.button}
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const DayList: React.FC<{read: number}> = ({read}) => {
  const row = Math.floor(read * day.length);
  return (
    <div style={{flex: 1, padding: '26px 36px 28px', display: 'flex', flexDirection: 'column', gap: 18}}>
      <div style={{display: 'flex', alignItems: 'baseline', gap: 16}}>
        <span style={{fontSize: 28, fontWeight: 600, color: ui.ink}}>Today</span>
        <span style={{fontSize: 15, color: ui.muted}}>{clinic.date} · 6 patients</span>
      </div>
      <div style={{background: ui.panel, border: `1px solid ${ui.line}`, borderRadius: 10}}>
        {day.map((p, i) => (
          <div
            key={p.name}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 20,
              padding: '17px 22px',
              borderBottom: i < day.length - 1 ? `1px solid ${ui.line}` : 'none',
              background: i === row ? '#F2F6F4' : 'transparent',
              fontSize: 17,
            }}
          >
            <span style={{width: 56, color: ui.muted, fontVariantNumeric: 'tabular-nums'}}>{p.time}</span>
            <span style={{width: 200, color: ui.ink, fontWeight: 500}}>{p.name}</span>
            <span style={{flex: 1, color: ui.muted}}>{p.item}</span>
            <span style={{display: 'flex', alignItems: 'center', gap: 6, color: ui.accent, fontWeight: 600, fontSize: 15}}>
              <Check /> Approved by you
            </span>
          </div>
        ))}
      </div>
      <div style={{fontSize: 16, color: ui.muted, paddingLeft: 4}}>No drafts waiting.</div>
    </div>
  );
};

export const Monitor: React.FC<{doc: DocId; e: number; a: number; read: number; frame: number}> = ({doc, e, a, read, frame}) => {
  const d = docs[doc];
  // Pointer glides from the text to the button, then clicks.
  const glide = smooth((a - 0.05) / (APPROVE.hover - 0.05));
  const px = lerp(editTarget[doc][0] + 120, buttonTarget[doc][0] + 10, glide);
  const py = lerp(editTarget[doc][1] + 30, buttonTarget[doc][1] + 6, glide);
  const showPointer = a > 0 && a < APPROVE.done + 0.2;
  return (
    <div style={{width: CANVAS_W, height: CANVAS_H, background: ui.bg, fontFamily: ui.font, display: 'flex', flexDirection: 'column', position: 'relative'}}>
      <TopBar />
      <div style={{flex: 1, display: 'flex', minHeight: 0}}>
        <Sidebar active={doc === 'list' ? -1 : d.nav} allDone={doc === 'list'} />
        {doc === 'list' ? <DayList read={read} /> : <DocCard doc={doc} e={e} a={a} read={read} frame={frame} />}
      </div>
      {showPointer ? <Pointer x={px} y={py} down={a >= APPROVE.press && a < APPROVE.done} /> : null}
    </div>
  );
};

const framingScale: Record<Framing, number> = {ots: 1.02, cu: 1.3, ecu: 1.8};
const verticalScale: Record<Framing, number> = {ots: 1.12, cu: 1.2, ecu: 1.55};
export const VERTICAL = {screenTop: 220, screenH: 1000};

/** A screen shot: the monitor filmed handheld-but-steady, with window light across the glass. */
export const ScreenShot: React.FC<{
  doc: DocId;
  phase: Phase;
  framing: Framing;
  light: Light;
  from: number;
  to: number;
  width: number;
  height: number;
  vertical: boolean;
}> = ({doc, phase, framing, light, from, to, width, height, vertical}) => {
  const frame = useCurrentFrame();
  const local = frame - from;
  const p = clamp(local / (to - from));
  const {e, a, read} = phaseProgress(phase, p);

  // Region of the frame that shows the screen (vertical keeps a desk band below).
  // Vertical: the screen sits in a band under the supers, the desk below it,
  // framed on the document card so the text stays large.
  const regionTop = vertical ? VERTICAL.screenTop : 0;
  const regionH = vertical ? VERTICAL.screenH : height;
  const s = (vertical ? verticalScale[framing] : framingScale[framing] * 1.2) * (1 + 0.035 * p);

  // Camera target: the edit while editing, the button while approving.
  const edit = editTarget[doc];
  const pan = phase === 'approve' ? 1 : phase === 'both' ? smooth(a / APPROVE.pan) : 0;
  const base = framing === 'ots' ? center : edit;
  const button = buttonTarget[doc];
  let tx = lerp(base[0], button[0] - (framing === 'ecu' ? 60 : 160), pan);
  let ty = lerp(base[1], button[1] - (framing === 'ecu' ? 40 : 90), pan);
  if (vertical && framing !== 'ecu') tx = 780; // hold the whole card width
  if (framing === 'ots' && !vertical) {
    tx = lerp(center[0], tx, 0.5);
    ty = lerp(center[1], ty, 0.5);
  }
  // Handheld: slow, small, never jittery.
  const sway = (f: number) => Math.sin(f / 41) * 5 + Math.sin(f / 17 + 1.3) * 1.6;
  const cx = width / 2 + sway(frame);
  const cy = regionH / 2 + sway(frame + 90) * 0.7;
  // Keep the camera inside the monitor; a wide shot that shows the whole
  // monitor stays near centre with the room around it.
  const fit = (pos: number, frameSize: number, size: number) =>
    size <= frameSize ? (frameSize - size) / 2 + (pos - (frameSize - size) / 2) * 0.15 : Math.min(0, Math.max(frameSize - size, pos));
  const left = fit(cx - tx * s, width, CANVAS_W * s);
  const top = fit(cy - ty * s, regionH, CANVAS_H * s);
  const ots = framing === 'ots';

  return (
    <AbsoluteFill style={{background: '#16130F', overflow: 'hidden'}}>
      <div style={{position: 'absolute', left: 0, top: regionTop, width, height: regionH, overflow: 'hidden'}}>
        <div
          style={{
            position: 'absolute',
            left,
            top,
            transform: `scale(${s})`,
            transformOrigin: '0 0',
            boxShadow: '0 0 0 12px #0E0D0C, 0 40px 90px rgba(0,0,0,0.55)',
          }}
        >
          <Monitor doc={doc} e={e} a={a} read={read} frame={frame} />
        </div>
        {/* Window light and glass reflection across the screen. */}
        <AbsoluteFill style={{background: lightTint[light]}} />
        <AbsoluteFill style={{background: 'linear-gradient(200deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0) 35%)'}} />
        {ots ? (
          // Over-the-shoulder: the doctor's shoulder, soft and out of focus.
          <div
            style={{
              position: 'absolute',
              left: -width * 0.16,
              bottom: -regionH * 0.5,
              width: width * 0.5,
              height: regionH * 0.95,
              borderRadius: '46% 54% 0 0',
              background: 'linear-gradient(160deg, #2E2620 0%, #1A1511 70%)',
              filter: 'blur(34px)',
              opacity: 0.92,
            }}
          />
        ) : null}
      </div>
      {vertical ? <Desk top={regionTop + regionH} width={width} height={height - regionTop - regionH} e={e} a={a} phase={phase} light={light} /> : null}
    </AbsoluteFill>
  );
};

/** Vertical only: the hand and keyboard under the screen, so edit and click share the frame. */
const Desk: React.FC<{top: number; width: number; height: number; e: number; a: number; phase: Phase; light: Light}> = ({
  top,
  width,
  height,
  e,
  a,
  phase,
  light,
}) => {
  const frame = useCurrentFrame();
  const typing = phase !== 'approve' && e > EDIT.typeFrom && e < EDIT.typeTo;
  const hot = typing ? (frame * 7) % 36 : -1;
  const warm = light === 'late' ? 'rgba(255,170,90,0.20)' : light === 'warm' ? 'rgba(255,214,160,0.12)' : 'rgba(255,255,255,0.05)';
  const clicking = a >= APPROVE.press && a < APPROVE.done;
  return (
    <div style={{position: 'absolute', left: 0, top, width, height, background: 'linear-gradient(180deg, #2A231D 0%, #1B1612 100%)', overflow: 'hidden'}}>
      <div style={{position: 'absolute', inset: 0, background: `linear-gradient(100deg, ${warm} 0%, rgba(0,0,0,0) 60%)`}} />
      {/* Keyboard */}
      <div style={{position: 'absolute', left: 90, top: 150, width: 640, display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 8, transform: 'perspective(900px) rotateX(38deg)', transformOrigin: '50% 0'}}>
        {Array.from({length: 36}).map((_, i) => (
          <div key={i} style={{height: 46, borderRadius: 7, background: i === hot ? '#5B5046' : '#3A322B', boxShadow: '0 3px 0 #120E0B'}} />
        ))}
        <div style={{gridColumn: '3 / 11', height: 46, borderRadius: 7, background: '#3A322B', boxShadow: '0 3px 0 #120E0B'}} />
      </div>
      {/* Mouse */}
      <div
        style={{
          position: 'absolute',
          left: 800,
          top: 200,
          width: 110,
          height: 170,
          borderRadius: '55px 55px 60px 60px',
          background: '#3F362E',
          boxShadow: '0 12px 30px rgba(0,0,0,0.45)',
          transform: `translateY(${clicking ? 3 : 0}px) rotate(-8deg)`,
        }}
      />
    </div>
  );
};
