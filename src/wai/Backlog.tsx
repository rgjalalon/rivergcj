import '../loadFonts';
import {AbsoluteFill, Audio, Easing, Img, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {Grain} from '../components/Grain';
import {fonts} from '../theme';

// Wai: "The 30 hours" — 16:9 kinetic-type film, 29s at 30fps.
// Motion language follows the reference: type that writes itself on at huge
// scale then pulls back, a camera that never stops drifting (push-ins, a 3D
// tilt, depth blur), zoom-through transitions, a glass prompt bar with a
// cursor click, and a soft moving gradient under the end card.
export const BACKLOG_FPS = 30;
export const BACKLOG_DURATION = 870;
export const BACKLOG_W = 1920;
export const BACKLOG_H = 1080;

const B = {split: 150, pile: 240, whip: 392, line: 410, prompt: 495, click: 568, through: 572, clear: 592, close: 700, logo: 790};

const C = {
  bg: '#FFFFFF',
  panel: '#EEF3FB',
  card: '#FFFFFF',
  cardLine: 'rgba(20,50,120,0.12)',
  gray: '#C5CEDB',
  text: '#0B1B3A',
  dim: 'rgba(11,27,58,0.5)',
  accent: '#1F5BFF', // blue: patient care, the hero
  orange: '#FF8A3D', // used sparingly: carets, ticks, key words
};

const TOTAL = 57.8;
const CARE = 27.2;
const BAR = {x: 240, y: 600, w: 1440, h: 56};
const CARE_W = (BAR.w * CARE) / TOTAL;

const expo = Easing.bezier(0.16, 1, 0.3, 1);
const inOut = Easing.bezier(0.65, 0, 0.35, 1);
const easeIn = Easing.bezier(0.55, 0, 0.9, 0.3);
const p = (f: number, a: number, d: number, e = expo) =>
  interpolate(f, [a, a + d], [0, 1], {easing: e, extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
const mix = (a: number, b: number, t: number) => a + (b - a) * t;
const typed = (s: string, f: number, at: number, cps = 1.4) => s.slice(0, Math.max(0, Math.floor((f - at) * cps)));

const TASKS = ['Documentation', 'Prior authorizations', 'Order entry', 'Inbox messages'];
const CARD_W = 300;
const CARD_H = 60;
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
    at: B.pile + 16 + i * 9,
    clearAt: B.clear + (11 - i) * 5,
  };
});
const CLEARED = B.clear + 12 * 5 + 4;
const WHIP_CARD = cards[9];

// ---- Camera ---------------------------------------------------------------
type Cam = {f: number; x: number; y: number; s: number; rx: number; rz: number; e?: (t: number) => number};
const keys: Cam[] = [
  {f: 0, x: 400, y: 392, s: 2.9, rx: 0, rz: 0},
  {f: 26, x: 404, y: 392, s: 2.75, rx: 0, rz: 0},
  {f: 100, x: 960, y: 540, s: 1, rx: 0, rz: 0},
  {f: B.split, x: 950, y: 545, s: 1.04, rx: 0, rz: 0},
  {f: B.split + 32, x: CARE_W + BAR.x, y: 610, s: 1.75, rx: 0, rz: 0},
  {f: B.pile, x: CARE_W + BAR.x + 30, y: 605, s: 1.62, rx: 0, rz: 0},
  {f: B.pile + 50, x: 1010, y: 520, s: 1.02, rx: 24, rz: -5},
  {f: B.whip, x: 1000, y: 505, s: 1.14, rx: 28, rz: -7},
  {f: B.line, x: WHIP_CARD.x + CARD_W / 2, y: WHIP_CARD.y + CARD_H / 2, s: 7, rx: 0, rz: 0, e: easeIn},
  // after the zoom-through on the prompt's button
  {f: B.through + 6, x: 1100, y: 470, s: 2.4, rx: 0, rz: 0},
  {f: B.clear + 14, x: 980, y: 540, s: 1.06, rx: 0, rz: 0},
  {f: CLEARED, x: 960, y: 545, s: 1, rx: 0, rz: 0},
];
const cam = (f: number) => {
  let i = 0;
  while (i < keys.length - 2 && f >= keys[i + 1].f) i++;
  const a = keys[i];
  const b = keys[i + 1];
  const t = interpolate(f, [a.f, b.f], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: b.e ?? inOut});
  return {x: mix(a.x, b.x, t), y: mix(a.y, b.y, t), s: mix(a.s, b.s, t), rx: mix(a.rx, b.rx, t), rz: mix(a.rz, b.rz, t)};
};
// Motion blur from camera speed.
const camBlur = (f: number) => {
  const a = cam(f - 1);
  const b = cam(f);
  const v = Math.abs(Math.log(b.s / a.s)) * 60 + Math.hypot(b.x - a.x, b.y - a.y) * b.s * 0.02;
  return Math.min(14, v * 1.6);
};

