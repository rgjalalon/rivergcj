import '../loadFonts';
import {AbsoluteFill, Audio, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {Grain, Vignette} from '../components/Grain';
import {WaiEndCard} from '../wai/EndCard';
import {OriginFootage} from './OriginFootage';
import {ChatUi, RecordUi} from './ProductUi';
import {ORIGIN_DURATION, ORIGIN_H, ORIGIN_W, originShots} from './timeline';

export const WaiOrigin: React.FC = () => {
  const frame = useCurrentFrame();
  const current = originShots.findIndex((s) => frame >= s.from && frame < s.to);
  const visible = originShots.filter(
    (s, i) => i === current || (originShots[current]?.kind === 'end' && i === current - 1),
  );
  // A single building cue, close to the reference's runtime, with a long
  // fade under the open and a slow swell into the end card.
  const musicVolume = interpolate(
    frame,
    [0, 45, ORIGIN_DURATION - 90, ORIGIN_DURATION],
    [0, 0.6, 0.6, 0],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
  );

  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Audio src={staticFile('wai/origin/theme-origin.mp3')} volume={musicVolume} />
      {visible.map((s) => {
        switch (s.kind) {
          case 'clip':
            return <OriginFootage key={s.from} id={s.id} from={s.from} to={s.to} />;
          case 'recordUi':
            return <RecordUi key={s.from} from={s.from} to={s.to} />;
          case 'chatUi':
            return <ChatUi key={s.from} from={s.from} to={s.to} />;
          case 'end':
            return <WaiEndCard key={s.from} from={s.from} to={s.to} />;
        }
      })}
      <Vignette />
      <Grain width={ORIGIN_W} height={ORIGIN_H} opacity={0.12} />
    </AbsoluteFill>
  );
};
