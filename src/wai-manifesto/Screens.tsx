import {AbsoluteFill, Img, interpolate, random, staticFile, useCurrentFrame} from 'remotion';
import {colors, fonts} from '../theme';
import {Screen} from './timeline';
import {AiVoice, AskWai, ButtonClick, PhoneProfile, Schedule, ScribeNote, ScribeTerminal} from './Premium';

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
      return <ButtonClick span={span} title="Blood panel · Thu 16 Oct" sub="8:30 AM with Dr. Patel. Fasting from 10pm." primary="Confirm booking" />;
    case 'signNote':
      return <ButtonClick span={span} title="Note is ready for signature" sub="Review the note below before signing." primary="Sign note" secondary="Edit" />;
  }
};

export {WaiMark};

export const Thumb: React.FC<{name: string}> = ({name}) => (
  <Img src={staticFile(`wai/manifesto/thumbs/${name}.jpg`)} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
);
