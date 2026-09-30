import {AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {copy, PW_DURATION, scenes, src} from './timeline';
import {easeInOut, Mark, pw, ramp, Rise} from './util';

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
        filter: `brightness(0) blur(${(1 - reveal) * 16}px)`,
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
  const reveal = ramp(frame, src(6.9), 34, easeInOut);
  const zoom = interpolate(frame, [from, to], [1.1, 1.0], {easing: easeInOut});
  return (
    <AbsoluteFill style={{background: pw.white, alignItems: 'center', justifyContent: 'center'}}>
      <div style={{transform: `scale(${zoom})`}}>
        <Logo width={560} reveal={reveal} />
      </div>
    </AbsoluteFill>
  );
};

// Lockup geometry: the logo slides left and shrinks to sit beside the line.
const LOCK_LOGO = 250;
const TEXT_W = 960;
const GAP = 34;

/** "wai drafts while you carry on." */
export const Lockup: React.FC = () => {
  const frame = useCurrentFrame();
  const {from, to} = scenes.lockup;
  const move = ramp(frame, from, 20, easeInOut);
  const logoW = interpolate(move, [0, 1], [560, LOCK_LOGO]);
  const totalW = LOCK_LOGO + GAP + TEXT_W;
  const logoX = interpolate(move, [0, 1], [0, -totalW / 2 + LOCK_LOGO / 2]);
  const drift = interpolate(frame, [from, to], [0, -24]);
  const out = ramp(frame, src(12.3), 14, easeInOut);
  const words = copy.lockup;
  const starts = [src(10.0), src(10.25), src(10.45), src(10.7), src(10.95)];

  return (
    <AbsoluteFill style={{background: pw.white}}>
      <AbsoluteFill
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          transform: `translateX(${drift}px) scale(${1 + out * 0.06})`,
          opacity: 1 - out,
          filter: `blur(${out * 10}px)`,
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
            top: 540 - 56,
            fontFamily: pw.sans,
            fontWeight: 600,
            fontSize: 80,
            lineHeight: '100px',
            letterSpacing: -2.5,
            color: pw.ink,
            whiteSpace: 'nowrap',
          }}
        >
          {words.slice(0, 3).map((w, i) => (
            <Rise key={w} frame={frame} at={starts[i]}>
              {w + ' '}
            </Rise>
          ))}
          <Rise frame={frame} at={starts[3]}>
            <Mark frame={frame} at={starts[4] + 4}>
              {words.slice(3).join(' ')}
            </Mark>
          </Rise>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/** Logo and end line on white, over the last of the paper storm. */
export const EndCard: React.FC = () => {
  const frame = useCurrentFrame();
  const {from} = scenes.end;
  const bg = ramp(frame, from - 8, 14, easeInOut);
  const reveal = ramp(frame, from + 6, 30, easeInOut);
  const zoom = interpolate(frame, [from, PW_DURATION], [1.05, 1.0]);
  return (
    <AbsoluteFill style={{background: `rgba(255,255,255,${bg})`}}>
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', transform: `scale(${zoom})`}}>
        <Logo width={500} reveal={reveal} />
        <div
          style={{
            marginTop: 64,
            fontFamily: pw.sans,
            fontWeight: 600,
            fontSize: 46,
            letterSpacing: -1,
            color: pw.ink,
          }}
        >
          <Rise frame={frame} at={from + 30}>
            {'Less paperwork. '}
          </Rise>
          <Rise frame={frame} at={from + 38}>
            <Mark frame={frame} at={from + 46}>
              More medicine.
            </Mark>
          </Rise>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
