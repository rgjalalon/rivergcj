import {interpolate, useCurrentFrame} from 'remotion';
import {copy} from '../copy';
import {colors, fonts} from '../theme';
import {DURATION, progress, t} from '../timeline';

export const EndCard: React.FC = () => {
  const frame = useCurrentFrame();
  const bg = progress(frame, t.endIn, 12);
  if (bg <= 0) return null;

  const mark = progress(frame, t.endIn + 10, 18);
  const word = progress(frame, t.endIn + 16, 18);
  const line = progress(frame, t.endIn + 26, 18);
  const tag = progress(frame, t.endIn + 32, 18);
  // Very slow push-in so the hold never feels static.
  const zoom = interpolate(frame, [t.endIn, DURATION], [1, 1.04], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        opacity: bg,
        background: `radial-gradient(ellipse 60% 55% at 50% 48%, #4C3A2C 0%, ${colors.espresso} 60%, #33261C 100%)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          transform: `scale(${zoom})`,
        }}
      >
        {/* Logo placeholder: monogram + wordmark. Swap for the real logo asset. */}
        <div
          style={{
            width: 104,
            height: 104,
            borderRadius: 52,
            border: `1.5px solid ${colors.caramel}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: fonts.serif,
            fontStyle: 'italic',
            fontSize: 52,
            color: colors.cream,
            opacity: mark,
            transform: `translateY(${(1 - mark) * 12}px)`,
          }}
        >
          W
        </div>
        <div
          style={{
            fontFamily: fonts.serif,
            fontSize: 92,
            letterSpacing: 2,
            color: colors.cream,
            marginTop: 34,
            opacity: word,
            transform: `translateY(${(1 - word) * 14}px)`,
          }}
        >
          {copy.brand}
        </div>
        <div style={{width: 80 * line, height: 1.5, background: colors.caramel, marginTop: 30}} />
        <div
          style={{
            fontFamily: fonts.serif,
            fontStyle: 'italic',
            fontSize: 36,
            color: colors.taupe,
            marginTop: 28,
            opacity: tag,
            transform: `translateY(${(1 - tag) * 10}px)`,
          }}
        >
          {copy.tagline}
        </div>
      </div>
    </div>
  );
};
