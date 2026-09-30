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

// The product on the doctor's screen: a calm, legible clinical UI with no
// product name on it. Laid out as a 1280×800 window and filmed by a locked-off
// virtual camera with a slow eased push. Every state change (selection, typing,
// hover, approve) is continuous, so nothing pops.
export const CANVAS_W = 1280;
export const CANVAS_H = 800;
// The vertical cut shows the same app in a narrow window: sidebar hidden, labels stacked.
export const COMPACT_W = 720;
export const COMPACT_H = 820;

const ui = {
  bg: '#F6F5F1',
  panel: '#FFFFFF',
  ink: '#16211D',
  body: '#27322E',
  muted: '#707A76',
  faint: '#A3AAA6',
  line: '#E8E6E0',
  accent: '#1F5E52',
  accentHover: '#184B41',
  accentSoft: '#E4EFEB',
  select: 'rgba(31,94,82,0.18)',
  edited: 'rgba(31,94,82,0.07)',
  draft: '#946118',
  draftSoft: '#FAF0DD',
  font: 'Inter, -apple-system, "Helvetica Neue", Arial, sans-serif',
  shadow: '0 1px 2px rgba(22,33,29,0.04), 0 10px 30px rgba(22,33,29,0.06)',
};

// Camera targets in window pixels (measured from the layout): the edit, and the approve button.
const editTarget: Record<DocId, [number, number]> = {
  note: [775, 456],
  referral: [650, 382],
  followup: [947, 334],
  booking: [760, 380],
  list: [785, 350],
};
const buttonTarget: Record<DocId, [number, number]> = {
  note: [1138, 567],
  referral: [1136, 509],
  followup: [1136, 477],
  booking: [1135, 503],
  list: [1135, 503],
};
const cardCenter: [number, number] = [785, 370];
const compactEdit: Record<DocId, [number, number]> = {
  note: [330, 560],
  referral: [300, 470],
  followup: [440, 404],
  booking: [360, 430],
  list: [360, 330],
};
const compactButton: Record<DocId, [number, number]> = {
  note: [592, 660],
  referral: [590, 578],
  followup: [590, 578],
  booking: [590, 572],
  list: [590, 572],
};
const compactCenter: [number, number] = [360, 380];

const clamp = (x: number) => Math.min(1, Math.max(0, x));
const smooth = (x: number) => {
  const c = clamp(x);
  return c * c * (3 - 2 * c);
};
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const window01 = (x: number, from: number, len: number) => smooth((x - from) / len);

const backdrop: Record<Light, string> = {
  day: 'radial-gradient(120% 100% at 25% 15%, #F4F2ED 0%, #E2DDD3 55%, #D2CBBF 100%)',
  warm: 'radial-gradient(120% 100% at 25% 15%, #F5ECDF 0%, #E4D4BD 55%, #D3BE9F 100%)',
  late: 'radial-gradient(120% 100% at 25% 15%, #F6E3C8 0%, #E3C29A 55%, #C99E72 100%)',
  amber: 'radial-gradient(120% 100% at 25% 15%, #F6E3C8 0%, #E3C29A 55%, #C99E72 100%)',
  dusk: '#1A1714',
  corridor: '#1A1714',
};
const lightSweep: Record<Light, string> = {
  day: 'linear-gradient(115deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0) 45%)',
  warm: 'linear-gradient(115deg, rgba(255,220,170,0.12) 0%, rgba(255,220,170,0) 50%)',
  late: 'linear-gradient(115deg, rgba(255,180,110,0.16) 0%, rgba(255,180,110,0.02) 60%)',
  amber: 'linear-gradient(115deg, rgba(255,180,110,0.16) 0%, rgba(255,180,110,0.02) 60%)',
  dusk: 'none',
  corridor: 'none',
};

const Pointer: React.FC<{x: number; y: number; press: number; opacity: number}> = ({x, y, press, opacity}) => (
  <svg
    width="28"
    height="36"
    viewBox="0 0 28 36"
    style={{
      position: 'absolute',
      left: x - 4,
      top: y - 3,
      opacity,
      transform: `scale(${1 - 0.1 * press})`,
      transformOrigin: '4px 3px',
      filter: 'drop-shadow(0 2px 3px rgba(0,0,0,0.25))',
    }}
  >
    <path d="M4 3 L4 27 L10 21.5 L14.5 31.5 L18.6 29.7 L14.2 20 L22 20 Z" fill="#111" stroke="#fff" strokeWidth="1.8" strokeLinejoin="round" />
  </svg>
);

