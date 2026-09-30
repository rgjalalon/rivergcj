import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {copy, scenes, src} from './timeline';
import {easeInOut, Mark, pw, ramp, Reveal, Source} from './util';

/**
 * The typing footage with a slow push. The original yellow caption is baked
 * into the clip, so a larger blue bar sits exactly over it and the question
 * is re-typed in bigger type, in time with the original key sounds.
 */
export const Question: React.FC = () => {
  const frame = useCurrentFrame();
  const {from, to} = scenes.footage;
  const zoom = interpolate(frame, [from, to], [1.04, 1.1]);

  const typeFrom = src(1.83);
  const typeTo = src(3.41);
  const chars = Math.round(
    interpolate(frame, [typeFrom, typeTo], [0, copy.question.length], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
  );
  const caretOn = chars < copy.question.length || Math.floor(frame / 8) % 2 === 0;
  // Brief white dip into the type cards.
  const out = ramp(frame, to - 5, 5, easeInOut);

  return (
    <AbsoluteFill style={{background: '#000', overflow: 'hidden'}}>
      <AbsoluteFill style={{transform: `scale(${zoom})`, filter: 'grayscale(1) contrast(1.1) brightness(1.02)'}}>
        <Source from={from} to={to} />
      </AbsoluteFill>
      {/* Covers the baked caption (source x 492–1383, y 510–583, before zoom). */}
      <div style={{position: 'absolute', left: 0, right: 0, top: 490, height: 110, display: 'flex', justifyContent: 'center'}}>
        <div
          style={{
            background: pw.blue,
            borderRadius: 10,
            padding: '0 36px',
            height: 110,
            lineHeight: '110px',
            fontFamily: pw.sans,
            fontWeight: 600,
            fontSize: 54,
            letterSpacing: -1,
            color: pw.white,
            whiteSpace: 'pre',
            boxShadow: '0 24px 60px rgba(8,20,60,0.35)',
          }}
        >
          {copy.question.slice(0, chars)}
          <span style={{position: 'relative'}}>
            <span
              style={{position: 'absolute', left: 3, top: 30, width: 3, height: 52, background: pw.white, opacity: caretOn ? 1 : 0}}
            />
          </span>
          <span style={{opacity: 0}}>{copy.question.slice(chars)}</span>
        </div>
      </div>
      <AbsoluteFill style={{background: pw.white, opacity: out}} />
    </AbsoluteFill>
  );
};

/** "Not replace the clinician." (struck through) → "But support them." */
export const Cards: React.FC = () => {
  const frame = useCurrentFrame();
  const {from, to} = scenes.cards;
  const strike = ramp(frame, src(5.0), 12, easeInOut);
  const second = src(5.5);
  const lift = ramp(frame, second - 4, 20, easeInOut);
  const out = ramp(frame, to - 10, 10, easeInOut);
  const drift = interpolate(frame, [from, to], [1.03, 1]);
  const text: React.CSSProperties = {fontFamily: pw.sans, fontWeight: 600, fontSize: 92, letterSpacing: -3, color: pw.ink};

  return (
    <AbsoluteFill style={{background: pw.white}}>
      <AbsoluteFill
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          opacity: 1 - out,
          transform: `scale(${drift})`,
          filter: `blur(${out * 8}px)`,
        }}
      >
        <div
          style={{
            ...text,
            position: 'absolute',
            transform: `translateY(${-lift * 86}px) scale(${1 - lift * 0.4})`,
            color: `rgba(14,17,22,${1 - lift * 0.55})`,
          }}
        >
          <Reveal frame={frame} at={from + 2}>
            {'Not '}
          </Reveal>
          <span style={{position: 'relative', display: 'inline-block'}}>
            <Reveal frame={frame} at={from + 5}>
              <span style={{opacity: 1 - strike * 0.55}}>replace</span>
            </Reveal>
            <span
              style={{
                position: 'absolute',
                left: -4,
                top: '55%',
                height: 6,
                borderRadius: 3,
                width: `calc(${strike * 100}% + ${strike * 8}px)`,
                background: pw.blue,
              }}
            />
          </span>
          <Reveal frame={frame} at={from + 8}>
            {' the clinician.'}
          </Reveal>
        </div>
        <div style={{...text, position: 'absolute', transform: 'translateY(52px)', fontSize: 128, letterSpacing: -4.5, fontWeight: 700}}>
          {frame >= second - 2 && (
            <>
              <Reveal frame={frame} at={second}>
                {'But '}
              </Reveal>
              <Reveal frame={frame} at={second + 4}>
                <Mark frame={frame} at={second + 14}>
                  support
                </Mark>
              </Reveal>
              <Reveal frame={frame} at={second + 8}>
                {' them.'}
              </Reveal>
            </>
          )}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
