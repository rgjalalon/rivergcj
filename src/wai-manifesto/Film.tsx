import {AbsoluteFill, Img, interpolate, OffthreadVideo, random, staticFile, useCurrentFrame} from 'remotion';
import {Look, M_FPS} from './timeline';

const filters: Record<Look, string> = {
  // Old 16mm: slightly sepia, crushed, flickering (flicker added per frame below).
  archival: 'grayscale(1) sepia(0.28) contrast(1.22) brightness(0.95)',
  // Cinematic present day: lower saturation, a little teal in the shadows.
  modern: 'saturate(0.82) contrast(1.1) brightness(0.96)',
  // Gold mythology: pushed toward amber.
  gold: 'sepia(0.85) saturate(2.1) hue-rotate(-12deg) contrast(1.25) brightness(0.9)',
  night: 'grayscale(0.75) contrast(1.3) brightness(0.55)',
};

/** Gate weave + exposure flicker for archival film; nothing for modern. */
export const useFilmMotion = (look: Look, seed: string) => {
  const frame = useCurrentFrame();
  if (look !== 'archival') return {dx: 0, dy: 0, flicker: 1};
  const r = (k: string) => random(`${seed}-${k}-${frame}`) - 0.5;
  return {dx: r('x') * 3, dy: r('y') * 3, flicker: 1 + r('f') * 0.12};
};

export const Graded: React.FC<{look: Look; seed: string; push: number; span: number; children: React.ReactNode}> = ({
  look,
  seed,
  push,
  span,
  children,
}) => {
  const frame = useCurrentFrame();
  const {dx, dy, flicker} = useFilmMotion(look, seed);
  const scale = interpolate(frame, [0, span], [1.02, 1.02 + push], {extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{background: '#000', overflow: 'hidden'}}>
      <AbsoluteFill
        style={{
          transform: `translate(${dx}px, ${dy}px) scale(${scale})`,
          filter: `${filters[look]} brightness(${flicker})`,
        }}
      >
        {children}
      </AbsoluteFill>
      {look === 'modern' && (
        <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(20,60,70,0.10), rgba(60,35,15,0.12))', mixBlendMode: 'soft-light'}} />
      )}
      {look === 'archival' && <Scratches seed={seed} />}
    </AbsoluteFill>
  );
};

/** Occasional vertical scratches and dust, like a worn print. */
const Scratches: React.FC<{seed: string}> = ({seed}) => {
  const frame = useCurrentFrame();
  const show = random(`${seed}-s-${frame}`) > 0.72;
  const x = random(`${seed}-sx-${Math.floor(frame / 3)}`) * 100;
  const dust = Array.from({length: 3}, (_, i) => ({
    x: random(`${seed}-dx${i}-${frame}`) * 100,
    y: random(`${seed}-dy${i}-${frame}`) * 100,
    r: 1 + random(`${seed}-dr${i}-${frame}`) * 3,
    on: random(`${seed}-do${i}-${frame}`) > 0.6,
  }));
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      {show && <div style={{position: 'absolute', left: `${x}%`, top: 0, bottom: 0, width: 1.5, background: 'rgba(255,255,255,0.22)'}} />}
      {dust.map((d, i) =>
        d.on ? (
          <div
            key={i}
            style={{position: 'absolute', left: `${d.x}%`, top: `${d.y}%`, width: d.r, height: d.r, borderRadius: d.r, background: 'rgba(250,245,230,0.5)'}}
          />
        ) : null,
      )}
    </AbsoluteFill>
  );
};

export const Clip: React.FC<{src: string; look: Look; trim: number; push: number; span: number; seed: string}> = ({
  src,
  look,
  trim,
  push,
  span,
  seed,
}) => (
  <Graded look={look} seed={seed} push={push} span={span}>
    <OffthreadVideo
      src={staticFile(src)}
      muted
      trimBefore={Math.round(trim * M_FPS)}
      style={{width: '100%', height: '100%', objectFit: 'cover'}}
    />
  </Graded>
);

export const Still: React.FC<{src: string; style?: React.CSSProperties}> = ({src, style}) => (
  <Img src={staticFile(src)} style={{width: '100%', height: '100%', objectFit: 'cover', ...style}} />
);

/** Film grain over everything; heavier during the archival act. */
export const FilmGrain: React.FC<{amount: number; w: number; h: number}> = ({amount, w, h}) => {
  const frame = useCurrentFrame();
  return (
    <svg width={w} height={h} style={{position: 'absolute', inset: 0, opacity: amount, mixBlendMode: 'overlay', pointerEvents: 'none'}}>
      <filter id="mgrain">
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed={frame % 113} stitchTiles="stitch" />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#mgrain)" />
    </svg>
  );
};

export const Vignette: React.FC<{strength: number}> = ({strength}) => (
  <AbsoluteFill
    style={{
      pointerEvents: 'none',
      background: `radial-gradient(ellipse 78% 75% at 50% 50%, rgba(0,0,0,0) 50%, rgba(0,0,0,${strength}) 100%)`,
    }}
  />
);
