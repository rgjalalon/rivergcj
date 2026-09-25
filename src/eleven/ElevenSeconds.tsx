import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Easing,
  Img,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import '../loadFonts';
import {fonts} from '../theme';

// ---------------------------------------------------------------------------
// Timeline (30fps). Each beat is a Sequence, so frames inside are local.
// ---------------------------------------------------------------------------
export const ELEVEN_FPS = 30;
export const beats = {
  b1: [0, 230],
  b2: [230, 440],
  b3: [440, 530],
  b4: [530, 800],
  b5: [800, 905],
  b6: [905, 1020],
} as const;
export const ELEVEN_DURATION = beats.b6[1];

const ink = '#141414';
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const ease = Easing.bezier(0.22, 1, 0.36, 1);

const useSpring = (delay: number, damping = 12, stiffness = 140) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return spring({frame: frame - delay, fps, config: {damping, stiffness, mass: 0.8}});
};

const fadeOut = (frame: number, end: number, len = 8) =>
  interpolate(frame, [end - len, end], [1, 0], clamp);

// ---------------------------------------------------------------------------
// Shared visual language
// ---------------------------------------------------------------------------
const GridBg: React.FC = () => (
  <AbsoluteFill
    style={{
      backgroundColor: '#F4F3EF',
      backgroundImage:
        'linear-gradient(rgba(20,20,20,0.055) 1.5px, transparent 1.5px), linear-gradient(90deg, rgba(20,20,20,0.055) 1.5px, transparent 1.5px)',
      backgroundSize: '96px 96px',
      backgroundPosition: '-2px -2px',
    }}
  />
);

/** A halftone swatch: dots on a colour, like a printed cutout scrap. */
const Halftone: React.FC<{
  x: number;
  y: number;
  w: number;
  h: number;
  color: string;
  bg?: string;
  size?: number;
  delay?: number;
  rot?: number;
}> = ({x, y, w, h, color, bg = 'transparent', size = 12, delay = 0, rot = 0}) => {
  const s = useSpring(delay, 14, 180);
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: w,
        height: h,
        backgroundColor: bg,
        backgroundImage: `radial-gradient(circle, ${color} 32%, transparent 36%)`,
        backgroundSize: `${size}px ${size}px`,
        transform: `scale(${s}) rotate(${rot}deg)`,
        transformOrigin: 'center',
      }}
    />
  );
};

/** Cutout object on a soft grey tile, springing in and floating. */
const Cutout: React.FC<{
  x: number;
  y: number;
  size: number;
  delay: number;
  tile?: boolean;
  float?: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({x, y, size, delay, tile = true, float = 1, children, style}) => {
  const frame = useCurrentFrame();
  const s = useSpring(delay, 10, 130);
  const bob = Math.sin((frame + delay * 7) / 22) * 6 * float;
  return (
    <div
      style={{
        position: 'absolute',
        left: x - size / 2,
        top: y - size / 2,
        width: size,
        height: size,
        transform: `translateY(${bob}px) scale(${s})`,
        ...style,
      }}
    >
      {tile && <div style={{position: 'absolute', inset: 0, background: '#E6E5E1'}} />}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          filter: 'drop-shadow(0 18px 18px rgba(0,0,0,0.22)) drop-shadow(0 3px 4px rgba(0,0,0,0.18))',
          transform: `rotate(${Math.sin((frame + delay * 3) / 30) * 2}deg)`,
        }}
      >
        {children}
      </div>
    </div>
  );
};

/** Scattered kinetic words: each word pops in on its own spring at its own spot. */
type Word = {t: string; x: number; y: number; d: number; size?: number; w?: number; color?: string};
const Scatter: React.FC<{words: Word[]; out?: number}> = ({words, out}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const o = out === undefined ? 1 : fadeOut(frame, out);
  return (
    <>
      {words.map((w, i) => {
        const s = spring({frame: frame - w.d, fps, config: {damping: 11, stiffness: 170, mass: 0.7}});
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: w.x,
              top: w.y,
              fontFamily: fonts.sans,
              fontWeight: w.w ?? 500,
              fontSize: w.size ?? 64,
              letterSpacing: -1.5,
              color: w.color ?? ink,
              whiteSpace: 'nowrap',
              opacity: interpolate(s, [0, 0.3], [0, 1], clamp) * o,
              transform: `translateY(${(1 - s) * 40}px) scale(${0.85 + 0.15 * s})`,
              transformOrigin: 'left bottom',
            }}
          >
            {w.t}
          </div>
        );
      })}
    </>
  );
};

