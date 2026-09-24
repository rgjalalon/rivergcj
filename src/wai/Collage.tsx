import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {colors, fonts} from '../theme';
import {progress} from '../timeline';
import {Footage} from './Footage';
import {FootageId} from './timeline';

type Tile =
  | {kind: 'photo'; id: FootageId; at: number; x: number; y: number; w: number; h: number; rot: number}
  | {kind: 'card'; at: number; x: number; y: number; w: number; rot: number; label: string; value: string; note: string};

// Tiles stay clear of the centre band so the caption reads cleanly. Each card
// lands on the caption word it echoes (tracked / understood / improved).
const tiles = (from: number): Tile[] => [
  {kind: 'photo', id: 'run', at: from + 4, x: 70, y: 140, w: 560, h: 420, rot: -2.5},
  {kind: 'card', at: from + 22, x: 520, y: 400, w: 470, rot: 2, label: 'Blood panel', value: '42 markers', note: 'tracked'},
  {kind: 'card', at: from + 50, x: 100, y: 610, w: 450, rot: -1.5, label: 'Energy', value: 'Sleep is the lever', note: 'understood'},
  {kind: 'photo', id: 'clinic', at: from + 72, x: 540, y: 1090, w: 460, h: 520, rot: 1.5},
  {kind: 'card', at: from + 100, x: 90, y: 1170, w: 430, rot: -1.5, label: 'Vitamin D', value: '+38%', note: 'improved'},
  {kind: 'photo', id: 'outdoors', at: from + 118, x: 170, y: 1450, w: 500, h: 360, rot: -1},
];

export const Collage: React.FC<{from: number; to: number}> = ({from, to}) => {
  const frame = useCurrentFrame();
  // Whole board drifts a touch, like a slow handheld push.
  const drift = interpolate(frame, [from, to], [1, 1.04], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{background: colors.caramel}}>
      <AbsoluteFill style={{background: 'radial-gradient(ellipse 80% 60% at 50% 40%, rgba(245,240,232,0.18), rgba(62,47,35,0.18))'}} />
      <AbsoluteFill style={{transform: `scale(${drift})`}}>
        {tiles(from).map((t, i) => {
          const p = progress(frame, t.at, 10);
          if (p <= 0) return null;
          const base: React.CSSProperties = {
            position: 'absolute',
            left: t.x,
            top: t.y,
            width: t.w,
            opacity: p,
            transform: `translateY(${(1 - p) * 40}px) rotate(${t.rot}deg) scale(${0.96 + 0.04 * p})`,
            boxShadow: '0 30px 60px rgba(62,47,35,0.28), 0 6px 14px rgba(62,47,35,0.16)',
          };
          if (t.kind === 'photo') {
            return (
              <div key={i} style={{...base, height: t.h, padding: 12, background: colors.cream, boxSizing: 'border-box'}}>
                <div style={{position: 'relative', width: '100%', height: '100%', overflow: 'hidden'}}>
                  <Footage id={t.id} from={t.at} to={to} push={0.05} />
                </div>
              </div>
            );
          }
          return (
            <div
              key={i}
              style={{
                ...base,
                background: colors.paper,
                borderRadius: 36,
                padding: '34px 38px',
                boxSizing: 'border-box',
                fontFamily: fonts.sans,
              }}
            >
              <div style={{fontSize: 26, color: colors.muted}}>{t.label}</div>
              <div style={{fontFamily: fonts.serif, fontSize: 52, color: colors.espresso, marginTop: 8, lineHeight: 1.1}}>{t.value}</div>
              <div
                style={{
                  display: 'inline-block',
                  marginTop: 18,
                  padding: '8px 18px',
                  borderRadius: 22,
                  background: '#F3E6D6',
                  color: '#8A5E34',
                  fontSize: 22,
                  fontWeight: 600,
                }}
              >
                {t.note}
              </div>
            </div>
          );
        })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
