import {colors} from '../theme';

export const SCREEN_W = 400;
export const SCREEN_H = 866;
const BEZEL = 13;

export const Phone: React.FC<{children: React.ReactNode}> = ({children}) => {
  return (
    <div
      style={{
        width: SCREEN_W + BEZEL * 2,
        height: SCREEN_H + BEZEL * 2,
        borderRadius: 68,
        padding: BEZEL,
        background: `linear-gradient(145deg, #54433A 0%, ${colors.espresso} 40%, #2C2119 100%)`,
        boxShadow: [
          '0 0 0 1.5px rgba(255,255,255,0.08) inset',
          '0 2px 4px rgba(62,47,35,0.10)',
          '0 24px 48px rgba(62,47,35,0.14)',
          '0 60px 120px rgba(62,47,35,0.16)',
        ].join(', '),
        position: 'relative',
      }}
    >
      <div
        style={{
          width: SCREEN_W,
          height: SCREEN_H,
          borderRadius: 56,
          overflow: 'hidden',
          position: 'relative',
          background: colors.paper,
          // Force a clipping layer so rounded corners stay crisp.
          transform: 'translateZ(0)',
        }}
      >
        {children}
        {/* Dynamic island */}
        <div
          style={{
            position: 'absolute',
            top: 12,
            left: '50%',
            width: 118,
            height: 34,
            marginLeft: -59,
            borderRadius: 20,
            background: '#15100C',
            zIndex: 50,
          }}
        />
      </div>
    </div>
  );
};
