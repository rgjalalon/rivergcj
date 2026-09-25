import {ThreeCanvas} from '@remotion/three';
import {AbsoluteFill, Easing, staticFile, useCurrentFrame} from 'remotion';
import * as THREE from 'three';
import '../loadFonts';
import {Grain} from '../components/Grain';
import {Field} from './Field';
import {BEAT, H, VIGNETTES, W, cameraAt, cellX, cellZ, clamp01, ease, pop} from './timeline';
import {KineticType, SANS, Tag} from './Type';

const LOGO = staticFile('wai/wai-logo-white.png');

/** Dark scrim so type always reads over the field. */
const Scrim: React.FC<{amount: number; at?: string}> = ({amount, at = '50% 50%'}) => (
  <AbsoluteFill
    style={{
      background: `radial-gradient(ellipse 70% 60% at ${at}, rgba(5,4,4,${0.72 * amount}) 0%, rgba(5,4,4,${0.35 * amount}) 60%, rgba(5,4,4,0) 100%)`,
    }}
  />
);

const projector = new THREE.PerspectiveCamera(38, W / H, 0.1, 500);
const project = (frame: number, x: number, y: number, z: number) => {
  const {pos, target} = cameraAt(frame);
  projector.position.set(...pos);
  projector.lookAt(...target);
  projector.updateMatrixWorld();
  const v = new THREE.Vector3(x, y, z).project(projector);
  return {x: (v.x * 0.5 + 0.5) * W, y: (-v.y * 0.5 + 0.5) * H};
};

const VignetteLabels: React.FC = () => {
  const frame = useCurrentFrame();
  if (frame < BEAT.pops || frame > BEAT.signals + 12) return null;
  return (
    <>
      {VIGNETTES.map((v) => {
        const {x, y} = project(frame, cellX(v.i), 6.4, cellZ(v.j));
        return (
          <Tag key={v.kind} at={v.at + 10} out={BEAT.signals - 4} style={{left: x, top: y, translate: '-50% -100%', fontSize: 22}}>
            {v.label}
          </Tag>
        );
      })}
    </>
  );
};

const formatCount = (n: number) => n.toLocaleString('en-US');

const Copy: React.FC = () => {
  const frame = useCurrentFrame();
  const count = Math.round(8759 * ease(frame, BEAT.signals + 16, 26, Easing.out(Easing.cubic)));

  const scrim =
    ease(frame, BEAT.hour + 30, 20) * (1 - ease(frame, BEAT.sweep - 6, 16)) * 0.9 +
    ease(frame, BEAT.sweep + 12, 16) * (1 - ease(frame, BEAT.pops - 4, 10)) +
    ease(frame, BEAT.signals, 14) * (1 - ease(frame, BEAT.wave - 6, 12)) +
    ease(frame, BEAT.tagline + 6, 16) * (1 - ease(frame, BEAT.logo - 16, 10));

  return (
    <>
      <Scrim amount={scrim} />

      {/* Beat 1 caption */}
      <Tag at={62} out={BEAT.hour - 6} style={{left: '50%', bottom: 120, translate: '-50% 0'}}>
        1 year&nbsp;&nbsp;=&nbsp;&nbsp;8,760 hours&nbsp;&nbsp;·&nbsp;&nbsp;one cube each
      </Tag>

      {/* Beat 2 */}
      <KineticType
        align="left"
        style={{left: 130, bottom: 210}}
        out={BEAT.sweep - 12}
        lines={[
          {at: BEAT.hour + 34, size: 70, words: 'The average person spends'.split(' ').map((t) => ({t}))},
          {
            at: BEAT.hour + 46,
            size: 70,
            words: [{t: 'about'}, {t: 'an', warm: true}, {t: 'hour', warm: true}, {t: 'a'}, {t: 'year'}],
          },
          {at: BEAT.hour + 58, size: 70, words: 'with a doctor.'.split(' ').map((t) => ({t}))},
        ]}
      />
      <Tag at={BEAT.hour + 82} out={BEAT.sweep - 12} style={{left: 130, bottom: 120}}>
        CDC: ~3 visits a year, minutes each.
      </Tag>

      {/* Beat 3 */}
      <KineticType
        out={BEAT.pops - 10}
        style={{left: 0, right: 0, top: 380}}
        lines={[
          {at: BEAT.sweep + 22, size: 92, words: "Your health doesn't happen".split(' ').map((t) => ({t}))},
          {at: BEAT.sweep + 36, size: 92, words: [{t: 'in'}, {t: 'that', warm: true}, {t: 'hour.', warm: true}]},
        ]}
      />

      <VignetteLabels />

      {/* Beat 5 */}
      <KineticType
        out={BEAT.wave - 8}
        style={{left: 0, right: 0, top: 330}}
        lines={[
          {
            at: BEAT.signals + 8,
            size: 96,
            words: [{t: 'It'}, {t: 'happens'}, {t: 'in'}, {t: 'the'}, {t: 'other'}, {t: formatCount(Math.max(1, count)), warm: true}],
          },
          {
            at: BEAT.signals + 46,
            size: 70,
            words: [{t: "That's"}, {t: 'where'}, {t: 'the'}, {t: 'signals', warm: true}, {t: 'live.'}],
          },
        ]}
        gap={26}
      />

      {/* Beat 7a */}
      <KineticType
        out={BEAT.logo - 18}
        style={{left: 0, right: 0, top: 300}}
        gap={30}
        lines={[
          {at: BEAT.tagline + 10, size: 190, words: [{t: 'Wai.'}]},
          {
            at: BEAT.tagline + 32,
            size: 74,
            words: [{t: 'Care'}, {t: 'for'}, {t: 'the'}, {t: 'other'}, {t: '8,759', warm: true}, {t: 'hours.'}],
          },
        ]}
      />
    </>
  );
};

