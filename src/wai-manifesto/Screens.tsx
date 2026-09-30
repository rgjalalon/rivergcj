import {AbsoluteFill, Img, interpolate, random, staticFile, useCurrentFrame} from 'remotion';
import {colors, fonts} from '../theme';
import {M_FPS, Screen} from './timeline';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const mono = '"DejaVu Sans Mono", "Liberation Mono", monospace';

/** Reveal `text` a character at a time between frames a and b. */
const typed = (text: string, frame: number, a: number, b: number) =>
  text.slice(0, Math.round(interpolate(frame, [a, b], [0, text.length], clamp)));

/** A slow handheld drift, like a camera pointed at a screen. */
const useDrift = (span: number, amount = 1) => {
  const frame = useCurrentFrame();
  return {
    s: interpolate(frame, [0, span], [1.04, 1.04 + 0.05 * amount], clamp),
    x: interpolate(frame, [0, span], [0, -18 * amount], clamp),
    y: interpolate(frame, [0, span], [0, -8 * amount], clamp),
  };
};

// ─── Archival-era screens ────────────────────────────────────────────────────

const RetroEmr: React.FC<{span: number}> = ({span}) => {
  const frame = useCurrentFrame();
  const d = useDrift(span);
  const lines = [
    'GENERAL HOSPITAL  —  PATIENT RECORD SYSTEM   v1.2      1986',
    '──────────────────────────────────────────────────────────',
    'PATIENT : HARRIS, MARGARET          DOB : 04/11/1931',
    'MRN     : 0048213                   WARD: 4B',
    '──────────────────────────────────────────────────────────',
    '03/02   BP 150/92    HR 84    WT 71 KG',
    '03/09   BP 146/90    RX: HCTZ 25MG',
    '03/16   LABS PENDING . . .',
  ];
  const shown = Math.min(lines.length, 3 + Math.floor(frame / 4));
  const flick = 0.92 + random(`emr-${frame}`) * 0.08;
  return (
    <AbsoluteFill style={{background: '#030604', overflow: 'hidden'}}>
      <AbsoluteFill style={{transform: `perspective(1600px) rotateY(-7deg) rotateX(3deg) scale(${d.s}) translate(${d.x}px, ${d.y}px)`}}>
        <div
          style={{
            position: 'absolute',
            inset: '8% 6%',
            borderRadius: 60,
            background: 'radial-gradient(ellipse at 50% 45%, #0b2215 0%, #04100a 70%, #010402 100%)',
            boxShadow: 'inset 0 0 120px rgba(0,0,0,0.9)',
            padding: '70px 80px',
            fontFamily: mono,
            fontSize: 30,
            lineHeight: 1.55,
            color: '#6dff9e',
            textShadow: '0 0 8px rgba(80,255,140,0.75), 0 0 22px rgba(80,255,140,0.35)',
            opacity: flick,
            filter: 'blur(0.6px)',
            whiteSpace: 'pre',
          }}
        >
          {lines.slice(0, shown).join('\n')}
          {'\n> '}
          <span style={{opacity: Math.floor(frame / 8) % 2 ? 1 : 0}}>█</span>
        </div>
        <AbsoluteFill
          style={{
            background: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.35) 0px, rgba(0,0,0,0.35) 2px, rgba(0,0,0,0) 3px, rgba(0,0,0,0) 5px)',
          }}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const EarlyPortal: React.FC<{span: number}> = ({span}) => {
  const d = useDrift(span, 1.3);
  const rows = [
    ['Hemoglobin A1c', '6.1 %', '4.0 – 5.6', 'HIGH'],
    ['Vitamin D, 25-OH', '18 ng/mL', '30 – 100', 'LOW'],
    ['TSH', '2.4 mIU/L', '0.4 – 4.0', ''],
    ['Ferritin', '42 ng/mL', '15 – 150', ''],
    ['Cholesterol, Total', '214 mg/dL', '< 200', 'HIGH'],
  ];
  const ui = 'Tahoma, Verdana, "DejaVu Sans", sans-serif';
  return (
    <AbsoluteFill style={{background: '#111', overflow: 'hidden'}}>
      <AbsoluteFill
        style={{
          transform: `perspective(1800px) rotateY(8deg) scale(${d.s * 1.08}) translate(${d.x}px, ${d.y}px)`,
          filter: 'blur(0.8px) saturate(0.85) contrast(1.05)',
        }}
      >
        <div style={{position: 'absolute', inset: '4% 3%', background: '#ece9d8', fontFamily: ui, color: '#000'}}>
          <div style={{height: 38, background: 'linear-gradient(180deg,#0a5fd8,#0a3fa0)', color: '#fff', fontSize: 20, fontWeight: 700, padding: '6px 12px'}}>
            MyHealth Online — Patient Portal — Microsoft Internet Explorer
          </div>
          <div style={{background: '#fff', position: 'absolute', inset: '38px 0 0 0', padding: 24}}>
            <div style={{background: 'linear-gradient(90deg,#2d6aa6,#6fa7d8)', color: '#fff', padding: '14px 20px', fontSize: 34, fontWeight: 700}}>
              MyHealth Online
              <span style={{fontSize: 18, fontWeight: 400, marginLeft: 18}}>Welcome, Margaret Harris | Log out</span>
            </div>
            <div style={{display: 'flex', gap: 24, marginTop: 18}}>
              <div style={{width: 220, fontSize: 20, lineHeight: 2, color: '#0033cc', textDecoration: 'underline'}}>
                <div>My Appointments</div>
                <div style={{fontWeight: 700}}>Lab Results</div>
                <div>Medications</div>
                <div>Messages (3)</div>
                <div>Billing</div>
              </div>
              <div style={{flex: 1}}>
                <div style={{fontSize: 26, fontWeight: 700, marginBottom: 10}}>Lab Results — 03/16/2004</div>
                <table style={{borderCollapse: 'collapse', width: '100%', fontSize: 20}}>
                  <tbody>
                    <tr style={{background: '#c9d9ee'}}>
                      {['Test', 'Result', 'Reference', 'Flag'].map((h) => (
                        <td key={h} style={{border: '1px solid #8aa', padding: '6px 10px', fontWeight: 700}}>
                          {h}
                        </td>
                      ))}
                    </tr>
                    {rows.map((r) => (
                      <tr key={r[0]}>
                        {r.map((c, i) => (
                          <td key={i} style={{border: '1px solid #aab', padding: '6px 10px', color: i === 3 ? '#c00' : '#000', fontWeight: i === 3 ? 700 : 400}}>
                            {c}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div style={{marginTop: 14, fontSize: 18, color: '#555'}}>Please contact your physician's office to discuss these results.</div>
              </div>
            </div>
          </div>
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{background: 'repeating-linear-gradient(90deg, rgba(0,0,0,0.05) 0 2px, rgba(0,0,0,0) 2px 4px)'}} />
    </AbsoluteFill>
  );
};

// ─── Wai, today ──────────────────────────────────────────────────────────────

const WaiMark: React.FC<{h: number; tint?: string}> = ({h, tint = colors.espresso}) => (
  <div
    style={{
      height: h,
      width: (h * 2000) / 552,
      background: tint,
      maskImage: `url(${staticFile('wai/wai-logo-cream.png')})`,
      WebkitMaskImage: `url(${staticFile('wai/wai-logo-cream.png')})`,
      maskSize: 'contain',
      WebkitMaskSize: 'contain',
      maskRepeat: 'no-repeat',
      WebkitMaskRepeat: 'no-repeat',
    }}
  />
);

const PhoneProfile: React.FC<{span: number}> = ({span}) => {
  const frame = useCurrentFrame();
  const tilt = interpolate(frame, [0, span], [-9, -6], clamp);
  return (
    <AbsoluteFill style={{background: 'radial-gradient(ellipse at 45% 60%, #6b3a17 0%, #2a160a 55%, #0c0604 100%)', overflow: 'hidden'}}>
      <div
        style={{
          position: 'absolute',
          left: 520,
          top: 90,
          width: 440,
          height: 900,
          borderRadius: 64,
          background: '#141010',
          padding: 16,
          transform: `rotate(${tilt}deg) scale(${1.05 + frame * 0.004})`,
          boxShadow: '0 40px 90px rgba(0,0,0,0.7)',
        }}
      >
        <div style={{width: '100%', height: '100%', borderRadius: 50, background: colors.paper, padding: '60px 36px', boxSizing: 'border-box', fontFamily: fonts.sans}}>
          <WaiMark h={26} />
          <div style={{fontSize: 22, color: colors.muted, marginTop: 34}}>Good morning, Maria</div>
          <div style={{background: '#3f6b55', color: '#f2efe6', borderRadius: 26, marginTop: 22, padding: '30px 28px', textAlign: 'center'}}>
            <div style={{fontFamily: fonts.serif, fontSize: 96, lineHeight: 1}}>41/42</div>
            <div style={{fontSize: 20, marginTop: 8, opacity: 0.85}}>markers in range</div>
          </div>
          <div style={{fontFamily: fonts.serif, fontSize: 34, lineHeight: 1.3, color: colors.espresso, marginTop: 30}}>
            Vitamin D is back in range. Keep the morning walks.
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

const ScribeTerminal: React.FC<{span: number}> = ({span}) => {
  const frame = useCurrentFrame();
  const lines = [
    ['#8a7a69', 'wai scribe — listening            ● REC 00:04:12'],
    ['#e9dcc6', '[patient]    about three weeks now. I’m exhausted by lunch.'],
    ['#e9dcc6', '[clinician]  any change in your sleep?'],
    ['#e9dcc6', '[patient]    I’m up two or three times a night.'],
    ['#c89b6d', '› structuring note…'],
    ['#c89b6d', '› HPI: 3/52 fatigue, nocturia ×2–3'],
    ['#c89b6d', '› suggest: HbA1c, TSH, ferritin, vit D'],
  ];
  const per = span / (lines.length + 1);
  return (
    <AbsoluteFill style={{background: '#0d0c0b', padding: '120px 110px', fontFamily: mono, fontSize: 30, lineHeight: 1.7}}>
      {lines.map(([c, t], i) => (
        <div key={i} style={{color: c, whiteSpace: 'pre'}}>
          {typed(t, frame, i * per * 0.8, i * per * 0.8 + per)}
        </div>
      ))}
    </AbsoluteFill>
  );
};

const aiWords = "Hi. I've read your whole record... and I think I know what's going on.".split(' ');

const AiVoice: React.FC<{span: number}> = () => {
  const frame = useCurrentFrame();
  // ai01 starts 1.4s into this screen and runs ~4s.
  const t = (frame - 1.4 * M_FPS) / (4.0 * M_FPS);
  const current = Math.floor(t * aiWords.length);
  return (
    <AbsoluteFill style={{background: 'radial-gradient(ellipse 70% 80% at 85% 95%, #d9731f 0%, #5a2a0c 38%, #120905 75%)'}}>
      <div style={{position: 'absolute', left: 470, top: 360, width: 560, fontFamily: fonts.sans, color: '#efe6da'}}>
        <div style={{fontSize: 18, letterSpacing: 2, color: '#b8a691', marginBottom: 18}}>WAI</div>
        <div style={{fontSize: 30, lineHeight: 1.5}}>
          {aiWords.map((w, i) => (
            <span
              key={i}
              style={{
                background: i === current ? 'rgba(239,230,218,0.9)' : 'transparent',
                color: i === current ? '#1a0f08' : i < current ? '#efe6da' : 'rgba(239,230,218,0.45)',
                borderRadius: 4,
                padding: '0 3px',
              }}
            >
              {w}{' '}
            </span>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};

const AskWai: React.FC<{span: number}> = ({span}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: '#faf7f2', alignItems: 'center', justifyContent: 'center', fontFamily: fonts.sans}}>
      <div style={{transform: `scale(${1.12 + frame * 0.004})`, textAlign: 'center'}}>
        <div style={{fontFamily: fonts.serif, fontSize: 64, color: colors.espresso}}>What’s on your mind today?</div>
        <div
          style={{
            marginTop: 44,
            width: 780,
            height: 92,
            borderRadius: 46,
            background: '#fff',
            boxShadow: '0 10px 40px rgba(62,47,35,0.12)',
            display: 'flex',
            alignItems: 'center',
            padding: '0 18px 0 40px',
            boxSizing: 'border-box',
            fontSize: 30,
            color: colors.espresso,
          }}
        >
          <span style={{flex: 1, textAlign: 'left'}}>{typed('Why am I so tired lately?', frame, 0, span * 0.7) || ' '}</span>
          <div style={{width: 60, height: 60, borderRadius: 30, background: colors.espresso, color: colors.cream, fontSize: 30, lineHeight: '60px'}}>↑</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

const ScribeNote: React.FC<{span: number}> = ({span}) => {
  const frame = useCurrentFrame();
  const d = useDrift(span, 1.4);
  const note = [
    ['Subjective', '3 weeks of fatigue, worse by midday. Nocturia 2–3×/night. No weight change.'],
    ['Objective', 'BP 128/82. HR 72. BMI 26.1. Thyroid not enlarged.'],
    ['Plan', 'HbA1c, TSH, ferritin, vitamin D. Sleep diary. Review in 2 weeks.'],
  ];
  return (
    <AbsoluteFill style={{background: '#efeae2', overflow: 'hidden'}}>
      <AbsoluteFill style={{transform: `scale(${d.s * 1.25}) translate(${d.x - 60}px, ${d.y + 40}px)`, transformOrigin: '30% 30%'}}>
        <div style={{position: 'absolute', inset: '6% 5%', background: '#fff', borderRadius: 18, boxShadow: '0 20px 60px rgba(0,0,0,0.12)', display: 'flex', fontFamily: fonts.sans}}>
          <div style={{width: 260, borderRight: '1px solid #eee4d6', padding: 28, fontSize: 18, color: colors.muted, lineHeight: 2.2}}>
            <WaiMark h={22} />
            <div style={{marginTop: 20, color: colors.espresso, fontWeight: 600}}>Maria Lopez · 10:40</div>
            <div>James Okoro · 11:00</div>
            <div>Priya Shah · 11:20</div>
          </div>
          <div style={{flex: 1, padding: '34px 44px'}}>
            <div style={{display: 'flex', alignItems: 'center', gap: 14}}>
              <div style={{fontFamily: fonts.serif, fontSize: 36, color: colors.espresso}}>Consultation note</div>
              <div style={{fontSize: 15, padding: '5px 12px', borderRadius: 14, background: '#f3e6d6', color: '#8a5e34', fontWeight: 600}}>drafted by wai scribe</div>
            </div>
            {note.map(([h, t], i) => (
              <div key={h} style={{marginTop: 26}}>
                <div style={{fontSize: 17, fontWeight: 700, color: colors.muted, textTransform: 'uppercase', letterSpacing: 1}}>{h}</div>
                <div style={{fontSize: 24, color: colors.espresso, marginTop: 6, minHeight: 30}}>
                  {typed(t, frame, i * span * 0.25, i * span * 0.25 + span * 0.35)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const Schedule: React.FC<{span: number}> = ({span}) => {
  const d = useDrift(span, 1);
  const cols = ['Dr. Patel', 'Dr. Okafor', 'Nurse Kim', 'Physio'];
  const blocks = [
    [0, 0, 2, '#e8d3b8', 'Maria L.'], [0, 3, 1, '#d8e3d4', 'New patient'], [1, 1, 2, '#e8d3b8', 'James O.'],
    [1, 4, 1, '#efe1cf', 'Follow-up'], [2, 0, 1, '#d8e3d4', 'Bloods'], [2, 2, 1, '#d8e3d4', 'Vaccine'],
    [3, 1, 2, '#e4dcef', 'Rehab'], [3, 4, 1, '#efe1cf', 'Priya S.'],
  ] as const;
  return (
    <AbsoluteFill style={{background: '#f7f3ec', fontFamily: fonts.sans, overflow: 'hidden'}}>
      <AbsoluteFill style={{transform: `scale(${d.s * 1.1}) translate(${d.x}px, ${d.y}px)`, padding: '80px 90px'}}>
        <div style={{fontFamily: fonts.serif, fontSize: 40, color: colors.espresso}}>Tuesday, 14 October</div>
        <div style={{display: 'flex', gap: 18, marginTop: 30}}>
          {cols.map((c, ci) => (
            <div key={c} style={{flex: 1}}>
              <div style={{fontSize: 20, color: colors.muted, marginBottom: 12}}>{c}</div>
              <div style={{position: 'relative', height: 700, background: '#fff', borderRadius: 16}}>
                {blocks
                  .filter((b) => b[0] === ci)
                  .map((b, i) => (
                    <div
                      key={i}
                      style={{position: 'absolute', left: 10, right: 10, top: 12 + b[1] * 130, height: b[2] * 130 - 12, background: b[3], borderRadius: 12, padding: 14, fontSize: 20, color: colors.espresso, fontWeight: 600}}
                    >
                      {b[4]}
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const Cursor: React.FC<{x: number; y: number; press: number}> = ({x, y, press}) => (
  <svg width="52" height="52" viewBox="0 0 24 24" style={{position: 'absolute', left: x, top: y, transform: `scale(${1 - press * 0.15})`}}>
    <path d="M4 2l16 9.5-7 1.6 4.2 7.4-2.8 1.5-4.2-7.4L4 19.5z" fill="#111" stroke="#fff" strokeWidth="1.3" />
  </svg>
);

const ButtonClick: React.FC<{span: number; title: string; sub: string; primary: string; secondary?: string}> = ({span, title, sub, primary, secondary}) => {
  const frame = useCurrentFrame();
  const clickAt = span * 0.6;
  const press = interpolate(frame, [clickAt - 2, clickAt, clickAt + 4], [0, 1, 0], clamp);
  const cx = interpolate(frame, [0, clickAt], [780, 610], clamp);
  const cy = interpolate(frame, [0, clickAt], [720, 600], clamp);
  return (
    <AbsoluteFill style={{background: '#f4f1ec', fontFamily: fonts.sans, overflow: 'hidden'}}>
      <AbsoluteFill style={{transform: `scale(${1.5 + frame * 0.004})`, transformOrigin: '45% 55%'}}>
        <div style={{position: 'absolute', left: 360, top: 330, width: 760, background: '#fff', borderRadius: 22, padding: '40px 44px', boxShadow: '0 20px 60px rgba(0,0,0,0.08)'}}>
          <div style={{fontSize: 30, fontWeight: 600, color: '#111'}}>{title}</div>
          <div style={{fontSize: 22, color: '#777', marginTop: 10}}>{sub}</div>
          <div style={{display: 'flex', gap: 16, marginTop: 34}}>
            <div
              style={{
                padding: '16px 30px',
                borderRadius: 14,
                background: colors.espresso,
                color: '#fff',
                fontSize: 24,
                fontWeight: 600,
                transform: `scale(${1 - press * 0.05})`,
              }}
            >
              {primary}
            </div>
            {secondary && <div style={{padding: '16px 30px', borderRadius: 14, border: '1px solid #ddd', fontSize: 24, color: '#333'}}>{secondary}</div>}
          </div>
        </div>
        <Cursor x={cx} y={cy} press={press} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const ScreenShot: React.FC<{screen: Screen; span: number}> = ({screen, span}) => {
  switch (screen) {
    case 'retroEmr':
      return <RetroEmr span={span} />;
    case 'earlyPortal':
      return <EarlyPortal span={span} />;
    case 'phoneProfile':
      return <PhoneProfile span={span} />;
    case 'scribeTerminal':
      return <ScribeTerminal span={span} />;
    case 'aiVoice':
      return <AiVoice span={span} />;
    case 'askWai':
      return <AskWai span={span} />;
    case 'scribeNote':
      return <ScribeNote span={span} />;
    case 'schedule':
      return <Schedule span={span} />;
    case 'confirmBooking':
      return <ButtonClick span={span} title="Blood panel · Thu 16 Oct, 8:30" sub="Fasting from 10pm. We’ll send a reminder." primary="Confirm booking" />;
    case 'signNote':
      return <ButtonClick span={span} title="Note is ready for signature" sub="Review the note below before signing." primary="Sign note" secondary="Edit" />;
  }
};

export {WaiMark};

export const Thumb: React.FC<{name: string}> = ({name}) => (
  <Img src={staticFile(`wai/manifesto/thumbs/${name}.jpg`)} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
);
