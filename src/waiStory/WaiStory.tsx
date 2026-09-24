import '../loadFonts';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {Grain} from '../components/Grain';
import {StoryCaptions} from './Caption';
import {StoryEndCard} from './EndCard';
import {PhoneChat} from './PhoneChat';
import {Grade, Scene} from './Scene';
import {PICTURE_H, PICTURE_TOP, shots, STORY_H, STORY_W} from './timeline';

export const WaiStory: React.FC = () => {
  const frame = useCurrentFrame();
  // Hard cuts between shots, like the reference. The end card keeps the last
  // shot underneath so it dissolves to espresso.
  const current = shots.findIndex((s) => frame >= s.from && frame < s.to);
  const visible = shots.filter((s, i) => i === current || (shots[current]?.kind === 'end' && i === current - 1));
  const end = shots[shots.length - 1];
  // Letterbox bars open up as the end card fills the frame.
  const bars = 1 - interpolate(frame, [end.from, end.from + 24], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  return (
    <AbsoluteFill style={{background: '#000'}}>
      <div style={{position: 'absolute', left: 0, top: PICTURE_TOP, width: STORY_W, height: PICTURE_H, overflow: 'hidden'}}>
        {visible.map((s) => {
          switch (s.kind) {
            case 'scene':
              return <Scene key={s.from} id={s.id} from={s.from} to={s.to} />;
            case 'phone':
              return (
                <AbsoluteFill key={s.from}>
                  <PhoneChat from={s.from} to={s.to} />
                  <Grade />
                </AbsoluteFill>
              );
            default:
              return null;
          }
        })}
      </div>
      {frame >= end.from && <StoryEndCard from={end.from} to={end.to} />}
      {/* Black bars, the same film throughout */}
      <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: PICTURE_TOP, background: '#000', opacity: bars}} />
      <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: PICTURE_TOP, background: '#000', opacity: bars}} />
      <StoryCaptions />
      <Grain width={STORY_W} height={STORY_H} opacity={0.14} />
    </AbsoluteFill>
  );
};
