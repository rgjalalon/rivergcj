import '../loadFonts';
import {AbsoluteFill, Img, staticFile} from 'remotion';

// Square Instagram/Threads post (1080×1080): "Have you ever had your Lp(a) checked?"
// Same system as the ageing-well carousel: white page, running head and rule,
// light DM Sans headline, wordmark footer. Reply pills invite answers on Threads.
export const LPA_W = 1080;
export const LPA_H = 1080;

const c = {
  page: '#FFFFFF',
  ink: '#1F1B18',
  body: '#5E5852',
  muted: '#9A938B',
  rule: '#E4DFD8',
};

const sans = '"DM Sans", Inter, -apple-system, "Helvetica Neue", Arial, sans-serif';
const M = 72;

const caps: React.CSSProperties = {
  fontFamily: sans,
  fontSize: 13,
  fontWeight: 500,
  letterSpacing: 3,
  textTransform: 'uppercase',
  color: c.muted,
};

const replies = ['Yes', 'No', 'What’s Lp(a)?'];

export const LpaPost: React.FC = () => (
  <AbsoluteFill style={{background: c.page, fontFamily: sans, color: c.ink}}>
    <div style={{position: 'absolute', left: M, right: M, top: 52, display: 'flex', justifyContent: 'space-between'}}>
      <div style={caps}>Heart health</div>
      <div style={caps}>Quick question</div>
    </div>
    <div style={{position: 'absolute', left: M, right: M, top: 88, height: 1, background: c.rule}} />

    <div
      style={{
        position: 'absolute',
        left: M,
        right: M,
        top: 230,
        fontSize: 96,
        fontWeight: 300,
        lineHeight: 1.02,
        letterSpacing: -2.6,
      }}
    >
      Have you ever had
      <br />
      your <span style={{fontWeight: 500}}>Lp(a)</span> checked?
    </div>

    <div style={{position: 'absolute', left: M, top: 508, display: 'flex', gap: 14}}>
      {replies.map((r) => (
        <div
          key={r}
          style={{
            height: 60,
            padding: '0 30px',
            borderRadius: 30,
            border: `1.5px solid ${c.ink}`,
            display: 'flex',
            alignItems: 'center',
            fontSize: 22,
            fontWeight: 400,
          }}
        >
          {r}
        </div>
      ))}
    </div>

    <div
      style={{
        position: 'absolute',
        left: M,
        right: M,
        top: 668,
        borderTop: `1px solid ${c.rule}`,
        paddingTop: 30,
        display: 'flex',
        gap: 48,
      }}
    >
      <div style={{fontSize: 72, fontWeight: 300, lineHeight: 1, letterSpacing: -1.5, whiteSpace: 'nowrap'}}>1 in 5</div>
      <div style={{fontSize: 22, fontWeight: 300, lineHeight: 1.5, color: c.body}}>
        people have raised Lp(a), a mostly inherited heart-risk marker. It rarely shows up on a standard cholesterol
        test, and most people only need to test once.
      </div>
    </div>

    <div style={{position: 'absolute', left: 0, right: 0, bottom: 56, display: 'flex', justifyContent: 'center'}}>
      <Img src={staticFile('posts/aging2/wordmark.png')} style={{height: 24, display: 'block'}} />
    </div>
  </AbsoluteFill>
);
