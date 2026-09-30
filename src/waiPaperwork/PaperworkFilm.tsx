import '../loadFonts';
import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {Grain} from '../components/Grain';
import {EndCard, LogoReveal, Lockup} from './Brand';
import {Hook} from './Hook';
import {Product} from './Product';
import {Cards, Question} from './Question';
import {scenes, SRC_START, PW_FPS, PW_H, PW_W} from './timeline';
import {Source} from './util';

const inScene = (frame: number, s: {from: number; to: number}, pad = 0) => frame >= s.from - pad && frame < s.to + pad;

export const PaperworkFilm: React.FC = () => {
  const frame = useCurrentFrame();
  const product = {from: scenes.product.from, to: scenes.papers.to};
  const dark = !inScene(frame, product) || frame >= scenes.end.from;

  return (
    <AbsoluteFill style={{background: '#000'}}>
      {inScene(frame, scenes.hook) && <Hook />}
      {inScene(frame, scenes.footage) && <Question />}
      {inScene(frame, scenes.cards) && <Cards />}
      {inScene(frame, scenes.logo) && <LogoReveal />}
      {inScene(frame, scenes.lockup) && <Lockup />}
      {inScene(frame, product) && (
        <Product>
          <Source from={product.from} to={product.to} />
        </Product>
      )}
      {frame >= scenes.end.from - 8 && <EndCard />}
      <AbsoluteFill
        style={{
          pointerEvents: 'none',
          background: dark
            ? 'radial-gradient(ellipse 85% 80% at 50% 50%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.35) 100%)'
            : 'radial-gradient(ellipse 85% 80% at 50% 50%, rgba(0,0,0,0) 60%, rgba(120,85,50,0.12) 100%)',
        }}
      />
      <Grain width={PW_W} height={PW_H} opacity={dark ? 0.1 : 0.06} />

      <Audio src={staticFile('wai-paperwork/sfx.wav')} volume={0.8} />
      <Sequence from={scenes.footage.from} layout="none">
        <Audio src={staticFile('wai-paperwork/source-audio.m4a')} startFrom={Math.round(SRC_START * PW_FPS)} />
      </Sequence>
    </AbsoluteFill>
  );
};
