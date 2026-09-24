import {Composition} from 'remotion';
import {WellnessAppWalkthrough} from './WellnessAppWalkthrough';
import {DURATION, FPS} from './timeline';

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="WellnessAppWalkthrough"
      component={WellnessAppWalkthrough}
      durationInFrames={DURATION}
      fps={FPS}
      width={1920}
      height={1080}
    />
  );
};
