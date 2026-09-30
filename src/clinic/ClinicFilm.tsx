import '../loadFonts';
import {AbsoluteFill, getStaticFiles, Html5Audio, Img, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {Grain} from '../components/Grain';
import {fonts} from '../theme';
import {Live} from './Live';
import {ScreenShot} from './Screen';
import {Cut, CUTS, edits} from './timeline';

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
      <Grain width={w} height={h} opacity={0.07} />
      {getStaticFiles().some((f) => f.name === sound) ? <Html5Audio src={staticFile(sound)} /> : null}
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
          fontWeight: 400,
          fontSize: vertical ? 64 : 48,
          letterSpacing: isTime ? 4 : 0.2,
          fontVariantNumeric: 'tabular-nums',
          color: 'rgba(250,246,240,0.96)',
          padding: '14px 34px',
          borderRadius: 6,
          background: 'rgba(22,18,14,0.66)',
          textShadow: '0 2px 18px rgba(0,0,0,0.35)',
        }}
      >
        {s.text}
      </div>
    </div>
  );
};

const EndCard: React.FC<{from: number; vertical: boolean}> = ({from, vertical}) => {
  const frame = useCurrentFrame() - from;
  const bg = interpolate(frame, [0, 12], [0, 1], {extrapolateRight: 'clamp'});
  const logo = interpolate(frame, [10, 34], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const line = interpolate(frame, [30, 52], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill
      style={{
        opacity: bg,
        background: 'radial-gradient(ellipse 70% 55% at 50% 48%, #2B241E 0%, #1A1612 70%, #120F0C 100%)',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Img src={staticFile('wai/wai-logo-cream.png')} style={{width: vertical ? 480 : 420, opacity: logo}} />
      <div
        style={{
          marginTop: vertical ? 64 : 52,
          fontFamily: fonts.sans,
          fontSize: vertical ? 38 : 32,
          letterSpacing: 1,
          color: 'rgba(245,240,232,0.7)',
          opacity: line,
        }}
      >
        Clinical assistant
      </div>
    </AbsoluteFill>
  );
};
