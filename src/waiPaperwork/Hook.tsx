import {AbsoluteFill, Img, interpolate, random, staticFile, useCurrentFrame} from 'remotion';
import {copy, HEADLINES, headlineGaps, HOOK, TITLE_AT} from './timeline';
import {easeInOut, easeOut, Mark, pw, ramp, Reveal} from './util';

// Intro, frames 0–96: the original headline shots slam onto a growing pile,
// faster and faster; then the pile steps back and the title lands.
const starts = headlineGaps.reduce<number[]>((acc, gap) => [...acc, acc[acc.length - 1] + gap], [-3]);
const CARD = 0.6; // card size relative to the frame
const LAND = 6;

const Card: React.FC<{i: number; frame: number}> = ({i, frame}) => {
  const at = starts[i];
  if (frame < at) return null;
  const p = ramp(frame, at, LAND, easeOut);
  // Alternate sides so the pile spreads across the frame.
  const side = i % 2 === 0 ? -1 : 1;
  const x = side * (60 + random(`x${i}`) * 200);
  const y = (random(`y${i}`) - 0.5) * 240;
  const rot = side * (1 + random(`r${i}`) * 3.5);
  const w = 1920 * CARD;
  const h = 1080 * CARD;
  return (
    <div
      style={{
        position: 'absolute',
        left: 960 - w / 2,
        top: 540 - h / 2,
        width: w,
        height: h,
        borderRadius: 14,
        overflow: 'hidden',
        opacity: ramp(frame, at, 3),
        transform: `translate(${x}px, ${y}px) rotate(${rot}deg) scale(${interpolate(p, [0, 1], [1.45, 1])})`,
        filter: `blur(${(1 - p) * 8}px)`,
        boxShadow: `0 2px 6px rgba(0,0,0,0.06), 0 ${10 + p * 24}px ${30 + p * 40}px rgba(0,0,0,${0.08 + p * 0.06})`,
        border: '1px solid rgba(0,0,0,0.06)',
        background: pw.white,
      }}
    >
      <Img
        src={staticFile(`wai-paperwork/headlines/h${String(i + 1).padStart(2, '0')}.jpg`)}
        style={{width: w, height: h, display: 'block'}}
      />
    </div>
  );
};

export const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const back = ramp(frame, TITLE_AT, 14, easeInOut);
  const pull = interpolate(frame, [0, TITLE_AT], [1.16, 0.98], {extrapolateRight: 'clamp'});
  // A small knock each time a card lands.
  const last = [...starts].reverse().find((s) => frame >= s + LAND - 1) ?? -99;
  const since = frame - (last + LAND - 1);
  const knock = since >= 0 && since < 4 && frame < TITLE_AT ? (1 - since / 4) * 5 : 0;
  const shake = knock * (random(`k${last}`) - 0.5) * 2;

  const push = interpolate(frame, [TITLE_AT, HOOK], [1.04, 1], {extrapolateLeft: 'clamp', easing: easeOut});
  const text: React.CSSProperties = {
    fontFamily: pw.sans,
    fontWeight: 700,
    fontSize: 140,
    lineHeight: '158px',
    letterSpacing: -5,
    color: pw.ink,
  };

  return (
    <AbsoluteFill style={{background: pw.white, overflow: 'hidden'}}>
      <AbsoluteFill
        style={{
          transform: `scale(${pull * (1 - back * 0.12)}) translate(${shake}px, ${shake * 0.5}px)`,
          filter: `blur(${back * 14}px)`,
          opacity: 1 - back * 0.8,
        }}
      >
        {Array.from({length: HEADLINES}).map((_, i) => (
          <Card key={i} i={i} frame={frame} />
        ))}
      </AbsoluteFill>
      {frame >= TITLE_AT - 1 && (
        <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
          <div style={{...text, transform: `scale(${push})`, textAlign: 'left'}}>
            <div>
              <Reveal frame={frame} at={TITLE_AT}>
                <Mark frame={frame} at={TITLE_AT + 10} dur={12}>
                  {copy.title[0]}
                </Mark>
              </Reveal>
            </div>
            <div>
              <Reveal frame={frame} at={TITLE_AT + 4}>
                {copy.title[1]}
              </Reveal>
            </div>
            <div>
              <Reveal frame={frame} at={TITLE_AT + 8}>
                {copy.title[2]}
              </Reveal>
            </div>
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
