import {AbsoluteFill, getStaticFiles, interpolate, OffthreadVideo, staticFile, useCurrentFrame} from 'remotion';
import {fonts} from '../theme';
import {Light, live, LiveId} from './timeline';

const clipPath = (id: LiveId) => `wai/clinic/${id}.mp4`;
const hasClip = (id: LiveId) => getStaticFiles().some((f) => f.name === clipPath(id));

const clamp = (x: number) => Math.min(1, Math.max(0, x));
const step = (p: number, at: number, len = 0.06) => clamp((p - at) / len);

/**
 * A live-action slot with the film's grade: warm, desaturated, soft blacks.
 * Until the clip exists it shows a lit placeholder of the shot plus its brief.
 */
export const Live: React.FC<{id: LiveId; n: number; from: number; to: number; width: number; height: number}> = ({
  id,
  n,
  from,
  to,
  width,
  height,
}) => {
  const frame = useCurrentFrame();
  const p = clamp((frame - from) / (to - from));
  // Handheld-but-steady drift; exteriors are locked off.
  const locked = id === 'ext-window' || id === 'ext-exit' || id === 'desk-1800';
  const dx = locked ? 0 : Math.sin(frame / 43) * 6;
  const dy = locked ? 0 : Math.sin(frame / 31 + 2) * 4;
  const push = locked ? 1 : interpolate(p, [0, 1], [1.02, 1.05]);
  return (
    <AbsoluteFill style={{overflow: 'hidden', background: '#14110E'}}>
      <AbsoluteFill style={{transform: `translate(${dx}px, ${dy}px) scale(${push})`, filter: 'saturate(0.78) sepia(0.12) contrast(1.02)'}}>
        {hasClip(id) ? (
          <OffthreadVideo src={staticFile(clipPath(id))} muted style={{width: '100%', height: '100%', objectFit: 'cover'}} />
        ) : (
          <Placeholder id={id} p={p} width={width} height={height} />
        )}
      </AbsoluteFill>
      {/* Grade: warm highlights, lifted warm shadows. */}
      <AbsoluteFill style={{background: 'linear-gradient(160deg, rgba(214,170,120,0.18) 0%, rgba(214,170,120,0) 60%)', mixBlendMode: 'soft-light'}} />
      <AbsoluteFill style={{background: 'rgba(40,30,22,0.06)'}} />
      {hasClip(id) ? null : <Slate id={id} n={n} vertical={height > width} />}
    </AbsoluteFill>
  );
};

const Slate: React.FC<{id: LiveId; n: number; vertical: boolean}> = ({id, n, vertical}) => (
  <div
    style={{
      position: 'absolute',
      left: vertical ? 60 : 72,
      right: vertical ? 60 : 72,
      top: vertical ? 1560 : 60,
      fontFamily: fonts.sans,
      color: 'rgba(245,240,232,0.62)',
    }}
  >
    <div style={{fontSize: vertical ? 22 : 20, letterSpacing: 3, textTransform: 'uppercase', fontWeight: 600}}>
      Live action · shot {String(n).padStart(2, '0')} · {id}
    </div>
    <div style={{fontSize: vertical ? 28 : 24, marginTop: 8, maxWidth: 1100, lineHeight: 1.4}}>{live[id].brief}</div>
  </div>
);

const room: Record<Light, {wall: string; floor: string; spill: string}> = {
  day: {wall: '#A9ABA2', floor: '#6E6A60', spill: 'rgba(255,252,240,0.75)'},
  warm: {wall: '#A89C8A', floor: '#6B5F50', spill: 'rgba(255,226,180,0.7)'},
  late: {wall: '#8C6F52', floor: '#4E3C2D', spill: 'rgba(255,176,98,0.7)'},
  amber: {wall: '#7A5C42', floor: '#3E2F23', spill: 'rgba(255,170,90,0.65)'},
  corridor: {wall: '#5B5248', floor: '#2F2924', spill: 'rgba(255,236,200,0.6)'},
  dusk: {wall: '#3A4450', floor: '#23262B', spill: 'rgba(255,205,140,0.9)'},
};

