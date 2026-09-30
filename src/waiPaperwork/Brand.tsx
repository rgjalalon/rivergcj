import {AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {copy, PW_DURATION, scenes, src} from './timeline';
import {easeInOut, Mark, pw, ramp, Reveal, Rise} from './util';

const LOGO = staticFile('wai/wai-logo-cream.png');
const LOGO_RATIO = 552 / 2000;

/** The logo in ink (the cream file, darkened), resolving from a soft blur. */
const Logo: React.FC<{width: number; reveal: number}> = ({width, reveal}) => {
  const edge = reveal * 140 - 20; // soft left-to-right wipe
  return (
    <Img
      src={LOGO}
      style={{
        width,
        height: width * LOGO_RATIO,
        display: 'block',
        filter: `brightness(0) blur(${(1 - reveal) * 14}px)`,
        opacity: Math.min(1, reveal * 1.4),
        WebkitMaskImage: `linear-gradient(90deg, #000 ${edge}%, transparent ${edge + 20}%)`,
      }}
    />
  );
};

/** The music swell: logo alone on white. */
export const LogoReveal: React.FC = () => {
  const frame = useCurrentFrame();
  const {from, to} = scenes.logo;
  const reveal = ramp(frame, src(7.1), 36, easeInOut);
  const zoom = interpolate(frame, [from, to], [1.08, 1.0], {easing: easeInOut});
  return (
    <AbsoluteFill style={{background: pw.white, alignItems: 'center', justifyContent: 'center'}}>
      <div style={{transform: `scale(${zoom})`}}>
        <Logo width={540} reveal={reveal} />
      </div>
    </AbsoluteFill>
  );
};

// Lockup geometry: the logo slides left and shrinks to sit beside the line.
const LOCK_LOGO = 240;
const TEXT_W = 900;
const GAP = 34;

/** "wai drafts while you carry on." — held long enough to read twice. */
export const Lockup: React.FC = () => {
  const frame = useCurrentFrame();
  const {from, to} = scenes.lockup;
  const move = ramp(frame, from, 24, easeInOut);
  const logoW = interpolate(move, [0, 1], [540, LOCK_LOGO]);
  const totalW = LOCK_LOGO + GAP + TEXT_W;
  const logoX = interpolate(move, [0, 1], [0, -totalW / 2 + LOCK_LOGO / 2]);
  const drift = interpolate(frame, [from, to], [1, 1.035]);
  const out = ramp(frame, src(12.45), 13, easeInOut);
  const words = copy.lockup;
  const starts = [src(9.7), src(9.9), src(10.1), src(10.35), src(10.6)];

  return (
    <AbsoluteFill style={{background: pw.white}}>
      <AbsoluteFill
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          transform: `scale(${drift + out * 0.03})`,
          opacity: 1 - out,
          filter: `blur(${out * 8}px)`,
        }}
      >
        <div style={{position: 'absolute', transform: `translateX(${logoX}px)`}}>
          <Logo width={logoW} reveal={1} />
        </div>
        <div
          style={{
            position: 'absolute',
            left: 960 - totalW / 2 + LOCK_LOGO + GAP,
            width: TEXT_W,
            top: 540 - 52,
            fontFamily: pw.sans,
            fontWeight: 500,
            fontSize: 76,
            lineHeight: '96px',
            letterSpacing: -2.5,
            color: pw.ink,
            whiteSpace: 'nowrap',
          }}
        >
          {words.slice(0, 3).map((w, i) => (
            <Reveal key={w} frame={frame} at={starts[i]}>
              {w + ' '}
            </Reveal>
          ))}
          <Reveal frame={frame} at={starts[3]}>
            <Mark frame={frame} at={starts[4] + 8} dur={14}>
              {words.slice(3).join(' ')}
            </Mark>
          </Reveal>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/** Logo and end line on white, over the last of the paper storm. */
export const EndCard: React.FC = () => {
  const frame = useCurrentFrame();
  const {from} = scenes.end;
  const bg = ramp(frame, from - 8, 16, easeInOut);
  const reveal = ramp(frame, from + 6, 32, easeInOut);
  const zoom = interpolate(frame, [from, PW_DURATION], [1.05, 1.0]);
  return (
    <AbsoluteFill style={{background: `rgba(255,255,255,${bg})`}}>
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', transform: `scale(${zoom})`}}>
        <Logo width={480} reveal={reveal} />
        <div style={{marginTop: 60, fontFamily: pw.sans, fontWeight: 500, fontSize: 42, letterSpacing: -1, color: pw.ink}}>
          <Rise frame={frame} at={from + 30}>
            {'Less paperwork. '}
          </Rise>
          <Rise frame={frame} at={from + 38}>
            <Mark frame={frame} at={from + 48}>
              More medicine.
            </Mark>
          </Rise>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
