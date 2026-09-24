import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {StatusBar} from '../components/StatusBar';
import {Check} from '../components/Icons';
import {colors, fonts, softShadow} from '../theme';
import {easeOut, progress} from '../timeline';

// App screens are laid out at phone scale (400pt wide) and blown up to fill
// the vertical frame, like a close screen recording.
const UI_W = 400;
const UI_SCALE = 1080 / UI_W;
const UI_H = 1920 / UI_SCALE;

const ScreenCamera: React.FC<{from: number; to: number; children: React.ReactNode}> = ({from, to, children}) => {
  const frame = useCurrentFrame();
  const s = interpolate(frame, [from, to], [1, 1.05], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const y = interpolate(frame, [from, to], [0, -24], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{background: colors.paper, overflow: 'hidden'}}>
      <div
        style={{
          position: 'absolute',
          left: (1080 - UI_W) / 2,
          top: (1920 - UI_H) / 2,
          width: UI_W,
          height: UI_H,
          transform: `scale(${UI_SCALE * s}) translateY(${y / UI_SCALE}px)`,
          fontFamily: fonts.sans,
        }}
      >
        {children}
      </div>
    </AbsoluteFill>
  );
};

const items = [
  {title: 'Morning walk', detail: '32 min · outside', emoji: 'walk'},
  {title: 'Water', detail: '6 of 8 glasses', emoji: 'water'},
  {title: 'Sleep', detail: '7h 42m · steady', emoji: 'sleep'},
  {title: 'Vitamin D', detail: 'taken with breakfast', emoji: 'pill'},
  {title: 'Wind down', detail: 'screens off at 21:30', emoji: 'moon'},
];

