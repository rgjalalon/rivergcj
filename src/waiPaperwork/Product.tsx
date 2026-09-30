import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {camera, captions, scenes, src} from './timeline';
import {easeInOut, inOut, Mark, pw, ramp, Reveal, Rise} from './util';

/** Camera state at a film frame, eased between keyframes. */
const cameraAt = (frame: number) => {
  const keys = camera.map((k) => ({...k, f: src(k.at)}));
  if (frame <= keys[0].f) return keys[0];
  for (let i = 0; i < keys.length - 1; i++) {
    const a = keys[i];
    const b = keys[i + 1];
    if (frame <= b.f) {
      const p = interpolate(frame, [a.f, b.f], [0, 1], {easing: easeInOut});
      const mix = (u: number, v: number) => u + (v - u) * p;
      return {x: mix(a.x, b.x), y: mix(a.y, b.y), z: mix(a.z, b.z), rx: mix(a.rx, b.rx), ry: mix(a.ry, b.ry)};
    }
  }
  return keys[keys.length - 1];
};

const Caption: React.FC<{frame: number; from: number; to: number; text: string; mark?: string}> = ({
  frame,
  from,
  to,
  text,
  mark,
}) => {
  const vis = inOut(frame, from, to, 12, 10);
  if (vis <= 0) return null;
  const at = mark ? text.lastIndexOf(mark) : -1;
  const head = at >= 0 ? text.slice(0, at) : text;
  const tail = at >= 0 ? text.slice(at, at + mark!.length) : '';
  const rest = at >= 0 ? text.slice(at + mark!.length) : '';
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 74,
        textAlign: 'center',
        fontFamily: pw.sans,
        fontWeight: 500,
        fontSize: 46,
        letterSpacing: -1,
        color: pw.ink,
        opacity: vis,
      }}
    >
      <Rise frame={frame} at={from} dist={18}>
        {head}
      </Rise>
      {tail && (
        <Rise frame={frame} at={from + 4} dist={18}>
          <Mark frame={frame} at={from + 12}>
            {tail}
          </Mark>
        </Rise>
      )}
      {rest}
    </div>
  );
};

/**
 * The product capture (worklist → note → letter → paper storm) on clean white,
 * with a virtual camera. The capture's background is pure white, so the
 * camera can pull out past the frame edges without a seam.
 */
export const Product: React.FC<{children: React.ReactNode}> = ({children}) => {
  const frame = useCurrentFrame();
  const cam = cameraAt(frame);
  const payoff = src(33.5);
  const payoffVis = inOut(frame, payoff, scenes.papers.to + 6, 12, 10);
  const enter = ramp(frame, scenes.product.from, 14);

  return (
    <AbsoluteFill style={{background: pw.white, overflow: 'hidden'}}>
      <AbsoluteFill style={{perspective: 2400, opacity: enter}}>
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: 1920,
            height: 1080,
            transformOrigin: '0 0',
            transform: `translate(960px, 500px) rotateX(${cam.rx}deg) rotateY(${cam.ry}deg) scale(${cam.z}) translate(${-cam.x}px, ${-cam.y}px)`,
            filter: `blur(${payoffVis * 6}px)`,
            opacity: 1 - payoffVis * 0.55,
          }}
        >
          {children}
        </div>
      </AbsoluteFill>
      {/* White fade behind the captions so they never sit on UI text. */}
      <AbsoluteFill
        style={{
          background: 'linear-gradient(to bottom, rgba(255,255,255,0) 800px, rgba(255,255,255,0.96) 930px, #fff 1080px)',
        }}
      />
      {captions.map((c) => (
        <Caption key={c.from} frame={frame} from={src(c.from)} to={src(c.to)} text={c.text} mark={c.mark} />
      ))}
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', opacity: payoffVis}}>
        <div
          style={{
            fontFamily: pw.sans,
            fontWeight: 700,
            fontSize: 150,
            letterSpacing: -5,
            color: pw.ink,
            transform: `scale(${1.04 - 0.04 * ramp(frame, payoff, 40)})`,
          }}
        >
          <Reveal frame={frame} at={payoff}>
            {'Your time, '}
          </Reveal>
          <Reveal frame={frame} at={payoff + 5}>
            <Mark frame={frame} at={payoff + 14}>
              back.
            </Mark>
          </Reveal>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
