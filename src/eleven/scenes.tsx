import React from 'react';
import {AbsoluteFill, Easing, Img, interpolate, staticFile} from 'remotion';
import {fonts} from '../theme';
import {
  SAGE,
  Cutout,
  Dots,
  GlassPill,
  Glyph,
  GridBg,
  H,
  HalftoneBg,
  EMBER,
  Typed,
  W,
  Word,
  WordsIn,
  clamp,
  collageText,
  ink,
  useSpr,
} from './parts';

const ease = Easing.bezier(0.22, 1, 0.36, 1);
const inOut = Easing.bezier(0.65, 0, 0.35, 1);

// =============================================================== collages
const Camera: React.FC<{f: number; drift?: number; zoom?: [number, number, number]; children: React.ReactNode}> = ({
  f,
  drift = 1.4,
  zoom,
  children,
}) => {
  const s = zoom ? interpolate(f, [0, zoom[2]], [zoom[0], zoom[1]], {...clamp, easing: Easing.out(Easing.quad)}) : 1;
  return (
    <AbsoluteFill style={{transform: `translateX(${-f * drift}px) scale(${s})`, transformOrigin: '50% 50%'}}>
      {children}
    </AbsoluteFill>
  );
};

const AppTile: React.FC<{f: number; x: number; y: number; d: number}> = ({f, x, y, d}) => {
  const s = useSpr(f, d, 11, 200, 0.6);
  if (f < d) return null;
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: 92,
        height: 92,
        borderRadius: 22,
        background: 'linear-gradient(160deg, #D9B08A, #A86F48)',
        boxShadow: '0 10px 24px rgba(168,111,72,0.35)',
        transform: `scale(${s})`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <svg width={50} height={50} viewBox="0 0 32 32">
        <path d="M2 17h6l3-8 5 15 4-10 2 3h8" stroke="#fff" strokeWidth={3.2} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
};

const BlueChip: React.FC<{f: number; x: number; y: number; d: number; label: string}> = ({f, x, y, d, label}) => {
  const s = useSpr(f, d, 12, 200, 0.6);
  if (f < d) return null;
  const click = interpolate(f, [d + 12, d + 14, d + 17], [1, 0.9, 1], clamp);
  const cx = interpolate(f, [d, d + 11], [150, 88], {...clamp, easing: ease});
  const cy = interpolate(f, [d, d + 11], [70, 26], {...clamp, easing: ease});
  return (
    <div style={{position: 'absolute', left: x, top: y, transform: `scale(${s})`, transformOrigin: 'left top'}}>
      <div
        style={{
          fontFamily: fonts.sans,
          fontSize: 30,
          fontWeight: 500,
          color: '#fff',
          background: '#5E7F6C',
          padding: '9px 18px',
          borderRadius: 10,
          transform: `scale(${click})`,
          boxShadow: '0 8px 20px rgba(94,127,108,0.35)',
          whiteSpace: 'nowrap',
        }}
      >
        {label}
      </div>
      <svg width={40} height={40} viewBox="0 0 24 24" style={{position: 'absolute', left: cx, top: cy}}>
        <path d="M5 2l14 10-6 1.5 3.5 7-2.6 1.3-3.5-7L6 19z" fill="#fff" stroke="#111" strokeWidth={1.4} strokeLinejoin="round" />
      </svg>
    </div>
  );
};

const ConsultCard: React.FC<{f: number; x: number; y: number; d: number}> = ({f, x, y, d}) => {
  const s = useSpr(f, d, 12, 200, 0.6);
  if (f < d) return null;
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: 300,
        padding: '18px 22px',
        borderRadius: 14,
        background: 'linear-gradient(160deg, #4A392B, #2A1F17)',
        border: '1.5px solid rgba(255,255,255,0.15)',
        boxShadow: '0 14px 30px rgba(0,0,0,0.22)',
        transform: `scale(${s})`,
        transformOrigin: 'left top',
        fontFamily: fonts.sans,
        color: '#fff',
      }}
    >
      <div style={{fontSize: 26, fontWeight: 500}}>Consult</div>
      <div style={{fontSize: 15, opacity: 0.65, marginTop: 4}}>Today · 09:40 – 09:50</div>
      <div style={{display: 'flex', gap: 8, marginTop: 12}}>
        <div style={{width: 44, height: 12, borderRadius: 6, background: '#8FAE95'}} />
        <div style={{width: 70, height: 12, borderRadius: 6, background: 'rgba(255,255,255,0.8)'}} />
      </div>
    </div>
  );
};

