import {AbsoluteFill, interpolate, OffthreadVideo, staticFile, useCurrentFrame} from 'remotion';
import {colors} from '../theme';
import {OriginClipId} from './timeline';

/**
 * A documentary-style footage slot: slower, deeper push than the lifestyle
 * brand film, warm highlights but heavier shadow — closer to the reference's
 * dramatic single-source lighting than to the caramel-collage grade.
 */
export const OriginFootage: React.FC<{id: OriginClipId; from: number; to: number; push?: number}> = ({
  id,
  from,
  to,
  push = 0.08,
}) => {
  const frame = useCurrentFrame();
  const scale = interpolate(frame, [from, to], [1, 1 + push], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  return (
    <AbsoluteFill style={{overflow: 'hidden', background: '#000'}}>
      <AbsoluteFill
        style={{
          transform: `scale(${scale})`,
          filter: 'sepia(0.14) saturate(0.92) contrast(1.12) brightness(0.92)',
        }}
      >
        <OffthreadVideo
          src={staticFile(`wai/origin/${id}.mp4`)}
          muted
          style={{width: '100%', height: '100%', objectFit: 'cover'}}
        />
      </AbsoluteFill>
      <AbsoluteFill style={{background: 'linear-gradient(160deg, rgba(200,155,109,0.16) 0%, rgba(200,155,109,0) 50%)', mixBlendMode: 'soft-light'}} />
      <AbsoluteFill style={{background: `linear-gradient(0deg, ${colors.espresso}66 0%, rgba(0,0,0,0) 40%)`, mixBlendMode: 'multiply'}} />
      <AbsoluteFill style={{background: 'radial-gradient(ellipse 75% 70% at 50% 50%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.5) 100%)'}} />
    </AbsoluteFill>
  );
};
