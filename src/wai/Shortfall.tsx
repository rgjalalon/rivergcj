import '../loadFonts';
import {AbsoluteFill, Audio, Easing, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {Grain} from '../components/Grain';
import {fonts} from '../theme';

// Wai: "The shortfall" — 16:9 dark-mode motion graphic, 31s at 30fps, no VO.
// Beats: 11M count-up → "can't hire our way out" → burnout grid → hour
// blocks drown in admin → "hours already exist" → AI sweep → close + logo.
export const SHORT_FPS = 30;
export const SHORT_DURATION = 870;
export const SHORT_W = 1920;
export const SHORT_H = 1080;

const B = {land: 42, hire: 96, grid: 176, hours: 336, exist: 486, sweep: 566, close: 690, logo: 780};

const C = {
  bg: '#0A0B0E',
  panel: '#13151A',
  line: 'rgba(255,255,255,0.07)',
  text: '#F4F1EC',
  dim: 'rgba(244,241,236,0.52)',
  faint: 'rgba(244,241,236,0.16)',
  gray: '#2F333B',
  grayHi: '#474C57',
  grayMid: '#3A3E47',
  warm: '#F2A65A',
};

const expo = Easing.bezier(0.16, 1, 0.3, 1);
const inOut = Easing.bezier(0.65, 0, 0.35, 1);
const p = (f: number, a: number, d: number, e = expo) =>
  interpolate(f, [a, a + d], [0, 1], {easing: e, extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
const mix = (a: number, b: number, t: number) => a + (b - a) * t;
/** In at `a`, out at `b`; returns opacity with a soft blur-lift. */
const scene = (f: number, a: number, b: number, dIn = 20, dOut = 16) => p(f, a, dIn) * (1 - p(f, b - dOut, dOut, inOut));
const fmt = (n: number) => Math.round(n).toLocaleString('en-US');

// ---- Shared pieces -----------------------------------------------------------
const Glow: React.FC<{f: number; strength: number}> = ({f, strength}) => (
  <AbsoluteFill
    style={{
      opacity: strength,
      background: `radial-gradient(ellipse 40% 45% at ${50 + 8 * Math.sin(f / 80)}% ${58 + 6 * Math.cos(f / 95)}%, rgba(242,166,90,0.2) 0%, rgba(242,166,90,0.1) 35%, rgba(242,166,90,0.03) 70%, rgba(242,166,90,0) 100%)`,
    }}
  />
);

const Label: React.FC<{children: React.ReactNode; style?: React.CSSProperties}> = ({children, style}) => (
  <div style={{fontFamily: fonts.sans, fontSize: 22, fontWeight: 500, letterSpacing: 2.6, textTransform: 'uppercase', color: C.dim, ...style}}>{children}</div>
);

const Source: React.FC<{children: React.ReactNode}> = ({children}) => (
  <span style={{display: 'inline-block', marginLeft: 14, padding: '4px 12px', border: `1px solid ${C.faint}`, borderRadius: 999, fontSize: 18, letterSpacing: 1.6, color: C.warm}}>
    {children}
  </span>
);

/** Word-by-word kinetic line. */
const Kinetic: React.FC<{f: number; at: number; text: string; size?: number; accent?: string[]}> = ({f, at, text, size = 88, accent = []}) => (
  <div style={{fontFamily: fonts.sans, fontWeight: 600, fontSize: size, color: C.text, letterSpacing: -2.4, lineHeight: 1.12, textAlign: 'center', maxWidth: 1500}}>
    {text.split(' ').map((w, i) => {
      const t = p(f, at + i * 4, 22);
      return (
        <span key={i} style={{display: 'inline-block', marginRight: '0.26em', opacity: t, transform: `translateY(${(1 - t) * 26}px)`, filter: `blur(${(1 - t) * 8}px)`, color: accent.includes(w) ? C.warm : undefined}}>
          {w}
        </span>
      );
    })}
  </div>
);

const Center: React.FC<{o: number; children: React.ReactNode; s?: number}> = ({o, children, s = 1}) => (
  <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', opacity: o, transform: `scale(${s})`}}>{children}</AbsoluteFill>
);

// ---- Beat 1: the number --------------------------------------------------------
const Count: React.FC<{f: number}> = ({f}) => {
  // Counting from frame 0: the hook is motion before it's a sentence.
  const n = 11_000_000 * p(f, 0, B.land, Easing.bezier(0.2, 0, 0.1, 1));
  const hit = p(f, B.land, 16);
  const punch = f >= B.land ? 1 + 0.07 * (1 - hit) : mix(0.9, 1, p(f, 0, B.land));
  const shake = f >= B.land && f < B.land + 8 ? Math.sin(f * 2.7) * (B.land + 8 - f) * 1.2 : 0;
  return (
    <Center o={scene(f, 0, B.hire, 1, 12)}>
      <div style={{transform: `translate(${shake}px, ${shake * 0.4}px) scale(${punch})`, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        <div style={{fontFamily: fonts.sans, fontWeight: 600, fontSize: 260, color: C.text, letterSpacing: -10, lineHeight: 1, fontVariantNumeric: 'tabular-nums', textShadow: `0 0 ${60 * (1 - hit)}px rgba(242,166,90,${0.8 * (1 - hit) * (f >= B.land ? 1 : 0)})`}}>
          {fmt(n)}
        </div>
        <div style={{width: mix(0, 620, p(f, B.land, 22)), height: 4, marginTop: 34, background: C.warm, borderRadius: 2, boxShadow: '0 0 24px rgba(242,166,90,0.6)'}} />
        <Label style={{marginTop: 34, opacity: p(f, B.land + 4, 16), transform: `translateY(${(1 - p(f, B.land + 4, 16)) * 12}px)`}}>
          Health workers the world will be short by 2030 <Source>WHO</Source>
        </Label>
      </div>
      {/* impact ring */}
      <div style={{position: 'absolute', width: 400, height: 400, borderRadius: '50%', border: `2px solid ${C.warm}`, opacity: f >= B.land ? 0.5 * (1 - hit) : 0, transform: `scale(${mix(0.6, 3.4, hit)})`}} />
    </Center>
  );
};

// ---- Beat 3: burnout grid ---------------------------------------------------------
const COLS = 14;
const ROWS = 6;
const DOCS = COLS * ROWS;
// Deterministic shuffle: which ~45% dim, and in what order.
const hash = (i: number) => {
  const x = Math.sin(i * 12.9898 + 4.1) * 43758.5453;
  return x - Math.floor(x);
};
const order = Array.from({length: DOCS}, (_, i) => i).sort((a, b) => hash(a) - hash(b));
const DIM = Math.round(DOCS * 0.45);
const dimRank = new Map(order.slice(0, DIM).map((id, r) => [id, r]));

const Doc: React.FC<{lit: number}> = ({lit}) => (
  <svg width="56" height="64" viewBox="0 0 28 32">
    <circle cx="14" cy="9" r="6" fill={lit > 0.5 ? C.text : C.gray} opacity={mix(0.28, 0.95, lit)} />
    <path d="M3 31 C3 22 8 18 14 18 C20 18 25 22 25 31 Z" fill={lit > 0.5 ? C.text : C.gray} opacity={mix(0.28, 0.95, lit)} />
    <path d="M19 23 h4 M21 21 v4" stroke={C.warm} strokeWidth="1.6" strokeLinecap="round" opacity={mix(0.15, 1, lit)} />
  </svg>
);

const Burnout: React.FC<{f: number}> = ({f}) => {
  const o = scene(f, B.grid, B.hours, 20, 18);
  const pct = Math.round(45 * p(f, B.grid + 40, 70, inOut));
  return (
    <AbsoluteFill style={{opacity: o}}>
      <div style={{position: 'absolute', left: 0, right: 0, top: 150, display: 'flex', justifyContent: 'center', gap: 28, flexWrap: 'wrap', width: 1180, margin: '0 auto'}}>
        {Array.from({length: DOCS}).map((_, i) => {
          const r = Math.floor(i / COLS);
          const c = i % COLS;
          const inT = p(f, B.grid + (r + c) * 1.4, 20);
          const rank = dimRank.get(i);
          const lit = rank === undefined ? 1 : 1 - p(f, B.grid + 30 + rank * 1.3, 14, inOut);
          return (
            <div key={i} style={{opacity: inT, transform: `translateY(${(1 - inT) * 14}px) scale(${mix(0.96, 1, lit)})`}}>
              <Doc lit={lit} />
            </div>
          );
        })}
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 720, textAlign: 'center'}}>
        <div style={{fontFamily: fonts.sans, fontWeight: 600, fontSize: 118, color: C.text, letterSpacing: -4, fontVariantNumeric: 'tabular-nums'}}>
          ~{pct}<span style={{color: C.warm}}>%</span>
        </div>
        <Label style={{marginTop: 12, opacity: p(f, B.grid + 60, 20)}}>Physician burnout still sits near 45% <Source>AMA, 2024</Source></Label>
        <div style={{fontFamily: fonts.sans, fontSize: 30, color: C.dim, marginTop: 18, opacity: p(f, B.grid + 95, 24)}}>Even at its lowest rate since COVID.</div>
      </div>
    </AbsoluteFill>
  );
};

// ---- Beats 4 + 6: hour blocks --------------------------------------------------------
const HR = 8; // clinicians (rows)
const HC = 16; // hour blocks per row
const ADMIN = ['Documentation', 'Prior authorizations', 'Inbox messages'];
// Gray fill order: blocks go admin from the right end of each row, staggered.
const adminAt = (r: number, c: number) => {
  const depth = HC - 1 - c; // 0 = rightmost
  const limit = 10 + ((r * 5) % 3); // how many per row end up gray (~65-75%)
  if (depth >= limit) return null;
  return B.hours + 40 + depth * 6 + ((r * 7) % 5) * 3;
};
const ADMIN_COLORS = [C.grayHi, C.grayMid, C.gray];
const kindOf = (r: number, c: number) => (r * 3 + c * 5) % 3;
const BW = 76;
const BH = 50;
const GAP = 8;
const GRID_W = HC * BW + (HC - 1) * GAP;
const GRID_X = (1920 - GRID_W) / 2;
const GRID_Y = 250;
const SWEEP_D = 80;
const sweepX = (f: number) => mix(GRID_X - 120, GRID_X + GRID_W + 120, p(f, B.sweep + 10, SWEEP_D, inOut));

const Hours: React.FC<{f: number}> = ({f}) => {
  const vis = p(f, B.hours, 20) * (1 - p(f, B.exist - 18, 18, inOut)) + p(f, B.sweep, 20) * (1 - p(f, B.close - 18, 18, inOut));
  const sx = sweepX(f);
  const inSweep = f >= B.sweep;
  const legend = p(f, B.hours + 30, 24);
  return (
    <AbsoluteFill style={{opacity: vis, perspective: 1600}}>
      <AbsoluteFill style={{transform: `rotateX(${mix(22, 0, p(f, B.sweep - 10, 50, inOut))}deg) rotateZ(${mix(-4, 0, p(f, B.sweep - 10, 50, inOut))}deg) scale(${mix(1.06, 1, p(f, B.sweep - 10, 50, inOut))})`, transformOrigin: '50% 60%'}}>
      <div style={{position: 'absolute', left: GRID_X, top: GRID_Y - 70, display: 'flex', gap: 34, alignItems: 'center', opacity: legend}}>
        <Key color={C.warm} label="Patient care" />
        {ADMIN.map((a, i) => (
          <Key key={a} color={ADMIN_COLORS[i]} label={a} />
        ))}
      </div>
      {Array.from({length: HR * HC}).map((_, i) => {
        const r = Math.floor(i / HC);
        const c = i % HC;
        const x = GRID_X + c * (BW + GAP);
        const y = GRID_Y + r * (BH + GAP);
        const inT = p(f, B.hours + c * 1.2 + r * 1.5, 18);
        const at = adminAt(r, c);
        let admin = at === null ? 0 : p(f, at, 14, inOut);
        let flip = 0;
        if (inSweep && at !== null) {
          flip = interpolate(sx - (x + BW / 2), [0, 60], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
          admin = 1 - flip;
        }
        const kind = kindOf(r, c);
        const bg = admin > 0.5 ? ADMIN_COLORS[kind] : C.warm;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: x,
              top: y - (at !== null && !inSweep ? (1 - p(f, at, 14)) * 18 : 0),
              width: BW,
              height: BH,
              borderRadius: 8,
              background: bg,
              opacity: inT * (admin > 0.5 ? 1 : mix(0.9, 1, flip)),
              boxShadow: admin > 0.5 ? 'none' : `0 0 ${mix(14, 30, flip)}px rgba(242,166,90,${mix(0.35, 0.6, flip)})`,
              transform: `scale(${mix(0.9, 1, inT) * (flip > 0 && flip < 1 ? 1 + Math.sin(flip * Math.PI) * 0.08 : 1)})`,
            }}
          />
        );
      })}
      {/* AI layer: a soft vertical beam */}
      {inSweep && (
        <div
          style={{
            position: 'absolute',
            left: sx - 3,
            top: GRID_Y - 40,
            width: 6,
            height: HR * (BH + GAP) + 72,
            borderRadius: 3,
            background: C.warm,
            boxShadow: '0 0 40px 10px rgba(242,166,90,0.45), 0 0 120px 40px rgba(242,166,90,0.15)',
            opacity: p(f, B.sweep + 6, 10) * (1 - p(f, B.sweep + 10 + SWEEP_D - 6, 12)),
          }}
        />
      )}
      </AbsoluteFill>
      <HoursCaption f={f} />
    </AbsoluteFill>
  );
};

const Key: React.FC<{color: string; label: string}> = ({color, label}) => (
  <div style={{display: 'flex', alignItems: 'center', gap: 12, fontFamily: fonts.sans, fontSize: 22, color: C.dim}}>
    <div style={{width: 22, height: 14, borderRadius: 4, background: color}} />
    {label}
  </div>
);

const HoursCaption: React.FC<{f: number}> = ({f}) => {
  const y = GRID_Y + HR * (BH + GAP) + 60;
  // Beat 6: the headline figure ticks down as the sweep clears the backlog.
  const t = p(f, B.sweep + 10, SWEEP_D + 30, inOut);
  const n = mix(11_000_000, 7_400_000, t);
  const gone = 1 - p(f, B.sweep + 64, 22, inOut);
  const b = p(f, B.sweep + 4, 18);
  return (
    <>
      {f >= B.sweep && (
        <div style={{position: 'absolute', left: 0, right: 0, top: y - 10, textAlign: 'center', opacity: b * gone}}>
          <div style={{fontFamily: fonts.sans, fontWeight: 600, fontSize: 96, color: C.text, letterSpacing: -3.5, fontVariantNumeric: 'tabular-nums'}}>{fmt(n)}</div>
          <Label style={{marginTop: 6}}>The gap, closing</Label>
        </div>
      )}
    </>
  );
};

// ---- Beat 7: close ---------------------------------------------------------------
// The line lands, holds, then dissolves upward; the logo arrives alone,
// out of a warm bloom, and settles with a slow breath.
const LOGO = staticFile('wai/wai-logo-white.webp');

const Close: React.FC<{f: number}> = ({f}) => {
  const lineOut = p(f, B.logo - 22, 26, inOut);
  const bloom = p(f, B.logo - 6, 50, inOut);
  const logo = p(f, B.logo + 4, 46);
  const breathe = 1 + 0.012 * Math.sin(Math.max(0, f - B.logo - 50) / 22);
  const sheen = interpolate(f, [B.logo + 34, B.logo + 74], [-40, 140], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: inOut});
  const mask = {maskImage: `url(${LOGO})`, WebkitMaskImage: `url(${LOGO})`, maskSize: 'contain', WebkitMaskSize: 'contain', maskRepeat: 'no-repeat', WebkitMaskRepeat: 'no-repeat', maskPosition: 'center', WebkitMaskPosition: 'center'} as React.CSSProperties;
  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
      {f < B.logo + 6 && (
        <div style={{opacity: 1 - lineOut, transform: `translateY(${-lineOut * 40}px) scale(${mix(1, 0.97, lineOut)})`, filter: `blur(${lineOut * 12}px)`}}>
          <Kinetic f={f} at={B.close} text="Wai gives care its hours back." size={104} accent={['hours']} />
        </div>
      )}
      <AbsoluteFill style={{opacity: bloom * 0.9, background: 'radial-gradient(ellipse 34% 38% at 50% 50%, rgba(242,166,90,0.26) 0%, rgba(242,166,90,0.1) 40%, rgba(242,166,90,0.025) 75%, rgba(242,166,90,0) 100%)'}} />
      <div style={{position: 'absolute', width: 420, height: 120, opacity: logo, filter: `blur(${(1 - logo) * 14}px) drop-shadow(0 0 40px rgba(242,166,90,${0.35 * logo}))`, transform: `scale(${mix(1.12, 1, logo) * breathe})`}}>
        <div style={{position: 'absolute', inset: 0, background: `url(${LOGO}) center / contain no-repeat`}} />
        {/* one warm sheen passes across the mark */}
        <div style={{position: 'absolute', inset: 0, ...mask, background: `linear-gradient(100deg, transparent ${sheen - 18}%, rgba(242,166,90,0.9) ${sheen}%, transparent ${sheen + 18}%)`}} />
      </div>
    </AbsoluteFill>
  );
};

