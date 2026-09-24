import {colors, fonts} from '../theme';

export const StatusBar: React.FC<{tone?: 'dark' | 'light'}> = ({tone = 'dark'}) => {
  const c = tone === 'dark' ? colors.espresso : colors.cream;
  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 54,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '6px 34px 0 42px',
        fontFamily: fonts.sans,
        fontWeight: 600,
        fontSize: 16,
        color: c,
        zIndex: 40,
      }}
    >
      <span>7:42</span>
      <div style={{display: 'flex', gap: 6, alignItems: 'center'}}>
        {/* Signal */}
        <svg width="18" height="12" viewBox="0 0 18 12">
          {[0, 1, 2, 3].map((i) => (
            <rect key={i} x={i * 4.6} y={9 - i * 3} width="3.2" height={3 + i * 3} rx="1" fill={c} />
          ))}
        </svg>
        {/* Wifi */}
        <svg width="16" height="12" viewBox="0 0 16 12">
          <path d="M8 11.5 L5.6 9 A3.4 3.4 0 0 1 10.4 9 Z" fill={c} />
          <path d="M2.6 6 A7.6 7.6 0 0 1 13.4 6" stroke={c} strokeWidth="1.8" fill="none" strokeLinecap="round" />
          <path d="M0.8 3.4 A10.6 10.6 0 0 1 15.2 3.4" stroke={c} strokeWidth="1.8" fill="none" strokeLinecap="round" />
        </svg>
        {/* Battery */}
        <svg width="27" height="13" viewBox="0 0 27 13">
          <rect x="0.5" y="0.5" width="23" height="12" rx="3.5" stroke={c} strokeOpacity="0.4" fill="none" />
          <rect x="2.5" y="2.5" width="17" height="8" rx="2" fill={c} />
          <rect x="24.5" y="4.5" width="1.6" height="4" rx="0.8" fill={c} fillOpacity="0.4" />
        </svg>
      </div>
    </div>
  );
};
