import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {colors} from '../theme';
import {Footage} from './Footage';
import {collagePhotos} from './timeline';

/** Flat caramel board; photos cut on one at a time and stack up. */
export const Collage: React.FC<{from: number; to: number}> = ({to}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: colors.caramel}}>
      {collagePhotos
        .filter((p) => frame >= p.at)
        .map((p) => (
          <div
            key={p.id}
            style={{
              position: 'absolute',
              left: p.x,
              top: p.y,
              width: p.w,
              height: p.h,
              overflow: 'hidden',
              boxShadow: '0 18px 40px rgba(62,47,35,0.22)',
            }}
          >
            <Footage id={p.id} from={p.at} to={to} push={0.04} compact />
          </div>
        ))}
    </AbsoluteFill>
  );
};