const Dot: React.FC<{kind: string}> = ({kind}) => {
  const c = colors.caramel;
  const paths: Record<string, React.ReactNode> = {
    walk: <path d="M13 5.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM10 9l-2 11M11 9l3 4 3 1M10.5 13.5l3 2.5 1 4" stroke={c} strokeWidth="1.7" strokeLinecap="round" fill="none" />,
    water: <path d="M12 4s5.5 6 5.5 10a5.5 5.5 0 01-11 0C6.5 10 12 4 12 4z" stroke={c} strokeWidth="1.7" fill="none" />,
    sleep: <path d="M19 14.5A7.5 7.5 0 019.5 5a7.5 7.5 0 109.5 9.5z" stroke={c} strokeWidth="1.7" fill="none" strokeLinejoin="round" />,
    pill: <><rect x="4" y="9" width="16" height="6" rx="3" stroke={c} strokeWidth="1.7" fill="none" transform="rotate(-35 12 12)" /><path d="M10.2 9.4l3.6 5.2" stroke={c} strokeWidth="1.7" /></>,
    moon: <><circle cx="12" cy="12" r="7" stroke={c} strokeWidth="1.7" fill="none" /><path d="M12 8v4l2.5 1.5" stroke={c} strokeWidth="1.7" strokeLinecap="round" /></>,
  };
  return (
    <div style={{width: 40, height: 40, borderRadius: 20, background: '#F3E6D6', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
      <svg width="22" height="22" viewBox="0 0 24 24">{paths[kind]}</svg>
    </div>
  );
};

export const TrackerScreen: React.FC<{from: number; to: number}> = ({from, to}) => {
  const frame = useCurrentFrame();
  const checkAt = (i: number) => from + 4 + i * 6;
  const done = items.slice(0, 4).filter((_, i) => frame >= checkAt(i)).length;
  const ring = interpolate(frame, [from + 6, checkAt(3) + 9], [0.2, 0.8], {
    easing: easeOut,
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const R = 30;
  const C = 2 * Math.PI * R;

  return (
    <ScreenCamera from={from} to={to}>
      <StatusBar />
      <div style={{position: 'absolute', top: 70, left: 24, right: 24}}>
        <div style={{fontSize: 13, color: colors.muted}}>Sunday, 14 September</div>
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 4}}>
          <div style={{fontFamily: fonts.serif, fontSize: 38, color: colors.espresso}}>Today</div>
          <svg width="72" height="72" viewBox="0 0 72 72">
            <circle cx="36" cy="36" r={R} stroke={colors.line} strokeWidth="6" fill="none" />
            <circle
              cx="36"
              cy="36"
              r={R}
              stroke={colors.caramel}
              strokeWidth="6"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={C}
              strokeDashoffset={C * (1 - ring)}
              transform="rotate(-90 36 36)"
            />
            <text x="36" y="41" textAnchor="middle" fontFamily="Inter" fontWeight="600" fontSize="15" fill={colors.espresso}>
              {done}/5
            </text>
          </svg>
        </div>
        <div style={{fontSize: 14, color: colors.muted, marginTop: 6}}>The small things, adding up.</div>
      </div>

      <div style={{position: 'absolute', top: 222, left: 24, right: 24, display: 'flex', flexDirection: 'column', gap: 10}}>
        {items.map((it, i) => {
          const p = i < 4 ? progress(frame, checkAt(i)) : 0;
          return (
            <div
              key={it.title}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                padding: '14px 16px',
                borderRadius: 20,
                background: '#FFFFFF',
                boxShadow: softShadow,
              }}
            >
              <Dot kind={it.emoji} />
              <div style={{flex: 1}}>
                <div style={{fontSize: 15.5, fontWeight: 600, color: colors.espresso}}>{it.title}</div>
                <div style={{fontSize: 13, color: colors.muted, marginTop: 2}}>{it.detail}</div>
              </div>
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 14,
                  border: `1.5px solid ${p > 0 ? colors.espresso : colors.line}`,
                  background: `rgba(62,47,35,${p})`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transform: `scale(${1 - 0.06 * Math.sin(Math.PI * p)})`,
                }}
              >
                <div style={{opacity: p}}>
                  <Check color={colors.cream} size={16} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </ScreenCamera>
  );
};

export const InsightsScreen: React.FC<{from: number; to: number}> = ({from, to}) => {
  const frame = useCurrentFrame();
  const draw = interpolate(frame, [from + 6, from + 40], [0, 1], {easing: easeOut, extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const badge = progress(frame, from + 36);
  const pts = [
    [0, 118],
    [60, 110],
    [120, 96],
    [180, 80],
    [240, 58],
    [300, 44],
    [312, 42],
  ];
  const d = pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x} ${y}`).join(' ');
  const LEN = 360;
  const value = Math.round(interpolate(draw, [0, 1], [24, 58]));

  return (
    <ScreenCamera from={from} to={to}>
      <StatusBar />
      <div style={{position: 'absolute', top: 70, left: 24, right: 24}}>
        <div style={{fontSize: 13, color: colors.muted}}>Insights</div>
        <div style={{fontFamily: fonts.serif, fontSize: 34, color: colors.espresso, marginTop: 4}}>Your results</div>
      </div>

      <div
        style={{
          position: 'absolute',
          top: 170,
          left: 24,
          right: 24,
          borderRadius: 24,
          background: '#FFFFFF',
          boxShadow: softShadow,
          padding: 20,
        }}
      >
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
          <div>
            <div style={{fontSize: 14, fontWeight: 600, color: colors.espresso}}>Vitamin D</div>
            <div style={{display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 6}}>
              <span style={{fontFamily: fonts.serif, fontSize: 40, color: colors.espresso}}>{value}</span>
              <span style={{fontSize: 13, color: colors.muted}}>ng/mL</span>
            </div>
          </div>
          <div
            style={{
              opacity: badge,
              transform: `translateY(${(1 - badge) * 6}px)`,
              padding: '6px 12px',
              borderRadius: 14,
              background: '#F3E6D6',
              color: '#8A5E34',
              fontSize: 12.5,
              fontWeight: 600,
            }}
          >
            Improved
          </div>
        </div>
        <svg width="312" height="140" viewBox="0 0 312 140" style={{marginTop: 14, overflow: 'visible'}}>
          <rect x="0" y="20" width="312" height="44" rx="8" fill="rgba(200,155,109,0.14)" />
          <text x="304" y="36" textAnchor="end" fontFamily="Inter" fontSize="10.5" fill="#8A5E34">
            optimal range
          </text>
          {[0, 1, 2, 3].map((i) => (
            <line key={i} x1="0" x2="312" y1={20 + i * 36} y2={20 + i * 36} stroke={colors.line} strokeWidth="0.8" />
          ))}
          <path d={d} fill="none" stroke={colors.espresso} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray={LEN} strokeDashoffset={LEN * (1 - draw)} />
          <circle cx={312} cy={42} r={5} fill={colors.caramel} opacity={badge} />
        </svg>
        <div style={{display: 'flex', justifyContent: 'space-between', fontSize: 11.5, color: colors.muted, marginTop: 8}}>
          <span>Mar</span>
          <span>Jun</span>
          <span>Sep</span>
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          top: 470,
          left: 24,
          right: 24,
          borderRadius: 20,
          background: colors.cream,
          border: `1px solid ${colors.line}`,
          padding: '16px 18px',
          fontSize: 14,
          lineHeight: 1.55,
          color: '#6B5C4E',
          opacity: progress(frame, from + 14, 12),
        }}
      >
        <div style={{fontWeight: 600, color: colors.espresso, marginBottom: 4}}>What this means</div>
        You’re now in the optimal range. Keep up the morning walks, and we’ll retest in 12 weeks.
      </div>
    </ScreenCamera>
  );
};
