import {AbsoluteFill, interpolate, random, useCurrentFrame} from 'remotion';
import {copy, HOOK} from './timeline';
import {easeInOut, pw, ramp, Rise} from './util';

// Cold open, frames 0–135:
//   0   "FOR EVERY / 1 hour with a patient,"
//   34  digit rolls 1 → 2, "DOCTORS SPEND NEARLY / 2 hours on paperwork."  (hit at 42)
//   76  paper starts falling and buries the frame
//   104 "It's driving doctors out."
const ROLL = 34;
const HIT = 42;
const PAPER = 76;
const OUT = 104;
const DIGIT = 540;

const Digit: React.FC<{frame: number}> = ({frame}) => {
  const p = ramp(frame, ROLL, HIT - ROLL, easeInOut);
  const velocity = Math.sin(p * Math.PI);
  return (
    <div style={{height: DIGIT, overflow: 'hidden', lineHeight: `${DIGIT}px`}}>
      <div
        style={{
          transform: `translateY(${-p * DIGIT}px)`,
          filter: `blur(${velocity * 14}px)`,
          fontFamily: pw.serif,
          fontWeight: 500,
          fontSize: DIGIT,
          color: pw.cream,
          letterSpacing: -20,
        }}
      >
        <div style={{height: DIGIT}}>1</div>
        <div style={{height: DIGIT, color: pw.caramel}}>2</div>
      </div>
    </div>
  );
};

const Label: React.FC<{frame: number; text: string; from: number; to?: number}> = ({frame, text, from, to}) => {
  const out = to === undefined ? 0 : ramp(frame, to, 6, easeInOut);
  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        opacity: ramp(frame, from, 10) * (1 - out),
        transform: `translateY(${(1 - ramp(frame, from, 14)) * 12 - out * 12}px)`,
        fontFamily: pw.sans,
        fontWeight: 500,
        fontSize: 26,
        letterSpacing: '0.32em',
        textTransform: 'uppercase',
        color: pw.caramel,
      }}
    >
      {text}
    </div>
  );
};

const Line: React.FC<{frame: number; from: number; to?: number; children: React.ReactNode}> = ({
  frame,
  from,
  to,
  children,
}) => {
  const out = to === undefined ? 0 : ramp(frame, to, 8, easeInOut);
  return (
    <div
      style={{
        position: 'absolute',
        top: 52,
        left: 0,
        whiteSpace: 'nowrap',
        opacity: 1 - out,
        transform: `translateY(${-out * 40}px)`,
        filter: `blur(${out * 8}px)`,
      }}
    >
      {children}
    </div>
  );
};

/** One sheet of paper, drawn like the documents in the product capture. */
const Sheet: React.FC<{seed: number}> = ({seed}) => {
  const lines = 7 + Math.floor(random(`l${seed}`) * 5);
  return (
    <div
      style={{
        width: 300,
        height: 390,
        background: '#FDFBF7',
        borderRadius: 4,
        padding: '34px 30px',
        boxShadow: '0 2px 4px rgba(23,17,13,0.18), 0 24px 48px rgba(23,17,13,0.35)',
        display: 'flex',
        flexDirection: 'column',
        gap: 13,
      }}
    >
      <div style={{width: 110, height: 9, borderRadius: 5, background: '#2B221B'}} />
      <div style={{height: 10}} />
      {Array.from({length: lines}).map((_, i) => (
        <div
          key={i}
          style={{
            height: 7,
            borderRadius: 4,
            background: '#E3DACD',
            width: `${62 + random(`w${seed}-${i}`) * 36}%`,
          }}
        />
      ))}
    </div>
  );
};

const SHEETS = 64;

const Papers: React.FC<{frame: number}> = ({frame}) => {
  return (
    <>
      {Array.from({length: SHEETS}).map((_, i) => {
        // Land on a jittered grid so the pile covers the frame by the end.
        const col = i % 8;
        const row = Math.floor(i / 8);
        const tx = -80 + col * 285 + (random(`x${i}`) - 0.5) * 160;
        const ty = -120 + row * 175 + (random(`y${i}`) - 0.5) * 140;
        const order = random(`o${i}`);
        const start = PAPER + Math.pow(order, 0.8) * 30;
        const fall = 11 + random(`d${i}`) * 5;
        const p = ramp(frame, start, fall, easeInOut);
        if (frame < start) return null;
        const r0 = (random(`r0${i}`) - 0.5) * 70;
        const r1 = (random(`r1${i}`) - 0.5) * 24;
        const drift = (random(`dx${i}`) - 0.5) * 260;
        const scale = interpolate(p, [0, 1], [1.5, 1]);
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: tx + (1 - p) * drift,
              top: ty - (1 - p) * 700,
              zIndex: Math.round(order * 100),
              transform: `rotate(${r0 + (r1 - r0) * p}deg) scale(${scale})`,
              filter: `blur(${(1 - p) * 6}px)`,
            }}
          >
            <Sheet seed={i} />
          </div>
        );
      })}
    </>
  );
};

