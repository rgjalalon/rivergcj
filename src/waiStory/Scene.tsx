import {AbsoluteFill, getStaticFiles, interpolate, OffthreadVideo, staticFile, useCurrentFrame} from 'remotion';
import {colors} from '../theme';
import {SceneId} from './timeline';
import {Coffee, Labs, Runner, Stretch, Sunlight, Temples} from './animatics';

const hasClip = (id: SceneId) => getStaticFiles().some((f) => f.name === `wai/story/${id}.mp4`);

const animatics: Record<SceneId, React.FC<{t: number}>> = {
  labs: Labs,
  temples: Temples,
  runner: Runner,
  sunlight: Sunlight,
  stretch: Stretch,
  coffee: Coffee,
};

/**
 * One cinematic shot. Plays public/wai/story/<id>.mp4 when present, otherwise
 * the animatic. Either way it gets the same slow push, handheld drift and the
 * warm-dark Wai grade, so every shot reads as the same film.
 */
export const Scene: React.FC<{id: SceneId; from: number; to: number}> = ({id, from, to}) => {
  const frame = useCurrentFrame();
  const t = frame - from;
  const scale = interpolate(frame, [from, to], [1.02, 1.08], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  // Gentle handheld drift, a few pixels at most.
  const dx = Math.sin((frame + from) / 23) * 5 + Math.sin((frame + from) / 7.3) * 1.2;
  const dy = Math.cos((frame + from) / 29) * 4 + Math.cos((frame + from) / 8.1) * 1;
  const Animatic = animatics[id];

  return (
    <AbsoluteFill style={{overflow: 'hidden', background: '#140E0A'}}>
      <AbsoluteFill
        style={{
          transform: `translate(${dx}px, ${dy}px) scale(${scale})`,
          filter: 'sepia(0.18) saturate(0.86) contrast(1.06)',
        }}
      >
        {hasClip(id) ? (
          <OffthreadVideo src={staticFile(`wai/story/${id}.mp4`)} muted style={{width: '100%', height: '100%', objectFit: 'cover'}} />
        ) : (
          <Animatic t={t} />
        )}
      </AbsoluteFill>
      <Grade />
    </AbsoluteFill>
  );
};

/** Warm-dark grade: caramel in the highlights, espresso in the shadows, lifted blacks. */
export const Grade: React.FC = () => (
  <>
    <AbsoluteFill style={{background: 'linear-gradient(160deg, rgba(200,155,109,0.26) 0%, rgba(200,155,109,0) 60%)', mixBlendMode: 'soft-light'}} />
    <AbsoluteFill style={{background: `linear-gradient(0deg, rgba(62,47,35,0.5) 0%, rgba(62,47,35,0) 50%)`, mixBlendMode: 'multiply'}} />
    <AbsoluteFill style={{background: 'rgba(62,47,35,0.10)', mixBlendMode: 'lighten'}} />
    <AbsoluteFill style={{background: `rgba(245,240,232,0.03)`}} />
    <AbsoluteFill style={{boxShadow: `inset 0 0 220px 40px ${colors.espresso}99`}} />
  </>
);