// ---------------------------------------------------------------------------
// Illustrated cutouts (drawn in SVG so they stay crisp)
// ---------------------------------------------------------------------------
const Stopwatch: React.FC<{size: number; angle: number; seconds?: number; glow?: number}> = ({
  size,
  angle,
  seconds,
  glow = 0,
}) => (
  <svg width={size} height={size * 1.18} viewBox="0 0 200 236">
    <defs>
      <radialGradient id="sw-case" cx="35%" cy="30%" r="80%">
        <stop offset="0" stopColor="#F2F2F0" />
        <stop offset="0.55" stopColor="#B9BBBD" />
        <stop offset="1" stopColor="#6E7174" />
      </radialGradient>
      <radialGradient id="sw-face" cx="45%" cy="40%" r="70%">
        <stop offset="0" stopColor="#FFFFFF" />
        <stop offset="1" stopColor="#E9E7E1" />
      </radialGradient>
      <linearGradient id="sw-btn" x1="0" x2="1">
        <stop offset="0" stopColor="#8E9195" />
        <stop offset="0.5" stopColor="#E6E7E8" />
        <stop offset="1" stopColor="#7D8084" />
      </linearGradient>
    </defs>
    <rect x="86" y="6" width="28" height="22" rx="5" fill="url(#sw-btn)" />
    <rect x="80" y="24" width="40" height="12" rx="4" fill="#E0482F" />
    <rect x="150" y="38" width="22" height="16" rx="4" fill="url(#sw-btn)" transform="rotate(40 161 46)" />
    <circle cx="100" cy="136" r="92" fill="url(#sw-case)" />
    <circle cx="100" cy="136" r="78" fill="url(#sw-face)" />
    {glow > 0 && <circle cx="100" cy="136" r="78" fill="#F7B267" opacity={glow * 0.18} />}
    {Array.from({length: 60}).map((_, i) => {
      const a = (i / 60) * Math.PI * 2;
      const big = i % 5 === 0;
      const r1 = big ? 64 : 69;
      return (
        <line
          key={i}
          x1={100 + Math.sin(a) * r1}
          y1={136 - Math.cos(a) * r1}
          x2={100 + Math.sin(a) * 73}
          y2={136 - Math.cos(a) * 73}
          stroke={big ? '#1A1A1A' : '#9A9893'}
          strokeWidth={big ? 2.6 : 1.2}
        />
      );
    })}
    {seconds !== undefined && (
      <text x="100" y="178" textAnchor="middle" fontFamily="Inter" fontWeight={600} fontSize="15" fill="#6B6964">
        {`00:${String(seconds).padStart(2, '0')}`}
      </text>
    )}
    <g transform={`rotate(${angle} 100 136)`}>
      <line x1="100" y1="152" x2="100" y2="72" stroke="#E0482F" strokeWidth="3.2" strokeLinecap="round" />
    </g>
    <circle cx="100" cy="136" r="6.5" fill="#1A1A1A" />
    <circle cx="100" cy="136" r="2.5" fill="#E0482F" />
  </svg>
);

const Stethoscope: React.FC<{size: number}> = ({size}) => (
  <svg width={size} height={size} viewBox="0 0 200 200">
    <defs>
      <linearGradient id="st-tube" x1="0" x2="1">
        <stop offset="0" stopColor="#1E2A3A" />
        <stop offset="0.5" stopColor="#3D5372" />
        <stop offset="1" stopColor="#1E2A3A" />
      </linearGradient>
      <radialGradient id="st-chest" cx="35%" cy="30%" r="75%">
        <stop offset="0" stopColor="#FFFFFF" />
        <stop offset="0.5" stopColor="#C4C7CB" />
        <stop offset="1" stopColor="#6F7378" />
      </radialGradient>
    </defs>
    <path d="M52 24 C40 70, 50 104, 100 110 C150 104, 160 70, 148 24" fill="none" stroke="#B7BBC0" strokeWidth="6" strokeLinecap="round" />
    <circle cx="52" cy="22" r="7" fill="#2A2A2A" />
    <circle cx="148" cy="22" r="7" fill="#2A2A2A" />
    <path d="M100 110 C100 140, 70 150, 76 172" fill="none" stroke="url(#st-tube)" strokeWidth="10" strokeLinecap="round" />
    <circle cx="80" cy="176" r="20" fill="url(#st-chest)" />
    <circle cx="80" cy="176" r="12" fill="#2B2F35" opacity="0.85" />
  </svg>
);

