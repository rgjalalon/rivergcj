import {AbsoluteFill, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {fonts} from '../theme';
import {M_FPS} from './timeline';

// Premium Wai UI: warm near-black, glass panels, hairline borders, gold accents.
const ink = '#F4EEE4';
const dim = 'rgba(244,238,228,0.56)';
const faint = 'rgba(244,238,228,0.32)';
const gold = '#D8B47A';
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

const glass: React.CSSProperties = {
  background: 'linear-gradient(180deg, rgba(255,248,238,0.075), rgba(255,248,238,0.025))',
  border: '1px solid rgba(255,236,210,0.12)',
  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.08), 0 50px 120px rgba(0,0,0,0.55)',
  borderRadius: 30,
};

const useIn = (delay = 0) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return spring({frame: frame - delay, fps, config: {damping: 200, mass: 0.7}});
};

const rise = (p: number, d = 18): React.CSSProperties => ({opacity: p, transform: `translateY(${(1 - p) * d}px)`});

const typed = (t: string, frame: number, a: number, b: number) =>
  t.slice(0, Math.round(interpolate(frame, [a, b], [0, t.length], clamp)));

/** Warm stage: deep espresso with a slow-moving caramel glow. */
const Stage: React.FC<{children: React.ReactNode; glow?: [number, number]}> = ({children, glow = [70, 30]}) => {
  const frame = useCurrentFrame();
  const gx = glow[0] + Math.sin(frame / 40) * 4;
  return (
    <AbsoluteFill style={{background: '#0b0806', fontFamily: fonts.sans, color: ink, overflow: 'hidden'}}>
      <AbsoluteFill style={{background: `radial-gradient(ellipse 55% 60% at ${gx}% ${glow[1]}%, rgba(200,140,80,0.32), rgba(0,0,0,0) 70%)`}} />
      <AbsoluteFill style={{background: 'radial-gradient(ellipse 50% 50% at 15% 95%, rgba(120,70,35,0.25), rgba(0,0,0,0) 70%)'}} />
      {children}
    </AbsoluteFill>
  );
};

const Mark: React.FC<{h: number; color?: string}> = ({h, color = ink}) => (
  <div
    style={{
      height: h,
      width: (h * 2000) / 552,
      background: color,
      maskImage: `url(${staticFile('wai/wai-logo-cream.png')})`,
      WebkitMaskImage: `url(${staticFile('wai/wai-logo-cream.png')})`,
      maskSize: 'contain',
      WebkitMaskSize: 'contain',
      maskRepeat: 'no-repeat',
      WebkitMaskRepeat: 'no-repeat',
    }}
  />
);

const Pill: React.FC<{children: React.ReactNode}> = ({children}) => (
  <span style={{fontSize: 15, fontWeight: 600, letterSpacing: 0.4, color: gold, border: '1px solid rgba(216,180,122,0.35)', background: 'rgba(216,180,122,0.08)', borderRadius: 20, padding: '6px 14px'}}>
    {children}
  </span>
);

