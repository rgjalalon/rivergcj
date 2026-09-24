import '../loadFonts';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {Grain, Vignette} from '../components/Grain';
import {InsightsScreen, TrackerScreen} from './AppScreens';
import {Captions} from './Caption';
import {Collage} from './Collage';
import {PrintShot, ScreenShot} from './Document';
import {WaiEndCard} from './EndCard';
import {Footage} from './Footage';
import {Shot, shots, WAI_H, WAI_W} from './timeline';

const render = (s: Shot) => {
  switch (s.kind) {
    case 'footage':
      return <Footage id={s.id} from={s.from} to={s.to} />;
    case 'tracker':
      return <TrackerScreen from={s.from} to={s.to} />;
    case 'insights':
      return <InsightsScreen from={s.from} to={s.to} />;
    case 'collage':
      return <Collage from={s.from} to={s.to} />;
    case 'screen':
      return <ScreenShot from={s.from} to={s.to} />;
    case 'print':
      return <PrintShot from={s.from} to={s.to} />;
    case 'end':
      return <WaiEndCard from={s.from} to={s.to} />;
  }
};

export const WaiFilm: React.FC = () => {
  const frame = useCurrentFrame();
  // Hard cuts, except where a shot has `xfade`: then it dissolves in over the
  // previous one, centred on its cut point. The end card keeps the last shot
  // underneath so its fade reads as a dissolve to espresso.
  return (
    <AbsoluteFill style={{background: '#000'}}>
      {shots.map((s, i) => {
        const half = (s.xfade ?? 0) / 2;
        const next = shots[i + 1];
        const tail = next?.kind === 'end' ? next.to - s.to : (next?.xfade ?? 0) / 2;
        if (frame < s.from - half || frame >= s.to + tail) return null;
        const opacity = half ? interpolate(frame, [s.from - half, s.from + half], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}) : 1;
        return (
          <AbsoluteFill key={s.from} style={{opacity}}>
            {render(s)}
          </AbsoluteFill>
        );
      })}
      <Captions />
      <Vignette />
      <Grain width={WAI_W} height={WAI_H} opacity={0.1} />
    </AbsoluteFill>
  );
};