const Keyboard: React.FC<{size: number}> = ({size}) => (
  <svg width={size} height={size * 0.62} viewBox="0 0 260 160">
    <defs>
      <linearGradient id="kb-body" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#4A4D52" />
        <stop offset="1" stopColor="#1E1F22" />
      </linearGradient>
      <linearGradient id="kb-key" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#62666C" />
        <stop offset="1" stopColor="#35383C" />
      </linearGradient>
    </defs>
    <g transform="skewX(-14) translate(30 0)">
      <rect x="6" y="20" width="230" height="120" rx="14" fill="url(#kb-body)" />
      {Array.from({length: 4}).map((_, r) =>
        Array.from({length: 11}).map((__, c) => (
          <rect
            key={`${r}-${c}`}
            x={18 + c * 19.6}
            y={32 + r * 23}
            width="16"
            height="18"
            rx="3.5"
            fill={r === 1 && c === 10 ? '#E0482F' : 'url(#kb-key)'}
          />
        )),
      )}
      <rect x="60" y="124" width="120" height="12" rx="3.5" fill="url(#kb-key)" />
    </g>
  </svg>
);

const Screen: React.FC<{size: number; typed?: number}> = ({size, typed = 0}) => (
  <svg width={size} height={size * 0.86} viewBox="0 0 240 206">
    <defs>
      <linearGradient id="sc-bezel" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#3B3E43" />
        <stop offset="1" stopColor="#141517" />
      </linearGradient>
    </defs>
    <rect x="102" y="150" width="36" height="36" fill="#9EA2A7" />
    <rect x="70" y="182" width="100" height="12" rx="6" fill="#B9BDC1" />
    <rect x="4" y="4" width="232" height="152" rx="12" fill="url(#sc-bezel)" />
    <rect x="14" y="14" width="212" height="132" rx="4" fill="#F7F7F4" />
    <rect x="26" y="26" width="70" height="9" rx="3" fill="#1A1A1A" />
    {Array.from({length: 7}).map((_, i) => {
      const full = [170, 150, 176, 120, 160, 140, 96][i];
      const w = Math.max(0, Math.min(full, typed * 600 - i * 160));
      return <rect key={i} x="26" y={46 + i * 13} width={w} height="6" rx="3" fill={i === 0 ? '#E0482F' : '#BDBBB5'} />;
    })}
  </svg>
);

const Clipboard: React.FC<{size: number}> = ({size}) => (
  <svg width={size} height={size} viewBox="0 0 200 200">
    <rect x="46" y="26" width="108" height="150" rx="10" fill="#C9A47A" />
    <rect x="56" y="42" width="88" height="124" rx="3" fill="#FFFFFF" />
    <rect x="78" y="18" width="44" height="20" rx="6" fill="#8D9095" />
    {[0, 1, 2, 3, 4].map((i) => (
      <rect key={i} x="66" y={58 + i * 18} width={[60, 50, 64, 40, 56][i]} height="6" rx="3" fill="#CFCCC6" />
    ))}
  </svg>
);

const PillBottle: React.FC<{size: number}> = ({size}) => (
  <svg width={size} height={size} viewBox="0 0 200 200">
    <defs>
      <linearGradient id="pb" x1="0" x2="1">
        <stop offset="0" stopColor="#D26A1E" />
        <stop offset="0.45" stopColor="#F5A04A" />
        <stop offset="1" stopColor="#B4551A" />
      </linearGradient>
    </defs>
    <rect x="66" y="30" width="68" height="28" rx="6" fill="#F4F4F2" />
    <rect x="62" y="56" width="76" height="118" rx="12" fill="url(#pb)" opacity="0.92" />
    <rect x="70" y="92" width="60" height="46" rx="4" fill="#FFFFFF" />
    <rect x="78" y="104" width="40" height="6" rx="3" fill="#CFCCC6" />
    <rect x="78" y="118" width="28" height="6" rx="3" fill="#CFCCC6" />
  </svg>
);