export const Collage1: React.FC<{f: number}> = ({f}) => (
  <AbsoluteFill>
    <GridBg />
    <Camera f={f}>
      <Word f={f} t="A patient starts to explain" x={540} y={190} d={2} />
      <AppTile f={f} x={250} y={330} d={14} />
      <Word f={f} t="why" x={230} y={540} d={22} />
      <Glyph f={f} kind="chat" x={760} y={610} d={26} size={56} />
      <Word f={f} t="they can't" x={940} y={480} d={28} />
      <Word f={f} t="sleep." x={1250} y={660} d={36} />
      <Cutout f={f} src="throw_pillows_01" x={1500} y={100} size={300} d={20} />
      <Cutout f={f} src="mug" x={290} y={720} size={240} d={26} />
      <Cutout f={f} src="potted_plant_04" x={830} y={780} size={200} d={32} />
      <Cutout f={f} src="round_spectacles" x={1500} y={500} size={320} d={38} tile={false} />
      <Cutout f={f} src="lemon" x={1680} y={850} size={160} d={44} />
      <Cutout f={f} src="tea_set_01" x={60} y={50} size={200} d={40} />
      <Dots f={f} x={1690} y={0} w={240} h={120} d={56} />
      <Dots f={f} x={0} y={960} w={240} h={120} d={60} color="rgba(200,155,109,0.85)" />
    </Camera>
  </AbsoluteFill>
);

export const Collage2: React.FC<{f: number}> = ({f}) => (
  <AbsoluteFill>
    <GridBg />
    <Camera f={f}>
      <BlueChip f={f} x={190} y={160} d={3} label="Save note" />
      <Word f={f} t="Another" x={430} y={330} d={2} />
      <Word f={f} t="tries to" x={900} y={230} d={7} />
      <Word f={f} t="describe" x={620} y={520} d={12} />
      <Glyph f={f} kind="pulse" x={1090} y={525} d={12} size={60} />
      <Word f={f} t="the pain." x={1230} y={650} d={18} />
      <Cutout f={f} src="steth" x={1360} y={80} size={330} d={4} />
      <Cutout f={f} src="medical_box" x={120} y={640} size={290} d={8} />
      <Cutout f={f} src="medical_tape" x={820} y={770} size={200} d={13} />
      <Cutout f={f} src="wheelchair_01" x={1560} y={500} size={380} d={16} tile={false} />
      <Cutout f={f} src="magnifying_glass_01" x={500} y={840} size={180} d={20} />
      <Dots f={f} x={1560} y={960} w={360} h={120} d={30} />
    </Camera>
  </AbsoluteFill>
);

export const Collage3: React.FC<{f: number}> = ({f}) => (
  <AbsoluteFill>
    <GridBg />
    <Camera f={f}>
      <ConsultCard f={f} x={140} y={250} d={3} />
      <Word f={f} t="Another" x={560} y={330} d={3} />
      <Word f={f} t="just wants" x={980} y={250} d={8} />
      <Word f={f} t="to ask" x={430} y={560} d={13} />
      <Glyph f={f} kind="mic" x={850} y={575} d={13} size={56} />
      <Word f={f} t="a question." x={1080} y={540} d={17} />
      <Cutout f={f} src="office_notepads" x={680} y={30} size={220} d={5} />
      <Cutout f={f} src="lightbulb_01" x={1500} y={70} size={260} d={7} />
      <Cutout f={f} src="stationery_supplies" x={130} y={680} size={260} d={10} />
      <Cutout f={f} src="SchoolChair_01" x={1480} y={540} size={400} d={14} tile={false} />
      <Cutout f={f} src="desk_lamp_arm_01" x={840} y={720} size={280} d={18} />
      <Cutout f={f} src="binder_notebook" x={1220} y={820} size={200} d={22} />
      <Dots f={f} x={0} y={0} w={240} h={120} d={30} />
    </Camera>
  </AbsoluteFill>
);

