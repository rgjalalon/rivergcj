import '../loadFonts';
import {AbsoluteFill, Audio, interpolate, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {Clip, FilmGrain, Vignette} from './Film';
import {GoldLogo, Mosaic, Products} from './Finale';
import {Engraving, GoldHead, HandsSpark} from './Myth';
import {ScreenShot} from './Screens';
import {f, M_DURATION, M_H, M_W, sfx, Shot, shots, voice, voiceDur} from './timeline';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

const ShotView: React.FC<{shot: Shot; span: number; seed: string}> = ({shot, span, seed}) => {
  switch (shot.kind) {
    case 'clip':
      return <Clip src={shot.src} look={shot.look} trim={shot.trim ?? 0} push={shot.push ?? 0.04} span={span} seed={seed} />;
    case 'screen':
      return <ScreenShot screen={shot.screen} span={span} />;
    case 'engraving':
      return <Engraving span={span} chalk={shot.chalk} />;
    case 'goldHead':
      return <GoldHead span={span} />;
    case 'handsSpark':
      return <HandsSpark span={span} />;
    case 'products':
      return <Products span={span} />;
    case 'mosaic':
      return <Mosaic span={span} />;
    case 'logo':
      return <GoldLogo span={span} />;
    case 'black':
      return <AbsoluteFill style={{background: '#000'}} />;
  }
};

/** Duck the score under narration, and shape it to the four acts. */
const scoreVolume = (frame: number) => {
  const t = frame / 30;
  const talking = voice.some((v) => t >= v.at - 0.15 && t <= v.at + voiceDur[v.id] + 0.25);
  const shape = interpolate(
    t,
    [0, 2, 23.6, 24.4, 25.3, 26, 60, 63.5, 85, 98.5, 102, 105.6],
    [0, 0.34, 0.34, 0.08, 0.08, 0.5, 0.5, 0.62, 0.62, 0.8, 0.8, 0],
    clamp,
  );
  return shape * (talking ? 0.55 : 1);
};

export const WaiManifesto: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / 30;
  const grain = t < 24 ? 0.2 : 0.08;
  return (
    <AbsoluteFill style={{background: '#000'}}>
      {shots.map((s, i) => {
        const from = f(s.at);
        const dur = f(s.to) - from;
        return (
          <Sequence key={i} from={from} durationInFrames={dur} premountFor={15}>
            <ShotView shot={s} span={dur} seed={`s${i}`} />
          </Sequence>
        );
      })}

      <Vignette strength={t < 24 ? 0.7 : 0.45} />
      <FilmGrain amount={grain} w={M_W} h={M_H} />

      <Audio src={staticFile('wai/manifesto/audio/score_silent_descent.mp3')} volume={scoreVolume} />
      {voice.map((v) => (
        <Sequence key={v.id} from={f(v.at)} durationInFrames={f(voiceDur[v.id] + 0.5)}>
          <Audio src={staticFile(`wai/manifesto/vo/${v.id}.mp3`)} volume={v.vol ?? 1} />
        </Sequence>
      ))}
      {sfx.map((s, i) => (
        <Sequence key={`sfx${i}`} from={f(s.at)} durationInFrames={s.len ? f(s.len) : f(10)}>
          <Audio
            src={staticFile(`wai/manifesto/audio/${s.id}.mp3`)}
            volume={(fr) => (s.len ? s.vol * interpolate(fr, [f(s.len) - 20, f(s.len)], [1, 0], clamp) : s.vol)}
          />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};