// ---------------------------------------------------------------------------
// Beat 1: 11 seconds
// ---------------------------------------------------------------------------
const Beat1: React.FC<{len: number}> = ({len}) => {
  const frame = useCurrentFrame();
  // One tick every 6 frames up to 11, each tick snapping with a tiny overshoot.
  const tickEvery = 6;
  const tickStart = 14;
  const ticks = Math.max(0, Math.min(11, Math.floor((frame - tickStart) / tickEvery) + 1));
  const sinceTick = frame - (tickStart + (ticks - 1) * tickEvery);
  const snap = ticks > 0 && ticks <= 11 ? interpolate(sinceTick, [0, 2, 5], [0, 1.6, 0], clamp) : 0;
  const angle = ticks * 6 + (ticks < 11 ? snap : 0);
  const count = useSpring(10, 9, 160);
  const shake = ticks < 11 && ticks > 0 ? Math.sin(frame * 2.2) * 0.8 : 0;
  const shrink = interpolate(frame, [86, 110], [0, 1], {...clamp, easing: ease});
  const o = fadeOut(frame, len);

  return (
    <AbsoluteFill style={{opacity: o}}>
      <GridBg />
      <Halftone x={120} y={820} w={192} h={140} color="#E0482F" delay={20} />
      <Halftone x={1640} y={96} w={180} h={96} color="#2E2E2E" delay={26} size={10} />
      <Halftone x={1520} y={870} w={96} h={96} color="#E0482F" delay={32} />

      <div
        style={{
          position: 'absolute',
          left: interpolate(shrink, [0, 1], [640, 1340]),
          top: interpolate(shrink, [0, 1], [150, 300]),
          transform: `scale(${interpolate(shrink, [0, 1], [1, 0.72])}) rotate(${shake}deg)`,
          transformOrigin: 'top left',
        }}
      >
        <Cutout x={170} y={200} size={380} delay={0} tile={false} float={0.5}>
          <Stopwatch size={320} angle={angle} seconds={ticks} />
        </Cutout>
      </div>

      {/* The count */}
      <div
        style={{
          position: 'absolute',
          left: interpolate(shrink, [0, 1], [960, 150]),
          top: interpolate(shrink, [0, 1], [560, 150]),
          transform: `translateX(${interpolate(shrink, [0, 1], [-50, 0])}%) scale(${interpolate(count, [0, 1], [0.6, 1])})`,
          transformOrigin: 'left center',
          opacity: count,
          fontFamily: fonts.sans,
          fontWeight: 600,
          fontSize: interpolate(shrink, [0, 1], [150, 120]),
          letterSpacing: -6,
          color: ink,
          whiteSpace: 'nowrap',
          display: 'flex',
          alignItems: 'baseline',
          gap: 28,
        }}
      >
        <span style={{fontVariantNumeric: 'tabular-nums', color: ticks === 11 ? '#E0482F' : ink, minWidth: 150}}>
          {Math.max(1, ticks)}
        </span>
        <span style={{opacity: interpolate(frame, [80, 86], [0, 1], clamp)}}>seconds.</span>
      </div>

      <Scatter
        words={[
          {t: "That's how long", x: 150, y: 370, d: 108, size: 60},
          {t: 'the average patient', x: 420, y: 460, d: 116, size: 60},
          {t: 'talks', x: 150, y: 560, d: 124, size: 60},
          {t: 'before being', x: 360, y: 650, d: 130, size: 60},
          {t: 'interrupted.', x: 760, y: 650, d: 138, size: 60, w: 600, color: '#E0482F'},
        ]}
      />
      <div
        style={{
          position: 'absolute',
          left: 150,
          top: 790,
          padding: '10px 18px',
          border: '1.5px solid rgba(20,20,20,0.5)',
          borderRadius: 999,
          fontFamily: fonts.sans,
          fontSize: 22,
          fontWeight: 500,
          letterSpacing: 1.5,
          textTransform: 'uppercase',
          color: 'rgba(20,20,20,0.7)',
          background: '#F4F3EF',
          opacity: interpolate(frame, [150, 160], [0, 1], clamp),
        }}
      >
        Source: J Gen Intern Med, 2018
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Beat 2: attention splits between the patient and the note
// ---------------------------------------------------------------------------
const Bubble: React.FC<{x: number; y: number; side: 'l' | 'r'; delay: number; text: string; label: string; dim: number}> = ({
  x,
  y,
  side,
  delay,
  text,
  label,
  dim,
}) => {
  const s = useSpring(delay, 11, 150);
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        transform: `scale(${s})`,
        transformOrigin: side === 'l' ? 'left bottom' : 'right bottom',
        opacity: 1 - dim * 0.55,
      }}
    >
      <div style={{fontFamily: fonts.sans, fontSize: 20, color: 'rgba(20,20,20,0.5)', marginBottom: 8, textAlign: side === 'l' ? 'left' : 'right'}}>
        {label}
      </div>
      <div
        style={{
          fontFamily: fonts.sans,
          fontSize: 30,
          lineHeight: 1.35,
          color: side === 'l' ? ink : '#fff',
          background: side === 'l' ? '#FFFFFF' : '#1C1C1C',
          padding: '22px 30px',
          borderRadius: 28,
          borderBottomLeftRadius: side === 'l' ? 6 : 28,
          borderBottomRightRadius: side === 'r' ? 6 : 28,
          boxShadow: '0 20px 40px rgba(0,0,0,0.10), 0 2px 6px rgba(0,0,0,0.06)',
          maxWidth: 440,
        }}
      >
        {text}
      </div>
    </div>
  );
};

