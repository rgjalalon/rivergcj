import {Composition} from 'remotion';
import {WellnessAppWalkthrough} from './WellnessAppWalkthrough';
import {DURATION, FPS} from './timeline';
import {WaiFilm} from './wai/WaiFilm';
import {WAI_DURATION, WAI_FPS, WAI_H, WAI_W} from './wai/timeline';
import {WaiOrigin} from './wai-origin/WaiOrigin';
import {ORIGIN_DURATION, ORIGIN_FPS, ORIGIN_H, ORIGIN_W} from './wai-origin/timeline';
import {WaiManifesto} from './wai-manifesto/WaiManifesto';
import {M_DURATION, M_FPS, M_H, M_W} from './wai-manifesto/timeline';

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
        id="WaiOrigin"
        component={WaiOrigin}
        durationInFrames={ORIGIN_DURATION}
        fps={ORIGIN_FPS}
        width={ORIGIN_W}
        height={ORIGIN_H}
      />
      <Composition
        id="WaiManifesto"
        component={WaiManifesto}
        durationInFrames={M_DURATION}
        fps={M_FPS}
        width={M_W}
        height={M_H}
      />
    </>
  );
};
