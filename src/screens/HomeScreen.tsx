import {useCurrentFrame} from 'remotion';
import {StatusBar} from '../components/StatusBar';
import {ArrowRight, CalendarIcon, HomeIcon, LeafIcon, UserIcon} from '../components/Icons';
import {copy} from '../copy';
import {colors, fonts, softShadow} from '../theme';
import {pressScale, progress, t} from '../timeline';

// Tap target centre, in screen coordinates.
export const BOOK_BUTTON = {x: 200, y: 356};

const Reveal: React.FC<{i: number; children: React.ReactNode; style?: React.CSSProperties}> = ({
  i,
  children,
  style,
}) => {
  const frame = useCurrentFrame();
  const p = progress(frame, t.homeIn + i * 4, 12);
  return (
    <div style={{position: 'absolute', opacity: p, transform: `translateY(${(1 - p) * 14}px)`, ...style}}>
      {children}
    </div>
  );
};

const explore = [
  {name: 'Blood panel', note: 'Know your numbers', tint: '#D9C7B0'},
  {name: 'Nutrition', note: 'Eat for energy', tint: '#CDB79C'},
  {name: 'Recovery', note: 'Train smarter', tint: '#E3D5C3'},
];

export const HomeScreen: React.FC = () => {
  const frame = useCurrentFrame();
  const btnScale = pressScale(frame, t.tapBook);

  return (
    <div style={{position: 'absolute', inset: 0, background: colors.paper, fontFamily: fonts.sans}}>
      <StatusBar />

      <Reveal i={0} style={{left: 24, top: 74}}>
        <div style={{fontSize: 15, color: colors.muted, letterSpacing: 0.2}}>{copy.greeting},</div>
        <div style={{fontFamily: fonts.serif, fontSize: 36, color: colors.espresso, marginTop: 2}}>
          {copy.userName}
        </div>
      </Reveal>

      <Reveal i={1} style={{right: 24, top: 80}}>
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: 24,
            background: `linear-gradient(135deg, ${colors.taupe}, ${colors.caramel})`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: colors.cream,
            fontFamily: fonts.serif,
            fontSize: 20,
            boxShadow: softShadow,
          }}
        >
          S
        </div>
      </Reveal>

      {/* Booking card */}
      <Reveal i={2} style={{left: 24, top: 168}}>
        <div
          style={{
            width: 352,
            height: 232,
            borderRadius: 28,
            background: `linear-gradient(150deg, #4A3829 0%, ${colors.espresso} 70%)`,
            boxShadow: '0 18px 40px rgba(62,47,35,0.22)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'absolute',
              right: -60,
              top: -70,
              width: 220,
              height: 220,
              borderRadius: 110,
              background: `radial-gradient(circle, rgba(200,155,109,0.35), rgba(200,155,109,0) 70%)`,
            }}
          />
          <div style={{position: 'absolute', left: 22, top: 22}}>
            <div style={{fontSize: 11, letterSpacing: 1.6, textTransform: 'uppercase', color: colors.caramel, fontWeight: 600}}>
              Your next step
            </div>
            <div style={{fontFamily: fonts.serif, fontSize: 25, lineHeight: 1.2, color: colors.cream, marginTop: 10}}>
              Feel your best,
              <br />
              starting this week
            </div>
            <div style={{fontSize: 13.5, color: 'rgba(245,240,232,0.7)', marginTop: 8}}>
              Treatments designed around you.
            </div>
          </div>
          <div
            style={{
              position: 'absolute',
              left: 20,
              top: 162,
              width: 312,
              height: 52,
              borderRadius: 26,
              background: colors.cream,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
              fontWeight: 600,
              fontSize: 15.5,
              color: colors.espresso,
              transform: `scale(${btnScale})`,
            }}
          >
            Book a treatment
            <ArrowRight color={colors.espresso} />
          </div>
        </div>
      </Reveal>

      <Reveal i={3} style={{left: 24, top: 428, right: 24}}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', width: 352}}>
          <div style={{fontFamily: fonts.serif, fontSize: 21, color: colors.espresso}}>Explore</div>
          <div style={{fontSize: 13, color: colors.caramel, fontWeight: 500}}>See all</div>
        </div>
      </Reveal>

      <Reveal i={4} style={{left: 24, top: 468}}>
        <div style={{display: 'flex', gap: 12}}>
          {explore.map((e) => (
            <div
              key={e.name}
              style={{
                width: 148,
                height: 172,
                borderRadius: 22,
                background: '#fff',
                boxShadow: softShadow,
                overflow: 'hidden',
              }}
            >
              <div style={{height: 96, background: `linear-gradient(160deg, ${e.tint}, ${colors.sand})`}} />
              <div style={{padding: '12px 14px'}}>
                <div style={{fontSize: 14.5, fontWeight: 600, color: colors.espresso}}>{e.name}</div>
                <div style={{fontSize: 12.5, color: colors.muted, marginTop: 3}}>{e.note}</div>
              </div>
            </div>
          ))}
        </div>
      </Reveal>

      {/* Daily snapshot */}
      <Reveal i={5} style={{left: 24, top: 664}}>
        <div
          style={{
            width: 352,
            height: 100,
            borderRadius: 22,
            background: colors.cream,
            border: `1px solid ${colors.line}`,
            display: 'flex',
            alignItems: 'center',
            padding: '0 20px',
            boxSizing: 'border-box',
          }}
        >
          {[
            {label: 'Energy', value: '+12%'},
            {label: 'Sleep', value: '7h 42m'},
            {label: 'Streak', value: '9 days'},
          ].map((s, i) => (
            <div
              key={s.label}
              style={{
                flex: 1,
                borderLeft: i ? `1px solid ${colors.line}` : 'none',
                paddingLeft: i ? 16 : 0,
              }}
            >
              <div style={{fontSize: 12, color: colors.muted}}>{s.label}</div>
              <div style={{fontFamily: fonts.serif, fontSize: 21, color: colors.espresso, marginTop: 4}}>
                {s.value}
              </div>
            </div>
          ))}
        </div>
      </Reveal>

      <TabBar active={0} />
    </div>
  );
};

export const TabBar: React.FC<{active: number}> = ({active}) => {
  const icons = [HomeIcon, CalendarIcon, LeafIcon, UserIcon];
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        height: 88,
        background: 'rgba(251,248,243,0.94)',
        borderTop: `1px solid ${colors.line}`,
        display: 'flex',
        justifyContent: 'space-around',
        paddingTop: 14,
        boxSizing: 'border-box',
      }}
    >
      {icons.map((Icon, i) => (
        <div key={i} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6}}>
          <Icon color={i === active ? colors.espresso : colors.taupe} />
          <div
            style={{width: 4, height: 4, borderRadius: 2, background: i === active ? colors.caramel : 'transparent'}}
          />
        </div>
      ))}
      <div
        style={{
          position: 'absolute',
          bottom: 8,
          left: '50%',
          width: 134,
          marginLeft: -67,
          height: 5,
          borderRadius: 3,
          background: colors.espresso,
        }}
      />
    </div>
  );
};