// ─── Phone: health profile ──────────────────────────────────────────────────
export const PhoneProfile: React.FC<{span: number}> = ({span}) => {
  const frame = useCurrentFrame();
  const p = useIn(0);
  const ring = interpolate(frame, [2, span], [0.3, 41 / 42], clamp);
  const R = 92;
  const C = 2 * Math.PI * R;
  const ry = interpolate(frame, [0, span], [-20, -10], clamp);
  return (
    <Stage glow={[55, 45]}>
      <div style={{position: 'absolute', left: 500, top: 70, perspective: 1800}}>
        <div
          style={{
            width: 440,
            height: 920,
            borderRadius: 72,
            padding: 12,
            background: 'linear-gradient(145deg, #3a342e, #0d0c0b 40%, #26221e)',
            boxShadow: '0 70px 140px rgba(0,0,0,0.7), inset 0 0 0 1.5px rgba(255,255,255,0.12)',
            transform: `rotateY(${ry}deg) rotateX(6deg) translateY(${(1 - p) * 60}px)`,
          }}
        >
          <div style={{position: 'relative', width: '100%', height: '100%', borderRadius: 62, background: 'linear-gradient(180deg,#15100c,#0a0806)', overflow: 'hidden', padding: '70px 34px 0'}}>
            <div style={{position: 'absolute', top: 16, left: '50%', marginLeft: -62, width: 124, height: 36, borderRadius: 20, background: '#000'}} />
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
              <Mark h={24} />
              <div style={{width: 40, height: 40, borderRadius: 20, background: 'linear-gradient(135deg,#d8b47a,#8a5e34)'}} />
            </div>
            <div style={{fontSize: 17, color: dim, marginTop: 28}}>Good morning, Maria</div>
            <div style={{fontFamily: fonts.serif, fontSize: 36, marginTop: 6}}>Your health, today</div>
            <div style={{position: 'relative', height: 230, marginTop: 18, display: 'flex', justifyContent: 'center'}}>
              <svg width="230" height="230" viewBox="0 0 230 230">
                <defs>
                  <linearGradient id="gring" x1="0" x2="1">
                    <stop offset="0" stopColor="#f3d9a6" />
                    <stop offset="1" stopColor="#b8813f" />
                  </linearGradient>
                </defs>
                <circle cx="115" cy="115" r={R} stroke="rgba(255,255,255,0.08)" strokeWidth="14" fill="none" />
                <circle cx="115" cy="115" r={R} stroke="url(#gring)" strokeWidth="14" fill="none" strokeLinecap="round" strokeDasharray={C} strokeDashoffset={C * (1 - ring)} transform="rotate(-90 115 115)" />
              </svg>
              <div style={{position: 'absolute', top: 70, textAlign: 'center'}}>
                <div style={{fontFamily: fonts.serif, fontSize: 60, lineHeight: 1}}>41<span style={{color: faint}}>/42</span></div>
                <div style={{fontSize: 14, color: dim, marginTop: 6}}>markers in range</div>
              </div>
            </div>
            {[
              ['Vitamin D', 'Back in range', '58 ng/mL'],
              ['Sleep', 'Steady this week', '7h 42m'],
            ].map(([a, b, c], i) => {
              const q = useIn(4 + i * 3);
              return (
                <div key={a} style={{...glass, borderRadius: 20, boxShadow: 'none', padding: '16px 18px', marginTop: 12, display: 'flex', justifyContent: 'space-between', ...rise(q, 12)}}>
                  <div>
                    <div style={{fontSize: 16, fontWeight: 600}}>{a}</div>
                    <div style={{fontSize: 13, color: dim, marginTop: 3}}>{b}</div>
                  </div>
                  <div style={{fontFamily: fonts.serif, fontSize: 22, color: gold}}>{c}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Stage>
  );
};

// ─── Ambient scribe listening ───────────────────────────────────────────────
export const ScribeTerminal: React.FC<{span: number}> = ({span}) => {
  const frame = useCurrentFrame();
  const p = useIn(0);
  const lines: [string, string][] = [
    ['Patient', 'About three weeks now. I’m exhausted by lunch.'],
    ['Clinician', 'Any change in your sleep?'],
    ['Patient', 'I’m up two or three times a night.'],
  ];
  const per = span / 4;
  return (
    <Stage glow={[30, 20]}>
      <div style={{...glass, position: 'absolute', left: 150, top: 150, width: 1140, height: 780, padding: '44px 56px', ...rise(p, 30)}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 16}}>
          <div style={{width: 12, height: 12, borderRadius: 6, background: '#e0645a', boxShadow: '0 0 14px #e0645a', opacity: 0.6 + 0.4 * Math.sin(frame / 3)}} />
          <div style={{fontSize: 22, fontWeight: 600}}>Listening</div>
          <div style={{fontSize: 20, color: faint}}>00:04:12</div>
          <div style={{marginLeft: 'auto'}}>
            <Pill>wai scribe</Pill>
          </div>
        </div>
        <div style={{display: 'flex', alignItems: 'center', gap: 6, height: 110, marginTop: 30}}>
          {Array.from({length: 64}, (_, i) => {
            const h = 10 + Math.abs(Math.sin(i * 0.55 + frame * 0.45) * Math.cos(i * 0.21 - frame * 0.2)) * 90;
            return <div key={i} style={{width: 8, height: h, borderRadius: 4, background: `linear-gradient(180deg, ${gold}, rgba(216,180,122,0.2))`}} />;
          })}
        </div>
        <div style={{marginTop: 34, fontSize: 30, lineHeight: 1.6}}>
          {lines.map(([who, t], i) => (
            <div key={i} style={{display: 'flex', gap: 24}}>
              <span style={{width: 150, color: faint, fontSize: 22, paddingTop: 6}}>{who}</span>
              <span>{typed(t, frame, i * per, i * per + per)}</span>
            </div>
          ))}
        </div>
        <div style={{marginTop: 20, fontSize: 22, color: gold, opacity: interpolate(frame, [span * 0.72, span * 0.85], [0, 1], clamp)}}>
          Structuring note · HPI, nocturia, suggested labs
        </div>
      </div>
    </Stage>
  );
};

// ─── Wai speaks ─────────────────────────────────────────────────────────────
const aiWords = "Hi. I've read your whole record... and I think I know what's going on.".split(' ');
export const AiVoice: React.FC<{span: number}> = () => {
  const frame = useCurrentFrame();
  const t = (frame - 1.4 * M_FPS) / (4.0 * M_FPS);
  const cur = Math.floor(t * aiWords.length);
  const pulse = 1 + 0.08 * Math.sin(frame / 4) * (t > 0 && t < 1 ? 1 : 0.3);
  return (
    <Stage glow={[50, 30]}>
      <div
        style={{
          position: 'absolute',
          left: 720 - 90,
          top: 220,
          width: 180,
          height: 180,
          borderRadius: 90,
          transform: `scale(${pulse})`,
          background: 'radial-gradient(circle at 38% 32%, #fff3d6, #e3b56d 35%, #8a5324 75%, #3a200d)',
          boxShadow: '0 0 80px 20px rgba(226,170,95,0.35), 0 0 200px 60px rgba(200,120,50,0.18)',
        }}
      />
      <div style={{position: 'absolute', left: 220, right: 220, top: 500, textAlign: 'center', fontFamily: fonts.serif, fontSize: 52, lineHeight: 1.3}}>
        {aiWords.map((w, i) => (
          <span key={i} style={{color: i <= cur ? ink : 'rgba(244,238,228,0.22)', transition: 'none'}}>
            {w}{' '}
          </span>
        ))}
      </div>
    </Stage>
  );
};

// ─── Ask Wai ────────────────────────────────────────────────────────────────
export const AskWai: React.FC<{span: number}> = ({span}) => {
  const frame = useCurrentFrame();
  const p = useIn(0);
  return (
    <Stage glow={[50, 40]}>
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', ...rise(p, 24)}}>
        <Mark h={34} color={gold} />
        <div style={{fontFamily: fonts.serif, fontSize: 76, marginTop: 30}}>What’s on your mind today?</div>
        <div style={{...glass, marginTop: 48, width: 900, height: 104, borderRadius: 52, display: 'flex', alignItems: 'center', padding: '0 20px 0 44px', boxSizing: 'border-box', fontSize: 32}}>
          <span style={{flex: 1}}>{typed('Why am I so tired lately?', frame, 2, span * 0.8) || ' '}</span>
          <div style={{width: 64, height: 64, borderRadius: 32, background: `linear-gradient(135deg,#f0d3a0,${gold} 50%,#9a6a35)`, color: '#1a120b', fontSize: 30, lineHeight: '64px', textAlign: 'center'}}>↑</div>
        </div>
        <div style={{display: 'flex', gap: 14, marginTop: 26}}>
          {['Explain my blood panel', 'Book a follow-up', 'Prepare for my visit'].map((c) => (
            <span key={c} style={{fontSize: 18, color: dim, border: '1px solid rgba(255,236,210,0.12)', borderRadius: 22, padding: '10px 18px'}}>{c}</span>
          ))}
        </div>
      </AbsoluteFill>
    </Stage>
  );
};

/** macOS-style app window. */
const Window: React.FC<{children: React.ReactNode; p: number}> = ({children, p}) => (
  <div style={{...glass, position: 'absolute', left: 90, top: 110, width: 1260, height: 860, overflow: 'hidden', ...rise(p, 30)}}>
    <div style={{height: 52, display: 'flex', alignItems: 'center', gap: 9, padding: '0 22px', borderBottom: '1px solid rgba(255,236,210,0.08)'}}>
      {['#e0645a', '#e3b04b', '#5fb85a'].map((c) => (
        <div key={c} style={{width: 13, height: 13, borderRadius: 7, background: c, opacity: 0.85}} />
      ))}
      <div style={{marginLeft: 20}}>
        <Mark h={18} color={dim} />
      </div>
    </div>
    {children}
  </div>
);

// ─── Consultation note drafting itself ──────────────────────────────────────
export const ScribeNote: React.FC<{span: number}> = ({span}) => {
  const frame = useCurrentFrame();
  const p = useIn(0);
  const note = [
    ['Subjective', '3 weeks of fatigue, worse by midday. Nocturia 2–3×/night.'],
    ['Objective', 'BP 128/82 · HR 72 · BMI 26.1'],
    ['Plan', 'HbA1c, TSH, ferritin, vitamin D. Sleep diary. Review in 2 weeks.'],
  ];
  return (
    <Stage glow={[75, 20]}>
      <Window p={p}>
        <div style={{display: 'flex', height: '100%'}}>
          <div style={{width: 280, borderRight: '1px solid rgba(255,236,210,0.08)', padding: 26, fontSize: 18, lineHeight: 2.4, color: dim}}>
            <div style={{fontSize: 13, letterSpacing: 2, color: faint}}>TODAY</div>
            <div style={{color: ink, background: 'rgba(216,180,122,0.1)', borderRadius: 10, padding: '0 12px', margin: '6px -12px'}}>Maria Lopez · 10:40</div>
            <div>James Okoro · 11:00</div>
            <div>Priya Shah · 11:20</div>
            <div>Tom Evans · 11:40</div>
          </div>
          <div style={{flex: 1, padding: '38px 52px'}}>
            <div style={{display: 'flex', alignItems: 'center', gap: 18}}>
              <div style={{fontFamily: fonts.serif, fontSize: 44}}>Consultation note</div>
              <Pill>Drafted by wai</Pill>
            </div>
            {note.map(([h, t], i) => (
              <div key={h} style={{marginTop: 34}}>
                <div style={{fontSize: 14, fontWeight: 600, letterSpacing: 2, color: gold, textTransform: 'uppercase'}}>{h}</div>
                <div style={{fontSize: 28, marginTop: 10, minHeight: 36}}>{typed(t, frame, i * span * 0.22, i * span * 0.22 + span * 0.35)}</div>
              </div>
            ))}
          </div>
        </div>
      </Window>
    </Stage>
  );
};

// ─── Clinic schedule ────────────────────────────────────────────────────────
export const Schedule: React.FC<{span: number}> = () => {
  const p = useIn(0);
  const cols = ['Dr. Patel', 'Dr. Okafor', 'Nurse Kim', 'Physio'];
  const ev: [number, number, number, string, string][] = [
    [0, 0, 2, 'Maria L.', 'Follow-up'], [0, 3, 1, 'New patient', 'Intake'], [1, 1, 2, 'James O.', 'Review'],
    [1, 4, 1, 'Priya S.', 'Results'], [2, 0, 1, 'Bloods', '3 patients'], [2, 2, 1, 'Vaccines', 'Walk-in'], [3, 1, 2, 'Rehab', 'Tom E.'],
  ];
  return (
    <Stage glow={[40, 20]}>
      <Window p={p}>
        <div style={{padding: '30px 40px'}}>
          <div style={{fontFamily: fonts.serif, fontSize: 38}}>Tuesday, 14 October</div>
          <div style={{display: 'flex', gap: 16, marginTop: 24}}>
            {cols.map((c, ci) => (
              <div key={c} style={{flex: 1}}>
                <div style={{fontSize: 17, color: dim, marginBottom: 12}}>{c}</div>
                <div style={{position: 'relative', height: 640, borderRadius: 18, background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,236,210,0.06)'}}>
                  {ev.filter((e) => e[0] === ci).map((e, k) => {
                    const q = useIn(k * 2 + ci);
                    return (
                      <div key={k} style={{position: 'absolute', left: 8, right: 8, top: 10 + e[1] * 124, height: e[2] * 124 - 12, borderRadius: 14, padding: 14, background: 'linear-gradient(180deg, rgba(216,180,122,0.2), rgba(216,180,122,0.07))', borderLeft: `3px solid ${gold}`, ...rise(q, 10)}}>
                        <div style={{fontSize: 19, fontWeight: 600}}>{e[3]}</div>
                        <div style={{fontSize: 15, color: dim, marginTop: 4}}>{e[4]}</div>
                      </div>
                    );
                  })}
                  <div style={{position: 'absolute', left: 0, right: 0, top: 300, height: 2, background: gold, boxShadow: `0 0 10px ${gold}`}} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </Window>
    </Stage>
  );
};

// ─── Confirm / sign, with a cursor click ────────────────────────────────────
export const ButtonClick: React.FC<{span: number; title: string; sub: string; primary: string; secondary?: string}> = ({span, title, sub, primary, secondary}) => {
  const frame = useCurrentFrame();
  const p = useIn(0);
  const at = span * 0.6;
  const press = interpolate(frame, [at - 2, at, at + 4], [0, 1, 0], clamp);
  const ripple = interpolate(frame, [at, at + 10], [0, 1], clamp);
  const cx = interpolate(frame, [0, at], [900, 612], clamp);
  const cy = interpolate(frame, [0, at], [760, 612], clamp);
  return (
    <Stage glow={[50, 50]}>
      <AbsoluteFill style={{transform: `scale(${1.25 + frame * 0.004})`, transformOrigin: '45% 55%'}}>
        <div style={{...glass, position: 'absolute', left: 340, top: 360, width: 780, padding: '44px 48px', ...rise(p, 20)}}>
          <div style={{fontFamily: fonts.serif, fontSize: 38}}>{title}</div>
          <div style={{fontSize: 21, color: dim, marginTop: 10}}>{sub}</div>
          <div style={{display: 'flex', gap: 16, marginTop: 36}}>
            <div style={{position: 'relative', padding: '18px 34px', borderRadius: 16, background: `linear-gradient(135deg,#f0d3a0,${gold} 50%,#9a6a35)`, color: '#1a120b', fontSize: 24, fontWeight: 700, transform: `scale(${1 - press * 0.05})`, boxShadow: '0 12px 30px rgba(216,180,122,0.25)'}}>
              {primary}
              <div style={{position: 'absolute', left: '50%', top: '50%', width: 260, height: 260, marginLeft: -130, marginTop: -130, borderRadius: 130, border: `2px solid ${gold}`, opacity: (1 - ripple) * (ripple > 0 ? 1 : 0), transform: `scale(${0.2 + ripple})`}} />
            </div>
            {secondary && <div style={{padding: '18px 34px', borderRadius: 16, border: '1px solid rgba(255,236,210,0.16)', fontSize: 24, color: dim}}>{secondary}</div>}
          </div>
        </div>
        <svg width="46" height="46" viewBox="0 0 24 24" style={{position: 'absolute', left: cx, top: cy, transform: `scale(${1 - press * 0.15})`, filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.5))'}}>
          <path d="M4 2l16 9.5-7 1.6 4.2 7.4-2.8 1.5-4.2-7.4L4 19.5z" fill="#fff" stroke="#111" strokeWidth="1" />
        </svg>
      </AbsoluteFill>
    </Stage>
  );
};
