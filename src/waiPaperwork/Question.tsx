import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {copy, scenes, src} from './timeline';
import {easeInOut, Mark, pw, ramp, Rise, Source} from './util';

/**
 * The typing footage with a slow push. The original yellow caption is baked
 * into the clip, so a larger highlighter bar sits exactly over it and the
 * question is re-typed in bigger type, in time with the original key sounds.
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

  return (
    <AbsoluteFill style={{background: '#000', overflow: 'hidden'}}>
      <AbsoluteFill style={{transform: `scale(${zoom})`, filter: 'contrast(1.08)'}}>
        <Source from={from} to={to} />
      </AbsoluteFill>
      {/* Covers the baked caption (source x 492–1383, y 510–583, before zoom). */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 490,
          height: 110,
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            background: pw.marker,
            padding: '0 34px',
            height: 110,
            lineHeight: '110px',
            fontFamily: pw.sans,
            fontWeight: 600,
            fontSize: 56,
            letterSpacing: -1,
            color: pw.ink,
            whiteSpace: 'pre',
            boxShadow: '0 20px 50px rgba(0,0,0,0.25)',
          }}
        >
          {copy.question.slice(0, chars)}
          <span style={{position: 'relative'}}>
            <span
              style={{
                position: 'absolute',
                left: 2,
                top: 28,
                width: 4,
                height: 56,
                background: pw.ink,
                opacity: caretOn ? 1 : 0,
              }}
            />
          </span>
          <span style={{opacity: 0}}>{copy.question.slice(chars)}</span>
        </div>
      </div>
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
  const out = ramp(frame, to - 6, 6, easeInOut);
  const text: React.CSSProperties = {fontFamily: pw.sans, fontWeight: 700, fontSize: 96, letterSpacing: -3, color: pw.ink};

  return (
    <AbsoluteFill style={{background: pw.white, alignItems: 'center', justifyContent: 'center'}}>
      <div style={{opacity: 1 - out, position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <div
          style={{
            ...text,
            position: 'absolute',
            transform: `translateY(${-lift * 80}px) scale(${1 - lift * 0.3})`,
            opacity: 1 - lift * 0.7,
          }}
        >
          <Rise frame={frame} at={from}>
            {'Not '}
          </Rise>
          <span style={{position: 'relative', display: 'inline-block'}}>
            <Rise frame={frame} at={from + 3}>
              <span style={{opacity: 1 - strike * 0.6}}>replace</span>
            </Rise>
            <span
              style={{
                position: 'absolute',
                left: -6,
                top: '54%',
                height: 8,
                width: `calc(${strike * 100}% + ${strike * 12}px)`,
                background: pw.ink,
              }}
            />
          </span>
          <Rise frame={frame} at={from + 6}>
            {' the clinician.'}
          </Rise>
        </div>
        <div style={{...text, position: 'absolute', transform: 'translateY(56px)', fontSize: 128, letterSpacing: -4}}>
          {frame >= second - 2 && (
            <>
              <Rise frame={frame} at={second}>
                {'But '}
              </Rise>
              <Rise frame={frame} at={second + 4}>
                <Mark frame={frame} at={second + 8}>
                  support
                </Mark>
              </Rise>
              <Rise frame={frame} at={second + 8}>
                {' them.'}
              </Rise>
            </>
          )}
        </div>
      </div>
    </AbsoluteFill>
  );
};