export const Collage4: React.FC<{f: number}> = ({f}) => (
  <AbsoluteFill>
    <GridBg />
    <Camera f={f} drift={0.6} zoom={[1.12, 0.9, 98]}>
      <Word f={f} t="It's not rudeness." x={640} y={320} d={3} />
      <Word f={f} t="Someone" x={410} y={470} d={28} />
      <Glyph f={f} kind="doc" x={790} y={490} d={31} size={52} />
      <Word f={f} t="has to" x={920} y={460} d={33} />
      <Word f={f} t="write" x={1190} y={560} d={39} />
      <Word f={f} t="the note." x={1330} y={450} d={45} />
      <Cutout f={f} src="clipboard" x={220} y={70} size={250} d={6} />
      <Cutout f={f} src="classic_laptop" x={1360} y={660} size={360} d={9} />
      <Cutout f={f} src="vintage_stapler" x={1540} y={100} size={230} d={13} />
      <Cutout f={f} src="office_notepads" x={860} y={50} size={190} d={17} />
      <Cutout f={f} src="binder_notebook" x={80} y={620} size={250} d={20} />
      <Cutout f={f} src="stationery_supplies" x={590} y={760} size={220} d={24} />
      <Cutout f={f} src="decorative_book_set_01" x={930} y={730} size={330} d={28} tile={false} />
      <Cutout f={f} src="cardboard_box_01" x={1720} y={430} size={190} d={33} />
      <Cutout f={f} src="desk_lamp_arm_01" x={1150} y={80} size={230} d={38} tile={false} />
      <Cutout f={f} src="mug" x={390} y={900} size={160} d={44} />
      <Cutout f={f} src="wall_clock" x={1760} y={850} size={170} d={48} />
      <Cutout f={f} src="steth" x={-60} y={350} size={230} d={52} tile={false} />
      <Cutout f={f} src="medical_box" x={1850} y={0} size={170} d={56} />
      <Cutout f={f} src="lightbulb_01" x={-90} y={880} size={180} d={60} />
      <Dots f={f} x={1560} y={1000} w={360} h={120} d={70} />
    </Camera>
  </AbsoluteFill>
);

// =============================================================== hero (halftone) scenes
const SEQ_N = 72;

