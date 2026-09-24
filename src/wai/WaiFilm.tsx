import '../loadFonts';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {Grain, Vignette} from '../components/Grain';
import {InsightsScreen, TrackerScreen} from './AppScreens';
import {Captions} from './Caption';
import {Collage} from './Collage';
import {WaiEndCard} from './EndCard';
import {Footage} from './Footage';
import {shots, WAI_H, WAI_W} from './timeline';

export const WaiFilm: React.FC = () => {
  const frame = useCurrentFrame();
  // Hard cuts between shots, like the reference edit. The end card keeps the
  // previous shot underneath so its fade reads as a dissolve to espresso.
  const current = shots.findIndex((s) => frame >= s.from && frame < s.to);
  const visible = shots.filter((s, i) => i === current || (shots[current]?.kind === 'end' && i === current - 1));

  return (
    <AbsoluteFill style={{background: '#000'}}>
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
