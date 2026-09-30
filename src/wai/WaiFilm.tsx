import '../loadFonts';
import {AbsoluteFill, Audio, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {Grain, Vignette} from '../components/Grain';
import {InsightsScreen, TrackerScreen} from './AppScreens';
import {Captions} from './Caption';
import {Collage} from './Collage';
import {WaiEndCard} from './EndCard';
import {Footage} from './Footage';
import {shots, WAI_DURATION, WAI_H, WAI_W} from './timeline';

export const WaiFilm: React.FC = () => {
  const frame = useCurrentFrame();
  // Hard cuts between shots, like the reference edit. The end card keeps the
  // previous shot underneath so its fade reads as a dissolve to espresso.
  const current = shots.findIndex((s) => frame >= s.from && frame < s.to);
  const visible = shots.filter((s, i) => i === current || (shots[current]?.kind === 'end' && i === current - 1));
  // Score fades in under the opening cut and out under the end card, with a
  // gentle dip through the collage so the "tracked / understood / improved"
  // captions keep the read.
  const musicVolume = interpolate(
    frame,
    [0, 24, 420, 460, 480, 774, WAI_DURATION - 30, WAI_DURATION],
    [0, 0.5, 0.5, 0.34, 0.34, 0.5, 0.5, 0],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
  );

  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Audio src={staticFile('wai/audio/theme.mp3')} volume={musicVolume} />
      {visible.map((s) => {
        switch (s.kind) {
          case 'footage':
            return <Footage key={s.from} id={s.id} from={s.from} to={s.to} />;
          case 'tracker':
            return <TrackerScreen key={s.from} from={s.from} to={s.to} />;
          case 'insights':
            return <InsightsScreen key={s.from} from={s.from} to={s.to} />;
          case 'collage':
            return <Collage key={s.from} from={s.from} to={s.to} />;
          case 'end':
            return <WaiEndCard key={s.from} from={s.from} to={s.to} />;
        }
      })}
      <Captions />
      <Vignette />
      <Grain width={WAI_W} height={WAI_H} opacity={0.1} />
    </AbsoluteFill>
  );
};