export const Hero: React.FC<{f: number; seq: 'clock' | 'pwatch' | 'laptop'; seed: number; size?: number; pill: {x: number; y: number}}> = ({
  f,
  seq,
  seed,
  size = 860,
  pill,
}) => {
  // swing in, then keep turning slowly
  const a = interpolate(f, [0, 26], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  const idx = Math.round(Math.min(SEQ_N - 1, a * 56 + interpolate(f, [26, 60], [0, 9], clamp)));
  const sc = interpolate(a, [0, 1], [1.2, 1]);
  const tx = interpolate(a, [0, 1], [160, 0]);
  const bob = Math.sin(f / 18) * 6;
  const secs = Math.max(0, Math.min(11, Math.floor((f - 14) / 2)));
  const pillIn = useSpr(f, 12, 13, 200, 0.6);
  const blink = Math.floor(f / 6) % 2 === 0;
  return (
    <AbsoluteFill>
      <HalftoneBg f={f + seed * 40} pal={SAGE} seed={seed} />
      <Img
        src={staticFile(`eleven/3d/${seq}/${String(idx).padStart(3, '0')}.webp`)}
        style={{
          position: 'absolute',
          left: W / 2 - size / 2,
          top: H / 2 - size / 2 + 20,
          width: size,
          height: size,
          transform: `translate(${tx}px, ${bob}px) scale(${sc})`,
          filter: 'drop-shadow(0 40px 40px rgba(30,40,30,0.35))',
        }}
      />
      {f >= 12 && (
        <div style={{position: 'absolute', left: pill.x, top: pill.y, transform: `scale(${pillIn})`, transformOrigin: 'left center'}}>
          <GlassPill>
            <span style={{width: 10, height: 10, borderRadius: 5, background: '#E8A46A', opacity: secs >= 11 ? 1 : blink ? 1 : 0.3}} />
            <span style={{fontVariantNumeric: 'tabular-nums'}}>0:{String(secs).padStart(2, '0')}</span>
            <Typed text="Interrupted" f={f} start={37} cpf={1.2} fade={3} />
          </GlassPill>
        </div>
      )}
      <div
        style={{
          position: 'absolute',
          left: 60,
          bottom: 48,
          fontFamily: fonts.sans,
          fontSize: 18,
          color: 'rgba(255,255,255,0.8)',
          opacity: interpolate(f, [8, 16], [0, 1], clamp),
          letterSpacing: 0.2,
        }}
      >
        Average time a patient talks before being interrupted: 11 seconds · J Gen Intern Med, 2018
      </div>
    </AbsoluteFill>
  );
};

// =============================================================== bloom: red → orb
export const ORB = {x: W / 2, y: H / 2};

const orbFill = (t: number) =>
  `radial-gradient(circle at ${40 + Math.sin(t * 1.3) * 18}% ${35 + Math.cos(t * 1.1) * 15}%, #FFFBE6 0%, #F6E3C3 22%, transparent 48%),
   radial-gradient(circle at ${70 + Math.cos(t * 0.9) * 15}% ${70 + Math.sin(t * 1.2) * 12}%, #C89B6D 0%, transparent 45%),
   radial-gradient(circle at ${25 + Math.sin(t * 0.7) * 12}% ${75 + Math.cos(t) * 10}%, #A9C4AE 0%, transparent 40%),
   radial-gradient(circle at 50% 50%, #E7C9A0 0%, #A86F48 100%)`;

export const Orb: React.FC<{t: number; r: number; glow?: number; style?: React.CSSProperties}> = ({t, r, glow = 1, style}) => (
  <div
    style={{
      position: 'absolute',
      left: -r,
      top: -r,
      width: r * 2,
      height: r * 2,
      borderRadius: '50%',
      background: orbFill(t),
      boxShadow: `0 0 ${60 * glow}px ${10 * glow}px rgba(255,220,160,${0.45 * glow}), inset 0 0 ${r * 0.25}px rgba(255,255,255,0.6), 0 0 0 1.5px rgba(160,230,220,${0.5 * glow})`,
      filter: 'saturate(1.1)',
      ...style,
    }}
  />
);

export const Bloom: React.FC<{f: number}> = ({f}) => {
  const t = f / 30;
  // red field shrinks into a circle, then the circle becomes the orb
  const shrink = interpolate(f, [30, 50], [0, 1], {...clamp, easing: inOut});
  const R = interpolate(shrink, [0, 1], [1200, 360]);
  const toOrb = interpolate(f, [46, 62], [0, 1], {...clamp, easing: inOut});
  const orbR = interpolate(toOrb, [0, 1], [360, 190]) * (1 + 0.025 * Math.sin(f / 7));
  const rings = interpolate(f, [52, 70], [0, 1], clamp);
  const textO = interpolate(f, [34, 42], [1, 0], clamp);
  return (
    <AbsoluteFill style={{background: '#17110D'}}>
      {/* red halftone, clipped to a shrinking circle */}
      <AbsoluteFill
        style={{
          clipPath: `circle(${R}px at 50% 50%)`,
          opacity: 1 - toOrb,
          transform: `scale(${interpolate(shrink, [0, 1], [1, 0.7])})`,
        }}
      >
        <HalftoneBg f={f} pal={EMBER} seed={4} />
        <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', opacity: textO}}>
          <div style={{fontFamily: fonts.sans, fontSize: 40, fontWeight: 500, color: '#fff', letterSpacing: -0.6}}>
            <Typed text="What if no one had to?" f={f} start={4} cpf={0.9} fade={4} />
          </div>
        </AbsoluteFill>
      </AbsoluteFill>
      {/* rings */}
      <svg width={W} height={H} style={{position: 'absolute', inset: 0, opacity: rings}}>
        <defs>
          <linearGradient id="ringg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#fff" stopOpacity={0.8} />
            <stop offset="0.5" stopColor="#fff" stopOpacity={0.15} />
            <stop offset="1" stopColor="#CFE0CF" stopOpacity={0.75} />
          </linearGradient>
        </defs>
        {[300, 560, 860].map((r, i) => (
          <circle
            key={r}
            cx={W / 2}
            cy={H / 2}
            r={r * (0.9 + 0.1 * rings)}
            fill="none"
            stroke="url(#ringg)"
            strokeWidth={1.6}
            transform={`rotate(${f * (0.6 + i * 0.3) * (i % 2 ? -1 : 1)} ${W / 2} ${H / 2})`}
          />
        ))}
      </svg>
      {toOrb > 0 && (
        <div style={{position: 'absolute', left: ORB.x, top: ORB.y, opacity: toOrb}}>
          <Orb t={t} r={orbR} glow={1} />
        </div>
      )}
    </AbsoluteFill>
  );
};

// =============================================================== chat
const Bubble: React.FC<{
  f: number;
  d: number;
  side: 'l' | 'r';
  label: string;
  text: string;
  x: number;
  y: number;
  avatar?: boolean;
  wpf?: number;
}> = ({f, d, side, label, text, x, y, wpf = 0.3}) => {
  const s = useSpr(f, d, 14, 170, 0.7);
  if (f < d) return null;
  return (
    <div style={{position: 'absolute', left: x, top: y, opacity: Math.min(1, s * 1.6), transform: `translateY(${(1 - s) * 18}px)`}}>
      <div style={{fontFamily: fonts.sans, fontSize: 18, color: 'rgba(255,255,255,0.75)', marginBottom: 8, marginLeft: 4}}>{label}</div>
      <div
        style={{
          fontFamily: fonts.sans,
          fontSize: 30,
          lineHeight: 1.45,
          color: '#fff',
          padding: '20px 28px',
          borderRadius: 18,
          maxWidth: 600,
          background: 'linear-gradient(180deg, rgba(255,255,255,0.20), rgba(255,255,255,0.10))',
          border: '1.5px solid rgba(255,255,255,0.32)',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.25), 0 20px 40px rgba(0,30,10,0.18)',
          backdropFilter: 'blur(14px)',
          minWidth: 180,
          minHeight: 39,
        }}
      >
        <WordsIn text={text} f={f} start={d + 4} wpf={wpf} />
      </div>
    </div>
  );
};

