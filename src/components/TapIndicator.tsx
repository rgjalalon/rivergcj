import {interpolate, useCurrentFrame} from 'remotion';
import {colors} from '../theme';
import {mix, progress} from '../timeline';

export type Tap = {frame: number; x: number; y: number};

const APPROACH = 16;
const LINGER = 3;

/**
 * A soft touch point that glides to each target, presses, and fades away —
 * reads as a finger on glass without being literal.
 */
export const TapIndicator: React.FC<{taps: Tap[]}> = ({taps}) => {
  const frame = useCurrentFrame();
  const tap = taps.find((tp) => frame >= tp.frame - APPROACH && frame <= tp.frame + LINGER + 8);
  if (!tap) return null;

  const start = tap.frame - APPROACH;
  const move = progress(frame, start, APPROACH - 2);
  // Glide in from slightly below-right, like a thumb.
  const x = mix(tap.x + 46, tap.x, move);
  const y = mix(tap.y + 64, tap.y, move);

  const fadeIn = progress(frame, start, 8);
  const fadeOut = 1 - progress(frame, tap.frame + LINGER, 6);
  const opacity = fadeIn * fadeOut;

  const press = 1 - 0.14 * (progress(frame, tap.frame - 1, 3) - progress(frame, tap.frame + 2, 6));
  const ripple = progress(frame, tap.frame, 14);
  const rippleOpacity = frame >= tap.frame ? interpolate(ripple, [0, 1], [0.35, 0]) : 0;

  return (
    <div style={{position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 60}}>
      <div
        style={{
          position: 'absolute',
          left: x - 40,
          top: y - 40,
          width: 80,
          height: 80,
          borderRadius: 40,
          border: `2px solid ${colors.caramel}`,
          transform: `scale(${0.5 + ripple * 0.9})`,
          opacity: rippleOpacity,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: x - 22,
          top: y - 22,
          width: 44,
          height: 44,
          borderRadius: 22,
          background: 'rgba(62,47,35,0.22)',
          border: '1.5px solid rgba(255,255,255,0.65)',
          boxShadow: '0 6px 18px rgba(62,47,35,0.18)',
          transform: `scale(${press})`,
          opacity,
        }}
      />
    </div>
  );
};
