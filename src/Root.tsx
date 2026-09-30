import {Composition} from 'remotion';
import {WellnessAppWalkthrough} from './WellnessAppWalkthrough';
import {DURATION, FPS} from './timeline';
import {WaiFilm} from './wai/WaiFilm';
import {WAI_DURATION, WAI_FPS, WAI_H, WAI_W} from './wai/timeline';
import {PaperworkFilm} from './waiPaperwork/PaperworkFilm';
import {PW_DURATION, PW_FPS, PW_H, PW_W} from './waiPaperwork/timeline';

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
        id="WaiPaperworkFilm"
        component={PaperworkFilm}
        durationInFrames={PW_DURATION}
        fps={PW_FPS}
        width={PW_W}
        height={PW_H}
      />
    </>
  );
};
