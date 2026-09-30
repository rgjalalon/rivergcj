import '../loadFonts';
import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {EndCard, LogoReveal, Lockup} from './Brand';
import {Hook} from './Hook';
import {Product} from './Product';
import {Cards, Question} from './Question';
import {scenes, SRC_START, PW_FPS} from './timeline';
import {pw, Source} from './util';

const inScene = (frame: number, s: {from: number; to: number}) => frame >= s.from && frame < s.to;

export const PaperworkFilm: React.FC = () => {
  const frame = useCurrentFrame();
  const product = {from: scenes.product.from, to: scenes.papers.to};

  return (
    <AbsoluteFill style={{background: pw.white}}>
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

      <Audio src={staticFile('wai-paperwork/sfx.wav')} volume={0.8} />
      <Sequence from={scenes.footage.from} layout="none">
        <Audio src={staticFile('wai-paperwork/source-audio.m4a')} startFrom={Math.round(SRC_START * PW_FPS)} />
      </Sequence>
    </AbsoluteFill>
  );
};
