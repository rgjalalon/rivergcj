import {Composition} from 'remotion';
import {WellnessAppWalkthrough} from './WellnessAppWalkthrough';
import {DURATION, FPS} from './timeline';
import {OtherFilm} from './other/Film';
import {DURATION as OTHER_DURATION, FPS as OTHER_FPS, H as OTHER_H, W as OTHER_W} from './other/timeline';
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
      <Composition
        id="TheOther8759"
        component={OtherFilm}
        durationInFrames={OTHER_DURATION}
        fps={OTHER_FPS}
        width={OTHER_W}
        height={OTHER_H}
      />
    </>
  );
};
