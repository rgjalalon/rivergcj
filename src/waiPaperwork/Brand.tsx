import {AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {copy, PW_DURATION, scenes, src} from './timeline';
import {easeInOut, pw, ramp, Rise} from './util';

const LOGO = staticFile('wai/wai-logo-cream.png');
const LOGO_RATIO = 552 / 2000;

const darkBg = (glow: number) =>
  `radial-gradient(ellipse 55% 50% at 50% 50%, rgba(200,155,109,${0.2 * glow}) 0%, rgba(62,47,35,${0.5 * glow}) 38%, ${pw.ink} 78%)`;

/** Cream logo that resolves from a soft blur and catches a light sweep. */
const Logo: React.FC<{frame: number; width: number; reveal: number; glintAt?: number}> = ({
  frame,
  width,
  reveal,
  glintAt,
}) => {
  const glint = glintAt === undefined ? -1 : interpolate(frame, [glintAt, glintAt + 22], [-0.4, 1.4], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: easeInOut});
  const edge = reveal * 140 - 20; // soft left-to-right wipe
  return (
    <div style={{position: 'relative', width, height: width * LOGO_RATIO}}>
      <Img
        src={LOGO}
        style={{
          width,
          display: 'block',
          filter: `blur(${(1 - reveal) * 18}px)`,
          opacity: Math.min(1, reveal * 1.4),
          WebkitMaskImage: `linear-gradient(90deg, #000 ${edge}%, transparent ${edge + 20}%)`,
        }}
      />
      {glint > -0.4 && glint < 1.4 && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            WebkitMaskImage: `url(${LOGO})`,
            WebkitMaskSize: '100% 100%',
            background: `linear-gradient(105deg, transparent ${(glint - 0.18) * 100}%, rgba(255,236,205,0.95) ${glint * 100}%, transparent ${(glint + 0.18) * 100}%)`,
          }}
        />
      )}
    </div>
  );
};

/** The music swell: logo alone on espresso. */
export const LogoReveal: React.FC = () => {
  const frame = useCurrentFrame();
  const {from, to} = scenes.logo;
  const glow = ramp(frame, from, 60);
  const reveal = ramp(frame, src(6.9), 34, easeInOut);
  const zoom = interpolate(frame, [from, to], [1.08, 1.0], {easing: easeInOut});
  return (
    <AbsoluteFill style={{background: darkBg(glow), alignItems: 'center', justifyContent: 'center'}}>
      <div style={{transform: `scale(${zoom})`}}>
        <Logo frame={frame} width={560} reveal={reveal} glintAt={src(8.2)} />
      </div>
    </AbsoluteFill>
  );
};

// Lockup geometry: the logo slides left and shrinks to sit beside the line.
const LOCK_LOGO = 250;
const TEXT_W = 900;
const GAP = 34;

/** "wai drafts while you carry on." then a cream wipe into the product. */
export const Lockup: React.FC = () => {
  const frame = useCurrentFrame();
  const {from, to} = scenes.lockup;
  const move = ramp(frame, from, 20, easeInOut);
  const logoW = interpolate(move, [0, 1], [560, LOCK_LOGO]);
  const totalW = LOCK_LOGO + GAP + TEXT_W;
  // Logo centre: screen centre → its slot at the left of the lockup.
  const logoX = interpolate(move, [0, 1], [0, -totalW / 2 + LOCK_LOGO / 2]);
  const wipe = ramp(frame, src(12.0), 20, easeInOut);
  const drift = interpolate(frame, [from, to], [0, -24]);
  const words = copy.lockup;
  const starts = [src(10.0), src(10.25), src(10.45), src(10.7), src(10.95)];

  return (
    <AbsoluteFill style={{background: darkBg(1)}}>
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', transform: `translateX(${drift}px)`}}>
        <div style={{position: 'absolute', transform: `translateX(${logoX}px)`}}>
          <Logo frame={frame} width={logoW} reveal={1} />
        </div>
        <div
          style={{
            position: 'absolute',
            left: 960 - totalW / 2 + LOCK_LOGO + GAP,
            width: TEXT_W,
            top: 540 - 58,
            fontFamily: pw.sans,
            fontWeight: 400,
            fontSize: 84,
            lineHeight: '100px',
            letterSpacing: -2,
            color: pw.cream,
            whiteSpace: 'nowrap',
          }}
        >
          {words.map((w, i) => (
            <Rise
              key={w}
              frame={frame}
              at={starts[i]}
              style={
                i >= 3
                  ? {fontFamily: pw.serif, fontStyle: 'italic', color: pw.caramel, letterSpacing: -1, fontSize: 90}
                  : undefined
              }
            >
              {w + (i < words.length - 1 ? ' ' : '')}
            </Rise>
          ))}
        </div>
      </AbsoluteFill>
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          height: `${wipe * 100}%`,
          background: pw.paper,
          boxShadow: '0 -30px 80px rgba(0,0,0,0.35)',
        }}
      />
    </AbsoluteFill>
  );
};

/** Espresso iris over the last papers, logo and end line, fade to black. */
export const EndCard: React.FC = () => {
  const frame = useCurrentFrame();
  const {from} = scenes.end;
  const iris = ramp(frame, from - 8, 20, easeInOut);
  const reveal = ramp(frame, from + 10, 30, easeInOut);
  const zoom = interpolate(frame, [from, PW_DURATION], [1.04, 1.0]);
  const black = ramp(frame, PW_DURATION - 22, 22, easeInOut);
  return (
    <AbsoluteFill style={{clipPath: `circle(${iris * 120}% at 50% 50%)`, background: darkBg(1)}}>
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', transform: `scale(${zoom})`}}>
        <Logo frame={frame} width={500} reveal={reveal} glintAt={from + 44} />
        <div
          style={{
            marginTop: 70,
            fontFamily: pw.serif,
            fontSize: 44,
            color: 'rgba(245,240,232,0.86)',
            letterSpacing: 0,
          }}
        >
          <Rise frame={frame} at={from + 34}>
            {'Less paperwork. '}
          </Rise>
          <Rise frame={frame} at={from + 42} style={{fontStyle: 'italic', color: pw.caramel}}>
            More medicine.
          </Rise>
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{background: '#000', opacity: black}} />
    </AbsoluteFill>
  );
};
