import React, {useLayoutEffect, useRef} from 'react';
import {AbsoluteFill, Img, interpolate, spring, staticFile, useVideoConfig} from 'remotion';
import {fonts} from '../theme';

export const W = 1920;
export const H = 1080;
export const CELL = 120; // grid cell; block wipes use the same grid
export const ink = '#111111';
export const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

// Deterministic pseudo-random in [0, 1)
export const rand = (i: number, seed = 1) => {
  const x = Math.sin(i * 127.1 + seed * 311.7) * 43758.5453;
  return x - Math.floor(x);
};

export const useSpr = (f: number, delay: number, damping = 13, stiffness = 170, mass = 0.7) => {
  const {fps} = useVideoConfig();
  return spring({frame: f - delay, fps, config: {damping, stiffness, mass}});
};

// ---------------------------------------------------------------- backgrounds
export const GridBg: React.FC = () => (
  <AbsoluteFill
    style={{
      backgroundColor: '#EFEEEA',
      backgroundImage:
        'linear-gradient(rgba(0,0,0,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.045) 1px, transparent 1px)',
      backgroundSize: `${CELL}px ${CELL}px`,
    }}
  />
);

export type Palette = {
  base: string[]; // blob colours for the smooth field
  light: [number, number, number];
  dark: [number, number, number];
};

export const BLUE: Palette = {
  base: ['#2F6E9E', '#5A9CC0', '#1F4B72', '#8D9160', '#9CC3D6', '#3C7FA8'],
  light: [214, 236, 246],
  dark: [22, 58, 92],
};
export const RED: Palette = {
  base: ['#D8322B', '#F07A3A', '#B01F3A', '#F4B25E', '#E4502F', '#8E1426'],
  light: [255, 214, 170],
  dark: [120, 16, 24],
};