const Check: React.FC<{size?: number; color?: string; draw?: number; width?: number}> = ({size = 14, color = ui.accent, draw = 1, width = 2}) => (
  <svg width={size} height={size} viewBox="0 0 16 16">
    <path
      d="M3.2 8.6l3 2.9 6.6-6.8"
      stroke={color}
      strokeWidth={width}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeDasharray={16}
      strokeDashoffset={16 * (1 - draw)}
    />
  </svg>
);

const Avatar: React.FC<{initials: string; size: number; tone: string}> = ({initials, size, tone}) => (
  <span
    style={{
      width: size,
      height: size,
      borderRadius: size / 2,
      background: tone,
      color: ui.ink,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: size * 0.38,
      fontWeight: 600,
      flexShrink: 0,
      letterSpacing: 0.2,
    }}
  >
    {initials}
  </span>
);

const tones = ['#E6E0F2', '#F4E3D3', '#DDEBE5', '#E3E8F2', '#F2E0E0', '#E8EDD9'];
const initialsOf = (name: string) =>
  name
    .split(' ')
    .map((w) => w[0])
    .join('');

/** The inline edit: old text → selected → new text typed with a soft caret. */
const EditSpan: React.FC<{old: string; neu: string; e: number; frame: number}> = ({old, neu, e, frame}) => {
  const caretOpacity = 0.5 + 0.5 * Math.cos((frame / 30) * Math.PI * 2);
  const caret = (
    <span
      style={{
        display: 'inline-block',
        width: 2,
        height: '1.15em',
        background: ui.accent,
        verticalAlign: '-0.18em',
        marginLeft: 1,
        borderRadius: 1,
        opacity: caretOpacity,
      }}
    />
  );
  if (e < EDIT.select) return <span>{old}</span>;
  if (e < EDIT.typeFrom) {
    const n = Math.round(smooth((e - EDIT.select) / (EDIT.selected - EDIT.select)) * old.length);
    return (
      <span>
        <span style={{background: ui.select, borderRadius: 3}}>{old.slice(0, n)}</span>
        {old.slice(n)}
      </span>
    );
  }
  const n = typedChars({old, neu}, e);
  const settle = window01(e, EDIT.typeTo, 0.08);
  return (
    <span
      style={{
        background: ui.edited,
        borderRadius: 3,
        boxShadow: `inset 0 -2px 0 rgba(31,94,82,${0.85 * settle})`,
        padding: '0 1px',
      }}
    >
      {neu.slice(0, n)}
      {e < 1 ? caret : null}
    </span>
  );
};

const TopBar: React.FC<{compact?: boolean}> = ({compact}) => (
  <div
    style={{
      height: 64,
      display: 'flex',
      alignItems: 'center',
      gap: 18,
      padding: '0 24px',
      borderBottom: `1px solid ${ui.line}`,
      background: ui.panel,
    }}
  >
    {/* Neutral app mark, no product name */}
    <span style={{width: 28, height: 28, borderRadius: 8, background: `linear-gradient(145deg, #2C7466, ${ui.accent})`}} />
    <span style={{fontSize: 16, fontWeight: 600, color: ui.ink}}>Today</span>
    <span style={{fontSize: 15, color: ui.muted}}>{compact ? clinic.date : `${clinic.date} · ${clinic.room}`}</span>
    {compact ? null : (
    <span
      style={{
        marginLeft: 'auto',
        width: 300,
        height: 38,
        borderRadius: 10,
        background: ui.bg,
        border: `1px solid ${ui.line}`,
        display: 'flex',
        alignItems: 'center',
        padding: '0 14px',
        gap: 10,
        fontSize: 14.5,
        color: ui.faint,
      }}
    >
      <svg width="15" height="15" viewBox="0 0 16 16">
        <circle cx="7" cy="7" r="5" stroke={ui.faint} strokeWidth="1.6" fill="none" />
        <path d="M11 11l3.2 3.2" stroke={ui.faint} strokeWidth="1.6" strokeLinecap="round" />
      </svg>
      Search patients
    </span>
    )}
    <span style={{marginLeft: compact ? 'auto' : 0, display: 'flex', alignItems: 'center', gap: 10, fontSize: 15, color: ui.ink, fontWeight: 500}}>
      <Avatar initials={clinic.initials} size={34} tone={ui.accentSoft} />
      {compact ? null : clinic.doctor}
    </span>
  </div>
);

