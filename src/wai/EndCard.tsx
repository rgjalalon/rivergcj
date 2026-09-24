import {AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {colors, fonts} from '../theme';
import {progress} from '../timeline';
import {tagline} from './timeline';

export const WaiEndCard: React.FC<{from: number; to: number}> = ({from, to}) => {
  const frame = useCurrentFrame();
  const bg = progress(frame, from, 9);
  const logo = progress(frame, from + 8, 18);
  const tag = progress(frame, from + 24, 18);
  const zoom = interpolate(frame, [from, to], [1, 1.035], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill
      style={{
        opacity: bg,
        background: `radial-gradient(ellipse 70% 45% at 50% 47%, #4C3A2C 0%, ${colors.espresso} 60%, #30241B 100%)`,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', transform: `scale(${zoom})`}}>
        <Img
          src={staticFile('wai/wai-logo-cream.png')}
          style={{width: 520, opacity: logo, transform: `translateY(${(1 - logo) * 16}px)`}}
        />
        <div
          style={{
            marginTop: 72,
            fontFamily: fonts.sans,
            fontSize: 40,
            fontWeight: 400,
            letterSpacing: 0.2,
            color: 'rgba(245,240,232,0.78)',
            opacity: tag,
            transform: `translateY(${(1 - tag) * 10}px)`,
          }}
        >
          {tagline}
        </div>
      </div>
    </AbsoluteFill>
  );
};