// ---- Pieces -----------------------------------------------------------------
const Grid: React.FC = () => (
  <AbsoluteFill
    style={{
      backgroundImage:
        'linear-gradient(rgba(20,50,120,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(20,50,120,0.05) 1px, transparent 1px)',
      backgroundSize: '80px 80px',
      maskImage: 'radial-gradient(ellipse 70% 65% at 50% 50%, #000 30%, transparent 100%)',
    }}
  />
);

/** Slow drifting blue gradient, as in the reference. */
const Blob: React.FC<{f: number; strength: number}> = ({f, strength}) => (
  <AbsoluteFill
    style={{
      opacity: strength,
      background: `radial-gradient(ellipse 45% 60% at ${38 + 10 * Math.sin(f / 70)}% ${62 + 8 * Math.cos(f / 90)}%, rgba(31,91,255,0.55) 0%, rgba(76,141,255,0.22) 45%, transparent 75%),
        radial-gradient(ellipse 40% 50% at ${72 + 6 * Math.cos(f / 60)}% ${30 + 6 * Math.sin(f / 80)}%, rgba(140,190,255,0.45) 0%, transparent 70%)`,
      filter: 'blur(40px)',
    }}
  />
);

const Mono: React.FC<{children: React.ReactNode; style?: React.CSSProperties}> = ({children, style}) => (
  <div style={{fontFamily: fonts.sans, fontSize: 20, fontWeight: 500, letterSpacing: 2.4, textTransform: 'uppercase', color: C.dim, ...style}}>
    {children}
  </div>
);

const Caret: React.FC<{f: number; on?: boolean}> = ({f, on = true}) => (
  <span style={{display: 'inline-block', width: 3, height: '0.9em', marginLeft: 4, verticalAlign: '-0.08em', background: C.orange, opacity: on && Math.floor(f / 8) % 2 === 0 ? 1 : on ? 0.25 : 0}} />
);

const Cursor: React.FC<{x: number; y: number; press: number; opacity: number}> = ({x, y, press, opacity}) => (
  <svg width="44" height="52" viewBox="0 0 22 26" style={{position: 'absolute', left: x, top: y, opacity, transform: `scale(${1 - press * 0.15})`, transformOrigin: '4px 2px', filter: 'drop-shadow(0 6px 14px rgba(11,27,58,0.25))'}}>
    <path d="M2 1.5 L2 20 L7 15.5 L10.5 23.5 L13.8 22 L10.4 14.3 L17 14.3 Z" fill="#FFFFFF" stroke="#0B1B3A" strokeWidth="1.3" strokeLinejoin="round" />
  </svg>
);