const Sidebar: React.FC<{active: number; allDone: boolean; approved: number}> = ({active, allDone, approved}) => (
  <div style={{width: 292, borderRight: `1px solid ${ui.line}`, background: ui.bg, padding: '22px 14px'}}>
    <div style={{padding: '0 12px 12px', fontSize: 12, letterSpacing: 1.4, textTransform: 'uppercase', color: ui.muted, fontWeight: 600}}>
      Appointments · 6
    </div>
    <div style={{display: 'flex', flexDirection: 'column', gap: 4}}>
      {day.map((p, i) => {
        const done = allDone || i < active;
        const on = i === active;
        const doneNow = on ? approved : done ? 1 : 0;
        return (
          <div
            key={p.name}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '10px 12px',
              borderRadius: 12,
              background: on ? ui.panel : 'transparent',
              boxShadow: on ? ui.shadow : 'none',
            }}
          >
            <Avatar initials={initialsOf(p.name)} size={34} tone={tones[i]} />
            <span style={{flex: 1, minWidth: 0}}>
              <span style={{display: 'block', fontSize: 15.5, color: ui.ink, fontWeight: on ? 600 : 500}}>{p.name}</span>
              <span style={{display: 'block', fontSize: 13, color: ui.muted, marginTop: 2, fontVariantNumeric: 'tabular-nums'}}>
                {p.time} · {p.item}
              </span>
            </span>
            <span
              style={{
                width: 22,
                height: 22,
                borderRadius: 11,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: `rgba(31,94,82,${0.12 * doneNow})`,
              }}
            >
              {doneNow > 0 ? <Check size={14} draw={doneNow} /> : on ? <span style={{width: 7, height: 7, borderRadius: 4, background: ui.draft}} /> : null}
            </span>
          </div>
        );
      })}
    </div>
  </div>
);

const Calendar: React.FC<{e: number; approved: number; compact?: boolean}> = ({e, approved, compact}) => {
  const days = ['Mon 23', 'Tue 24', 'Wed 25', 'Thu 26', 'Fri 27'];
  const moved = window01(e, EDIT.typeTo - 0.04, 0.1);
  const cell = (i: number) => {
    const fromOld = i === 2 ? 1 - moved : 0;
    const toNew = i === 4 ? moved : 0;
    return Math.max(fromOld, toNew);
  };
  return (
    <div style={{display: 'flex', gap: 10, marginTop: 12}}>
      {days.map((d, i) => {
        const on = cell(i);
        const time = i === 4 ? '09:00' : '14:30';
        return (
          <div
            key={d}
            style={{
              flex: 1,
              height: 78,
              borderRadius: 12,
              border: `1.5px solid ${on > 0.01 ? `rgba(31,94,82,${on})` : ui.line}`,
              background: i === 4 ? `rgba(228,239,235,${approved})` : ui.panel,
              padding: '10px 12px',
              fontSize: 13.5,
              color: ui.muted,
              position: 'relative',
            }}
          >
            <div>{d} Nov</div>
            <div style={{marginTop: 8, color: ui.accent, fontWeight: 600, fontSize: 14, opacity: on}}>{compact ? time : `${time} · Maya`}</div>
          </div>
        );
      })}
    </div>
  );
};

