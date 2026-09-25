import {useCurrentFrame} from 'remotion';
import {clamp01, ease, pop} from './timeline';

export const SANS = 'Inter, -apple-system, "Helvetica Neue", Arial, sans-serif';

const CHROME = 'linear-gradient(180deg, #ffffff 0%, #f4efe8 38%, #a39b92 52%, #e9e2d9 70%, #fffaf3 100%)';
const WARM = 'linear-gradient(180deg, #fff1d6 0%, #ffc680 40%, #d9762c 55%, #ffb25c 75%, #ffe7bf 100%)';

/** Extruded, chrome-faced word: a stacked back layer for depth and a gradient face on top. */
export const ChromeWord: React.FC<{text: string; size: number; warm?: boolean; weight?: number}> = ({
  text,
  size,
  warm,
  weight = 800,
}) => {
  const depth = Math.max(4, Math.round(size / 14));
  const side = warm ? '#7a3a12' : '#4a443e';
  const shadows = Array.from({length: depth}, (_, k) => `0 ${k + 1}px 0 ${side}`)
    .concat([`0 ${depth + 4}px ${size * 0.25}px rgba(0,0,0,0.65)`])
    .concat(warm ? [`0 0 ${size * 0.5}px rgba(255,140,60,0.35)`] : [])
    .join(',');
  const base: React.CSSProperties = {
    fontFamily: SANS,
    fontWeight: weight,
    fontSize: size,
    letterSpacing: -size * 0.035,
    lineHeight: 1.08,
    whiteSpace: 'pre',
  };
  return (
    <span style={{position: 'relative', display: 'inline-block'}}>
      <span style={{...base, color: side, textShadow: shadows}}>{text}</span>
      <span
        style={{
          ...base,
          position: 'absolute',
          left: 0,
          top: 0,
          background: warm ? WARM : CHROME,
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          color: 'transparent',
        }}
      >
        {text}
      </span>
    </span>
  );
};

export type Line = {words: {t: string; warm?: boolean}[]; size: number; at: number};

/** Kinetic lines: each word flips up in 3D with a springy overshoot, then the block lifts away. */
export const KineticType: React.FC<{
  lines: Line[];
  out: number;
  align?: 'left' | 'center';
  style?: React.CSSProperties;
  gap?: number;
}> = ({lines, out, align = 'center', style, gap = 10}) => {
  const frame = useCurrentFrame();
  if (frame < lines[0].at - 2 || frame > out + 14) return null;
  const leave = ease(frame, out, 12, (t) => t * t);
  return (
    <div
      style={{
        position: 'absolute',
        display: 'flex',
        flexDirection: 'column',
        alignItems: align === 'center' ? 'center' : 'flex-start',
        gap,
        perspective: 1400,
        transform: `translateY(${-leave * 70}px) scale(${1 + leave * 0.06})`,
        opacity: 1 - leave,
        filter: `blur(${leave * 12}px)`,
        ...style,
      }}
    >
      {lines.map((line, li) => (
        <div key={li} style={{display: 'flex', gap: line.size * 0.26, transformStyle: 'preserve-3d'}}>
          {line.words.map((w, wi) => {
            const start = line.at + wi * 3;
            const p = pop(frame, start, 0.85);
            const lin = clamp01((frame - start) / 7);
            return (
              <div
                key={wi}
                style={{
                  transformOrigin: '50% 100%',
                  transform: `translateY(${(1 - p) * line.size * 0.7}px) rotateX(${(1 - p) * 80}deg) translateZ(${(1 - lin) * -120}px)`,
                  opacity: lin,
                  filter: `blur(${(1 - lin) * 8}px)`,
                }}
              >
                <ChromeWord text={w.t} size={line.size} warm={w.warm} />
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

/** Small pill used for the source tag and captions. */
export const Tag: React.FC<{children: React.ReactNode; at: number; out: number; style?: React.CSSProperties}> = ({
  children,
  at,
  out,
  style,
}) => {
  const frame = useCurrentFrame();
  const p = pop(frame, at, 0.9);
  const o = clamp01((frame - at) / 6) * (1 - ease(frame, out, 10));
  if (o <= 0) return null;
  return (
    <div
      style={{
        position: 'absolute',
        fontFamily: SANS,
        fontWeight: 500,
        fontSize: 24,
        letterSpacing: 0.3,
        color: 'rgba(255,240,225,0.86)',
        padding: '12px 22px',
        borderRadius: 999,
        background: 'linear-gradient(180deg, rgba(255,255,255,0.14), rgba(255,255,255,0.04))',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.35), inset 0 -1px 0 rgba(0,0,0,0.4), 0 10px 30px rgba(0,0,0,0.5)',
        border: '1px solid rgba(255,255,255,0.12)',
        backdropFilter: 'blur(8px)',
        opacity: o,
        transform: `translateY(${(1 - p) * 18}px) scale(${0.9 + 0.1 * p})`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};
