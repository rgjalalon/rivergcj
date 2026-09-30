import {Composition} from 'remotion';
import {WellnessAppWalkthrough} from './WellnessAppWalkthrough';
import {DURATION, FPS} from './timeline';
import {WaiFilm} from './wai/WaiFilm';
import {ClinicFilm} from './clinic/ClinicFilm';
import {CUTS, FPS as CLINIC_FPS} from './clinic/timeline';
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
        id="WaiClinicMaster"
        component={ClinicFilm}
        durationInFrames={CUTS.master.seconds * CLINIC_FPS}
        fps={CLINIC_FPS}
        width={CUTS.master.w}
        height={CUTS.master.h}
        defaultProps={{cut: 'master' as const}}
      />
      <Composition
        id="WaiClinicShort"
        component={ClinicFilm}
        durationInFrames={CUTS.short.seconds * CLINIC_FPS}
        fps={CLINIC_FPS}
        width={CUTS.short.w}
        height={CUTS.short.h}
        defaultProps={{cut: 'short' as const}}
      />
      <Composition
        id="WaiClinicVertical"
        component={ClinicFilm}
        durationInFrames={CUTS.vertical.seconds * CLINIC_FPS}
        fps={CLINIC_FPS}
        width={CUTS.vertical.w}
        height={CUTS.vertical.h}
        defaultProps={{cut: 'vertical' as const}}
      />
    </>
  );
};
