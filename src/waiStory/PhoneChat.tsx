import {AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {colors, fonts} from '../theme';
import {easeOut, progress} from '../timeline';
import {chat} from './timeline';

// Wai chat UI is laid out at phone scale (360pt wide) and scaled to the phone
// on screen, like a close-up of a real device.
const PHONE_W = 640;
const BEZEL = 20;
const SCREEN_W = PHONE_W - BEZEL * 2;
const UI_W = 360;
const UI_SCALE = SCREEN_W / UI_W;

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

export const PhoneChat: React.FC<{from: number; to: number}> = ({from, to}) => {
  const frame = useCurrentFrame();
  const enter = progress(frame, from, 18);
  const push = interpolate(frame, [from, to], [1, 1.07], clamp);
  // Drift the phone up as the answer grows, keeping it centred in frame.
  const lift = interpolate(frame, [chat.answerIn, chat.rangeIn + 20], [0, -190], {...clamp, easing: easeOut});
  const sway = Math.sin(frame / 26) * 3;

  return (
    <AbsoluteFill style={{overflow: 'hidden', background: '#120C09'}}>
      <Backdrop frame={frame} />
      <AbsoluteFill style={{transform: `scale(${push})`, transformOrigin: '50% 40%'}}>
        <div
          style={{
            position: 'absolute',
            left: (1080 - PHONE_W) / 2,
            top: 70 + (1 - enter) * 60 + lift + sway,
            width: PHONE_W,
            height: 1300,
            transform: `rotate(${-2.5 + sway * 0.1}deg)`,
          }}
        >
          <Hand side="back" />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: 92,
              background: 'linear-gradient(135deg, #3A2E26, #120D0A 40%, #2A211B)',
              boxShadow: '0 60px 120px rgba(0,0,0,0.55), inset 0 0 0 2px rgba(245,240,232,0.08)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: BEZEL,
              top: BEZEL,
              width: SCREEN_W,
              height: 1300 - BEZEL * 2,
              borderRadius: 74,
              overflow: 'hidden',
              background: colors.espresso,
            }}
          >
            <div style={{width: UI_W, transform: `scale(${UI_SCALE})`, transformOrigin: '0 0', fontFamily: fonts.sans}}>
              <ChatUI frame={frame} />
            </div>
            {/* Screen glare */}
            <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(115deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0) 35%)'}} />
          </div>
          <Hand side="front" />
        </div>
      </AbsoluteFill>
      {/* Screen light spilling onto the hands and room */}
      <AbsoluteFill style={{background: 'radial-gradient(ellipse 50% 40% at 50% 55%, rgba(245,240,232,0.06), rgba(0,0,0,0) 70%)'}} />
    </AbsoluteFill>
  );
};

const Backdrop: React.FC<{frame: number}> = ({frame}) => (
  <AbsoluteFill style={{background: 'radial-gradient(ellipse 90% 70% at 30% 20%, #4A3526 0%, #1E150F 55%, #0F0A07 100%)'}}>
    {[
      [140, 180, 90, 'rgba(232,185,130,0.35)'],
      [900, 120, 70, 'rgba(200,155,109,0.30)'],
      [980, 520, 110, 'rgba(232,185,130,0.18)'],
      [80, 700, 80, 'rgba(200,155,109,0.22)'],
    ].map(([x, y, r, c], i) => (
      <div
        key={i}
        style={{
          position: 'absolute',
          left: (x as number) + Math.sin((frame + i * 20) / 40) * 6 - (r as number),
          top: (y as number) - (r as number),
          width: (r as number) * 2,
          height: (r as number) * 2,
          borderRadius: '50%',
          background: c as string,
          filter: 'blur(18px)',
        }}
      />
    ))}
  </AbsoluteFill>
);

/** Soft, low-light hand: fingers wrap the left edge, thumb rests on the right. */
const Hand: React.FC<{side: 'back' | 'front'}> = ({side}) => {
  const skin = 'linear-gradient(100deg, #6B4632 0%, #8E6048 55%, #5A3A29 100%)';
  const shape = (s: React.CSSProperties): React.CSSProperties => ({
    position: 'absolute',
    background: skin,
    filter: 'blur(1.2px)',
    boxShadow: 'inset -6px -8px 18px rgba(30,18,12,0.45)',
    ...s,
  });
  if (side === 'back') {
    // Palm behind the phone, peeking out below and on the left.
    return (
      <>
        <div style={shape({left: -120, top: 720, width: 520, height: 700, borderRadius: '45% 40% 30% 30%', transform: 'rotate(8deg)'})} />
        <div style={shape({left: 360, top: 820, width: 380, height: 600, borderRadius: '40%', transform: 'rotate(-12deg)'})} />
      </>
    );
  }
  return (
    <>
      {/* Fingers curling round the left edge */}
      {[640, 740, 836].map((y, i) => (
        <div key={y} style={shape({left: -34, top: y, width: 70 - i * 4, height: 88, borderRadius: '44px 36px 36px 44px', transform: `rotate(${-6 + i * 3}deg)`})} />
      ))}
      {/* Thumb along the right edge */}
      <div style={shape({left: PHONE_W - 40, top: 700, width: 74, height: 250, borderRadius: '37px 37px 30px 30px', transform: 'rotate(10deg)'})} />
    </>
  );
};

