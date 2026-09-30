import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {camera, captions, scenes, src} from './timeline';
import {easeInOut, inOut, pw, ramp, Rise} from './util';

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

const Caption: React.FC<{frame: number; from: number; to: number; text: string; em?: string}> = ({
  frame,
  from,
  to,
  text,
  em,
}) => {
  const vis = inOut(frame, from, to, 12, 10);
  if (vis <= 0) return null;
  const emAt = em ? text.lastIndexOf(em) : -1;
  const head = emAt >= 0 ? text.slice(0, emAt) : text;
  const tail = emAt >= 0 ? text.slice(emAt, emAt + em!.length) : '';
  const rest = emAt >= 0 ? text.slice(emAt + em!.length) : '';
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 78,
        textAlign: 'center',
        fontFamily: pw.serif,
        fontSize: 52,
        letterSpacing: -0.5,
        color: pw.espresso,
        opacity: vis,
      }}
    >
      <Rise frame={frame} at={from} dist={18}>
        {head}
      </Rise>
      {tail && (
        <Rise frame={frame} at={from + 5} dist={18} style={{fontStyle: 'italic', color: pw.caramelDeep}}>
          {tail}
        </Rise>
      )}
      {rest}
    </div>
  );
};

/**
 * The product capture (worklist → note → letter → paper storm) on warm paper.
 * The capture is white-on-white, so multiplying it over cream keeps the cards,
 * shadows and type while the background takes on the paper tone; that also
 * lets the camera pull out past the frame edges without a seam.
 */
export const Product: React.FC<{children: React.ReactNode}> = ({children}) => {
  const frame = useCurrentFrame();
  const cam = cameraAt(frame);
  const payoff = src(33.5);
  const payoffVis = inOut(frame, payoff, scenes.papers.to + 6, 12, 10);

  return (
    <AbsoluteFill style={{background: pw.paper, overflow: 'hidden', isolation: 'isolate'}}>
      <AbsoluteFill
        style={{
          background:
            'radial-gradient(ellipse 70% 60% at 45% 40%, rgba(255,253,249,1) 0%, rgba(247,242,234,1) 55%, rgba(233,224,210,1) 100%)',
        }}
      />
      <AbsoluteFill style={{perspective: 2400, mixBlendMode: 'multiply'}}>
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: 1920,
            height: 1080,
            transformOrigin: '0 0',
            transform: `translate(960px, 500px) rotateX(${cam.rx}deg) rotateY(${cam.ry}deg) scale(${cam.z}) translate(${-cam.x}px, ${-cam.y}px)`,
            filter: `blur(${payoffVis * 5}px)`,
          }}
        >
          {children}
        </div>
      </AbsoluteFill>
      {/* Paper fade behind the captions so they never sit on UI text. */}
      <AbsoluteFill
        style={{
          background: 'linear-gradient(to bottom, rgba(247,242,234,0) 800px, rgba(247,242,234,0.94) 930px, rgba(247,242,234,1) 1080px)',
        }}
      />
      {captions.map((c) => (
        <Caption key={c.from} frame={frame} from={src(c.from)} to={src(c.to)} text={c.text} em={c.em} />
      ))}
      <AbsoluteFill
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          opacity: payoffVis,
          background: `radial-gradient(ellipse 50% 36% at 50% 50%, rgba(247,242,234,0.97) 35%, rgba(247,242,234,0) 100%)`,
        }}
      >
        <div style={{fontFamily: pw.serif, fontSize: 150, letterSpacing: -3, color: pw.ink, transform: `scale(${1.03 - 0.03 * ramp(frame, payoff, 40)})`}}>
          <Rise frame={frame} at={payoff}>
            {'Your time, '}
          </Rise>
          <Rise frame={frame} at={payoff + 6} style={{fontStyle: 'italic', color: pw.caramelDeep}}>
            back.
          </Rise>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
