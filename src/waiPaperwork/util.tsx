import {Easing, interpolate, OffthreadVideo, Sequence, staticFile} from 'remotion';
import {PW_FPS, retime, src} from './timeline';

export const pw = {
  white: '#FFFFFF',
  ink: '#0E1116',
  muted: '#6B7280',
  /** Highlight blue; highlighted text turns white. */
  blue: '#2F5BFF',
  sans: '"Open Sans", "Helvetica Neue", Arial, sans-serif',
};

export const easeOut = Easing.bezier(0.16, 1, 0.3, 1);
export const easeInOut = Easing.bezier(0.65, 0, 0.35, 1);

/** 0 → 1 between two frames, eased and clamped. */
export const ramp = (frame: number, from: number, dur: number, easing = easeOut) =>
  interpolate(frame, [from, from + dur], [0, 1], {easing, extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

/** Fade-in at `from`, fade-out ending at `to`. */
export const inOut = (frame: number, from: number, to: number, inDur = 10, outDur = 8) =>
  Math.min(ramp(frame, from, inDur), 1 - ramp(frame, to - outDur, outDur, easeInOut));

const VIDEO = staticFile('wai-paperwork/source.mp4');
const fill: React.CSSProperties = {position: 'absolute', left: 0, top: 0, width: 1920, height: 1080};

/**
 * The source edit, picked up at the matching source time. Everything after
 * the intro is locked to the source timeline, so a scene starting at film
 * frame `from` starts the source at the same point.
 */
export const Source: React.FC<{from: number; to: number}> = ({from, to}) => (
  <Sequence from={from} durationInFrames={to - from} layout="none">
    <OffthreadVideo src={VIDEO} startFrom={from - src(0)} muted style={fill} />
  </Sequence>
);

/** The source played through the `retime` map: constant speed between keys. */
export const RetimedSource: React.FC = () => (
  <>
    {retime.slice(0, -1).map(([t0, v0], i) => {
      const [t1, v1] = retime[i + 1];
      const from = src(t0);
      const to = src(t1);
      return (
        <Sequence key={t0} from={from} durationInFrames={to - from} layout="none">
          <OffthreadVideo
            src={VIDEO}
            startFrom={Math.round(v0 * PW_FPS)}
            playbackRate={(v1 - v0) / (t1 - t0)}
            muted
            style={fill}
          />
        </Sequence>
      );
    })}
  </>
);

/**
 * Text revealed from behind a baseline mask: slides up into place, the way
 * title cards are set in a finished film.
 */
export const Reveal: React.FC<{
  frame: number;
  at: number;
  dur?: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({frame, at, dur = 18, children, style}) => {
  const p = ramp(frame, at, dur);
  return (
    <span style={{display: 'inline-block', overflow: 'hidden', verticalAlign: 'top', padding: '0.06em 0.2em 0.14em', margin: '-0.06em -0.2em -0.14em', ...style}}>
      <span
        style={{
          display: 'inline-block',
          whiteSpace: 'pre',
          transform: `translateY(${(1 - p) * 110}%)`,
        }}
      >
        {children}
      </span>
    </span>
  );
};

/** A soft fade-and-lift, for smaller supporting lines. */
export const Rise: React.FC<{
  frame: number;
  at: number;
  dur?: number;
  dist?: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({frame, at, dur = 16, dist = 14, children, style}) => {
  const p = ramp(frame, at, dur);
  return (
    <span
      style={{
        display: 'inline-block',
        opacity: p,
        transform: `translateY(${(1 - p) * dist}px)`,
        whiteSpace: 'pre',
        ...style,
      }}
    >
      {children}
    </span>
  );
};

/** Blue highlight that wipes in left to right; the text turns white under it. */
export const Mark: React.FC<{frame: number; at: number; dur?: number; children: React.ReactNode}> = ({
  frame,
  at,
  dur = 12,
  children,
}) => {
  const p = ramp(frame, at, dur, easeInOut);
  return (
    <span style={{position: 'relative', display: 'inline-block', whiteSpace: 'pre', margin: '0 0.1em'}}>
      <span
        style={{
          position: 'absolute',
          left: '-0.14em',
          right: '-0.14em',
          top: '0.02em',
          bottom: '-0.02em',
          borderRadius: '0.12em',
          background: pw.blue,
          transformOrigin: '0 50%',
          transform: `scaleX(${p})`,
        }}
      />
      {/* Ink text underneath, white text clipped to the highlight's sweep. */}
      <span style={{position: 'relative'}}>{children}</span>
      <span
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          color: pw.white,
          clipPath: `inset(-0.2em ${(1 - p) * 100}% -0.2em -0.2em)`,
        }}
      >
        {children}
      </span>
    </span>
  );
};