const StatusPill: React.FC<{approved: number}> = ({approved}) => (
  <span style={{position: 'relative', display: 'inline-flex', height: 28}}>
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        fontSize: 13,
        fontWeight: 600,
        padding: '0 12px',
        borderRadius: 14,
        color: ui.draft,
        background: ui.draftSoft,
        opacity: 1 - approved,
        whiteSpace: 'nowrap',
      }}
    >
      <span style={{width: 7, height: 7, borderRadius: 4, background: ui.draft}} />
      Draft · awaiting your approval
    </span>
    <span
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        fontSize: 13,
        fontWeight: 600,
        padding: '0 12px',
        borderRadius: 14,
        color: ui.accent,
        background: ui.accentSoft,
        opacity: approved,
        whiteSpace: 'nowrap',
      }}
    >
      <Check size={13} draw={approved} /> Approved
    </span>
  </span>
);

const DocCard: React.FC<{doc: DocId; e: number; a: number; read: number; frame: number; compact?: boolean}> = ({doc, e, a, read, frame, compact}) => {
  const d = docs[doc];
  const approved = window01(a, APPROVE.done - 0.02, 0.1);
  const edited = d.edit ? window01(e, EDIT.typeTo, 0.08) : 0;
  const hover = window01(a, APPROVE.hover - 0.04, 0.08);
  const press = window01(a, APPROVE.press - 0.03, 0.04) * (1 - window01(a, APPROVE.press + 0.04, 0.05));
  const readPos = read * d.sections.length;
  return (
    <div style={{flex: 1, display: 'flex', flexDirection: 'column', padding: compact ? '24px 22px' : '28px 36px 28px', gap: 20, minWidth: 0}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 16}}>
        <Avatar initials={initialsOf(d.patient.name)} size={52} tone={tones[Math.max(0, d.nav)]} />
        <span>
          <span style={{display: 'block', fontSize: 26, fontWeight: 600, color: ui.ink, letterSpacing: -0.3}}>{d.patient.name}</span>
          <span style={{display: 'block', fontSize: 14.5, color: ui.muted, marginTop: 3}}>{d.patient.meta}</span>
        </span>
        {compact ? null : (
          <span style={{marginLeft: 'auto', fontSize: 13.5, color: ui.muted, padding: '6px 12px', borderRadius: 14, border: `1px solid ${ui.line}`, background: ui.panel}}>
            No known allergies
          </span>
        )}
      </div>
      <div style={{background: ui.panel, border: `1px solid ${ui.line}`, borderRadius: 16, boxShadow: ui.shadow, display: 'flex', flexDirection: 'column'}}>
        <div style={{display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 14, rowGap: 10, padding: '18px 24px 6px'}}>
          <span style={{fontSize: 19, fontWeight: 600, color: ui.ink, letterSpacing: -0.2}}>{d.title}</span>
          <StatusPill approved={approved} />
          <span
            style={{
              marginLeft: compact ? 0 : 'auto',
              flexBasis: compact ? '100%' : 'auto',
              fontSize: 13.5,
              color: ui.accent,
              fontWeight: 500,
              opacity: edited,
              transform: `translateY(${(1 - edited) * 4}px)`,
            }}
          >
            Edited by you · 1 change
          </span>
        </div>
        <div style={{padding: '0 24px 10px', fontSize: 14, color: ui.muted}}>Drafted from today’s consultation. Nothing is sent until you approve.</div>
        <div style={{padding: '4px 12px 14px', display: 'flex', flexDirection: 'column', gap: 2}}>
          {d.sections.map((s, i) => {
            const glow = read > 0 ? Math.max(0, 1 - Math.abs(readPos - (i + 0.5)) * 1.4) : 0;
            return (
              <div
                key={s.label}
                style={{
                  display: 'flex',
                  flexDirection: compact ? 'column' : 'row',
                  gap: compact ? 4 : 20,
                  padding: '12px 12px',
                  borderRadius: 10,
                  background: `rgba(31,94,82,${0.045 * glow})`,
                }}
              >
                <span style={{width: 140, flexShrink: 0, fontSize: 12, letterSpacing: 1.1, textTransform: 'uppercase', color: ui.muted, fontWeight: 600, paddingTop: 5}}>
                  {s.label}
                </span>
                <div style={{flex: 1, fontSize: 20, lineHeight: 1.6, color: ui.body}}>
                  {s.text ?? (
                    <>
                      {s.before}
                      {d.edit ? <EditSpan old={d.edit.old} neu={d.edit.neu} e={e} frame={frame} /> : null}
                      {s.after}
                    </>
                  )}
                  {d.calendar && s.label === 'Time' ? <Calendar e={e} approved={approved} compact={compact} /> : null}
                </div>
              </div>
            );
          })}
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            padding: '14px 24px',
            borderTop: `1px solid ${ui.line}`,
            height: 72,
            boxSizing: 'border-box',
            position: 'relative',
          }}
        >
          {compact ? null : <span style={{fontSize: 14, color: ui.muted}}>You review every line before it goes anywhere.</span>}
          <span style={{marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 12, opacity: 1 - approved}}>
            <span style={{fontSize: 15, color: ui.muted, fontWeight: 500, padding: '10px 14px'}}>Discard</span>
            <span
              style={{
                fontSize: 16,
                fontWeight: 600,
                color: '#fff',
                padding: '12px 22px',
                borderRadius: 11,
                background: hover > 0 ? `color-mix(in srgb, ${ui.accentHover} ${Math.round(hover * 100)}%, ${ui.accent})` : ui.accent,
                boxShadow: `0 1px 2px rgba(0,0,0,0.12), 0 ${4 + 4 * hover}px ${12 + 8 * hover}px rgba(31,94,82,${0.18 + 0.12 * hover})`,
                transform: `scale(${1 - 0.035 * press})`,
              }}
            >
              {d.button}
            </span>
          </span>
          <span
            style={{
              position: 'absolute',
              right: 24,
              top: 0,
              bottom: 0,
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              fontSize: 16,
              color: ui.accent,
              fontWeight: 600,
              opacity: approved,
              transform: `translateY(${(1 - approved) * 6}px)`,
            }}
          >
            <span style={{width: 28, height: 28, borderRadius: 14, background: ui.accentSoft, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <Check size={16} draw={approved} width={2.2} />
            </span>
            {d.done}
          </span>
        </div>
      </div>
    </div>
  );
};

