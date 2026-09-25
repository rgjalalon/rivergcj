import '../loadFonts';
import {AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {Grain, Vignette} from '../components/Grain';
import {fonts} from '../theme';

// Wai: "The 30 hours" — 16:9 kinetic-type film, 36s at 30fps.
// Six beats; boundaries below. One accent (Wai caramel) on a dark neutral UI.
export const BACKLOG_FPS = 30;
export const BACKLOG_DURATION = 1080;
export const BACKLOG_W = 1920;
export const BACKLOG_H = 1080;

const B = {fill: 0, split: 150, pile: 300, line: 480, clear: 600, close: 820, logo: 960};

const C = {
  bg: '#0C0B0A',
  panel: '#161412',
  card: '#1D1B19',
  cardLine: 'rgba(255,255,255,0.08)',
  gray: '#3A3734',
  text: '#F3EEE7',
  dim: 'rgba(243,238,231,0.52)',
  accent: '#D9A774',
};

const TOTAL = 57.8;
const CARE = 27.2;
const BAR = {x: 240, y: 600, w: 1440, h: 56};
const CARE_W = (BAR.w * CARE) / TOTAL;

const expo = Easing.bezier(0.16, 1, 0.3, 1);
const inOut = Easing.bezier(0.65, 0, 0.35, 1);
const p = (f: number, a: number, d: number, e = expo) =>
  interpolate(f, [a, a + d], [0, 1], {easing: e, extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
const mix = (a: number, b: number, t: number) => a + (b - a) * t;

const TASKS = ['Documentation', 'Prior authorizations', 'Order entry', 'Inbox messages'];
const CARD_W = 300;
const CARD_H = 60;
// 12 cards in four stacks; stacks spill left over the patient-care segment.
const cards = Array.from({length: 12}, (_, i) => {
  const stack = i % 4;
  const level = Math.floor(i / 4) + (stack === 3 ? 0 : stack === 0 ? 1 : 0);
  const cx = [1470, 1150, 830, 540][stack];
  const jitter = ((i * 37) % 11) - 5;
  return {
    label: TASKS[(i + Math.floor(i / 4)) % 4],
    x: cx - CARD_W / 2 + jitter * 3,
    y: BAR.y - 14 - (level + 1) * (CARD_H + 10) + (stack === 3 ? 40 : 0),
    rot: jitter * 0.45,
    at: B.pile + 20 + i * 11,
    clearAt: B.clear + 40 + (11 - i) * 8,
  };
});
const CLEARED = B.clear + 40 + 12 * 8 + 6;

const Grid: React.FC = () => (
  <AbsoluteFill
    style={{
      backgroundImage:
        'linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)',
      backgroundSize: '80px 80px',
      backgroundPosition: '-1px -1px',
      maskImage: 'radial-gradient(ellipse 70% 65% at 50% 50%, #000 30%, transparent 100%)',
    }}
  />
);

const Mono: React.FC<{children: React.ReactNode; style?: React.CSSProperties}> = ({children, style}) => (
  <div style={{fontFamily: fonts.sans, fontSize: 20, fontWeight: 500, letterSpacing: 2.4, textTransform: 'uppercase', color: C.dim, ...style}}>
    {children}
  </div>
);

export const WaiBacklog: React.FC = () => {
  const f = useCurrentFrame();

  // Beat 1: bar fills.
  const fill = p(f, 12, 84, inOut);
  const hours = TOTAL * fill;
  const introIn = p(f, 0, 24);

  // Beat 2: split.
  const split = p(f, B.split, 30, inOut);
  const glow = p(f, B.split + 12, 40);

  // Beat 3: pile crowds the care segment.
  const crowd = p(f, B.pile + 30, 140, inOut);
  // Beat 5: cleared, then care re-expands and floods the frame.
  const regain = p(f, CLEARED, 26, inOut);
  const flood = p(f, CLEARED + 30, 34, inOut);
  const careW = mix(mix(CARE_W, CARE_W * 0.52, crowd), BAR.w, regain);
  const grayGone = p(f, B.pile + 10, 30);

  // Beat 4: dim the stage behind the line.
  const lineIn = p(f, B.line, 24);
  const lineOut = p(f, B.clear - 12, 18);
  const stageDim = lineIn * (1 - lineOut);

  // Beat 6 crossfade out of the flood.
  const close = p(f, B.close, 30, inOut);

  const careRect = {
    x: mix(BAR.x, 0, flood),
    y: mix(BAR.y, 0, flood),
    w: mix(careW, BACKLOG_W, flood),
    h: mix(BAR.h, BACKLOG_H, flood),
  };
  const careDim = mix(1, 0.55, crowd) + (1 - mix(1, 0.55, crowd)) * regain;

  // Assistant scanning head position (follows the card being cleared).
  const active = cards.find((c) => f >= c.clearAt - 8 && f < c.clearAt + 2);
  const assistIn = p(f, B.clear + 6, 20) * (1 - p(f, CLEARED, 14));

  return (
    <AbsoluteFill style={{background: C.bg, overflow: 'hidden'}}>
      <Grid />

      <AbsoluteFill style={{opacity: 1 - close, filter: `blur(${stageDim * 10}px)`, transform: `scale(${1 - stageDim * 0.02})`}}>
        {/* Header: counter + caption */}
        <div style={{position: 'absolute', left: BAR.x, top: 300, opacity: introIn * (1 - p(f, B.pile + 150, 30)) , transform: `translateY(${(1 - introIn) * 16}px)`}}>
          <Mono>Weekly hours</Mono>
          <div style={{fontFamily: fonts.sans, fontWeight: 600, fontSize: 132, color: C.text, letterSpacing: -4, lineHeight: 1.05, marginTop: 14, fontVariantNumeric: 'tabular-nums'}}>
            {hours.toFixed(1)}
            <span style={{fontSize: 56, color: C.dim, marginLeft: 12, letterSpacing: -1}}>h</span>
          </div>
        </div>
        <div style={{position: 'absolute', left: BAR.x, top: BAR.y + 96, fontFamily: fonts.sans, fontSize: 28, color: C.dim, opacity: p(f, 70, 24) * (1 - p(f, B.split, 16))}}>
          The average physician workweek <span style={{color: 'rgba(243,238,231,0.3)'}}>· AMA, 2024, n=18,000</span>
        </div>

        {/* Track + ticks */}
        <div style={{position: 'absolute', left: BAR.x, top: BAR.y, width: BAR.w, height: BAR.h, borderRadius: 14, background: C.panel, border: `1px solid ${C.cardLine}`, opacity: introIn * (1 - flood)}} />
        {Array.from({length: 13}, (_, i) => (
          <div key={i} style={{position: 'absolute', left: BAR.x + (BAR.w * i * 5) / TOTAL, top: BAR.y + BAR.h + 14, width: 1, height: 10, background: 'rgba(255,255,255,0.14)', opacity: introIn * (1 - p(f, B.split, 20))}} />
        ))}

        {/* Filled (pre-split) bar */}
        <div style={{position: 'absolute', left: BAR.x, top: BAR.y, width: BAR.w * fill, height: BAR.h, borderRadius: 14, background: 'linear-gradient(90deg, #6A635C, #8C847B)', opacity: 1 - split}} />

        {/* Gray remainder */}
        <div
          style={{
            position: 'absolute', left: BAR.x + CARE_W + 6 * split, top: BAR.y, width: (BAR.w - CARE_W - 6 * split), height: BAR.h, borderRadius: 14,
            background: C.gray, opacity: split * (1 - grayGone),
            transform: `scaleY(${1 - grayGone * 0.6})`,
          }}
        />
        <div style={{position: 'absolute', left: BAR.x + CARE_W + 6, top: BAR.y - 58, opacity: p(f, B.split + 30, 24) * (1 - grayGone)}}>
          <Mono>Everything else</Mono>
          <div style={{fontFamily: fonts.sans, fontSize: 24, color: 'rgba(243,238,231,0.4)', marginTop: 4}}>30.6 h</div>
        </div>
      </AbsoluteFill>

      {/* Patient-care segment: survives into the flood */}
      <div
        style={{
          position: 'absolute', left: careRect.x, top: careRect.y, width: careRect.w, height: careRect.h,
          borderRadius: mix(14, 0, flood),
          background: `linear-gradient(90deg, #C98F5A, ${C.accent})`,
          opacity: split * careDim * (1 - close),
          boxShadow: `0 0 ${60 * glow}px ${8 * glow}px rgba(217,167,116,${0.35 * glow * careDim}), 0 0 ${160 * glow}px rgba(217,167,116,${0.18 * glow})`,
          filter: `blur(${stageDim * 10}px)`,
        }}
      />
      <div
        style={{
          position: 'absolute', left: BAR.x, top: BAR.y - 58 - mix(0, 0, flood), opacity: p(f, B.split + 24, 24) * (1 - p(f, CLEARED + 20, 12)) * (1 - stageDim) * careDim,
        }}
      >
        <Mono style={{color: C.accent}}>Direct patient care</Mono>
        <div style={{fontFamily: fonts.sans, fontSize: 24, color: 'rgba(243,238,231,0.7)', marginTop: 4}}>27.2 h</div>
      </div>
      {/* Flood label */}
      <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: p(f, CLEARED + 44, 20) * (1 - close)}}>
        <div style={{fontFamily: fonts.serif, fontSize: 110, color: '#1A120B', letterSpacing: -2, transform: `translateY(${(1 - p(f, CLEARED + 44, 24)) * 14}px)`}}>
          Direct patient care.
        </div>
      </div>

      {/* Task cards */}
      <AbsoluteFill style={{filter: `blur(${stageDim * 10}px)`}}>
        {cards.map((c, i) => {
          const inn = p(f, c.at, 22);
          const out = p(f, c.clearAt, 12, Easing.bezier(0.5, 0, 0.75, 0));
          if (inn === 0 || out >= 1) return null;
          const tick = p(f, c.clearAt - 6, 6);
          // Spawn from the gray segment on the bar.
          const sx = BAR.x + CARE_W + 60 + (i % 4) * 150;
          const x = mix(sx, c.x, inn) + out * 260;
          const y = mix(BAR.y, c.y, inn) - out * 20;
          return (
            <div
              key={i}
              style={{
                position: 'absolute', left: x, top: y, width: CARD_W, height: CARD_H, borderRadius: 12,
                background: C.card, border: `1px solid ${tick > 0 ? `rgba(217,167,116,${0.6 * tick})` : C.cardLine}`,
                boxShadow: '0 10px 30px rgba(0,0,0,0.45)',
                transform: `rotate(${c.rot * inn * (1 - tick)}deg) scale(${mix(0.8, 1, inn)})`,
                opacity: inn * (1 - out),
                display: 'flex', alignItems: 'center', gap: 14, padding: '0 20px', boxSizing: 'border-box',
                fontFamily: fonts.sans, fontSize: 22, fontWeight: 500, color: 'rgba(243,238,231,0.78)',
              }}
            >
              <div style={{width: 18, height: 18, borderRadius: 5, border: `1.5px solid ${tick > 0 ? C.accent : 'rgba(255,255,255,0.25)'}`, background: `rgba(217,167,116,${tick})`, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <svg width="12" height="12" viewBox="0 0 12 12" style={{opacity: tick}}>
                  <path d="M2 6.2 L4.8 9 L10 3" stroke="#1A120B" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="12" strokeDashoffset={12 * (1 - tick)} />
                </svg>
              </div>
              {c.label}
            </div>
          );
        })}

        {/* Assistant cursor */}
        {active && (
          <div
            style={{
              position: 'absolute',
              left: c2x(active, f) - 26,
              top: active.y + CARD_H / 2 - 13,
              width: 26, height: 26, borderRadius: 13,
              background: C.accent, opacity: assistIn,
              boxShadow: '0 0 24px 6px rgba(217,167,116,0.45)',
            }}
          />
        )}
      </AbsoluteFill>

      {/* Assistant status pill */}
      <div style={{position: 'absolute', left: 0, right: 0, top: 140, display: 'flex', justifyContent: 'center', opacity: assistIn, transform: `translateY(${(1 - p(f, B.clear + 6, 20)) * 12}px)`}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 16, padding: '16px 28px', borderRadius: 40, background: 'rgba(29,27,25,0.9)', border: `1px solid ${C.cardLine}`, fontFamily: fonts.sans, fontSize: 24, color: C.text}}>
          <div style={{width: 12, height: 12, borderRadius: 6, background: C.accent, boxShadow: `0 0 ${10 + 6 * Math.sin(f / 4)}px rgba(217,167,116,0.8)`}} />
          Wai assistant
          <span style={{color: C.dim, fontVariantNumeric: 'tabular-nums'}}>
            · clearing backlog {Math.min(12, cards.filter((c) => f >= c.clearAt).length)}/12
          </span>
        </div>
      </div>

      {/* Beat 4 line */}
      <div style={{position: 'absolute', inset: 0, background: `rgba(12,11,10,${0.6 * stageDim})`}} />
      <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 220px', textAlign: 'center', opacity: stageDim}}>
        <div style={{fontFamily: fonts.serif, fontSize: 72, lineHeight: 1.18, color: C.text, letterSpacing: -1, transform: `translateY(${(1 - lineIn) * 18}px)`}}>
          Every hour spent on a form is an hour <span style={{fontStyle: 'italic', color: C.accent}}>not</span> spent looking at a patient.
        </div>
      </div>

      {/* Beat 6 close */}
      <div style={{position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 260px', textAlign: 'center', marginTop: -60}}>
        <div style={{fontFamily: fonts.sans, fontSize: 40, lineHeight: 1.4, color: C.dim, opacity: p(f, B.close + 20, 26), transform: `translateY(${(1 - p(f, B.close + 20, 30)) * 14}px)`}}>
          If AI has a role in healthcare, it’s not in the exam room making the call.
        </div>
        <div style={{marginTop: 28, fontFamily: fonts.serif, fontSize: 76, lineHeight: 1.15, color: C.text, letterSpacing: -1.2, opacity: p(f, B.close + 64, 28), transform: `translateY(${(1 - p(f, B.close + 64, 32)) * 16}px)`}}>
          It’s in the backlog, clearing <span style={{color: C.accent}}>the 30 hours.</span>
        </div>
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, bottom: 96, display: 'flex', justifyContent: 'center', opacity: p(f, B.logo, 36, inOut)}}>
        <Img src={staticFile('wai/wai-logo-white.webp')} style={{height: 64}} />
      </div>

      <Vignette />
      <Grain width={BACKLOG_W} height={BACKLOG_H} opacity={0.05} />
    </AbsoluteFill>
  );
};

// Cursor sweeps in from the card's left edge as the tick lands.
const c2x = (c: (typeof cards)[number], f: number) => c.x + mix(0, CARD_W * 0.15, p(f, c.clearAt - 8, 8));