const ChatUI: React.FC<{frame: number}> = ({frame}) => {
  const q = progress(frame, chat.questionIn, 10);
  const typing = frame >= chat.typingIn && frame < chat.answerIn;
  const chars = Math.max(0, Math.floor((frame - chat.answerIn) * chat.cps));
  const shown = chat.answer.slice(0, chars);
  const doneTyping = chars >= chat.answer.length;
  const answerIn = progress(frame, chat.answerIn - 2, 8);
  const range = progress(frame, chat.rangeIn, 14);
  const marker = interpolate(frame, [chat.rangeIn + 6, chat.rangeIn + 26], [0, 1], {...clamp, easing: easeOut});
  const caret = !doneTyping || Math.floor(frame / 8) % 2 === 0;

  return (
    <div style={{color: colors.cream, position: 'relative'}}>
      {/* Status bar */}
      <div style={{height: 50, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 30px', fontSize: 14, fontWeight: 600}}>
        <span>9:41</span>
        <div style={{width: 96, height: 26, borderRadius: 14, background: '#000'}} />
        <span style={{display: 'flex', gap: 4, alignItems: 'center'}}>
          <span style={{width: 16, height: 9, borderRadius: 2, border: '1.3px solid rgba(245,240,232,0.8)'}} />
        </span>
      </div>

      {/* Header */}
      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 20px 14px', borderBottom: '1px solid rgba(245,240,232,0.08)'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 10}}>
          <Img src={staticFile('wai/wai-logo-cream.png')} style={{height: 15}} />
          <span style={{fontSize: 12, color: 'rgba(245,240,232,0.55)'}}>your results</span>
        </div>
        <div style={{width: 8, height: 8, borderRadius: 4, background: colors.caramel}} />
      </div>

      <div style={{padding: '18px 16px', display: 'flex', flexDirection: 'column', gap: 16}}>
        {/* User question with the lab PDF attached */}
        <div style={{alignSelf: 'flex-end', maxWidth: 270, opacity: q, transform: `translateY(${(1 - q) * 10}px)`}}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '8px 10px',
              borderRadius: 12,
              background: 'rgba(245,240,232,0.06)',
              border: '1px solid rgba(245,240,232,0.10)',
              marginBottom: 6,
              fontSize: 11.5,
            }}
          >
            <div style={{width: 22, height: 26, borderRadius: 4, background: colors.caramel, color: colors.espresso, fontSize: 7.5, fontWeight: 600, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', paddingBottom: 3}}>
              PDF
            </div>
            <div>
              <div style={{fontWeight: 500}}>results_sep12.pdf</div>
              <div style={{color: 'rgba(245,240,232,0.5)', fontSize: 10.5}}>6 markers · all “normal”</div>
            </div>
          </div>
          <div style={{padding: '11px 14px', borderRadius: '18px 18px 4px 18px', background: 'rgba(200,155,109,0.22)', fontSize: 14.5, lineHeight: 1.45}}>
            {chat.question}
          </div>
        </div>

        {/* Wai answer */}
        <div style={{display: 'flex', gap: 10, alignItems: 'flex-start', opacity: typing ? 1 : answerIn}}>
          <div style={{width: 26, height: 26, borderRadius: 13, background: colors.caramel, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: fonts.serif, fontSize: 14, color: colors.espresso}}>
            w
          </div>
          {typing ? (
            <div style={{display: 'flex', gap: 5, paddingTop: 10}}>
              {[0, 1, 2].map((i) => (
                <div key={i} style={{width: 6, height: 6, borderRadius: 3, background: colors.caramel, opacity: 0.35 + 0.65 * Math.max(0, Math.sin((frame - i * 4) / 3))}} />
              ))}
            </div>
          ) : (
            <div style={{fontSize: 16, lineHeight: 1.55, paddingTop: 2, minHeight: 124, maxWidth: 290}}>
              {shown}
              <span style={{display: 'inline-block', width: 2, height: 17, marginLeft: 2, verticalAlign: -3, background: colors.caramel, opacity: caret ? 1 : 0}} />
            </div>
          )}
        </div>

        {/* Ferritin range card */}
        <div
          style={{
            marginLeft: 36,
            padding: '14px 16px 16px',
            borderRadius: 16,
            background: 'rgba(245,240,232,0.05)',
            border: '1px solid rgba(200,155,109,0.28)',
            opacity: range,
            transform: `translateY(${(1 - range) * 10}px)`,
          }}
        >
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline'}}>
            <span style={{fontSize: 12.5, color: 'rgba(245,240,232,0.6)'}}>Ferritin</span>
            <span>
              <span style={{fontFamily: fonts.serif, fontSize: 24}}>18</span>
              <span style={{fontSize: 11, color: 'rgba(245,240,232,0.55)', marginLeft: 4}}>ng/mL</span>
            </span>
          </div>
          <RangeBar marker={marker} />
        </div>
      </div>
    </div>
  );
};

/** Lab range 15–150 in muted cream, optimal 50–150 in caramel, marker at 18. */
const RangeBar: React.FC<{marker: number}> = ({marker}) => {
  const W = 258;
  const x = (v: number) => (v / 170) * W;
  const mx = interpolate(marker, [0, 1], [x(150), x(18)]);
  return (
    <svg width={W} height={52} viewBox={`0 0 ${W} 52`} style={{marginTop: 10, overflow: 'visible'}}>
      <rect x={x(15)} y={14} width={x(150) - x(15)} height={8} rx={4} fill="rgba(245,240,232,0.14)" />
      <rect x={x(50)} y={14} width={x(150) - x(50)} height={8} rx={4} fill={colors.caramel} />
      <circle cx={mx} cy={18} r={7} fill={colors.cream} stroke={colors.espresso} strokeWidth={2.5} />
      <text x={x(15)} y={40} fontFamily="Inter" fontSize={10} fill="rgba(245,240,232,0.5)">
        “normal” from 15
      </text>
      <text x={x(150)} y={40} textAnchor="end" fontFamily="Inter" fontSize={10} fill={colors.caramel}>
        optimal 50–150
      </text>
    </svg>
  );
};

