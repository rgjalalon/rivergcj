import {Easing, interpolate, OffthreadVideo, Sequence, staticFile} from 'remotion';
import {src} from './timeline';

export const pw = {
  white: '#FFFFFF',
  ink: '#111111',
  muted: '#8C8C8C',
  /** The highlighter yellow from the original captions and headlines. */
  marker: '#F9E85A',
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

/**
 * The source edit, picked up at the matching source time. Everything after
 * the intro is locked to the source timeline, so a scene starting at film
 * frame `from` starts the source at the same point.
 */
export const Source: React.FC<{from: number; to: number; style?: React.CSSProperties}> = ({from, to, style}) => (
  <Sequence from={from} durationInFrames={to - from} layout="none">
    <OffthreadVideo
      src={staticFile('wai-paperwork/source.mp4')}
      startFrom={from - src(0)}
      muted
      style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, ...style}}
    />
  </Sequence>
);

/** A word or phrase that rises in from a soft blur. */
export const Rise: React.FC<{
  frame: number;
  at: number;
  dur?: number;
  dist?: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({frame, at, dur = 14, dist = 26, children, style}) => {
  const p = ramp(frame, at, dur);
  return (
    <span
      style={{
        display: 'inline-block',
        opacity: p,
        transform: `translateY(${(1 - p) * dist}px)`,
        filter: `blur(${(1 - p) * 8}px)`,
        whiteSpace: 'pre',
        ...style,
      }}
    >
      {children}
    </span>
  );
};

/** Highlighter stroke that wipes in left to right behind its text. */
export const Mark: React.FC<{frame: number; at: number; dur?: number; children: React.ReactNode}> = ({
  frame,
  at,
  dur = 10,
  children,
}) => {
  const p = ramp(frame, at, dur, easeInOut);
  return (
    <span style={{position: 'relative', display: 'inline-block', whiteSpace: 'pre'}}>
      <span
        style={{
          position: 'absolute',
          left: '-0.12em',
          right: '-0.12em',
          top: '0.08em',
          bottom: '0.02em',
          background: pw.marker,
          transformOrigin: '0 50%',
          transform: `scaleX(${p})`,
          zIndex: 0,
        }}
      />
      <span style={{position: 'relative', zIndex: 1}}>{children}</span>
    </span>
  );
};
