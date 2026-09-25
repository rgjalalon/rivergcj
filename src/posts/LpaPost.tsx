import '../loadFonts';
import {AbsoluteFill, Img, staticFile} from 'remotion';

// Square Instagram/Threads post (1080×1080): "Have you ever had your Lp(a) checked?"
// Built for replies: the stat is shown as five figures with one highlighted, and the
// answers are lettered so commenting is one character ("A", "B" or "C").
export const LPA_W = 1080;
export const LPA_H = 1080;

const c = {
  page: '#FFFFFF',
  ink: '#1F1B18',
  body: '#5E5852',
  muted: '#9A938B',
  rule: '#E4DFD8',
  panel: '#F5F2EE',
  accent: '#B4533A',
  figure: '#DAD3CA',
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

const Person: React.FC<{color: string}> = ({color}) => (
  <svg width={54} height={96} viewBox="0 0 54 96">
    <circle cx={27} cy={17} r={15} fill={color} />
    <path d="M4 96V56a23 23 0 0146 0v40z" fill={color} />
  </svg>
);

const answers = [
  {k: 'A', label: 'Yes, I know my number'},
  {k: 'B', label: 'No, never tested'},
  {k: 'C', label: 'Wait, what’s Lp(a)?'},
];

export const LpaPost: React.FC = () => (
  <AbsoluteFill style={{background: c.page, fontFamily: sans, color: c.ink}}>
    <div style={{position: 'absolute', left: M, right: M, top: 52, display: 'flex', justifyContent: 'space-between'}}>
      <div style={caps}>Heart health</div>
      <div style={{...caps, color: c.accent}}>Quick question</div>
    </div>
    <div style={{position: 'absolute', left: M, right: M, top: 88, height: 1, background: c.rule}} />

    <div
      style={{
        position: 'absolute',
        left: M,
        right: M,
        top: 148,
        fontSize: 84,
        fontWeight: 300,
        lineHeight: 1.03,
        letterSpacing: -2.4,
      }}
    >
      Have you ever had your <span style={{fontWeight: 500, color: c.accent}}>Lp(a)</span> checked?
    </div>

    {/* 1 in 5, shown rather than told */}
    <div style={{position: 'absolute', left: M, right: M, top: 382, display: 'flex', alignItems: 'flex-end', gap: 44}}>
      <div style={{display: 'flex', gap: 12}}>
        {[0, 1, 2, 3, 4].map((i) => (
          <Person key={i} color={i === 0 ? c.accent : c.figure} />
        ))}
      </div>
      <div style={{paddingBottom: 2}}>
        <div style={{fontSize: 44, fontWeight: 400, lineHeight: 1, letterSpacing: -1}}>
          <span style={{color: c.accent}}>1 in 5</span> people have high Lp(a).
        </div>
        <div style={{marginTop: 12, fontSize: 21, fontWeight: 300, lineHeight: 1.4, color: c.body}}>
          It’s about 90% genetic, and most standard cholesterol tests don’t include it.
        </div>
      </div>
    </div>

    {/* Reply card */}
    <div
      style={{
        position: 'absolute',
        left: M,
        right: M,
        top: 566,
        background: c.panel,
        borderRadius: 28,
        padding: '30px 32px 32px',
      }}
    >
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline'}}>
        <div style={{fontSize: 26, fontWeight: 500}}>Comment A, B or C</div>
        <div style={{fontSize: 18, fontWeight: 300, color: c.muted}}>We reply to every one</div>
      </div>
      <div style={{marginTop: 22, display: 'flex', flexDirection: 'column', gap: 12}}>
        {answers.map((a) => (
          <div
            key={a.k}
            style={{
              height: 72,
              borderRadius: 36,
              background: '#FFFFFF',
              border: `1px solid ${c.rule}`,
              display: 'flex',
              alignItems: 'center',
              gap: 20,
              padding: '0 14px',
            }}
          >
            <div
              style={{
                width: 46,
                height: 46,
                borderRadius: 23,
                background: a.k === 'C' ? c.accent : c.ink,
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 20,
                fontWeight: 500,
              }}
            >
              {a.k}
            </div>
            <div style={{fontSize: 25, fontWeight: 400}}>{a.label}</div>
          </div>
        ))}
      </div>
    </div>

    <div
      style={{
        position: 'absolute',
        left: M,
        right: M,
        bottom: 54,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <div style={{fontSize: 13, color: c.muted}}>European Atherosclerosis Society, 2022</div>
      <Img src={staticFile('posts/aging2/wordmark.png')} style={{height: 24, display: 'block'}} />
    </div>
  </AbsoluteFill>
);
