import {AbsoluteFill, Img, interpolate, OffthreadVideo, random, staticFile, useCurrentFrame} from 'remotion';
import {Graded} from './Film';
import {M_FPS} from './timeline';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

/** A glowing gold orb with slow-turning rays. */
const Orb: React.FC<{x: number; y: number; r: number; on: number; chalk?: boolean}> = ({x, y, r, on, chalk}) => {
  const frame = useCurrentFrame();
  const core = chalk ? '#ffffff' : '#fff1c2';
  const mid = chalk ? 'rgba(255,255,255,0.9)' : '#e9b44c';
  const glow = chalk ? 'rgba(255,255,255,0.35)' : 'rgba(233,170,70,0.45)';
  return (
    <div style={{position: 'absolute', left: x - r * 6, top: y - r * 6, width: r * 12, height: r * 12, opacity: on}}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '50%',
          background: `repeating-conic-gradient(from ${frame * 0.6}deg, ${glow} 0deg 2deg, rgba(0,0,0,0) 2deg 9deg)`,
          maskImage: 'radial-gradient(circle, black 18%, transparent 70%)',
          WebkitMaskImage: 'radial-gradient(circle, black 18%, transparent 70%)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: r * 5,
          top: r * 5,
          width: r * 2,
          height: r * 2,
          borderRadius: '50%',
          background: `radial-gradient(circle at 38% 35%, ${core} 0%, ${mid} 45%, rgba(150,95,30,0.9) 100%)`,
          boxShadow: `0 0 ${r * 1.5}px ${r * 0.6}px ${glow}, 0 0 ${r * 5}px ${r * 2}px ${glow}`,
        }}
      />
    </div>
  );
};

/**
 * Max Brödel's 1936 Asclepius, pointing from the old hospital toward the new
 * one — in place of the reference's goddess holding the sun. A gold orb forms
 * at his fingertip.
 */
export const Engraving: React.FC<{span: number; chalk?: boolean}> = ({span, chalk}) => {
  const frame = useCurrentFrame();
  const imgH = 1250;
  const imgW = (imgH * 2470) / 1366;
  const hand = {x: 0.63 * imgW, y: 0.332 * imgH};
  const target = {x: 880, y: 400};
  const scale = chalk ? 1.9 : interpolate(frame, [0, span], [1.5, 1.85], clamp);
  const on = chalk ? 1 : interpolate(frame, [4, 22], [0, 1], clamp);
  return (
    <AbsoluteFill style={{background: chalk ? '#101412' : '#d9c9a3', overflow: 'hidden'}}>
      <div
        style={{
          position: 'absolute',
          left: target.x - hand.x,
          top: target.y - hand.y,
          width: imgW,
          height: imgH,
          transform: `scale(${scale})`,
          transformOrigin: `${hand.x}px ${hand.y}px`,
        }}
      >
        <Img
          src={staticFile('wai/manifesto/stills/asclepius_brodel.jpg')}
          style={{
            width: '100%',
            height: '100%',
            filter: chalk
              ? 'grayscale(1) invert(1) contrast(1.6) brightness(0.9)'
              : 'grayscale(1) sepia(0.75) saturate(1.3) contrast(1.15) brightness(1.02)',
            mixBlendMode: chalk ? 'normal' : 'multiply',
          }}
        />
        <Orb x={hand.x + 22} y={hand.y - 18} r={34} on={on} chalk={chalk} />
      </div>
      {!chalk && (
        <AbsoluteFill style={{background: 'radial-gradient(ellipse 70% 70% at 60% 40%, rgba(255,230,170,0.18), rgba(70,45,15,0.35))'}} />
      )}
    </AbsoluteFill>
  );
};

/** A Roman marble head of Asclepius, gilded and lit — the golden statue. */
export const GoldHead: React.FC<{span: number}> = ({span}) => {
  const frame = useCurrentFrame();
  const scale = interpolate(frame, [0, span], [1.08, 1.22], clamp);
  const sweep = interpolate(frame, [0, span], [-40, 140], clamp);
  return (
    <AbsoluteFill style={{background: '#050403', overflow: 'hidden'}}>
      <AbsoluteFill style={{transform: `scale(${scale}) translateX(-40px)`, transformOrigin: '55% 45%'}}>
        <Img
          src={staticFile('wai/manifesto/stills/asclepius_head.jpg')}
          style={{
            position: 'absolute',
            left: 200,
            top: -160,
            height: 1400,
            filter: 'grayscale(1) sepia(1) saturate(2.6) hue-rotate(-14deg) contrast(1.55) brightness(0.8)',
            maskImage: 'radial-gradient(ellipse 36% 40% at 58% 48%, black 55%, transparent 100%)',
            WebkitMaskImage: 'radial-gradient(ellipse 36% 40% at 58% 48%, black 55%, transparent 100%)',
          }}
        />
      </AbsoluteFill>
      <AbsoluteFill
        style={{
          background: `linear-gradient(105deg, rgba(0,0,0,0) ${sweep - 18}%, rgba(255,226,160,0.32) ${sweep}%, rgba(0,0,0,0) ${sweep + 18}%)`,
          mixBlendMode: 'screen',
        }}
      />
      <AbsoluteFill style={{background: 'radial-gradient(ellipse 60% 60% at 55% 45%, rgba(0,0,0,0) 40%, rgba(0,0,0,0.75) 100%)'}} />
    </AbsoluteFill>
  );
};

/**
 * A nurse's hand reaching for a patient's — Wai's version of the robot hand
 * meeting the human one. Light blooms where they touch, then floods white.
 */
export const HandsSpark: React.FC<{span: number}> = ({span}) => {
  const frame = useCurrentFrame();
  const touch = span - 26;
  const bloom = interpolate(frame, [touch, span - 4], [0, 1], clamp);
  const flash = interpolate(frame, [span - 7, span], [0, 1], clamp);
  const flick = 0.9 + random(`hs-${frame}`) * 0.1;
  return (
    <AbsoluteFill>
      <Graded look="modern" seed="hands" push={0.1} span={span}>
        <AbsoluteFill style={{filter: 'saturate(0.55) brightness(0.8)'}}>
          <OffthreadVideo
            src={staticFile('wai/manifesto/modern/hands_hope.mp4')}
            muted
            trimBefore={Math.round(4.2 * M_FPS)}
            style={{width: '100%', height: '100%', objectFit: 'cover'}}
          />
        </AbsoluteFill>
      </Graded>
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(8,20,30,0.35), rgba(8,20,30,0.1))'}} />
      <div
        style={{
          position: 'absolute',
          left: `${63 - 18 * bloom}%`,
          top: `${60 - 24 * bloom}%`,
          width: `${36 * bloom}%`,
          height: `${48 * bloom}%`,
          borderRadius: '50%',
          opacity: bloom * flick,
          background: 'radial-gradient(circle, rgba(255,248,225,1) 0%, rgba(255,214,140,0.65) 25%, rgba(240,170,80,0.18) 55%, rgba(0,0,0,0) 72%)',
          mixBlendMode: 'screen',
        }}
      />
      <AbsoluteFill style={{background: '#fffaf0', opacity: flash}} />
    </AbsoluteFill>
  );
};
