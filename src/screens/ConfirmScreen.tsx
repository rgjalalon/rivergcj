import {interpolate, useCurrentFrame} from 'remotion';
import {StatusBar} from '../components/StatusBar';
import {HomeIndicator} from './CalendarScreen';
import {ClockIcon, PinIcon} from '../components/Icons';
import {copy} from '../copy';
import {colors, fonts, softShadow} from '../theme';
import {easeOut, progress, t} from '../timeline';

const CHECK_LEN = 60;
const RING_LEN = 2 * Math.PI * 52;

export const ConfirmScreen: React.FC = () => {
  const frame = useCurrentFrame();
  const start = t.confirmIn + 6;
  const ring = interpolate(frame, [start, start + 22], [0, 1], {
    easing: easeOut,
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const fill = progress(frame, start + 14, 12);
  const check = interpolate(frame, [start + 16, start + 30], [0, 1], {
    easing: easeOut,
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const item = (i: number) => {
    const p = progress(frame, start + 22 + i * 4, 12);
    return {opacity: p, transform: `translateY(${(1 - p) * 12}px)`};
  };

  return (
    <div style={{position: 'absolute', inset: 0, background: colors.paper, fontFamily: fonts.sans}}>
      <StatusBar />

      <svg width="120" height="120" viewBox="0 0 120 120" style={{position: 'absolute', left: 140, top: 150}}>
        <circle cx="60" cy="60" r="52" fill="#F3E6D6" opacity={fill} />
        <circle
          cx="60"
          cy="60"
          r="52"
          fill="none"
          stroke={colors.caramel}
          strokeWidth="2.5"
          strokeDasharray={RING_LEN}
          strokeDashoffset={RING_LEN * (1 - ring)}
          transform="rotate(-90 60 60)"
          strokeLinecap="round"
        />
        <path
          d="M40 61 L54 75 L81 46"
          fill="none"
          stroke={colors.espresso}
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={CHECK_LEN}
          strokeDashoffset={CHECK_LEN * (1 - check)}
        />
      </svg>

      <div style={{position: 'absolute', top: 300, left: 24, right: 24, textAlign: 'center'}}>
        <div style={{...item(0), fontFamily: fonts.serif, fontSize: 32, color: colors.espresso}}>You’re booked in</div>
        <div style={{...item(1), fontSize: 15, color: colors.muted, marginTop: 10}}>
          {copy.dateLong} at {copy.time}
        </div>
      </div>

      <div
        style={{
          ...item(2),
          position: 'absolute',
          top: 410,
          left: 24,
          width: 352,
          borderRadius: 24,
          background: '#FFFFFF',
          boxShadow: softShadow,
          padding: '20px 22px',
          boxSizing: 'border-box',
        }}
      >
        <div style={{fontFamily: fonts.serif, fontSize: 20, color: colors.espresso}}>{copy.treatment}</div>
        <div style={{height: 1, background: colors.line, margin: '16px 0'}} />
        {[
          {Icon: ClockIcon, text: `${copy.dateLabel} · ${copy.time} · 45 min`},
          {Icon: PinIcon, text: copy.location},
        ].map(({Icon, text}) => (
          <div key={text} style={{display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: colors.espresso, marginBottom: 12}}>
            <Icon color={colors.caramel} size={16} />
            {text}
          </div>
        ))}
        <div
          style={{
            marginTop: 6,
            padding: '12px 14px',
            borderRadius: 14,
            background: colors.cream,
            fontSize: 13,
            lineHeight: 1.5,
            color: '#6B5C4E',
          }}
        >
          Your personal health plan will be ready 48 hours after your visit.
        </div>
      </div>

      <div style={{...item(3), position: 'absolute', left: 24, top: 700, width: 352}}>
        <div
          style={{
            height: 56,
            borderRadius: 28,
            background: colors.espresso,
            color: colors.cream,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 600,
            fontSize: 15.5,
          }}
        >
          Add to calendar
        </div>
        <div style={{textAlign: 'center', marginTop: 18, fontSize: 15, fontWeight: 500, color: colors.espresso}}>Done</div>
      </div>

      <HomeIndicator />
    </div>
  );
};