const DayList: React.FC<{read: number; compact?: boolean}> = ({read, compact}) => {
  const pos = read * day.length;
  return (
    <div style={{flex: 1, padding: compact ? '24px 22px' : '28px 36px', display: 'flex', flexDirection: 'column', gap: 20}}>
      <div>
        <div style={{fontSize: 26, fontWeight: 600, color: ui.ink, letterSpacing: -0.3}}>All caught up</div>
        <div style={{fontSize: 14.5, color: ui.muted, marginTop: 4}}>
          {clinic.date} · every draft approved by you
        </div>
      </div>
      <div style={{background: ui.panel, border: `1px solid ${ui.line}`, borderRadius: 16, boxShadow: ui.shadow, padding: 8}}>
        {day.map((p, i) => {
          const glow = Math.max(0, 1 - Math.abs(pos - (i + 0.5)) * 1.2);
          return (
            <div
              key={p.name}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                padding: '12px 14px',
                borderRadius: 10,
                background: `rgba(31,94,82,${0.045 * glow})`,
                fontSize: 16.5,
              }}
            >
              <Avatar initials={initialsOf(p.name)} size={34} tone={tones[i]} />
              <span style={{width: 58, color: ui.muted, fontVariantNumeric: 'tabular-nums'}}>{p.time}</span>
              <span style={{width: compact ? 150 : 190, color: ui.ink, fontWeight: 500}}>{p.name}</span>
              {compact ? <span style={{flex: 1}} /> : <span style={{flex: 1, color: ui.muted}}>{p.item}</span>}
              <span style={{display: 'flex', alignItems: 'center', gap: 6, color: ui.accent, fontWeight: 600, fontSize: 14.5}}>
                <Check /> Approved
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const Monitor: React.FC<{doc: DocId; e: number; a: number; read: number; frame: number; compact?: boolean}> = ({doc, e, a, read, frame, compact}) => {
  const d = docs[doc];
  const approved = window01(a, APPROVE.done - 0.02, 0.1);
  // Pointer glides in from the text to the button, clicks, then fades away.
  const glide = smooth((a - 0.02) / (APPROVE.hover - 0.02));
  const et = (compact ? compactEdit : editTarget)[doc];
  const bt = (compact ? compactButton : buttonTarget)[doc];
  const px = lerp(et[0] + (compact ? 60 : 140), bt[0] + 14, glide);
  const py = lerp(et[1] + 50, bt[1] + 8, glide);
  const pointerIn = window01(a, 0, 0.08) * (1 - window01(a, APPROVE.done + 0.12, 0.12));
  const press = window01(a, APPROVE.press - 0.03, 0.04) * (1 - window01(a, APPROVE.press + 0.04, 0.05));
  return (
    <div
      style={{
        width: compact ? COMPACT_W : CANVAS_W,
        height: compact ? COMPACT_H : CANVAS_H,
        background: ui.bg,
        fontFamily: ui.font,
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        borderRadius: 18,
        overflow: 'hidden',
      }}
    >
      <TopBar compact={compact} />
      <div style={{flex: 1, display: 'flex', minHeight: 0}}>
        {compact ? null : <Sidebar active={doc === 'list' ? -1 : d.nav} allDone={doc === 'list'} approved={doc === 'followup' ? 0 : approved} />}
        {doc === 'list' ? <DayList read={read} compact={compact} /> : <DocCard doc={doc} e={e} a={a} read={read} frame={frame} compact={compact} />}
      </div>
      {pointerIn > 0 ? <Pointer x={px} y={py} press={press} opacity={pointerIn} /> : null}
    </div>
  );
};

// Window scale per framing. Landscape: the wide shows the whole window with air
// around it; the close shots hold on the text being edited.
const framingScale: Record<Framing, number> = {ots: 1.22, cu: 1.5, ecu: 1.85};
const verticalScale: Record<Framing, number> = {ots: 1.36, cu: 1.46, ecu: 1.5};
export const VERTICAL = {windowCenterY: 1000};

/** A screen shot: the window on a soft backdrop, locked off, with a slow eased push. */
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
  const p = clamp((frame - from) / (to - from));
  const {e, a, read} = phaseProgress(phase, p);

  const s = (vertical ? verticalScale[framing] : framingScale[framing]) * (1 + 0.03 * smooth(p));

  // Camera target: the edit while editing, easing across to the button to approve.
  const W = vertical ? COMPACT_W : CANVAS_W;
  const H = vertical ? COMPACT_H : CANVAS_H;
  const pan = phase === 'approve' ? 1 : phase === 'both' ? smooth(a / APPROVE.pan) : 0;
  const wide = framing === 'ots';
  const centre = vertical ? compactCenter : cardCenter;
  const edit = wide ? centre : (vertical ? compactEdit : editTarget)[doc];
  const button = (vertical ? compactButton : buttonTarget)[doc];
  const approveView: [number, number] = wide
    ? [lerp(centre[0], button[0], 0.3), lerp(centre[1], button[1], 0.3)]
    : [button[0] - (framing === 'ecu' ? 120 : vertical ? 120 : 220), button[1] - 90];
  let tx = lerp(edit[0], approveView[0], pan);
  const ty = lerp(edit[1], approveView[1], pan);
  if (vertical) tx = centre[0]; // never crop the text column on a phone

  const cx = width / 2;
  const cy = vertical ? VERTICAL.windowCenterY : height / 2;
  // Keep the camera inside the window; a window smaller than the frame sits centred.
  const fit = (pos: number, frameSize: number, size: number, c: number) =>
    size <= frameSize ? c - size / 2 : Math.min(0, Math.max(frameSize - size, pos));
  const left = fit(cx - tx * s, width, W * s, cx);
  const top = fit(cy - ty * s, height, H * s, cy);

  return (
    <AbsoluteFill style={{background: backdrop[light], overflow: 'hidden'}}>
      <div
        style={{
          position: 'absolute',
          left,
          top,
          width: W,
          height: H,
          transform: `scale(${s})`,
          transformOrigin: '0 0',
          borderRadius: 18,
          boxShadow: '0 2px 6px rgba(40,30,20,0.08), 0 30px 80px rgba(40,30,20,0.22)',
        }}
      >
        <Monitor doc={doc} e={e} a={a} read={read} frame={frame} compact={vertical} />
      </div>
      <AbsoluteFill style={{background: lightSweep[light], pointerEvents: 'none'}} />
    </AbsoluteFill>
  );
};
