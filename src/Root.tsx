import {Composition, Still} from 'remotion';
import {AgingWellSlide, SLIDE_H, SLIDE_W, SLIDES} from './posts/aging/AgingWellCarousel';
import {LpaPost, LPA_H, LPA_W} from './posts/LpaPost';
import {InflammationPost, POST_H, POST_W} from './posts/InflammationPost';
import {WellnessAppWalkthrough} from './WellnessAppWalkthrough';
import {DURATION, FPS} from './timeline';
import {WaiFilm} from './wai/WaiFilm';
import {BACKLOG_DURATION, BACKLOG_FPS, BACKLOG_H, BACKLOG_W, WaiBacklog} from './wai/Backlog';
import {SHORT_DURATION, SHORT_FPS, SHORT_H, SHORT_W, WaiShortfall} from './wai/Shortfall';
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
        id="WaiBacklog"
        component={WaiBacklog}
        durationInFrames={BACKLOG_DURATION}
        fps={BACKLOG_FPS}
        width={BACKLOG_W}
        height={BACKLOG_H}
      />
      <Composition
        id="WaiShortfall"
        component={WaiShortfall}
        durationInFrames={SHORT_DURATION}
        fps={SHORT_FPS}
        width={SHORT_W}
        height={SHORT_H}
      />
      <Still id="InflammationPost" component={InflammationPost} width={POST_W} height={POST_H} />
      <Still id="LpaPost" component={LpaPost} width={LPA_W} height={LPA_H} />
      {SLIDES.map((_, i) => (
        <Still
          key={i}
          id={`AgingWell-${i + 1}`}
          component={AgingWellSlide}
          defaultProps={{index: i}}
          width={SLIDE_W}
          height={SLIDE_H}
        />
      ))}
    </>
  );
};