const Beat2: React.FC<{len: number}> = ({len}) => {
  const frame = useCurrentFrame();
  const split = interpolate(frame, [40, 150], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
  const o = fadeOut(frame, len);
  return (
    <AbsoluteFill style={{opacity: o}}>
      <GridBg />
      <Halftone x={0} y={960} w={200} h={120} color="#E0482F" delay={6} />
      <Halftone x={1720} y={0} w={200} h={130} color="#2E2E2E" delay={10} size={10} />

      {/* Consultation objects, scattered like the reference collage */}
      <Cutout x={1680} y={330} size={200} delay={4}>
        <Stethoscope size={170} />
      </Cutout>
      <Cutout x={250} y={250} size={170} delay={8}>
        <Clipboard size={140} />
      </Cutout>
      <Cutout x={1720} y={820} size={140} delay={12}>
        <PillBottle size={120} />
      </Cutout>

      <Bubble x={200} y={500} side="l" delay={14} label="Patient" text="It started last week, and at night it gets…" dim={split} />
      <Bubble x={1270} y={560} side="r" delay={24} label="Doctor" text="Mm-hm. Go on…" dim={0} />

      {/* Screen and keyboard drift into the gap between the bubbles and grow */}
      <div
        style={{
          position: 'absolute',
          left: interpolate(split, [0, 1], [1350, 940]),
          top: interpolate(split, [0, 1], [210, 560]),
          transform: `translate(-50%, -50%) scale(${interpolate(split, [0, 1], [0.6, 1.5])})`,
        }}
      >
        <Cutout x={0} y={0} size={240} delay={16} tile={false} float={0.4}>
          <Screen size={230} typed={interpolate(frame, [60, 200], [0, 1], clamp)} />
        </Cutout>
      </div>
      <div
        style={{
          position: 'absolute',
          left: interpolate(split, [0, 1], [640, 960]),
          top: interpolate(split, [0, 1], [880, 840]),
          transform: `translate(-50%, -50%) scale(${interpolate(split, [0, 1], [0.6, 1.3])})`,
        }}
      >
        <Cutout x={0} y={0} size={260} delay={20} tile={false} float={0.4}>
          <Keyboard size={250} />
        </Cutout>
      </div>

      <Scatter
        words={[
          {t: "It's not", x: 560, y: 90, d: 60, size: 72},
          {t: 'rudeness.', x: 835, y: 90, d: 66, size: 72},
          {t: "It's the note.", x: 700, y: 190, d: 100, size: 72, w: 600, color: '#E0482F'},
          {t: 'Someone has to', x: 470, y: 300, d: 140, size: 56},
          {t: 'write it.', x: 1000, y: 300, d: 150, size: 56, w: 600},
        ]}
      />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Beat 3: bold gradient statement
// ---------------------------------------------------------------------------
const Beat3: React.FC<{len: number}> = ({len}) => {
  const frame = useCurrentFrame();
  const drift = frame / len;
  const bg = useSpring(0, 20, 200);
  return (
    <AbsoluteFill style={{background: '#0B0B0B', opacity: fadeOut(frame, len, 6)}}>
      <AbsoluteFill
        style={{
          transform: `scale(${0.6 + 0.4 * bg})`,
          borderRadius: interpolate(bg, [0, 1], [400, 0]),
          overflow: 'hidden',
          background: `radial-gradient(circle at ${30 + drift * 25}% ${40 - drift * 10}%, #FFE29A 0%, #FFB36B 22%, #FF6B5A 48%, #D6386E 72%, #5B2A86 100%)`,
        }}
      >
        <AbsoluteFill
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.35) 30%, transparent 34%)',
            backgroundSize: '14px 14px',
            maskImage: 'linear-gradient(115deg, transparent 35%, black 100%)',
            WebkitMaskImage: 'linear-gradient(115deg, transparent 35%, black 100%)',
            opacity: 0.6,
          }}
        />
        <Scatter
          words={[
            {t: 'What if', x: 250, y: 330, d: 10, size: 170, w: 600, color: '#fff'},
            {t: 'no one', x: 920, y: 330, d: 20, size: 170, w: 600, color: '#fff'},
            {t: 'had to?', x: 620, y: 540, d: 32, size: 170, w: 600, color: '#fff'},
          ]}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Beat 4: the consultation is just a conversation; Wai drafts the rest
// ---------------------------------------------------------------------------
const Card: React.FC<{x: number; delay: number; title: string; done: string; doneAt: number; icon: React.ReactNode}> = ({
  x,
  delay,
  title,
  done,
  doneAt,
  icon,
}) => {
  const frame = useCurrentFrame();
  const s = useSpring(delay, 12, 140);
  const isDone = frame >= doneAt;
  const check = useSpring(doneAt, 10, 200);
  const bar = interpolate(frame, [delay + 6, doneAt], [0, 1], clamp);
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: 470,
        width: 420,
        height: 200,
        borderRadius: 26,
        background: 'rgba(255,255,255,0.42)',
        border: '1.5px solid rgba(255,255,255,0.75)',
        backdropFilter: 'blur(18px)',
        boxShadow: '0 30px 60px rgba(40,50,40,0.18)',
        padding: 32,
        boxSizing: 'border-box',
        opacity: interpolate(s, [0, 0.3], [0, 1], clamp),
        transform: `translateY(${(1 - s) * 120}px) rotate(${(1 - s) * (x > 900 ? 8 : -8)}deg)`,
        fontFamily: fonts.sans,
      }}
    >
      <div style={{display: 'flex', alignItems: 'center', gap: 16}}>
        <div
          style={{
            width: 54,
            height: 54,
            borderRadius: 16,
            background: 'rgba(255,255,255,0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {icon}
        </div>
        <div style={{fontSize: 32, fontWeight: 600, color: ink, letterSpacing: -0.5}}>{title}</div>
      </div>
      <div style={{marginTop: 30, height: 8, borderRadius: 4, background: 'rgba(20,20,20,0.1)', overflow: 'hidden'}}>
        <div style={{width: `${bar * 100}%`, height: '100%', background: isDone ? '#2E8B57' : '#1C1C1C'}} />
      </div>
      <div style={{marginTop: 20, display: 'flex', alignItems: 'center', gap: 12, fontSize: 26, color: 'rgba(20,20,20,0.75)'}}>
        {isDone ? (
          <>
            <svg width="30" height="30" viewBox="0 0 30 30" style={{transform: `scale(${check})`}}>
              <circle cx="15" cy="15" r="15" fill="#2E8B57" />
              <path d="M8.5 15.5l4.2 4.2L21.5 11" stroke="#fff" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span style={{fontWeight: 600, color: ink}}>{done}</span>
          </>
        ) : (
          <span>{'Drafting' + '.'.repeat(1 + (Math.floor(frame / 6) % 3))}</span>
        )}
      </div>
    </div>
  );
};