/** Blurred gradient field + a printed halftone of vertical dashes over it. */
export const HalftoneBg: React.FC<{f: number; pal: Palette; seed?: number}> = ({f, pal, seed = 1}) => {
  const ref = useRef<HTMLCanvasElement>(null);
  const t = f / 30;
  useLayoutEffect(() => {
    const c = ref.current;
    if (!c) return;
    const x = c.getContext('2d');
    if (!x) return;
    x.clearRect(0, 0, W, H);
    const cw = 8;
    const ch = 13;
    const cols = Math.ceil(W / cw);
    const rows = Math.ceil(H / ch);
    const buckets: number[][][] = Array.from({length: 10}, () => []);
    const dbuckets: number[][][] = Array.from({length: 10}, () => []);
    for (let gy = 0; gy < rows; gy++) {
      const v = gy / rows;
      for (let gx = 0; gx < cols; gx++) {
        const u = gx / cols;
        // soft rolling hills, like a printed topographic scan
        const hill = Math.sin(u * 5.2 + seed + Math.sin(v * 3 + t * 0.35) * 1.4 + t * 0.25);
        const band = 0.62 + 0.18 * Math.sin(u * 3.1 - t * 0.2 + seed) - v;
        const w = 0.5 + 0.5 * hill * Math.cos(v * 4.2 - u * 1.7 + t * 0.3);
        const len = ch * (0.18 + 0.78 * w);
        const rect = [gx * cw + 2, gy * ch + (ch - len) / 2, 3, len];
        const k = Math.min(9, Math.floor(w * 10));
        if (band < -0.05 && hill < 0.2) dbuckets[k].push(rect);
        else buckets[k].push(rect);
      }
    }
    const [lr, lg, lb] = pal.light;
    const [dr, dg, db] = pal.dark;
    buckets.forEach((rs, k) => {
      x.fillStyle = `rgba(${lr},${lg},${lb},${0.16 + k * 0.07})`;
      rs.forEach((r) => x.fillRect(r[0], r[1], r[2], r[3]));
    });
    dbuckets.forEach((rs, k) => {
      x.fillStyle = `rgba(${dr},${dg},${db},${0.25 + k * 0.05})`;
      rs.forEach((r) => x.fillRect(r[0], r[1], r[2], r[3]));
    });
  }, [t, pal, seed]);
  const b = pal.base;
  const p = (i: number, a: number, r: number) =>
    `${50 + Math.sin(t * 0.3 + i * 1.7 + seed) * a}% ${50 + Math.cos(t * 0.25 + i * 2.3 + seed) * r}%`;
  return (
    <AbsoluteFill>
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at ${p(0, 40, 30)}, ${b[4]} 0%, transparent 42%),
            radial-gradient(circle at ${p(1, 45, 35)}, ${b[1]} 0%, transparent 48%),
            radial-gradient(circle at ${p(2, 40, 40)}, ${b[3]} 0%, transparent 40%),
            radial-gradient(circle at ${p(3, 35, 30)}, ${b[5]} 0%, transparent 55%),
            radial-gradient(ellipse at 50% 110%, ${b[2]} 0%, transparent 60%),
            ${b[0]}`,
        }}
      />
      <canvas ref={ref} width={W} height={H} style={{position: 'absolute', inset: 0}} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- block wipe
const easeOutCubic = (x: number) => 1 - Math.pow(1 - x, 3);

/**
 * Pixel-block transition on the background grid, softened: each block dissolves
 * in over a few frames, in a staggered wave, some with a brief tinted flash
 * growing from the block's centre. `p` runs 0→1. Children are the incoming scene, which
 * also settles from a slight zoom.
 */
export const BlockWipe: React.FC<{
  p: number;
  id: string;
  from?: 'left' | 'right' | 'center' | 'bottom';
  flash?: string[];
  seed?: number;
  children: React.ReactNode;
}> = ({p, from = 'right', flash = ['#FFFFFF', '#EFEEEA'], seed = 3, children}) => {
  if (p <= 0) return null;
  const settle = 1 + 0.04 * (1 - easeOutCubic(Math.min(1, p)));
  if (p >= 1) return <AbsoluteFill>{children}</AbsoluteFill>;
  const cols = W / CELL;
  const rows = Math.ceil(H / CELL);
  const SPAN = 0.3; // how long a single block takes to open, in wipe progress
  const rects: string[] = [];
  const mids: React.ReactNode[] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const i = r * cols + c;
      const pos =
        from === 'right'
          ? 1 - c / (cols - 1)
          : from === 'left'
            ? c / (cols - 1)
            : from === 'bottom'
              ? 1 - r / (rows - 1)
              : Math.hypot(c - cols / 2, r - rows / 2) / Math.hypot(cols / 2, rows / 2);
      const start = (0.55 * pos + 0.45 * rand(i, seed)) * (1 - SPAN);
      const q = Math.max(0, Math.min(1, (p - start) / SPAN));
      if (q <= 0) continue;
      const e = easeOutCubic(q);
      // pixel-snapped so neighbouring blocks meet without hairline seams
      rects.push(`<rect x='${c * CELL}' y='${r * CELL}' width='${CELL}' height='${CELL}' fill='white' fill-opacity='${Math.min(1, e * 1.1).toFixed(3)}'/>`);
      // the tinted flash grows from the block's centre
      const sz = Math.round(CELL * (0.45 + 0.55 * e));
      const x0 = c * CELL + Math.round((CELL - sz) / 2);
      const y0 = r * CELL + Math.round((CELL - sz) / 2);
      const fl = q < 0.6 ? Math.sin((Math.PI * q) / 0.6) * 0.6 : 0;
      if (fl > 0.02 && rand(i, seed + 5) < 0.35) {
        const k = Math.floor(rand(i, seed + 9) * (flash.length + 1));
        mids.push(
          <div
            key={i}
            style={{
              position: 'absolute',
              left: x0,
              top: y0,
              width: sz,
              height: sz,
              opacity: fl,
              ...(k < flash.length
                ? {background: flash[k]}
                : {
                    backgroundColor: '#E9E8E3',
                    backgroundImage: 'radial-gradient(circle, rgba(60,80,60,0.55) 28%, transparent 32%)',
                    backgroundSize: '9px 9px',
                  }),
            }}
          />,
        );
      }
    }
  }
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='${W}' height='${H}' viewBox='0 0 ${W} ${H}' shape-rendering='crispEdges'>${rects.join('')}</svg>`;
  const mask = `url("data:image/svg+xml;utf8,${encodeURIComponent(svg)}")`;
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{maskImage: mask, WebkitMaskImage: mask, maskSize: '100% 100%', WebkitMaskSize: '100% 100%'}}>
        <AbsoluteFill style={{transform: `scale(${settle})`}}>{children}</AbsoluteFill>
      </AbsoluteFill>
      {mids}
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- type
/** Typewriter text: characters appear in sequence, the newest ones fading in. */
export const Typed: React.FC<{
  text: string;
  f: number;
  start: number;
  cpf?: number; // characters per frame
  fade?: number; // characters in the fading tail
  style?: React.CSSProperties;
  tail?: string; // colour of the fading tail
}> = ({text, f, start, cpf = 1.1, fade = 4, style, tail}) => {
  const n = (f - start) * cpf;
  if (n <= 0) return null;
  return (
    <span style={{whiteSpace: 'pre', ...style}}>
      {Array.from(text).map((ch, i) => {
        const o = Math.max(0, Math.min(1, (n - i) / fade));
        if (o <= 0) return null;
        return (
          <span key={i} style={{opacity: tail ? 1 : o, color: tail && o < 1 ? tail : undefined}}>
            {ch}
          </span>
        );
      })}
    </span>
  );
};

/** Word-by-word reveal (chat and title style): newest words arrive dim and brighten. */
export const WordsIn: React.FC<{text: string; f: number; start: number; wpf?: number; dim?: string; style?: React.CSSProperties}> = ({
  text,
  f,
  start,
  wpf = 0.28,
  dim = 'rgba(255,255,255,0.35)',
  style,
}) => {
  const words = text.split(' ');
  const n = (f - start) * wpf;
  return (
    <span style={style}>
      {words.map((w, i) => {
        const k = n - i;
        if (k <= 0) return null;
        return (
          <span key={i} style={{color: k < 1.6 ? dim : undefined, opacity: Math.min(1, k * 1.5)}}>
            {w}
            {i < words.length - 1 ? ' ' : ''}
          </span>
        );
      })}
    </span>
  );
};

