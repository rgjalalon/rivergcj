import {useCurrentFrame} from 'remotion';
import {copy} from '../copy';
import {colors, fonts} from '../theme';
import {captionWindows, progress, T300} from '../timeline';

const labels = ['Home', 'Booking', 'Treatment', 'Confirmation'];

export const Captions: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <>
      {copy.captions.map((c, i) => {
        const [start, end] = captionWindows[i];
        const inP = progress(frame, start + 6, 14);
        const outP = progress(frame, end - T300, T300);
        const opacity = inP * (1 - outP);
        if (opacity <= 0) return null;
        const y = (1 - inP) * 18 - outP * 10;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: 1060,
              top: 0,
              bottom: 0,
              width: 720,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              opacity,
              transform: `translateY(${y}px)`,
            }}
          >
            <div
              style={{
                fontFamily: fonts.sans,
                fontSize: 17,
                fontWeight: 500,
                letterSpacing: 3,
                textTransform: 'uppercase',
                color: colors.caramel,
                display: 'flex',
                alignItems: 'center',
                gap: 16,
              }}
            >
              <span>0{i + 1}</span>
              <span style={{width: 40, height: 1, background: colors.caramel}} />
              <span>{labels[i]}</span>
            </div>
            <div
              style={{
                fontFamily: fonts.serif,
                fontSize: 78,
                lineHeight: 1.08,
                color: colors.espresso,
                marginTop: 28,
                whiteSpace: 'pre-line',
                letterSpacing: -0.5,
              }}
            >
              {c.title}
            </div>
            <div style={{fontFamily: fonts.sans, fontSize: 26, color: colors.muted, marginTop: 26, lineHeight: 1.5}}>
              {c.body}
            </div>
          </div>
        );
      })}
    </>
  );
};
