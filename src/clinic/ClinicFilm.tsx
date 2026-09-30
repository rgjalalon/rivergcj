import '../loadFonts';
import {AbsoluteFill, Easing, getStaticFiles, Html5Audio, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {Grain} from '../components/Grain';
import {fonts} from '../theme';
import {Live} from './Live';
import {ScreenShot} from './Screen';
import {Cut, CUTS, edits, MUSIC} from './timeline';

// "18:00": one doctor, one afternoon. Opens on the outcome, rewinds to 14:10,
// shows each piece of after-work being drafted, edited and approved on screen,
// and returns to the empty clinic. The product name appears only on the end card.
export const ClinicFilm: React.FC<{cut: Cut}> = ({cut}) => {
  const frame = useCurrentFrame();
  const {w, h} = CUTS[cut];
  const vertical = cut === 'vertical';
  const {shots} = edits[cut];
  const shot = shots.find((s) => frame >= s.from && frame < s.to) ?? shots[shots.length - 1];
  const sound = `wai/clinic/sound-${cut === 'vertical' ? 'short' : cut}.wav`;
  const music = `wai/clinic/music/${MUSIC.id}.mp3`;
  const {fps, durationInFrames} = useVideoConfig();
  const musicStart = (cut === 'master' ? MUSIC.startMaster : MUSIC.startShort) * fps;
  // Score sits under the room tone: fades in, then fades out across the end card.
  const musicVolume = (f: number) =>
    MUSIC.volume *
    Math.min(
      interpolate(f, [0, 1.5 * fps], [0, 1], {extrapolateRight: 'clamp'}),
      interpolate(f, [durationInFrames - 2.5 * fps, durationInFrames - 2], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
    );

  return (
    <AbsoluteFill style={{background: '#000'}}>
      {shot.kind === 'live' ? <Live key={shot.n} id={shot.id} start={shot.start} n={shot.n} from={shot.from} to={shot.to} width={w} height={h} /> : null}
      {shot.kind === 'screen' ? (
        <ScreenShot
          key={shot.n}
          doc={shot.doc}
          phase={shot.phase}
          framing={shot.framing}
          light={shot.light}
          from={shot.from}
          to={shot.to}
          width={w}
          height={h}
          vertical={vertical}
        />
      ) : null}
      {shot.kind === 'end' ? <EndCard from={shot.from} vertical={vertical} /> : null}
      {/* Whole-film grade: warm, desaturated, gentle vignette. */}
      <AbsoluteFill style={{background: 'rgba(120,90,60,0.06)', mixBlendMode: 'soft-light', pointerEvents: 'none'}} />
      <AbsoluteFill
        style={{
          pointerEvents: 'none',
          background: 'radial-gradient(ellipse 85% 80% at 50% 50%, rgba(0,0,0,0) 60%, rgba(30,20,12,0.28) 100%)',
        }}
      />
      <Supers cut={cut} />
      {/* Grain on footage only: over flat UI it reads as flicker. */}
      {shot.kind === 'live' ? <Grain width={w} height={h} opacity={0.07} /> : null}
      {getStaticFiles().some((f) => f.name === sound) ? <Html5Audio src={staticFile(sound)} volume={0.6} /> : null}
      {getStaticFiles().some((f) => f.name === music) ? (
        <Html5Audio src={staticFile(music)} trimBefore={Math.round(musicStart)} volume={musicVolume} />
      ) : null}
    </AbsoluteFill>
  );
};

/** Minimal on-screen text: quiet, set low (upper-middle in vertical), fades in and out. */
const Supers: React.FC<{cut: Cut}> = ({cut}) => {
  const frame = useCurrentFrame();
  const vertical = cut === 'vertical';
  const s = edits[cut].supers.find((x) => frame >= x.from && frame < x.to);
  if (!s) return null;
  const o = Math.min(
    interpolate(frame, [s.from, s.from + 10], [0, 1], {extrapolateRight: 'clamp'}),
    interpolate(frame, [s.to - 10, s.to], [1, 0], {extrapolateLeft: 'clamp'}),
  );
  const isTime = /^\d\d:\d\d$/.test(s.text);
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        ...(vertical ? {top: 70} : {bottom: 120}),
        display: 'flex',
        justifyContent: 'center',
        opacity: o,
      }}
    >
      <div
        style={{
          fontFamily: fonts.sans,
          fontWeight: 500,
          fontSize: vertical ? 56 : 42,
          letterSpacing: isTime ? 3 : -0.2,
          fontVariantNumeric: 'tabular-nums',
          color: 'rgba(252,249,244,0.98)',
          padding: vertical ? '18px 40px' : '14px 34px',
          borderRadius: 999,
          background: 'rgba(24,20,16,0.5)',
          backdropFilter: 'blur(14px)',
          boxShadow: '0 10px 30px rgba(0,0,0,0.18)',
          transform: `translateY(${(1 - o) * 8}px)`,
        }}
      >
        {s.text}
      </div>
    </div>
  );
};

const EndCard: React.FC<{from: number; vertical: boolean}> = ({from, vertical}) => {
  const frame = useCurrentFrame() - from;
  const ease = {easing: Easing.bezier(0.25, 0.1, 0.25, 1), extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};
  const bg = interpolate(frame, [0, 14], [0, 1], ease);
  const logo = interpolate(frame, [12, 42], [0, 1], ease);
  const scale = interpolate(frame, [12, 90], [0.97, 1], ease);
  return (
    <AbsoluteFill
      style={{
        opacity: bg,
        background: 'radial-gradient(ellipse 70% 55% at 50% 48%, #2B241E 0%, #1A1612 70%, #120F0C 100%)',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Img src={staticFile('wai/wai-logo-cream.png')} style={{width: vertical ? 480 : 440, opacity: logo, transform: `scale(${scale})`}} />
    </AbsoluteFill>
  );
};
