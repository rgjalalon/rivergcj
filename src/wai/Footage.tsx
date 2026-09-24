import {AbsoluteFill, getStaticFiles, interpolate, OffthreadVideo, staticFile, useCurrentFrame} from 'remotion';
import {colors, fonts} from '../theme';
import {footage, FootageId} from './timeline';

const hasClip = (id: FootageId) =>
  getStaticFiles().some((f) => f.name === `wai/footage/${id}.mp4`);

/**
 * A real-life footage slot with the Wai grade applied: warm, slightly lifted
 * blacks, brown undertones. Falls back to a graded placeholder when no clip is
 * provided yet.
 */
export const Footage: React.FC<{id: FootageId; from: number; to: number; push?: number; compact?: boolean}> = ({
  id,
  from,
  to,
  push = 0.06,
  compact = false,
}) => {
  const frame = useCurrentFrame();
  const scale = interpolate(frame, [from, to], [1, 1 + push], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  return (
    <AbsoluteFill style={{overflow: 'hidden', background: colors.espresso}}>
      <AbsoluteFill
        style={{
          transform: `scale(${scale})`,
          filter: 'sepia(0.2) saturate(0.88) contrast(1.05) brightness(0.98)',
        }}
      >
        {hasClip(id) ? (
          <OffthreadVideo src={staticFile(`wai/footage/${id}.mp4`)} muted style={{width: '100%', height: '100%', objectFit: 'cover'}} />
        ) : (
          <Placeholder id={id} from={from} compact={compact} />
        )}
      </AbsoluteFill>
      {/* Grade: caramel warmth in the highlights, espresso in the shadows. */}
      <AbsoluteFill style={{background: 'linear-gradient(170deg, rgba(200,155,109,0.28) 0%, rgba(200,155,109,0) 55%)', mixBlendMode: 'soft-light'}} />
      <AbsoluteFill style={{background: 'linear-gradient(0deg, rgba(62,47,35,0.45) 0%, rgba(62,47,35,0) 45%)', mixBlendMode: 'multiply'}} />
      <AbsoluteFill style={{background: 'rgba(245,240,232,0.04)'}} />
    </AbsoluteFill>
  );
};

const Placeholder: React.FC<{id: FootageId; from: number; compact: boolean}> = ({id, from, compact}) => {
  const frame = useCurrentFrame() - from;
  const [dark, mid, light] = footage[id].tones;
  // Slow drifting light, so the slot reads as moving footage in the animatic.
  const blobs = [
    {x: 30 + Math.sin(frame / 40) * 6, y: 28 + frame * 0.05, r: 900, c: light, o: 0.85},
    {x: 78 - frame * 0.04, y: 62 + Math.cos(frame / 50) * 5, r: 700, c: mid, o: 0.7},
    {x: 50, y: 95, r: 1100, c: dark, o: 0.9},
  ];
  return (
    <AbsoluteFill style={{background: `linear-gradient(165deg, ${light} 0%, ${mid} 45%, ${dark} 100%)`}}>
      {blobs.map((b, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: `${b.x}%`,
            top: `${b.y}%`,
            width: b.r,
            height: b.r,
            marginLeft: -b.r / 2,
            marginTop: -b.r / 2,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${b.c} 0%, rgba(0,0,0,0) 65%)`,
            opacity: b.o,
          }}
        />
      ))}
      <div
        style={{
          position: 'absolute',
          left: compact ? 24 : 64,
          right: compact ? 24 : 64,
          bottom: compact ? 20 : 150,
          fontFamily: fonts.sans,
          color: 'rgba(245,240,232,0.55)',
          fontSize: compact ? 16 : 24,
          letterSpacing: compact ? 2 : 3,
          textTransform: 'uppercase',
          lineHeight: 1.6,
        }}
      >
        <div style={{fontWeight: 600}}>Footage · {id}</div>
        {!compact && <div style={{textTransform: 'none', letterSpacing: 0.5, fontSize: 26}}>{footage[id].brief}</div>}
      </div>
    </AbsoluteFill>
  );
};