export const collageText: React.CSSProperties = {
  fontFamily: fonts.sans,
  fontWeight: 500,
  fontSize: 66,
  letterSpacing: -2,
  color: ink,
  lineHeight: 1,
};

// ---------------------------------------------------------------- collage pieces
export const Cutout: React.FC<{
  f: number;
  src: string;
  x: number;
  y: number;
  size: number;
  d: number;
  tile?: boolean;
  fit?: number;
  rot?: number;
}> = ({f, src, x, y, size, d, tile = true, fit = 0.82, rot = 0}) => {
  const s = useSpr(f, d, 12, 190, 0.6);
  if (f < d) return null;
  const bob = Math.sin((f + d * 5) / 26) * 4;
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: size,
        height: size,
        transform: `translateY(${bob}px) scale(${0.55 + 0.45 * s})`,
        opacity: Math.min(1, s * 2),
      }}
    >
      {tile && <div style={{position: 'absolute', inset: 0, background: '#E2E1DD'}} />}
      <Img
        src={staticFile(`eleven/obj/${src}.webp`)}
        style={{
          position: 'absolute',
          left: (size * (1 - fit)) / 2,
          top: (size * (1 - fit)) / 2,
          width: size * fit,
          height: size * fit,
          objectFit: 'contain',
          transform: `rotate(${rot + Math.sin((f + d) / 34) * 1.5}deg)`,
          filter: 'drop-shadow(0 14px 16px rgba(0,0,0,0.22)) drop-shadow(0 2px 3px rgba(0,0,0,0.18))',
        }}
      />
    </div>
  );
};

export const Word: React.FC<{f: number; t: string; x: number; y: number; d: number; size?: number}> = ({f, t, x, y, d, size = 66}) => (
  <div style={{position: 'absolute', left: x, top: y, ...collageText, fontSize: size}}>
    <Typed text={t} f={f} start={d} cpf={1.3} fade={3} />
  </div>
);

export const Dots: React.FC<{f: number; x: number; y: number; w: number; h: number; d: number; color?: string; out?: number}> = ({
  f,
  x,
  y,
  w,
  h,
  d,
  color = 'rgba(70,90,70,0.6)',
  out = 9999,
}) => {
  if (f < d || f > out) return null;
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: w,
        height: h,
        backgroundImage: `radial-gradient(circle, ${color} 28%, transparent 33%)`,
        backgroundSize: '9px 9px',
        opacity: interpolate(f, [d, d + 3], [0, 1], clamp),
      }}
    />
  );
};

/** Small solid glyph icons, like the phone icon in the reference. */
export const Glyph: React.FC<{f: number; kind: 'chat' | 'pulse' | 'mic' | 'doc'; x: number; y: number; d: number; size?: number}> = ({
  f,
  kind,
  x,
  y,
  d,
  size = 44,
}) => {
  const s = useSpr(f, d, 11, 220, 0.5);
  if (f < d) return null;
  const paths: Record<string, React.ReactNode> = {
    chat: <path d="M4 5h24a3 3 0 0 1 3 3v13a3 3 0 0 1-3 3H14l-7 6v-6H4a3 3 0 0 1-3-3V8a3 3 0 0 1 3-3z" fill={ink} />,
    pulse: <path d="M1 17h7l3-8 5 16 4-11 3 3h8" stroke={ink} strokeWidth={3.2} fill="none" strokeLinecap="round" strokeLinejoin="round" />,
    mic: (
      <>
        <rect x={11} y={2} width={10} height={18} rx={5} fill={ink} />
        <path d="M6 15a10 10 0 0 0 20 0M16 25v5" stroke={ink} strokeWidth={3} fill="none" strokeLinecap="round" />
      </>
    ),
    doc: <path d="M7 2h12l7 7v21H7z M19 2v7h7" fill={ink} />,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" style={{position: 'absolute', left: x, top: y, transform: `scale(${s})`}}>
      {paths[kind]}
    </svg>
  );
};

/** A glass pill like the reference's "INCOMING CALL" tag. */
export const GlassPill: React.FC<{children: React.ReactNode; style?: React.CSSProperties}> = ({children, style}) => (
  <div
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 12,
      padding: '12px 22px',
      borderRadius: 999,
      background: 'linear-gradient(180deg, rgba(90,90,96,0.55), rgba(40,40,46,0.55))',
      border: '1.5px solid rgba(255,255,255,0.35)',
      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.3), 0 10px 30px rgba(0,0,0,0.25)',
      backdropFilter: 'blur(10px)',
      fontFamily: fonts.sans,
      fontSize: 22,
      fontWeight: 500,
      letterSpacing: 1.6,
      textTransform: 'uppercase',
      color: 'rgba(255,255,255,0.95)',
      whiteSpace: 'nowrap',
      ...style,
    }}
  >
    {children}
  </div>
);
