import React from 'react';
import {AbsoluteFill, Audio, Easing, interpolate, staticFile, useCurrentFrame} from 'remotion';
import '../loadFonts';
import {BlockWipe, H, W, clamp} from './parts';
import {Bloom, CHAT_AVATAR, Chat, Collage1, Collage2, Collage3, Collage4, Hero, ORB, Orb, Outro} from './scenes';

export const ELEVEN_FPS = 30;

// Scene windows in frames [start, end). Neighbours overlap by the length of
// the block wipe between them. The structure mirrors the reference edit.
export const T = {
  c1: [0, 80],
  h1: [70, 128],
  c2: [118, 172],
  h2: [162, 220],
  c3: [210, 264],
  h3: [254, 312],
  c4: [302, 400],
  bloom: [390, 520],
  chat: [500, 700],
  outro: [690, 1000],
} as const;
export const ELEVEN_DURATION = T.outro[1];
const WIPE = 10;

type Key = keyof typeof T;
const on = (f: number, k: Key) => f >= T[k][0] && f < T[k][1];
const local = (f: number, k: Key) => f - T[k][0];
const wipeP = (f: number, k: Key) => interpolate(f, [T[k][0], T[k][0] + WIPE], [0, 1], clamp);

export const ElevenSeconds: React.FC = () => {
  const f = useCurrentFrame();
  const blueFlash = ['#3C7FA8', '#FFFFFF', '#8D9160'];
  const greyFlash = ['#EFEEEA', '#FFFFFF', '#2F6E9E'];
  const redFlash = ['#E4502F', '#F4B25E', '#B01F3A', '#FFFFFF'];

  // orb → chat avatar hand-off
  const chatL = local(f, 'chat');
  const reveal = interpolate(chatL, [0, 22], [0, 1], {...clamp, easing: Easing.bezier(0.65, 0, 0.35, 1)});
  const toAvatar = interpolate(chatL, [4, 26], [0, 1], {...clamp, easing: Easing.bezier(0.65, 0, 0.35, 1)});

  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Audio src={staticFile('eleven/soundtrack.wav')} />
      {on(f, 'c1') && <Collage1 f={local(f, 'c1')} />}
      {on(f, 'h1') && (
        <BlockWipe p={wipeP(f, 'h1')} id="w1" from="right" flash={blueFlash} seed={1}>
          <Hero f={local(f, 'h1')} seq="clock" seed={1} pill={{x: 1130, y: 300}} />
        </BlockWipe>
      )}
      {on(f, 'c2') && (
        <BlockWipe p={wipeP(f, 'c2')} id="w2" from="left" flash={greyFlash} seed={2}>
          <Collage2 f={local(f, 'c2')} />
        </BlockWipe>
      )}
      {on(f, 'h2') && (
        <BlockWipe p={wipeP(f, 'h2')} id="w3" from="right" flash={blueFlash} seed={3}>
          <Hero f={local(f, 'h2')} seq="pwatch" seed={2} pill={{x: 1150, y: 280}} />
        </BlockWipe>
      )}
      {on(f, 'c3') && (
        <BlockWipe p={wipeP(f, 'c3')} id="w4" from="left" flash={greyFlash} seed={4}>
          <Collage3 f={local(f, 'c3')} />
        </BlockWipe>
      )}
      {on(f, 'h3') && (
        <BlockWipe p={wipeP(f, 'h3')} id="w5" from="right" flash={blueFlash} seed={5}>
          <Hero f={local(f, 'h3')} seq="laptop" seed={3} pill={{x: 1180, y: 250}} />
        </BlockWipe>
      )}
      {on(f, 'c4') && (
        <BlockWipe p={wipeP(f, 'c4')} id="w6" from="left" flash={greyFlash} seed={6}>
          <Collage4 f={local(f, 'c4')} />
        </BlockWipe>
      )}
      {on(f, 'bloom') && (
        <BlockWipe p={wipeP(f, 'bloom')} id="w7" from="bottom" flash={redFlash} seed={7}>
          <Bloom f={local(f, 'bloom')} />
        </BlockWipe>
      )}
      {on(f, 'chat') && (
        <AbsoluteFill style={{clipPath: `circle(${interpolate(reveal, [0, 1], [190, 1200])}px at ${ORB.x}px ${ORB.y}px)`}}>
          <Chat f={chatL} len={T.chat[1] - T.chat[0]} />
        </AbsoluteFill>
      )}
      {on(f, 'chat') && (
        <div
          style={{
            position: 'absolute',
            left: interpolate(toAvatar, [0, 1], [ORB.x, CHAT_AVATAR.x + 17]),
            top: interpolate(toAvatar, [0, 1], [ORB.y, CHAT_AVATAR.y + 32 + interpolate(chatL, [60, 70, 118, 128], [0, -40, -40, -80], clamp)]),
            opacity: interpolate(chatL, [T.chat[1] - T.chat[0] - 14, T.chat[1] - T.chat[0]], [1, 0], clamp),
          }}
        >
          <Orb t={f / 30} r={interpolate(toAvatar, [0, 1], [190, 17])} glow={interpolate(toAvatar, [0, 1], [1, 0.35])} />
        </div>
      )}
      {on(f, 'outro') && <Outro f={local(f, 'outro')} />}
      <div style={{position: 'absolute', width: W, height: H, pointerEvents: 'none'}} />
    </AbsoluteFill>
  );
};