/** Blocked-out stand-in for the shot: light, set and the one action that matters. */
const Placeholder: React.FC<{id: LiveId; p: number; width: number; height: number}> = ({id, p, width, height}) => {
  const {light, fx} = live[id];
  const c = room[light];
  const W = width;
  const H = height;

  if (light === 'dusk') {
    const off = step(p, 0.45);
    const walker = id === 'ext-exit' ? clamp((p - 0.5) / 0.5) : -1;
    const bw = Math.min(W * 0.7, 1100);
    return (
      <AbsoluteFill style={{background: 'linear-gradient(180deg, #2C3645 0%, #4C5663 55%, #5A5A5C 70%, #26272A 100%)'}}>
        {/* Building facade and the one lit window */}
        <div style={{position: 'absolute', left: (W - bw) / 2, top: H * 0.18, width: bw, height: H * 0.56, background: '#2B2E33'}} />
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: (W - bw) / 2 + bw * (0.1 + i * 0.3),
              top: H * 0.3,
              width: bw * 0.2,
              height: H * 0.22,
              background: i === 1 ? `rgba(240,196,130,${1 - off * 0.92})` : '#1E2126',
              boxShadow: i === 1 ? `0 0 ${80 * (1 - off)}px rgba(255,190,110,${0.5 * (1 - off)})` : 'none',
            }}
          />
        ))}
        <div style={{position: 'absolute', left: (W - bw) / 2 + bw * 0.42, top: H * 0.56, width: bw * 0.16, height: H * 0.18, background: '#1A1C20'}} />
        <div style={{position: 'absolute', left: 0, right: 0, top: H * 0.74, height: 3, background: 'rgba(255,255,255,0.08)'}} />
        {walker >= 0 ? <Figure x={(W - bw) / 2 + bw * 0.5 + walker * W * 0.35} y={H * 0.74} h={H * 0.2} coat /> : null}
      </AbsoluteFill>
    );
  }

  if (light === 'corridor') {
    const off = fx === 'lightOff' ? step(p, 0.6, 0.04) : 0;
    return (
      <AbsoluteFill style={{background: c.wall}}>
        <div style={{position: 'absolute', inset: 0, background: `radial-gradient(ellipse 45% 30% at 50% 0%, ${c.spill} 0%, rgba(0,0,0,0) 70%)`}} />
        {/* Receding corridor */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: c.floor,
            clipPath: `polygon(0 100%, 100% 100%, 58% 58%, 42% 58%)`,
          }}
        />
        <div style={{position: 'absolute', left: W * 0.44, top: H * 0.3, width: W * 0.12, height: H * 0.28, background: '#8C8274'}} />
        <div style={{position: 'absolute', left: W * 0.8, top: H * 0.46, width: 26, height: 40, borderRadius: 4, background: '#D8D0C2'}} />
        <Figure x={W * 0.62} y={H * 0.98} h={H * 0.62} coat />
        <AbsoluteFill style={{background: `rgba(10,8,6,${0.78 * off})`}} />
      </AbsoluteFill>
    );
  }

  // Interiors: consult room / desk, window light from the left through blinds.
  const on = fx === 'lightOn' ? step(p, 0.3, 0.05) : 1;
  const blinds = fx === 'lightOn' ? interpolate(p, [0.35, 0.9], [0.2, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}) : 1;
  const desk = id === 'desk-1800' || id === 'desk-close' || id === 'switch-on';
  const door = fx === 'door' ? clamp((p - 0.25) / 0.2) : 0;
  const lid = fx === 'laptop' ? clamp((p - 0.25) / 0.25) : id === 'desk-1800' ? 1 : 0;
  return (
    <AbsoluteFill style={{background: c.wall}}>
      <AbsoluteFill
        style={{
          background: `repeating-linear-gradient(172deg, ${c.spill} 0px, ${c.spill} ${22 * blinds}px, rgba(0,0,0,0) ${22 * blinds}px, rgba(0,0,0,0) 34px)`,
          opacity: 0.35,
          maskImage: 'linear-gradient(90deg, #000 0%, rgba(0,0,0,0) 70%)',
          WebkitMaskImage: 'linear-gradient(90deg, #000 0%, rgba(0,0,0,0) 70%)',
        }}
      />
      {desk ? (
        <>
          <div style={{position: 'absolute', left: 0, right: 0, top: H * 0.62, bottom: 0, background: c.floor}} />
          {/* Laptop: lid height shrinks as it closes */}
          <div style={{position: 'absolute', left: W * 0.36, top: H * 0.66, width: W * 0.28, height: H * 0.05, background: '#2A2724', borderRadius: 6}} />
          <div
            style={{
              position: 'absolute',
              left: W * 0.37,
              width: W * 0.26,
              top: H * 0.66 - H * 0.26 * (1 - lid),
              height: Math.max(6, H * 0.26 * (1 - lid)),
              background: lid < 1 ? 'linear-gradient(180deg, #DDE3E0 0%, #B9C3BF 100%)' : '#2A2724',
              border: '6px solid #1B1917',
              borderRadius: 6,
            }}
          />
          <div style={{position: 'absolute', left: W * 0.68, top: H * 0.72, width: W * 0.12, height: 6, background: '#1D1B19', borderRadius: 3}} />
        </>
      ) : (
        <>
          <div style={{position: 'absolute', left: 0, right: 0, top: H * 0.78, bottom: 0, background: c.floor}} />
          {/* Door on the right, swinging shut */}
          <div style={{position: 'absolute', left: W * 0.72, top: H * 0.2, width: W * 0.16, height: H * 0.58, background: '#3A332C'}} />
          <div
            style={{
              position: 'absolute',
              left: W * 0.72,
              top: H * 0.2,
              width: W * 0.16 * door,
              height: H * 0.58,
              background: '#CFC6B8',
              boxShadow: 'inset -6px 0 0 rgba(0,0,0,0.15)',
            }}
          />
          {door < 0.6 ? <Figure x={W * 0.78} y={H * 0.78} h={H * 0.5} opacity={1 - door / 0.6} /> : null}
          <Figure x={W * 0.3} y={H * 0.98} h={H * 0.55} />
          {/* Desk in front of the doctor, window on the left wall */}
          <div style={{position: 'absolute', left: W * 0.14, top: H * 0.66, width: W * 0.4, height: H * 0.2, background: '#5A4E42', boxShadow: 'inset 0 10px 0 #6B5D4F'}} />
          <div style={{position: 'absolute', left: W * 0.03, top: H * 0.16, width: W * 0.12, height: H * 0.42, background: c.spill, opacity: 0.8}} />
        </>
      )}
      <AbsoluteFill style={{background: `rgba(12,10,8,${0.72 * (1 - on)})`}} />
    </AbsoluteFill>
  );
};

/** A soft, featureless figure; the real performance comes from the footage. */
const Figure: React.FC<{x: number; y: number; h: number; coat?: boolean; opacity?: number}> = ({x, y, h, coat, opacity = 1}) => (
  <div style={{position: 'absolute', left: x - h * 0.16, top: y - h, width: h * 0.32, height: h, opacity, filter: 'blur(1.5px)'}}>
    <div style={{position: 'absolute', left: '32%', top: 0, width: '36%', height: '18%', borderRadius: '50%', background: '#2A231E'}} />
    <div style={{position: 'absolute', left: 0, top: '19%', width: '100%', height: '81%', borderRadius: '40% 40% 8% 8%', background: '#2A231E'}} />
    {coat ? <div style={{position: 'absolute', left: '-18%', top: '42%', width: '42%', height: '30%', borderRadius: 12, background: '#4A3E33'}} /> : null}
  </div>
);