// ---- Film --------------------------------------------------------------------------------
/** Every shot drifts in, keeps pushing, then zooms through into the next. */
const Shot: React.FC<{f: number; a: number; b: number; children: React.ReactNode}> = ({f, a, b, children}) => {
  const enter = p(f, a, 18);
  const exit = p(f, b - 12, 12, Easing.bezier(0.55, 0, 0.9, 0.3));
  const drift = 1 + 0.04 * interpolate(f, [a, b], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{transform: `scale(${mix(0.92, 1, enter) * drift * mix(1, 1.22, exit)})`, filter: `blur(${(1 - enter) * 10 + exit * 16}px)`}}>
      {children}
    </AbsoluteFill>
  );
};

export const WaiShortfall: React.FC = () => {
  const f = useCurrentFrame();
  const warm = mix(0.25, 1, p(f, B.sweep, 90, inOut)) * (f < B.hours ? 0.6 : 1);
  const vol = interpolate(f, [0, 6, SHORT_DURATION - 45, SHORT_DURATION - 2], [0, 0.9, 0.9, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{background: C.bg}}>
      <Audio src={staticFile('wai/30h-score.wav')} volume={vol} />
      <Glow f={f} strength={warm} />
      {f < B.hire && (
        <Shot f={f} a={-18} b={B.hire}>
          <Count f={f} />
        </Shot>
      )}
      {f >= B.hire && f < B.grid && (
        <Shot f={f} a={B.hire} b={B.grid}>
          <Center o={1}>
            <Kinetic f={f} at={B.hire + 2} text="We cannot hire our way out of this." size={96} accent={['cannot']} />
          </Center>
        </Shot>
      )}
      {f >= B.grid && f < B.hours && (
        <Shot f={f} a={B.grid} b={B.hours}>
          <Burnout f={f} />
        </Shot>
      )}
      {f >= B.hours && f < B.exist && (
        <Shot f={f} a={B.hours} b={B.exist}>
          <Hours f={f} />
        </Shot>
      )}
      {f >= B.exist && f < B.sweep && (
        <Shot f={f} a={B.exist} b={B.sweep}>
          <Center o={1}>
            <Kinetic f={f} at={B.exist + 2} text="The hours healthcare needs already exist." size={80} accent={['already', 'exist.']} />
            <div style={{height: 22}} />
            <Kinetic f={f} at={B.exist + 26} text="They're just trapped in the backlog." size={80} />
          </Center>
        </Shot>
      )}
      {f >= B.sweep && f < B.close && (
        <Shot f={f} a={B.sweep} b={B.close}>
          <Hours f={f} />
        </Shot>
      )}
      {f >= B.close && <Close f={f} />}
      <AbsoluteFill style={{background: 'radial-gradient(ellipse 80% 75% at 50% 50%, transparent 55%, rgba(0,0,0,0.55) 100%)', pointerEvents: 'none'}} />
      <Grain />
    </AbsoluteFill>
  );
};