export const CHAT_AVATAR = {x: 610, y: 400};
// the conversation scrolls up as bubbles arrive (chat clock frames → px)
export const CHAT_LIFT = {at: [60, 70, 128, 138, 258, 268], y: [0, -40, -40, -120, -120, -220]};

export const Chat: React.FC<{f: number; len: number}> = ({f, len}) => {
  const t = f / 30;
  const lift = interpolate(f, CHAT_LIFT.at, CHAT_LIFT.y, {...clamp, easing: inOut});
  const dark = interpolate(f, [len - 14, len], [0, 1], clamp);
  const blob = (i: number, ax: number, ay: number) =>
    `${50 + Math.sin(t * 0.35 + i * 1.9) * ax}% ${50 + Math.cos(t * 0.3 + i * 2.7) * ay}%`;
  return (
    <AbsoluteFill>
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse at ${blob(0, 35, 30)}, #3E2F23 0%, transparent 45%),
            radial-gradient(ellipse at ${blob(1, 45, 30)}, #C89B6D 0%, transparent 38%),
            radial-gradient(ellipse at ${blob(2, 40, 40)}, #B9CDB9 0%, transparent 42%),
            radial-gradient(ellipse at ${blob(3, 40, 35)}, #6E8F7B 0%, transparent 50%),
            radial-gradient(ellipse at ${blob(4, 30, 30)}, #E7C9A0 0%, transparent 30%),
            #7C6A58`,
          filter: 'blur(40px)',
          transform: 'scale(1.1)',
        }}
      />
      <AbsoluteFill style={{transform: `translateY(${lift}px)`}}>
        <Bubble f={f} d={22} side="l" label="Wai · listening" text="I've got the notes. Go ahead." x={CHAT_AVATAR.x + 50} y={CHAT_AVATAR.y - 40} avatar />
        {/* the patient's lines type along with her voice-over */}
        <Bubble f={f} d={58} side="r" label="Patient" text="It started last week, and at night… it just gets worse." x={900} y={CHAT_AVATAR.y + 110} wpf={0.14} />
        <Bubble f={f} d={128} side="r" label="Patient" text="I don't want to make a fuss, but I haven't really gotten much sleep." x={900} y={CHAT_AVATAR.y + 290} wpf={0.14} />
        <Bubble f={f} d={264} side="r" label="Doctor" text="Take all the time you need." x={760} y={CHAT_AVATAR.y + 470} />
      </AbsoluteFill>
      <AbsoluteFill style={{background: '#17110D', opacity: dark}} />
    </AbsoluteFill>
  );
};

// =============================================================== outro
const CARD_W = 360;
const CARD_H = 220;
const cards = [
  {title: 'Clinical note', sub: 'Drafted while you talk', g: 'radial-gradient(circle at 70% 30%, #8FAE95, transparent 60%), radial-gradient(circle at 20% 80%, #3A5446, transparent 60%), #5E7F6C'},
  {title: 'Letters', sub: 'Ready to sign', g: 'radial-gradient(circle at 30% 20%, #E7C9A0, transparent 55%), radial-gradient(circle at 80% 80%, #6B4A33, transparent 60%), #A86F48'},
  {title: 'Coding', sub: 'Done for you', g: 'radial-gradient(circle at 20% 90%, #F6E3C3, transparent 55%), radial-gradient(circle at 80% 20%, #8C7A66, transparent 60%), #B8A691'},
];

const CardIcon: React.FC<{i: number}> = ({i}) => {
  const st = {stroke: '#fff', strokeWidth: 2, fill: 'none', strokeLinecap: 'round', strokeLinejoin: 'round'} as const;
  return (
    <div
      style={{
        width: 44,
        height: 44,
        borderRadius: 12,
        background: 'rgba(255,255,255,0.18)',
        border: '1px solid rgba(255,255,255,0.3)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <svg width={22} height={22} viewBox="0 0 24 24">
        {i === 0 && <path d="M6 3h8l4 4v14H6z M14 3v4h4 M9 12h6 M9 16h4" {...st} />}
        {i === 1 && <path d="M3 6h18v12H3z M3 6l9 7 9-7" {...st} />}
        {i === 2 && <path d="M9 7l-5 5 5 5 M15 7l5 5-5 5" {...st} />}
      </svg>
    </div>
  );
};

export const Outro: React.FC<{f: number}> = ({f}) => {
  // 1. text on black
  const del = interpolate(f, [86, 104], [0, 1], clamp);
  const line = 'Stop losing minutes to paperwork. Start listening.';
  const shownWords = line.split(' ');
  const keep = Math.ceil(shownWords.length * (1 - del));
  const textStr = del > 0 ? shownWords.slice(0, keep).join(' ') : line;
  const textO = interpolate(f, [100, 108], [1, 0], clamp);
  // 2. outline rectangle draws, then shrinks into the centre card
  const draw = interpolate(f, [66, 92], [0, 1], {...clamp, easing: inOut});
  const shrink = interpolate(f, [96, 120], [0, 1], {...clamp, easing: inOut});
  const rw = interpolate(shrink, [0, 1], [1160, CARD_W]);
  const rh = interpolate(shrink, [0, 1], [520, CARD_H]);
  const perim = 2 * (rw + rh);
  const fill = interpolate(f, [106, 126], [0, 1], clamp);
  // 3. side cards
  const side = interpolate(f, [116, 138], [0, 1], {...clamp, easing: ease});
  // 4. merge into a bar, collapse to a line
  const merge = interpolate(f, [158, 170], [0, 1], {...clamp, easing: inOut});
  const collapse = interpolate(f, [170, 182], [0, 1], {...clamp, easing: inOut});
  const lineFade = interpolate(f, [192, 210], [1, 0], clamp);
  // 5. logo
  const logo = interpolate(f, [180, 196], [0, 1], {...clamp, easing: ease});
  const glow = interpolate(f, [182, 196, 230], [0, 1, 0.25], clamp);
  const sub = interpolate(f, [206, 222], [0, 1], {...clamp, easing: ease});
  const url = interpolate(f, [222, 238], [0, 1], {...clamp, easing: ease});
  const out = interpolate(f, [290, 310], [1, 0], clamp);
  const cx = W / 2;
  const cy = H / 2;
  const gap = 36;
  const cardsVisible = f >= 104 && collapse < 1;
  return (
    <AbsoluteFill style={{background: '#17110D', opacity: out}}>
      {f < 110 && (
        <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', opacity: textO}}>
          <div style={{fontFamily: fonts.sans, fontSize: 36, fontWeight: 500, color: '#fff', letterSpacing: -0.4}}>
            {del > 0 ? textStr : <WordsIn text={line} f={f} start={8} wpf={0.15} dim="rgba(255,255,255,0.28)" />}
          </div>
        </AbsoluteFill>
      )}
      {f >= 66 && f < 128 && (
        <svg width={W} height={H} style={{position: 'absolute', inset: 0}}>
          <defs>
            <linearGradient id="og" x1="1" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#fff" stopOpacity={0.9} />
              <stop offset="1" stopColor="#fff" stopOpacity={0.25} />
            </linearGradient>
          </defs>
          <rect
            x={cx - rw / 2}
            y={cy - rh / 2}
            width={rw}
            height={rh}
            rx={34 - 12 * shrink}
            fill="none"
            stroke="url(#og)"
            strokeWidth={2}
            strokeDasharray={`${perim * draw} ${perim}`}
            opacity={1 - fill}
          />
        </svg>
      )}
      {cardsVisible &&
        cards.map((c, i) => {
          const off = i - 1;
          const isC = off === 0;
          const baseX = cx + off * (CARD_W + gap) * (isC ? 1 : side);
          const barW = CARD_W + (gap * 2) / 3;
          const x = interpolate(merge, [0, 1], [baseX, cx + off * barW]);
          const w = interpolate(merge, [0, 1], [CARD_W, barW + 1]);
          const h = interpolate(collapse, [0, 1], [CARD_H, 3]) * (isC ? 1 : 1);
          const o = isC ? fill : side;
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: x - w / 2,
                top: cy - h / 2 + 60 * collapse,
                width: w,
                height: h,
                borderRadius: interpolate(merge, [0, 1], [18, 0]),
                background: collapse > 0.6 ? 'linear-gradient(90deg,#F6E3C3,#8FAE95,#C89B6D)' : c.g,
                border: isC && merge < 0.5 ? '1.5px solid rgba(255,255,255,0.55)' : '1px solid rgba(255,255,255,0.12)',
                boxShadow: isC ? '0 0 60px rgba(200,155,109,0.3)' : 'none',
                opacity: o,
                overflow: 'hidden',
                fontFamily: fonts.sans,
                color: '#fff',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                WebkitMaskImage: !isC && side < 1 ? `linear-gradient(${off < 0 ? 90 : 270}deg, transparent 0%, black ${side * 100}%)` : undefined,
              }}
            >
              <div style={{opacity: 1 - merge, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10}}>
                <CardIcon i={i} />
                <div style={{fontSize: 24, fontWeight: 600, marginTop: 4}}>{c.title}</div>
                <div style={{fontSize: 16, opacity: 0.78}}>{c.sub}</div>
              </div>
            </div>
          );
        })}
      {collapse >= 1 && (
        <div
          style={{
            position: 'absolute',
            left: cx - 620,
            top: cy + 59,
            width: 1240,
            height: 2,
            background: 'linear-gradient(90deg, transparent, #F6E3C3 20%, #8FAE95 50%, #C89B6D 80%, transparent)',
            opacity: lineFade,
            boxShadow: '0 0 18px rgba(231,201,160,0.6)',
          }}
        />
      )}
      {logo > 0 && (
        <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
          <Img
            src={staticFile('wai/wai-logo-white.webp')}
            style={{
              width: 260,
              opacity: logo,
              transform: `translateY(${(1 - logo) * 30 - 20}px)`,
              filter: `drop-shadow(0 0 ${24 * glow}px rgba(255,255,230,${0.9 * glow})) blur(${(1 - logo) * 6}px)`,
            }}
          />
          <div
            style={{
              marginTop: 22,
              fontFamily: fonts.sans,
              fontSize: 26,
              fontWeight: 500,
              color: 'rgba(255,255,255,0.85)',
              letterSpacing: -0.2,
              opacity: sub,
              transform: `translateY(${(1 - sub) * 8 - 20}px)`,
            }}
          >
            Care, <span style={{color: 'rgba(255,255,255,0.5)'}}>uninterrupted.</span>
          </div>
          <div style={{position: 'absolute', bottom: 80, fontFamily: fonts.sans, fontSize: 20, letterSpacing: 2, color: 'rgba(255,255,255,0.45)', opacity: url}}>
            wellnessa-i.com
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

export {collageText, ink};
