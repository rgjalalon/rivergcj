import {Composition} from 'remotion';
import {WellnessAppWalkthrough} from './WellnessAppWalkthrough';
import {DURATION, FPS} from './timeline';
import {WaiFilm} from './wai/WaiFilm';
import {WAI_DURATION, WAI_FPS, WAI_H, WAI_W} from './wai/timeline';
import {WaiStory} from './waiStory/WaiStory';
import {STORY_DURATION, STORY_FPS, STORY_H, STORY_W} from './waiStory/timeline';

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
        id="WaiStory"
        component={WaiStory}
        durationInFrames={STORY_DURATION}
        fps={STORY_FPS}
        width={STORY_W}
        height={STORY_H}
      />
    </>
  );
};
