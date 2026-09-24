import './loadFonts';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {Captions} from './components/Captions';
import {EndCard} from './components/EndCard';
import {Grain, Vignette} from './components/Grain';
import {Phone, SCREEN_W} from './components/Phone';
import {TapIndicator} from './components/TapIndicator';
import {CalendarScreen, CONTINUE_TAP, DATE_TAP, SLOT_TAP} from './screens/CalendarScreen';
import {ConfirmScreen} from './screens/ConfirmScreen';
import {CONFIRM_TAP, DetailScreen} from './screens/DetailScreen';
import {BOOK_BUTTON, HomeScreen} from './screens/HomeScreen';
import {colors} from './theme';
import {progress, t} from './timeline';

const taps = [
  {frame: t.tapBook, ...BOOK_BUTTON},
  {frame: t.tapDate, ...DATE_TAP},
  {frame: t.tapSlot, ...SLOT_TAP},
  {frame: t.tapContinue, ...CONTINUE_TAP},
  {frame: t.tapConfirm, ...CONFIRM_TAP},
];

/** iOS-style push: incoming slides in from the right, outgoing parallaxes left and dims. */
const Pushed: React.FC<{enter: number | null; exit: number | null; children: React.ReactNode}> = ({
  enter,
  exit,
  children,
}) => {
  const frame = useCurrentFrame();
  const inP = enter === null ? 1 : progress(frame, enter);
  const outP = exit === null ? 0 : progress(frame, exit);
  if (inP <= 0 || outP >= 1) return null;
  const x = (1 - inP) * SCREEN_W - outP * SCREEN_W * 0.3;
  return (
    <AbsoluteFill
      style={{
        transform: `translateX(${x}px)`,
        boxShadow: enter !== null && inP < 1 ? '-12px 0 30px rgba(62,47,35,0.12)' : 'none',
      }}
    >
      {children}
      <AbsoluteFill style={{background: colors.espresso, opacity: outP * 0.12}} />
    </AbsoluteFill>
  );
};

const Screens: React.FC = () => {
  const frame = useCurrentFrame();
  const confirmP = progress(frame, t.confirmIn);
  return (
    <>
      <Pushed enter={null} exit={t.calendarIn}>
        <HomeScreen />
      </Pushed>
      <Pushed enter={t.calendarIn} exit={t.detailIn}>
        <CalendarScreen />
      </Pushed>
      {confirmP < 1 && (
        <Pushed enter={t.detailIn} exit={null}>
          <DetailScreen />
        </Pushed>
      )}
      {confirmP > 0 && (
        <AbsoluteFill style={{opacity: confirmP, transform: `scale(${0.98 + 0.02 * confirmP})`}}>
          <ConfirmScreen />
        </AbsoluteFill>
      )}
      <TapIndicator taps={taps} />
    </>
  );
};

export const WellnessAppWalkthrough: React.FC = () => {
  const frame = useCurrentFrame();

  const phoneIn = progress(frame, t.phoneIn, 24);
  const screenOn = progress(frame, t.phoneIn + 12, 12);
  const phoneOut = progress(frame, t.endIn - 3, 12);
  // Gentle camera drift across the walkthrough.
  const drift = interpolate(frame, [0, t.endIn], [1, 1.03], {extrapolateRight: 'clamp'});

  return (
    <AbsoluteFill style={{background: colors.cream}}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 45% 60% at 36% 52%, #FFFDF9 0%, rgba(255,253,249,0) 70%),
            radial-gradient(ellipse 40% 50% at 85% 90%, rgba(184,166,145,0.18) 0%, rgba(184,166,145,0) 70%)`,
        }}
      />
      <AbsoluteFill style={{transform: `scale(${drift})`}}>
        <div
          style={{
            position: 'absolute',
            left: 700 - 213,
            top: 540 - 446,
            opacity: phoneIn * (1 - phoneOut),
            transform: `translateY(${(1 - phoneIn) * 40}px) scale(${1 - 0.03 * phoneOut})`,
          }}
        >
          <Phone>
            <div style={{position: 'absolute', inset: 0, opacity: screenOn}}>
              <Screens />
            </div>
          </Phone>
        </div>
        <Captions />
      </AbsoluteFill>
      <EndCard />
      <Vignette />
      <Grain />
    </AbsoluteFill>
  );
};
