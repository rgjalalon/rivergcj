import {useCurrentFrame} from 'remotion';
import {fonts} from '../theme';
import {captions} from './timeline';

/** Small centred lowercase white captions that cut on and off with the edit. */
export const Captions: React.FC = () => {
  const frame = useCurrentFrame();
  const c = captions.find((cap) => frame >= cap.from && frame < cap.to);
  if (!c) return null;
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
        fontSize: 46,
        letterSpacing: -0.2,
        color: '#FFFFFF',
        textShadow: '0 1px 18px rgba(40,28,20,0.45), 0 1px 3px rgba(40,28,20,0.35)',
        zIndex: 20,
      }}
    >
      {/* Soft espresso glow keeps white type legible over light screens and paper. */}
      <div style={{padding: '36px 72px', background: 'radial-gradient(ellipse 50% 50% at 50% 50%, rgba(46,33,24,0.42) 0%, rgba(46,33,24,0.18) 55%, rgba(46,33,24,0) 100%)'}}>
        {c.text}
      </div>
    </div>
  );
};