// ---- Stage (the chart world, filmed by the camera) ------------------------------
const Stage: React.FC<{f: number}> = ({f}) => {
  const fill = p(f, 8, 92, inOut);
  const hours = TOTAL * fill;
  const split = p(f, B.split, 26, inOut);
  const glow = p(f, B.split + 10, 36);
  const crowd = p(f, B.pile + 20, 130, inOut);
  const regain = p(f, CLEARED, 22, inOut);
  const flood = p(f, CLEARED + 24, 30, inOut);
  const careW = mix(mix(CARE_W, CARE_W * 0.52, crowd), BAR.w, regain);
  const grayGone = p(f, B.pile + 6, 26);
  const careDim = mix(mix(1, 0.5, crowd), 1, regain);
  const headline = `${hours.toFixed(1)}`;

  return (
    <>
      {/* Counter: starts full-frame, pulls back into place */}
      <div style={{position: 'absolute', left: BAR.x, top: 300, opacity: 1 - p(f, B.pile + 40, 24)}}>
        <Mono style={{opacity: p(f, 60, 20)}}>Weekly hours</Mono>
        <div style={{fontFamily: fonts.sans, fontWeight: 600, fontSize: 132, color: C.text, letterSpacing: -4, lineHeight: 1.05, marginTop: 14, fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap'}}>
          {headline}
          <span style={{fontSize: 56, color: C.dim, marginLeft: 12, letterSpacing: -1}}>h</span>
        </div>
      </div>
      <div style={{position: 'absolute', left: BAR.x, top: BAR.y + 96, fontFamily: fonts.sans, fontSize: 28, color: C.dim, opacity: 1 - p(f, B.split, 14), whiteSpace: 'nowrap'}}>
        {typed('The average physician workweek', f, 62, 1.6)}
        <span style={{color: 'rgba(11,27,58,0.32)'}}>{typed(' · AMA, 2024, n=18,000', f, 62 + 30 / 1.6, 1.6)}</span>
        {f > 60 && f < B.split && <Caret f={f} />}
      </div>

      <div style={{position: 'absolute', left: BAR.x, top: BAR.y, width: BAR.w, height: BAR.h, borderRadius: 14, background: C.panel, border: `1px solid ${C.cardLine}`, opacity: 1 - flood}} />
      <div style={{position: 'absolute', left: BAR.x, top: BAR.y, width: BAR.w * fill, height: BAR.h, borderRadius: 14, background: 'linear-gradient(90deg, #9AA7BB, #B7C1D0)', opacity: 1 - split}} />
      <div
        style={{
          position: 'absolute', left: BAR.x + CARE_W + 6 * split, top: BAR.y, width: BAR.w - CARE_W - 6 * split, height: BAR.h, borderRadius: 14,
          background: C.gray, opacity: split * (1 - grayGone), transform: `scaleY(${1 - grayGone * 0.6})`,
        }}
      />
      <div style={{position: 'absolute', left: BAR.x + CARE_W + 6, top: BAR.y - 58, opacity: p(f, B.split + 22, 20) * (1 - grayGone)}}>
        <Mono>Everything else</Mono>
        <div style={{fontFamily: fonts.sans, fontSize: 24, color: 'rgba(11,27,58,0.4)', marginTop: 4}}>30.6 h</div>
      </div>

      {/* Patient care: survives the pile and floods the frame */}
      <div
        style={{
          position: 'absolute',
          left: mix(BAR.x, -200, flood), top: mix(BAR.y, -200, flood),
          width: mix(careW, BACKLOG_W + 400, flood), height: mix(BAR.h, BACKLOG_H + 400, flood),
          borderRadius: mix(14, 0, flood),
          background: `linear-gradient(90deg, ${C.accent}, #4C8DFF)`,
          opacity: split * careDim,
          boxShadow: `0 0 ${60 * glow}px ${8 * glow}px rgba(31,91,255,${0.3 * glow * careDim}), 0 0 ${160 * glow}px rgba(76,141,255,${0.2 * glow})`,
        }}
      />
      <div style={{position: 'absolute', left: BAR.x, top: BAR.y - 58, opacity: p(f, B.split + 16, 20) * (1 - p(f, CLEARED + 10, 10)) * careDim}}>
        <Mono style={{color: C.accent}}>Direct patient care</Mono>
        <div style={{fontFamily: fonts.sans, fontSize: 24, color: 'rgba(11,27,58,0.7)', marginTop: 4}}>27.2 h</div>
      </div>

      {cards.map((c, i) => {
        const inn = p(f, c.at, 20);
        const out = p(f, c.clearAt + 3, 10, easeIn);
        if (inn === 0 || out >= 1) return null;
        const tick = p(f, c.clearAt - 3, 5);
        const sx = BAR.x + CARE_W + 60 + (i % 4) * 150;
        return (
          <div
            key={i}
            style={{
              position: 'absolute', left: mix(sx, c.x, inn) + out * 320, top: mix(BAR.y, c.y, inn) - out * 30, width: CARD_W, height: CARD_H, borderRadius: 12,
              background: C.card, border: `1px solid ${tick > 0 ? `rgba(255,138,61,${0.8 * tick})` : C.cardLine}`,
              boxShadow: `0 10px 30px rgba(20,40,90,0.12), 0 0 ${24 * tick}px rgba(255,138,61,${0.3 * tick})`,
              transform: `rotate(${c.rot * inn * (1 - tick)}deg) scale(${mix(0.8, 1, inn) * (1 - out * 0.1)})`,
              opacity: inn * (1 - out),
              display: 'flex', alignItems: 'center', gap: 14, padding: '0 20px', boxSizing: 'border-box',
              fontFamily: fonts.sans, fontSize: 22, fontWeight: 500, color: 'rgba(11,27,58,0.8)',
            }}
          >
            <div style={{width: 18, height: 18, borderRadius: 5, border: `1.5px solid ${tick > 0 ? C.orange : 'rgba(11,27,58,0.25)'}`, background: `rgba(255,138,61,${tick})`, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <svg width="12" height="12" viewBox="0 0 12 12" style={{opacity: tick}}>
                <path d="M2 6.2 L4.8 9 L10 3" stroke="#FFFFFF" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="12" strokeDashoffset={12 * (1 - tick)} />
              </svg>
            </div>
            {c.label}
          </div>
        );
      })}
    </>
  );
};

// ---- Film -------------------------------------------------------------------
const LINE = ['Every', 'hour', 'spent', 'on', 'a', 'form', 'is', 'an', 'hour', 'not', 'spent', 'looking', 'at', 'a', 'patient.'];
const PROMPT = 'Clear this week’s backlog';

export const WaiBacklog: React.FC = () => {
  const f = useCurrentFrame();
  const stageOn = f < B.line || (f >= B.through && f < B.close + 20);
  const c = cam(f);
  const blur = camBlur(f);
  const close = p(f, B.close, 24, inOut);

  // Beat 4 & prompt scene timing
  const lineOn = f >= B.line && f < B.prompt;
  const promptOn = f >= B.prompt - 6 && f < B.through + 14;
  const promptIn = p(f, B.prompt - 6, 22);
  const through = p(f, B.through - 4, 18, easeIn);
  const press = p(f, B.click - 3, 3) * (1 - p(f, B.click + 1, 5));
  const curIn = p(f, B.click - 34, 26, inOut);

  return (
    <AbsoluteFill style={{background: C.bg, overflow: 'hidden'}}>
      <Audio src={staticFile('wai/30h-score.wav')} />
      <Blob f={f} strength={f < B.line ? 0.35 : f < B.close ? 0.6 : 1} />
      <Grid />

      {/* Opening backdrop: the lily, cropped to 16:9, slow push, dissolves to white as the chart settles */}
      {f < B.split + 10 && (
        <AbsoluteFill style={{opacity: 1 - p(f, 96, 50, inOut)}}>
          <Img
            src={staticFile('wai/lily.jpg')}
            style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: '50% 46%', transform: `scale(${mix(1.14, 1.02, p(f, 0, 150, Easing.out(Easing.quad)))})`, filter: 'blur(3px) saturate(0.95)'}}
          />
          <AbsoluteFill style={{background: 'radial-gradient(ellipse 60% 60% at 30% 40%, rgba(255,255,255,0.28), rgba(255,255,255,0) 70%)'}} />
        </AbsoluteFill>
      )}

      {/* Chart world under the camera */}
      {stageOn && (
        <AbsoluteFill style={{perspective: 1400, opacity: (1 - close) * (f >= B.through ? p(f, B.through, 8) : 1)}}>
          <AbsoluteFill
            style={{
              transformOrigin: '0 0',
              transform: `translate(960px, 540px) rotateX(${c.rx}deg) rotateZ(${c.rz}deg) scale(${c.s}) translate(${-c.x}px, ${-c.y}px)`,
              filter: `blur(${blur}px)`,
            }}
          >
            <Stage f={f} />
          </AbsoluteFill>
          {/* Depth of field during the tilt */}
          <AbsoluteFill style={{backdropFilter: `blur(${6 * p(f, B.pile + 20, 40) * (1 - p(f, B.whip, 6))}px)`, maskImage: 'linear-gradient(180deg, #000 0%, transparent 38%, transparent 70%, #000 100%)'}} />
          {/* Flood title */}
          <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', opacity: p(f, CLEARED + 38, 16)}}>
            <div style={{fontFamily: fonts.serif, fontSize: 118, color: '#FFFFFF', letterSpacing: -2, transform: `scale(${mix(1.08, 1, p(f, CLEARED + 38, 40))})`}}>
              {typed('Direct patient care.', f, CLEARED + 36, 1.2)}
            </div>
          </AbsoluteFill>
        </AbsoluteFill>
      )}

      {/* Beat 4: word-by-word line, drifting push */}
      {lineOn && (
        <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', padding: '0 200px', opacity: p(f, B.line, 8) * (1 - p(f, B.prompt - 12, 12)), transform: `scale(${mix(1.06, 1, p(f, B.line, 80, Easing.out(Easing.quad)))})`}}>
          <div style={{fontFamily: fonts.serif, fontSize: 84, lineHeight: 1.16, color: C.text, letterSpacing: -1.2, textAlign: 'center'}}>
            {LINE.map((w, i) => {
              const t = p(f, B.line + 4 + i * 3, 14);
              const hi = w === 'not';
              return (
                <span key={i} style={{display: 'inline-block', marginRight: '0.26em', opacity: t, transform: `translateY(${(1 - t) * 30}px)`, filter: `blur(${(1 - t) * 8}px)`, fontStyle: hi ? 'italic' : 'normal', color: hi ? C.orange : C.text}}>
                  {w}
                </span>
              );
            })}
          </div>
        </AbsoluteFill>
      )}

      {/* Prompt bar: types, cursor clicks send, camera flies through the button */}
      {promptOn && (
        <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', opacity: promptIn * (1 - p(f, B.through + 4, 10))}}>
          <div
            style={{
              position: 'relative', width: 1040, height: 116, borderRadius: 58,
              background: 'rgba(255,255,255,0.72)', border: '1px solid rgba(31,91,255,0.18)',
              boxShadow: '0 30px 80px rgba(20,40,90,0.18), inset 0 1px 0 rgba(255,255,255,0.9)',
              backdropFilter: 'blur(20px)',
              display: 'flex', alignItems: 'center', padding: '0 20px 0 48px', boxSizing: 'border-box',
              transformOrigin: '962px 58px',
              transform: `perspective(1400px) rotateX(${mix(18, 0, promptIn)}deg) scale(${mix(0.9, 1, promptIn) * mix(1, 14, through)}) translateY(${(1 - promptIn) * 40}px)`,
              filter: `blur(${through * 10}px)`,
            }}
          >
            <div style={{width: 14, height: 14, borderRadius: 7, background: C.orange, marginRight: 22, boxShadow: `0 0 ${12 + 6 * Math.sin(f / 4)}px rgba(255,138,61,0.8)`}} />
            <div style={{flex: 1, fontFamily: fonts.sans, fontSize: 40, color: C.text, letterSpacing: -0.4}}>
              {f < B.prompt + 10 ? <span style={{color: 'rgba(11,27,58,0.32)'}}>Ask Wai…</span> : typed(PROMPT, f, B.prompt + 10, 0.9)}
              {f >= B.prompt + 10 && <Caret f={f} on={f < B.click} />}
            </div>
            <div style={{width: 76, height: 76, borderRadius: 38, background: `linear-gradient(135deg, #4C8DFF, ${C.accent})`, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${1 - press * 0.12})`, boxShadow: `0 0 ${30 + 30 * press}px rgba(31,91,255,${0.3 + 0.4 * press})`}}>
              <svg width="34" height="34" viewBox="0 0 24 24"><path d="M5 12h13M12 5l7 7-7 7" stroke="#FFFFFF" strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </div>
          </div>
          <Cursor x={mix(1500, 1392, curIn)} y={mix(820, 548, curIn)} press={press} opacity={curIn * (1 - through)} />
        </AbsoluteFill>
      )}

      {/* Beat 6 close */}
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', padding: '0 240px', textAlign: 'center', transform: `scale(${mix(1.04, 1, p(f, B.close, 150, Easing.out(Easing.quad)))})`}}>
        <div style={{marginTop: -80, fontFamily: fonts.sans, fontSize: 40, lineHeight: 1.4, color: C.dim}}>
          {f >= B.close + 10 && typed('If AI has a role in healthcare, it’s not in the exam room making the call.', f, B.close + 10, 2.2)}
        </div>
        <div style={{marginTop: 28, fontFamily: fonts.serif, fontSize: 80, lineHeight: 1.15, color: C.text, letterSpacing: -1.2}}>
          {['It’s', 'in', 'the', 'backlog,', 'clearing', 'the', '30', 'hours.'].map((w, i) => {
            const t = p(f, B.close + 48 + i * 4, 16);
            const hi = i >= 5;
            return (
              <span key={i} style={{display: 'inline-block', marginRight: '0.24em', opacity: t, transform: `translateY(${(1 - t) * 28}px)`, filter: `blur(${(1 - t) * 8}px)`, color: hi ? C.accent : C.text}}>
                {w}
              </span>
            );
          })}
        </div>
      </AbsoluteFill>
      <div style={{position: 'absolute', left: 0, right: 0, bottom: 96, display: 'flex', justifyContent: 'center', opacity: p(f, B.logo, 30, inOut), filter: `blur(${(1 - p(f, B.logo, 30)) * 10}px)`}}>
        {/* White logo recoloured blue via mask so it reads on white. */}
        <div style={{width: 232, height: 64, background: C.accent, maskImage: `url(${staticFile('wai/wai-logo-white.webp')})`, maskSize: 'contain', maskRepeat: 'no-repeat', maskPosition: 'center', WebkitMaskImage: `url(${staticFile('wai/wai-logo-white.webp')})`, WebkitMaskSize: 'contain', WebkitMaskRepeat: 'no-repeat', WebkitMaskPosition: 'center'}} />
      </div>

      <Grain width={BACKLOG_W} height={BACKLOG_H} opacity={0.03} />
    </AbsoluteFill>
  );
};
