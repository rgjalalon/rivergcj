import {useCurrentFrame} from 'remotion';
import {fonts} from '../theme';
import {progress} from '../timeline';
import {captions} from './timeline';

/** Centered lowercase white captions; each part fades in where it lands. */
export const Captions: React.FC = () => {
  const frame = useCurrentFrame();
  const c = captions.find((cap) => frame >= cap.from && frame < cap.to);
  if (!c) return null;
  const out = 1 - progress(frame, c.to - 6, 6);
  return (
    <div
      style={{
        position: 'absolute',
        left: 80,
        right: 80,
        top: 0,
        bottom: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        fontFamily: fonts.sans,
        fontWeight: 500,
        fontSize: 58,
        letterSpacing: -0.5,
        color: '#FFFFFF',
        textShadow: '0 2px 24px rgba(40,28,20,0.35), 0 1px 3px rgba(40,28,20,0.25)',
        opacity: out,
        zIndex: 20,
      }}
    >
      <div>
        {c.parts.map((p) => {
          const inP = progress(frame, p.at);
          return (
            <span key={p.at} style={{opacity: inP, whiteSpace: 'pre'}}>
              {p.text}
            </span>
          );
        })}
      </div>
    </div>
  );
};