/** Warm light burst used to punch into the end card. */
const Flash: React.FC = () => {
  const frame = useCurrentFrame();
  const a = ease(frame, BEAT.logo - 12, 12, Easing.in(Easing.quad)) * (1 - ease(frame, BEAT.logo, 16));
  if (a <= 0) return null;
  const r = 20 + 120 * ease(frame, BEAT.logo - 12, 18);
  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(circle at 50% 55%, rgba(255,236,210,${a}) 0%, rgba(255,160,80,${a * 0.9}) ${r * 0.4}%, rgba(40,20,10,${a * 0.6}) ${r}%)`,
      }}
    />
  );
};

const LogoCard: React.FC = () => {
  const frame = useCurrentFrame();
  if (frame < BEAT.logo) return null;
  const f = frame - BEAT.logo;
  const rise = pop(frame, BEAT.logo + 6, 0.7);
  const tilt = (1 - rise) * 55;
  const lw = 860;
  const lh = (lw * 552) / 2000;
  const depth = 18;
  const sheen = -40 + 180 * ease(frame, BEAT.logo + 34, 34);
  const tag = clamp01((frame - BEAT.logo - 58) / 14);
  const mask: React.CSSProperties = {
    WebkitMaskImage: `url(${LOGO})`,
    WebkitMaskSize: '100% 100%',
    maskImage: `url(${LOGO})`,
    maskSize: '100% 100%',
    position: 'absolute',
    inset: 0,
  };
  const logo = (
    <div style={{position: 'relative', width: lw, height: lh}}>
      {Array.from({length: depth}, (_, k) => {
        const d = depth - k;
        const shade = 40 + (k / depth) * 70;
        return (
          <div
            key={k}
            style={{...mask, transform: `translateY(${d * 1.1}px)`, background: `rgb(${shade + 40},${shade + 18},${shade})`}}
          />
        );
      })}
      <div
        style={{
          ...mask,
          background: `linear-gradient(105deg, rgba(255,255,255,0) ${sheen - 14}%, rgba(255,255,255,0.95) ${sheen}%, rgba(255,255,255,0) ${sheen + 14}%), linear-gradient(180deg, #ffffff 0%, #f6efe6 40%, #b9ab9b 55%, #efe3d3 72%, #fff8ee 100%)`,
        }}
      />
    </div>
  );
  return (
    <AbsoluteFill
      style={{
        background: 'radial-gradient(ellipse 60% 55% at 50% 42%, #3a2618 0%, #1a110b 45%, #070504 100%)',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Soft bokeh cubes drifting in the background */}
      {Array.from({length: 14}, (_, k) => {
        const x = ((k * 197) % 1920) + Math.sin((f + k * 30) / 40) * 20;
        const y = ((k * 311) % 1000) - f * (0.3 + (k % 4) * 0.12);
        const s = 30 + (k % 5) * 22;
        return (
          <div
            key={k}
            style={{
              position: 'absolute',
              left: x,
              top: y + 80,
              width: s,
              height: s,
              borderRadius: s * 0.22,
              transform: `rotate(${k * 23 + f * 0.3}deg)`,
              background: 'linear-gradient(135deg, rgba(255,190,120,0.22), rgba(255,120,50,0.05))',
              filter: `blur(${6 + (k % 3) * 5}px)`,
              opacity: clamp01(f / 20),
            }}
          />
        );
      })}
      {/* Warm key glow behind the logo */}
      <div
        style={{
          position: 'absolute',
          width: 1300,
          height: 700,
          top: 120,
          background: 'radial-gradient(ellipse at 50% 50%, rgba(255,150,70,0.35), rgba(255,120,50,0) 65%)',
          opacity: ease(frame, BEAT.logo + 10, 30),
        }}
      />
      {/* Glossy floor */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 640,
          bottom: 0,
          background: 'linear-gradient(180deg, rgba(255,170,100,0.10), rgba(0,0,0,0) 40%)',
          borderTop: '1px solid rgba(255,210,170,0.10)',
        }}
      />
      <div style={{position: 'absolute', top: 640 - lh - 40, perspective: 1600}}>
        <div
          style={{
            transformOrigin: '50% 100%',
            transform: `translateY(${(1 - rise) * 260}px) rotateX(${tilt}deg) scale(${0.85 + 0.15 * rise + f * 0.0006})`,
            opacity: clamp01(f / 8),
            filter: `drop-shadow(0 30px 40px rgba(0,0,0,0.6))`,
          }}
        >
          {logo}
        </div>
        {/* Reflection */}
        <div
          style={{
            transformOrigin: '50% 50%',
            transform: `translateY(${(1 - rise) * 260 + 6}px) scaleY(-1) scale(${0.85 + 0.15 * rise + f * 0.0006})`,
            opacity: clamp01(f / 8) * 0.22,
            WebkitMaskImage: 'linear-gradient(0deg, rgba(0,0,0,0.9), rgba(0,0,0,0) 55%)',
            filter: 'blur(3px)',
          }}
        >
          {logo}
        </div>
      </div>
      <div
        style={{
          position: 'absolute',
          top: 760,
          fontFamily: SANS,
          fontWeight: 500,
          fontSize: 34,
          letterSpacing: 0.5,
          color: 'rgba(250,236,220,0.82)',
          opacity: tag,
          transform: `translateY(${(1 - tag) * 14}px)`,
        }}
      >
        Care for the other <span style={{color: '#ffbf7a'}}>8,759</span> hours.
      </div>
    </AbsoluteFill>
  );
};

export const OtherFilm: React.FC = () => {
  const frame = useCurrentFrame();
  const fadeIn = ease(frame, 0, 24);
  const fadeOut = ease(frame, 960, 30);
  return (
    <AbsoluteFill style={{background: '#050404'}}>
      {frame < BEAT.logo + 2 && (
        <ThreeCanvas width={W} height={H} camera={{fov: 38, near: 0.1, far: 400}} gl={{antialias: true}}>
          <Field />
        </ThreeCanvas>
      )}
      <Copy />
      <LogoCard />
      <Flash />
      <AbsoluteFill
        style={{
          pointerEvents: 'none',
          background: 'radial-gradient(ellipse 85% 80% at 50% 50%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.55) 100%)',
        }}
      />
      <Grain opacity={0.07} />
      <AbsoluteFill style={{background: '#000', opacity: 1 - fadeIn + fadeOut}} />
    </AbsoluteFill>
  );
};
