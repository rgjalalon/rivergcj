import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {copy, scenes, src} from './timeline';
import {easeInOut, pw, ramp, Rise, Source} from './util';

const BAR = 138; // 2.39:1 letterbox

/**
 * The typing footage, graded and letterboxed. The original caption is baked
 * into the clip, so a frosted band (a blurred, desaturated copy of the same
 * shot) covers it and the question is re-set in large type on top.
 */
export const Question: React.FC = () => {
  const frame = useCurrentFrame();
  const {from, to} = scenes.footage;
  const zoom = interpolate(frame, [from, to], [1.06, 1.16]);
  const move: React.CSSProperties = {transform: `scale(${zoom})`, transformOrigin: '50% 50%'};

  // Typed across the same span as the typing sounds in the source audio.
  const typeFrom = src(1.83);
  const typeTo = src(3.41);
  const chars = Math.round(
    interpolate(frame, [typeFrom, typeTo], [0, copy.question.length], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
  );
  const typed = copy.question.slice(0, chars);
  const caretOn = chars < copy.question.length || Math.floor(frame / 8) % 2 === 0;
  const splitAt = copy.question.indexOf('carry');
  const before = typed.slice(0, splitAt);
  const accent = typed.slice(splitAt, splitAt + 'carry'.length);
  const after = typed.slice(splitAt + 'carry'.length);

  const inP = ramp(frame, from, 10);
  return (
    <AbsoluteFill style={{background: '#000', overflow: 'hidden'}}>
      <AbsoluteFill style={{...move, filter: 'grayscale(1) contrast(1.18) brightness(0.86)'}}>
        <Source from={from} to={to} />
      </AbsoluteFill>
      {/* Warm split-tone over the monochrome plate. */}
      <AbsoluteFill style={{background: 'rgba(200,155,109,0.22)', mixBlendMode: 'soft-light'}} />
      <AbsoluteFill
        style={{
          ...move,
          filter: 'grayscale(1) blur(26px) brightness(0.42)',
          WebkitMaskImage:
            'linear-gradient(to bottom, transparent 400px, #000 468px, #000 626px, transparent 694px)',
        }}
      >
        <Source from={from} to={to} />
      </AbsoluteFill>
      <AbsoluteFill
        style={{
          background:
            'linear-gradient(to bottom, rgba(23,17,13,0) 400px, rgba(23,17,13,0.35) 480px, rgba(23,17,13,0.35) 610px, rgba(23,17,13,0) 690px)',
        }}
      />
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', opacity: inP}}>
        <div style={{fontFamily: pw.serif, fontSize: 76, color: pw.cream, letterSpacing: -0.5, whiteSpace: 'pre'}}>
          {before}
          <span style={{fontStyle: 'italic', color: pw.caramel}}>{accent}</span>
          {after}
          <span style={{opacity: caretOn ? 0.9 : 0, color: pw.caramel, fontFamily: pw.sans, fontWeight: 400}}>|</span>
        </div>
      </AbsoluteFill>
      <div style={{position: 'absolute', top: 0, left: 0, right: 0, height: BAR, background: '#000'}} />
      <div style={{position: 'absolute', bottom: 0, left: 0, right: 0, height: BAR, background: '#000'}} />
    </AbsoluteFill>
  );
};

/** "Not replace the clinician." (struck through) → "But support them." */
export const Cards: React.FC = () => {
  const frame = useCurrentFrame();
  const {from, to} = scenes.cards;
  const strike = ramp(frame, src(5.0), 9, easeInOut);
  const second = src(5.5);
  const lift = ramp(frame, second - 2, 16, easeInOut);
  const out = ramp(frame, to - 8, 8, easeInOut);
  const text: React.CSSProperties = {fontFamily: pw.serif, fontSize: 96, letterSpacing: -1, color: pw.cream};

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse 70% 60% at 50% 50%, #2A1F17 0%, ${pw.ink} 70%)`,
        alignItems: 'center',
        justifyContent: 'center',
        opacity: 1 - out,
      }}
    >
      <div
        style={{
          ...text,
          position: 'absolute',
          transform: `translateY(${-lift * 70}px) scale(${1 - lift * 0.18})`,
          opacity: 1 - lift * 0.62,
        }}
      >
        <Rise frame={frame} at={from}>
          {'Not '}
        </Rise>
        <span style={{position: 'relative', display: 'inline-block'}}>
          <Rise frame={frame} at={from + 3}>
            <span style={{opacity: 1 - strike * 0.55}}>replace</span>
          </Rise>
          <span
            style={{
              position: 'absolute',
              left: -6,
              top: '56%',
              height: 6,
              borderRadius: 3,
              width: `calc(${strike * 100}% + ${strike * 12}px)`,
              background: pw.caramel,
            }}
          />
        </span>
        <Rise frame={frame} at={from + 6}>
          {' the clinician.'}
        </Rise>
      </div>
      <div style={{...text, position: 'absolute', transform: 'translateY(62px)', fontSize: 120}}>
        {frame >= second - 2 && (
          <>
            <Rise frame={frame} at={second}>
              {'But '}
            </Rise>
            <Rise frame={frame} at={second + 4} style={{fontStyle: 'italic', color: pw.caramel}}>
              support
            </Rise>
            <Rise frame={frame} at={second + 8}>
              {' them.'}
            </Rise>
          </>
        )}
      </div>
    </AbsoluteFill>
  );
};
