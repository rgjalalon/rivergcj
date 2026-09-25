import React from 'react';
import {AbsoluteFill, Audio, Easing, interpolate, staticFile, useCurrentFrame} from 'remotion';
import '../loadFonts';
import {BlockWipe, clamp} from './parts';
import {Bloom, CHAT_AVATAR, CHAT_LIFT, Chat, Collage1, Collage2, Collage3, Collage4, Hero, ORB, Orb, Outro} from './scenes';

export const ELEVEN_FPS = 30;

// Scene windows in frames [start, end). Neighbours overlap by the length of
// the wipe between them. The structure mirrors the reference edit; the pacing
// is a little calmer so every line has time to land.
export const T = {
  c1: [0, 112],
  h1: [96, 180],
  c2: [164, 244],
  h2: [228, 306],
  c3: [290, 370],
  h3: [354, 432],
  c4: [416, 540],
  bloom: [524, 700],
  chat: [669, 1130],
  outro: [1115, 1500],
} as const;
export const ELEVEN_DURATION = T.outro[1];
const WIPE = 16;

// Each scene's animation runs on a slightly slowed clock.
const PACE = {collage: 0.8, hero: 0.8, bloom: 0.75, chat: 0.7, outro: 0.8};

type Key = keyof typeof T;
const on = (f: number, k: Key) => f >= T[k][0] && f < T[k][1];
const local = (f: number, k: Key) => f - T[k][0];
const inOutE = Easing.bezier(0.45, 0, 0.25, 1);
const wipeP = (f: number, k: Key) => interpolate(f, [T[k][0], T[k][0] + WIPE], [0, 1], {...clamp, easing: inOutE});

/** Outgoing scenes drift forward and soften slightly while the next one wipes in. */
const Exit: React.FC<{f: number; next: Key; children: React.ReactNode}> = ({f, next, children}) => {
  const x = interpolate(f, [T[next][0], T[next][0] + WIPE], [0, 1], {...clamp, easing: inOutE});
  return <AbsoluteFill style={{transform: `scale(${1 + 0.05 * x})`, filter: x > 0 ? `brightness(${1 - 0.08 * x})` : undefined}}>{children}</AbsoluteFill>;
};

export const ElevenSeconds: React.FC = () => {
  const f = useCurrentFrame();
  const blueFlash = ['#6E8F7B', '#8FAE95', '#C89B6D'];
  const greyFlash = ['#EAE1D4', '#F5F0E8', '#9CC3D6'];
  const redFlash = ['#A86F48', '#E7C9A0', '#3E2F23'];
  const c = (k: Key) => local(f, k) * PACE.collage;
  const h = (k: Key) => local(f, k) * PACE.hero;

  // orb → chat avatar hand-off, on the chat's clock
  const ci = local(f, 'chat') * PACE.chat;
  const chatLen = (T.chat[1] - T.chat[0]) * PACE.chat;
  const smooth = Easing.bezier(0.65, 0, 0.35, 1);
  const reveal = interpolate(ci, [0, 24], [0, 1], {...clamp, easing: smooth});
  const toAvatar = interpolate(ci, [4, 28], [0, 1], {...clamp, easing: smooth});
  const lift = interpolate(ci, CHAT_LIFT.at, CHAT_LIFT.y, {...clamp, easing: smooth});

  return (
    <AbsoluteFill style={{background: '#17110D'}}>
      <Audio src={staticFile('eleven/soundtrack.wav')} />
      {on(f, 'c1') && (
        <Exit f={f} next="h1">
          <Collage1 f={c('c1')} />
        </Exit>
      )}
      {on(f, 'h1') && (
        <BlockWipe p={wipeP(f, 'h1')} id="w1" from="right" flash={blueFlash} seed={1}>
          <Exit f={f} next="c2">
            <Hero f={h('h1')} seq="clock" seed={1} pill={{x: 1130, y: 300}} />
          </Exit>
        </BlockWipe>
      )}
      {on(f, 'c2') && (
        <BlockWipe p={wipeP(f, 'c2')} id="w2" from="left" flash={greyFlash} seed={2}>
          <Exit f={f} next="h2">
            <Collage2 f={c('c2')} />
          </Exit>
        </BlockWipe>
      )}
      {on(f, 'h2') && (
        <BlockWipe p={wipeP(f, 'h2')} id="w3" from="right" flash={blueFlash} seed={3}>
          <Exit f={f} next="c3">
            <Hero f={h('h2')} seq="pwatch" seed={2} pill={{x: 1150, y: 280}} />
          </Exit>
        </BlockWipe>
      )}
      {on(f, 'c3') && (
        <BlockWipe p={wipeP(f, 'c3')} id="w4" from="left" flash={greyFlash} seed={4}>
          <Exit f={f} next="h3">
            <Collage3 f={c('c3')} />
          </Exit>
        </BlockWipe>
      )}
      {on(f, 'h3') && (
        <BlockWipe p={wipeP(f, 'h3')} id="w5" from="right" flash={blueFlash} seed={5}>
          <Exit f={f} next="c4">
            <Hero f={h('h3')} seq="laptop" seed={3} pill={{x: 1180, y: 250}} />
          </Exit>
        </BlockWipe>
      )}
      {on(f, 'c4') && (
        <BlockWipe p={wipeP(f, 'c4')} id="w6" from="left" flash={greyFlash} seed={6}>
          <Exit f={f} next="bloom">
            <Collage4 f={c('c4')} />
          </Exit>
        </BlockWipe>
      )}
      {on(f, 'bloom') && (
        <BlockWipe p={wipeP(f, 'bloom')} id="w7" from="bottom" flash={redFlash} seed={7}>
          <Bloom f={local(f, 'bloom') * PACE.bloom} />
        </BlockWipe>
      )}
      {on(f, 'chat') && (
        <AbsoluteFill style={{clipPath: `circle(${interpolate(reveal, [0, 1], [190, 1200])}px at ${ORB.x}px ${ORB.y}px)`}}>
          <Chat f={ci} len={chatLen} />
        </AbsoluteFill>
      )}
      {on(f, 'chat') && (
        <div
          style={{
            position: 'absolute',
            left: interpolate(toAvatar, [0, 1], [ORB.x, CHAT_AVATAR.x + 17]),
            top: interpolate(toAvatar, [0, 1], [ORB.y, CHAT_AVATAR.y + 32 + lift]),
            opacity: interpolate(ci, [chatLen - 14, chatLen], [1, 0], clamp),
          }}
        >
          <Orb t={f / 30} r={interpolate(toAvatar, [0, 1], [190, 17])} glow={interpolate(toAvatar, [0, 1], [1, 0.35])} />
        </div>
      )}
      {on(f, 'outro') && <Outro f={local(f, 'outro') * PACE.outro} />}
    </AbsoluteFill>
  );
};
