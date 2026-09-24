import {Composition} from 'remotion';
import {WellnessAppWalkthrough} from './WellnessAppWalkthrough';
import {DURATION, FPS} from './timeline';
import {WaiFilm} from './wai/WaiFilm';
import {WAI_DURATION, WAI_FPS, WAI_H, WAI_W} from './wai/timeline';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="WellnessAppWalkthrough"
        component={WellnessAppWalkthrough}
        durationInFrames={DURATION}
        fps={FPS}
        width={1920}
        height={1080}
      />
      <Composition
        id="WaiBrandFilm"
        component={WaiFilm}
        durationInFrames={WAI_DURATION}
        fps={WAI_FPS}
        width={WAI_W}
        height={WAI_H}
      />
    </>
  );
};