const iconStroke = {stroke: ink, strokeWidth: 2.4, fill: 'none', strokeLinecap: 'round', strokeLinejoin: 'round'} as const;

const Beat4: React.FC<{len: number}> = ({len}) => {
  const frame = useCurrentFrame();
  const bubble = useSpring(4, 12, 140);
  const t = frame / 30;
  const o = fadeOut(frame, len);
  const bars = 46;
  return (
    <AbsoluteFill style={{opacity: o, background: '#DDE8DA'}}>
      {/* Soft moving gradient field */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at ${20 + Math.sin(t / 2) * 8}% 25%, #B8D8C0 0%, transparent 45%),
            radial-gradient(circle at ${80 + Math.cos(t / 2.4) * 8}% 30%, #F6D6B8 0%, transparent 45%),
            radial-gradient(circle at 60% ${85 + Math.sin(t / 3) * 6}%, #A9CBE0 0%, transparent 50%),
            radial-gradient(circle at 15% 90%, #E9E2B8 0%, transparent 45%)`,
          filter: 'blur(30px)',
        }}
      />
      <AbsoluteFill
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(20,20,20,0.06) 30%, transparent 34%)',
          backgroundSize: '8px 8px',
        }}
      />

      {/* Conversation bubble with a live waveform */}
      <div
        style={{
          position: 'absolute',
          left: 960,
          top: 250,
          transform: `translate(-50%, -50%) scale(${bubble})`,
          width: 820,
          height: 170,
          borderRadius: 40,
          borderBottomLeftRadius: 10,
          background: 'rgba(255,255,255,0.5)',
          border: '1.5px solid rgba(255,255,255,0.8)',
          boxShadow: '0 30px 60px rgba(40,50,40,0.15)',
          display: 'flex',
          alignItems: 'center',
          padding: '0 44px',
          boxSizing: 'border-box',
          gap: 26,
        }}
      >
        <div
          style={{
            width: 58,
            height: 58,
            borderRadius: 29,
            flexShrink: 0,
            background: 'radial-gradient(circle at 35% 30%, #FFE29A, #FF8A5B 55%, #D6386E)',
            boxShadow: `0 0 0 ${6 + Math.sin(t * 5) * 4}px rgba(255,138,91,0.25)`,
          }}
        />
        <div style={{display: 'flex', alignItems: 'center', gap: 6, height: 110}}>
          {Array.from({length: bars}).map((_, i) => {
            const env = Math.sin((i / bars) * Math.PI);
            const h =
              12 +
              env *
                80 *
                Math.abs(Math.sin(t * 4.2 + i * 0.55) * 0.6 + Math.sin(t * 7.3 + i * 1.3) * 0.4);
            return <div key={i} style={{width: 7, height: h, borderRadius: 4, background: ink, opacity: 0.8}} />;
          })}
        </div>
        <div style={{position: 'absolute', left: 44, top: -40, fontFamily: fonts.sans, fontSize: 22, color: 'rgba(20,20,20,0.6)', display: 'flex', alignItems: 'center', gap: 10}}>
          <span style={{width: 10, height: 10, borderRadius: 5, background: '#E0482F', opacity: Math.floor(frame / 15) % 2 ? 1 : 0.35}} />
          Consultation · listening
        </div>
      </div>

      <Card
        x={270}
        delay={40}
        doneAt={85}
        title="Clinical note"
        done="Drafted"
        icon={
          <svg width="30" height="30" viewBox="0 0 30 30">
            <path d="M8 4h10l5 5v17H8z M18 4v5h5 M12 15h8 M12 20h6" {...iconStroke} />
          </svg>
        }
      />
      <Card
        x={750}
        delay={52}
        doneAt={105}
        title="Letter"
        done="Drafted"
        icon={
          <svg width="30" height="30" viewBox="0 0 30 30">
            <path d="M4 8h22v15H4z M4 8l11 8 11-8" {...iconStroke} />
          </svg>
        }
      />
      <Card
        x={1230}
        delay={64}
        doneAt={122}
        title="Coding"
        done="Done"
        icon={
          <svg width="30" height="30" viewBox="0 0 30 30">
            <path d="M11 8l-6 7 6 7 M19 8l6 7-6 7" {...iconStroke} />
          </svg>
        }
      />

      <Scatter
        out={170}
        words={[
          {t: 'Wai writes it all', x: 470, y: 760, d: 110, size: 76, w: 600},
          {t: 'while you talk.', x: 1080, y: 760, d: 120, size: 76},
        ]}
      />
      <Scatter
        words={[
          {t: 'The doctor', x: 420, y: 760, d: 176, size: 76},
          {t: 'looks at you.', x: 840, y: 760, d: 184, size: 76, w: 600},
          {t: 'You get heard.', x: 1000, y: 870, d: 204, size: 76, w: 600, color: '#C2410C'},
        ]}
      />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Beat 5: the stopwatch returns, still
// ---------------------------------------------------------------------------
const Beat5: React.FC<{len: number}> = ({len}) => {
  const frame = useCurrentFrame();
  const glow = interpolate(frame, [10, 60], [0, 1], clamp);
  return (
    <AbsoluteFill style={{opacity: fadeOut(frame, len, 10)}}>
      <GridBg />
      <Halftone x={1620} y={880} w={180} h={120} color="#F2A65A" delay={20} />
      <Cutout x={960} y={420} size={420} delay={0} tile={false} float={0.8}>
        <Stopwatch size={330} angle={0} glow={glow} />
      </Cutout>
      <Scatter
        words={[
          {t: 'Take all', x: 440, y: 760, d: 22, size: 88},
          {t: 'the time', x: 820, y: 760, d: 30, size: 88},
          {t: 'you need.', x: 1180, y: 760, d: 40, size: 88, w: 600},
        ]}
      />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Beat 6: end card
// ---------------------------------------------------------------------------
const Beat6: React.FC = () => {
  const frame = useCurrentFrame();
  const logo = interpolate(frame, [8, 26], [0, 1], {...clamp, easing: ease});
  const tag = interpolate(frame, [24, 40], [0, 1], {...clamp, easing: ease});
  const url = interpolate(frame, [40, 54], [0, 1], {...clamp, easing: ease});
  return (
    <AbsoluteFill
      style={{
        background: 'radial-gradient(ellipse 50% 40% at 50% 48%, #1A1A1A 0%, #050505 100%)',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: fonts.sans,
      }}
    >
      <Img
        src={staticFile('wai/wai-logo-white.webp')}
        style={{
          width: 300,
          opacity: logo,
          transform: `translateY(${(1 - logo) * 18}px) scale(${1 + frame * 0.0006})`,
          filter: `blur(${(1 - logo) * 8}px)`,
        }}
      />
      <div style={{marginTop: 48, fontSize: 46, fontWeight: 500, color: '#fff', letterSpacing: -1, opacity: tag, transform: `translateY(${(1 - tag) * 12}px)`}}>
        Care, <span style={{color: 'rgba(255,255,255,0.55)'}}>uninterrupted.</span>
      </div>
      <div style={{position: 'absolute', bottom: 90, fontSize: 24, letterSpacing: 2, color: 'rgba(255,255,255,0.5)', opacity: url}}>
        wellnessa-i.com
      </div>
    </AbsoluteFill>
  );
};

export const ElevenSeconds: React.FC = () => {
  const seq = (b: readonly [number, number], el: (len: number) => React.ReactNode) => (
    <Sequence from={b[0]} durationInFrames={b[1] - b[0]}>
      {el(b[1] - b[0])}
    </Sequence>
  );
  return (
    <AbsoluteFill style={{background: '#050505'}}>
      <Audio src={staticFile('eleven/soundtrack.wav')} />
      {seq(beats.b1, (l) => <Beat1 len={l} />)}
      {seq(beats.b2, (l) => <Beat2 len={l} />)}
      {seq(beats.b3, (l) => <Beat3 len={l} />)}
      {seq(beats.b4, (l) => <Beat4 len={l} />)}
      {seq(beats.b5, (l) => <Beat5 len={l} />)}
      {seq(beats.b6, () => <Beat6 />)}
    </AbsoluteFill>
  );
};
