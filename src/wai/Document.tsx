import {AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {colors, fonts} from '../theme';

const rows = [
  ['Morning walk', '20 min', '25 min', '30 min', '30 min'],
  ['Water', '6 glasses', '7 glasses', '8 glasses', '8 glasses'],
  ['Sleep', 'in bed 23:00', 'in bed 22:45', 'in bed 22:30', 'in bed 22:30'],
  ['Vitamin D', 'daily', 'daily', 'daily', 'retest'],
  ['Wind down', 'screens off', 'screens off', 'read 15 min', 'read 15 min'],
  ['Strength', '1× week', '2× week', '2× week', '2× week'],
];

/** The personal plan as a single page: rendered on a screen and on paper. */
const Page: React.FC<{ink: string; ticks: number}> = ({ink, ticks}) => (
  <div style={{width: 760, padding: '64px 56px', boxSizing: 'border-box', fontFamily: fonts.sans, color: ink}}>
    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
      <Img src={staticFile('wai/wai-logo-cream.png')} style={{width: 92, filter: 'brightness(0.25) sepia(1) saturate(1.4)'}} />
      <div style={{fontSize: 16, color: colors.muted}}>weeks 1–4</div>
    </div>
    <div style={{fontFamily: fonts.serif, fontSize: 46, marginTop: 40}}>your plan</div>
    <div style={{fontSize: 18, color: colors.muted, marginTop: 8}}>built from your bloods, sleep and daily habits</div>
    <div style={{marginTop: 40, borderTop: `1px solid ${colors.line}`}}>
      <div style={{display: 'grid', gridTemplateColumns: '1.3fr repeat(4, 1fr)', fontSize: 14, color: colors.muted, padding: '14px 0'}}>
        <span />
        {['week 1', 'week 2', 'week 3', 'week 4'].map((w) => (
          <span key={w}>{w}</span>
        ))}
      </div>
      {rows.map(([name, ...cells], r) => (
        <div
          key={name}
          style={{display: 'grid', gridTemplateColumns: '1.3fr repeat(4, 1fr)', alignItems: 'center', fontSize: 16, padding: '18px 0', borderTop: `1px solid ${colors.line}`}}
        >
          <span style={{fontWeight: 600}}>{name}</span>
          {cells.map((c, i) => (
            <span key={i} style={{display: 'flex', alignItems: 'center', gap: 8}}>
              <span
                style={{
                  width: 16,
                  height: 16,
                  borderRadius: 4,
                  border: `1.5px solid ${colors.caramel}`,
                  background: i === 0 && r < ticks ? colors.caramel : 'transparent',
                  flexShrink: 0,
                }}
              />
              <span style={{fontSize: 13.5, color: '#6B5C4E'}}>{c}</span>
            </span>
          ))}
        </div>
      ))}
    </div>
  </div>
);

/** Close-up of the plan on a laptop screen: dark bezel, slow push. */
export const ScreenShot: React.FC<{from: number; to: number}> = ({from, to}) => {
  const frame = useCurrentFrame();
  const s = interpolate(frame, [from, to], [1.02, 1.08], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{background: '#1E1712', alignItems: 'center', justifyContent: 'center', overflow: 'hidden'}}>
      <div style={{transform: `scale(${s * 1.28})`, background: '#FBF8F3', boxShadow: '0 0 0 18px #2A2019, 0 0 120px rgba(255,236,210,0.12)'}}>
        <Page ink={colors.espresso} ticks={0} />
      </div>
      <AbsoluteFill style={{background: 'linear-gradient(160deg, rgba(255,240,220,0.10), rgba(0,0,0,0) 40%)'}} />
    </AbsoluteFill>
  );
};

/** The same plan printed and taped to a cream wall, handheld drift. */
export const PrintShot: React.FC<{from: number; to: number}> = ({from, to}) => {
  const frame = useCurrentFrame();
  const t = frame - from;
  const s = interpolate(frame, [from, to], [1.12, 1.2], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const x = Math.sin(t / 37) * 6;
  const y = Math.cos(t / 43) * 5;
  const tape: React.CSSProperties = {position: 'absolute', width: 170, height: 46, background: 'rgba(122,92,66,0.82)', top: -22};
  return (
    <AbsoluteFill style={{background: 'radial-gradient(ellipse 90% 70% at 45% 40%, #F4ECDF 0%, #E6D9C6 70%, #D3C2AA 100%)', alignItems: 'center', justifyContent: 'center', overflow: 'hidden'}}>
      <div style={{transform: `translate(${x}px, ${y}px) scale(${s}) rotate(-0.6deg)`, position: 'relative', background: '#FDFBF7', boxShadow: '0 20px 50px rgba(62,47,35,0.18), 0 2px 6px rgba(62,47,35,0.12)'}}>
        <Page ink={colors.espresso} ticks={4} />
        <div style={{...tape, left: 120, transform: 'rotate(-3deg)'}} />
        <div style={{...tape, right: 120, transform: 'rotate(2deg)'}} />
        <div style={{...tape, top: undefined, bottom: -22, left: 300, transform: 'rotate(1deg)'}} />
      </div>
      <AbsoluteFill style={{background: 'linear-gradient(120deg, rgba(255,226,180,0.22) 0%, rgba(255,226,180,0) 45%, rgba(62,47,35,0.12) 100%)'}} />
    </AbsoluteFill>
  );
};
