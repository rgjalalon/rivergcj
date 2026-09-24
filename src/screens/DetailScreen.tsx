import {interpolate, useCurrentFrame} from 'remotion';
import {StatusBar} from '../components/StatusBar';
import {Check, ChevronLeft, ClockIcon, ImageIcon} from '../components/Icons';
import {HomeIndicator} from './CalendarScreen';
import {copy} from '../copy';
import {colors, fonts} from '../theme';
import {pressScale, progress, t} from '../timeline';

export const CONFIRM_TAP = {x: 286, y: 806};

export const DetailScreen: React.FC = () => {
  const frame = useCurrentFrame();
  const local = frame - t.detailIn;
  // Slow drift on the hero image, like a gentle parallax.
  const heroScale = interpolate(local, [0, 200], [1.06, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  // Content is already laid out as the screen pushes in; only a light settle.
  const item = (i: number) => {
    const p = progress(frame, t.detailIn + i * 2, 14);
    return {opacity: 0.4 + 0.6 * p, transform: `translateY(${(1 - p) * 6}px)`};
  };

  return (
    <div style={{position: 'absolute', inset: 0, background: colors.paper, fontFamily: fonts.sans}}>
      {/* Hero image placeholder */}
      <div style={{position: 'absolute', left: 0, top: 0, width: 400, height: 330, overflow: 'hidden'}}>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            transform: `scale(${heroScale})`,
            background: `radial-gradient(circle at 70% 30%, #E7D8C4 0%, rgba(231,216,196,0) 55%),
              linear-gradient(160deg, ${colors.taupe} 0%, ${colors.caramel} 100%)`,
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            color: 'rgba(245,240,232,0.75)',
            fontSize: 12,
            letterSpacing: 1.5,
            textTransform: 'uppercase',
          }}
        >
          <ImageIcon color="rgba(245,240,232,0.75)" />
          Treatment image
        </div>
      </div>
      <StatusBar tone="light" />
      <div
        style={{
          position: 'absolute',
          top: 60,
          left: 20,
          width: 40,
          height: 40,
          borderRadius: 20,
          background: 'rgba(245,240,232,0.85)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <ChevronLeft color={colors.espresso} size={20} />
      </div>

      {/* Content sheet */}
      <div
        style={{
          position: 'absolute',
          top: 300,
          left: 0,
          right: 0,
          bottom: 0,
          background: colors.paper,
          borderRadius: '28px 28px 0 0',
          padding: '26px 24px 0',
        }}
      >
        <div style={{...item(0), fontSize: 11, letterSpacing: 1.6, textTransform: 'uppercase', color: colors.caramel, fontWeight: 600}}>
          {copy.treatmentCategory}
        </div>
        <div style={{...item(1), fontFamily: fonts.serif, fontSize: 30, color: colors.espresso, marginTop: 8}}>
          {copy.treatment}
        </div>
        <div style={{...item(2), display: 'flex', gap: 8, marginTop: 12}}>
          {copy.treatmentMeta.map((m) => (
            <div
              key={m}
              style={{
                fontSize: 12,
                color: colors.espresso,
                padding: '6px 10px',
                borderRadius: 12,
                background: colors.cream,
                border: `1px solid ${colors.line}`,
              }}
            >
              {m}
            </div>
          ))}
        </div>
        <div style={{...item(3), fontSize: 14, lineHeight: 1.55, color: '#6B5C4E', marginTop: 16}}>
          {copy.treatmentDescription}
        </div>
        <div style={{...item(4), marginTop: 18}}>
          {copy.included.map((line) => (
            <div key={line} style={{display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10, fontSize: 14, color: colors.espresso}}>
              <div
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: 11,
                  background: '#F3E6D6',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Check color={colors.caramel} size={13} />
              </div>
              {line}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          height: 126,
          background: '#FFFFFF',
          borderTop: `1px solid ${colors.line}`,
          boxShadow: '0 -10px 30px rgba(62,47,35,0.05)',
        }}
      >
        <div style={{position: 'absolute', left: 24, top: 14, display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: colors.muted}}>
          <ClockIcon color={colors.caramel} size={13} />
          {copy.dateLabel} · {copy.time}
        </div>
        <div style={{position: 'absolute', left: 24, top: 42}}>
          <div style={{fontFamily: fonts.serif, fontSize: 30, color: colors.espresso, lineHeight: 1}}>{copy.price}</div>
          <div style={{fontSize: 12, color: colors.muted, marginTop: 5}}>{copy.priceNote}</div>
        </div>
        <div
          style={{
            position: 'absolute',
            left: CONFIRM_TAP.x - 90,
            top: CONFIRM_TAP.y - (866 - 126) - 28,
            width: 180,
            height: 56,
            borderRadius: 28,
            background: colors.espresso,
            color: colors.cream,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 600,
            fontSize: 15.5,
            boxShadow: '0 10px 24px rgba(62,47,35,0.2)',
            transform: `scale(${pressScale(frame, t.tapConfirm)})`,
          }}
        >
          Confirm booking
        </div>
        <HomeIndicator />
      </div>
    </div>
  );
};
