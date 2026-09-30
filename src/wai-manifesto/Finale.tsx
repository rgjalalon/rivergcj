import {AbsoluteFill, interpolate, random, staticFile, useCurrentFrame} from 'remotion';
import {fonts} from '../theme';
import {Thumb, WaiMark} from './Screens';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const LOGO = staticFile('wai/wai-logo-cream.png');
const LOGO_AR = 2000 / 552;

/** Wai's product lines over their own footage — in place of the portfolio logo cards. */
const products: [string, string][] = [
  ['vitals', 'scribe'],
  ['reception', 'front desk'],
  ['smartwatch_hr', 'health profile'],
  ['lab_zoomout', 'frontier'],
  ['doctor_office', 'clinics'],
];

export const Products: React.FC<{span: number}> = ({span}) => {
  const frame = useCurrentFrame();
  const each = span / products.length;
  const i = Math.min(products.length - 1, Math.floor(frame / each));
  const local = frame - i * each;
  const [thumb, name] = products[i];
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <AbsoluteFill style={{transform: `scale(${1.1 + local * 0.006})`, filter: 'brightness(0.38) saturate(0.7) blur(1px)'}}>
        <Thumb name={thumb} />
      </AbsoluteFill>
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 26}}>
        <WaiMark h={78} tint="#f5f0e8" />
        <div style={{fontFamily: fonts.sans, fontSize: 70, fontWeight: 500, color: '#f5f0e8', letterSpacing: -0.5, marginTop: 6}}>{name}</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const tiles = [
  'a_ct_doctor_scan', 'vitals', 'a_nurse_desk', 'reception', 'a_heart_diagram', 'dna_scans', 'a_polio_chart', 'doctor_office',
  'a_waveform', 'hologram_doctor', 'a_terminal_kid', 'lab_zoomout', 'a_stethoscope', 'screen_brain', 'a_brain_ct', 'team_celebrate',
  'a_xray_lightbox', 'smartwatch_hr', 'a_microscope_woman', 'petri', 'a_lung_ct', 'brain_models', 'a_ward', 'patient_good_news',
  'a_vaccinating', 'heartbeat_monitor', 'a_nurse_bedside', 'capsule_machine', 'a_circulation', 'blood_platelets', 'a_teletype', 'applause',
];

const Grid: React.FC<{cols: number; rows: number; size: number}> = ({cols, rows, size}) => (
  <div style={{display: 'grid', gridTemplateColumns: `repeat(${cols}, ${size}px)`, gap: 6}}>
    {Array.from({length: cols * rows}, (_, k) => {
      const name = tiles[(k * 7 + Math.floor(k / cols)) % tiles.length];
      return (
        <div key={k} style={{width: size, height: size * 0.75, overflow: 'hidden', filter: name.startsWith('a_') ? 'sepia(0.35)' : 'saturate(0.8)'}}>
          <Thumb name={name} />
        </div>
      );
    })}
  </div>
);

/** Every shot in the film tiles the screen, then collapses into the Wai wordmark. */
export const Mosaic: React.FC<{span: number}> = ({span}) => {
  const frame = useCurrentFrame();
  const fill = interpolate(frame, [0, span * 0.45], [0, 1], clamp);
  const zoom = interpolate(frame, [0, span * 0.5], [2.2, 1], clamp);
  const toLogo = interpolate(frame, [span * 0.5, span * 0.9], [0, 1], clamp);
  const maskW = interpolate(toLogo, [0, 1], [5200, 1000]);
  return (
    <AbsoluteFill style={{background: '#000', alignItems: 'center', justifyContent: 'center', overflow: 'hidden'}}>
      <div
        style={{
          transform: `scale(${zoom})`,
          opacity: fill,
          maskImage: toLogo > 0 ? `url(${LOGO})` : undefined,
          WebkitMaskImage: toLogo > 0 ? `url(${LOGO})` : undefined,
          maskSize: `${maskW}px ${maskW / LOGO_AR}px`,
          WebkitMaskSize: `${maskW}px ${maskW / LOGO_AR}px`,
          maskPosition: 'center',
          WebkitMaskPosition: 'center',
          maskRepeat: 'no-repeat',
          WebkitMaskRepeat: 'no-repeat',
        }}
      >
        <Grid cols={11} rows={11} size={150} />
      </div>
      {Array.from({length: 12}, (_, k) => {
        const on = random(`mf-${k}-${Math.floor(frame / 2)}`) > 0.8 && fill < 1;
        return on ? (
          <div
            key={k}
            style={{position: 'absolute', left: `${random(`mx-${k}`) * 100}%`, top: `${random(`my-${k}`) * 100}%`, width: 150, height: 112, background: 'rgba(255,255,255,0.08)'}}
          />
        ) : null;
      })}
    </AbsoluteFill>
  );
};

/** The gold Wai wordmark — in place of the gold A16Z. */
export const GoldLogo: React.FC<{span: number}> = ({span}) => {
  const frame = useCurrentFrame();
  const settle = interpolate(frame, [0, 24], [1.1, 1], clamp);
  const mosaicFade = interpolate(frame, [0, 18], [1, 0], clamp);
  const sweep = interpolate(frame, [20, 70], [-30, 130], clamp);
  const tag = interpolate(frame, [48, 72], [0, 1], clamp);
  const out = interpolate(frame, [span - 20, span], [1, 0], clamp);
  const w = 1000;
  const mask = {
    maskImage: `url(${LOGO})`,
    WebkitMaskImage: `url(${LOGO})`,
    maskSize: '100% 100%',
    WebkitMaskSize: '100% 100%',
  } as const;
  return (
    <AbsoluteFill style={{background: 'radial-gradient(ellipse 60% 50% at 50% 50%, #1a130b 0%, #060504 70%)', alignItems: 'center', justifyContent: 'center', opacity: out}}>
      <div style={{position: 'relative', width: w, height: w / LOGO_AR, transform: `scale(${settle * interpolate(frame, [0, span], [1, 0.9], clamp)})`, filter: 'drop-shadow(0 0 24px rgba(214,160,80,0.35))'}}>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            ...mask,
            background: 'linear-gradient(175deg, #fff1c9 0%, #e7b95f 22%, #9c6a2c 48%, #f3d08b 62%, #7a4f1f 82%, #d9a85a 100%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            ...mask,
            background: `linear-gradient(110deg, rgba(255,255,255,0) ${sweep - 12}%, rgba(255,250,235,0.95) ${sweep}%, rgba(255,255,255,0) ${sweep + 12}%)`,
          }}
        />
        <div style={{position: 'absolute', inset: 0, ...mask, opacity: mosaicFade}}>
          <Grid cols={8} rows={3} size={130} />
        </div>
      </div>
      <div
        style={{
          position: 'absolute',
          top: 540 + w / LOGO_AR / 2 + 30,
          fontFamily: fonts.sans,
          fontSize: 26,
          letterSpacing: 6,
          textTransform: 'uppercase',
          color: '#c9a86e',
          opacity: tag,
        }}
      >
        medical intelligence, made personal
      </div>
    </AbsoluteFill>
  );
};
