import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {colors, fonts, softShadow} from '../theme';
import {progress} from '../timeline';

const UI_W = 400;
const UI_SCALE = 1080 / UI_W;
const UI_H = 1920 / UI_SCALE;

const Frame: React.FC<{from: number; to: number; children: React.ReactNode}> = ({from, to, children}) => {
  const frame = useCurrentFrame();
  const s = interpolate(frame, [from, to], [1.03, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{background: colors.paper}}>
      <div
        style={{
          position: 'absolute',
          left: (1080 - UI_W) / 2,
          top: (1920 - UI_H) / 2,
          width: UI_W,
          height: UI_H,
          transform: `scale(${UI_SCALE * s})`,
          fontFamily: fonts.sans,
        }}
      >
        {children}
      </div>
    </AbsoluteFill>
  );
};

/**
 * B5 — the first version of the product taking shape: a stack of paper
 * records folding into a single digital list. Stands in for the reference's
 * old-website flash without borrowing anyone else's screenshot.
 */
export const RecordUi: React.FC<{from: number; to: number}> = ({from, to}) => {
  const frame = useCurrentFrame();
  const rows = ['Sleep', 'Vitamin D', 'Blood pressure', 'Medication', 'Notes'];
  return (
    <Frame from={from} to={to}>
      <div style={{position: 'absolute', top: 84, left: 24, right: 24}}>
        <div style={{fontSize: 13, color: colors.muted}}>Wai · early build</div>
        <div style={{fontFamily: fonts.serif, fontSize: 32, color: colors.espresso, marginTop: 4}}>One record</div>
      </div>
      <div style={{position: 'absolute', top: 190, left: 24, right: 24, display: 'flex', flexDirection: 'column', gap: 8}}>
        {rows.map((r, i) => {
          const p = progress(frame, from + 4 + i * 5, 8);
          return (
            <div
              key={r}
              style={{
                opacity: p,
                transform: `translateX(${(1 - p) * -16}px)`,
                background: '#FFFFFF',
                borderRadius: 16,
                padding: '14px 18px',
                boxShadow: softShadow,
                fontSize: 16,
                color: colors.espresso,
                fontWeight: 600,
              }}
            >
              {r}
            </div>
          );
        })}
      </div>
    </Frame>
  );
};

const exchange = [
  {who: 'you', text: "why am I so tired lately?"},
  {who: 'wai', text: 'Your last panel flagged low vitamin D and short sleep — both fixable, and likely related.'},
];

/**
 * B8b — "Ask Wai anything." Stands in for the reference's mysterious AI-chat
 * screenshot with Wai's own, on the record about what it actually does.
 */
export const ChatUi: React.FC<{from: number; to: number}> = ({from, to}) => {
  const frame = useCurrentFrame();
  return (
    <Frame from={from} to={to}>
      <div style={{position: 'absolute', top: 84, left: 24, right: 24}}>
        <div style={{fontSize: 13, color: colors.muted}}>Ask Wai</div>
      </div>
      <div style={{position: 'absolute', top: 150, left: 24, right: 24, display: 'flex', flexDirection: 'column', gap: 14}}>
        {exchange.map((m, i) => {
          const p = progress(frame, from + 10 + i * 28, 14);
          const mine = m.who === 'you';
          return (
            <div
              key={i}
              style={{
                opacity: p,
                transform: `translateY(${(1 - p) * 14}px)`,
                alignSelf: mine ? 'flex-end' : 'flex-start',
                maxWidth: '82%',
                background: mine ? colors.espresso : '#FFFFFF',
                color: mine ? colors.cream : colors.espresso,
                borderRadius: 22,
                borderBottomRightRadius: mine ? 6 : 22,
                borderBottomLeftRadius: mine ? 22 : 6,
                padding: '16px 20px',
                fontSize: 17,
                lineHeight: 1.45,
                boxShadow: softShadow,
              }}
            >
              {m.text}
            </div>
          );
        })}
      </div>
    </Frame>
  );
};