export const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const push = interpolate(frame, [0, HOOK], [1, 1.07]);
  const slam1 = 1 + 0.07 * (1 - ramp(frame, 6, 12));
  const slam2 = 1 + 0.09 * (1 - ramp(frame, HIT, 12));
  const flash = frame < HIT ? 0 : interpolate(frame, [HIT, HIT + 5], [0.16, 0], {extrapolateRight: 'clamp'});
  const shake = frame >= HIT && frame < HIT + 8 ? (random(`s${frame}`) - 0.5) * 10 * (1 - (frame - HIT) / 8) : 0;
  const bury = ramp(frame, PAPER + 10, 30, easeInOut);
  const outIn = ramp(frame, OUT, 14);

  return (
    <AbsoluteFill style={{background: pw.ink, overflow: 'hidden'}}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 60% 55% at 42% 50%, rgba(200,155,109,${0.16 + 0.08 * ramp(frame, HIT, 20)}) 0%, rgba(23,17,13,0) 70%)`,
        }}
      />
      <AbsoluteFill
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          transform: `scale(${push * slam1 * slam2}) translate(${shake}px, ${shake * 0.6}px)`,
          opacity: 1 - bury * 0.6,
          filter: `blur(${bury * 6}px)`,
        }}
      >
        <div style={{display: 'flex', alignItems: 'center', gap: 56, marginLeft: -40}}>
          <div style={{opacity: ramp(frame, 6, 8)}}>
            <Digit frame={frame} />
          </div>
          <div style={{position: 'relative', width: 880, height: 200, marginTop: 40}}>
            <Label frame={frame} text={copy.hookLabel1} from={0} to={ROLL} />
            <Label frame={frame} text={copy.hookLabel2} from={HIT - 4} />
            <Line frame={frame} from={6} to={ROLL}>
              <Rise
                frame={frame}
                at={6}
                style={{fontFamily: pw.serif, fontSize: 104, color: pw.cream, letterSpacing: -1}}
              >
                {copy.hookLine1}
              </Rise>
            </Line>
            <Line frame={frame} from={HIT}>
              <Rise frame={frame} at={HIT - 2} style={{fontFamily: pw.serif, fontSize: 104, color: pw.cream, letterSpacing: -1}}>
                {'hours on '}
              </Rise>
              <Rise
                frame={frame}
                at={HIT + 4}
                style={{fontFamily: pw.serif, fontStyle: 'italic', fontSize: 104, color: pw.caramel, letterSpacing: -1}}
              >
                paperwork.
              </Rise>
            </Line>
          </div>
        </div>
      </AbsoluteFill>
      <div
        style={{
          position: 'absolute',
          bottom: 64,
          width: '100%',
          textAlign: 'center',
          fontFamily: pw.sans,
          fontSize: 18,
          letterSpacing: '0.08em',
          color: 'rgba(245,240,232,0.5)',
          opacity: ramp(frame, HIT + 12, 12) * (1 - bury),
        }}
      >
        {copy.citation}
      </div>
      <AbsoluteFill style={{background: '#FFF', opacity: flash}} />
      <Papers frame={frame} />
      <AbsoluteFill
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 200,
          opacity: outIn,
          background: `radial-gradient(ellipse 58% 34% at 50% 50%, rgba(247,242,234,${0.96 * outIn}) 30%, rgba(247,242,234,0) 100%)`,
        }}
      >
        <div
          style={{
            fontFamily: pw.serif,
            fontSize: 118,
            color: pw.ink,
            letterSpacing: -1.5,
            transform: `scale(${1.04 - 0.04 * outIn})`,
          }}
        >
          <Rise frame={frame} at={OUT}>
            {'It’s driving '}
          </Rise>
          <Rise frame={frame} at={OUT + 5} style={{fontStyle: 'italic', color: pw.caramelDeep}}>
            doctors out.
          </Rise>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
