import '../loadFonts';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {ArrowRight, Check} from '../components/Icons';
import {colors, fonts} from '../theme';

// Instagram portrait post (1080×1350). The left panel carries the copy and a
// checklist drawn as a page from The Wellness site; the right is the interior photo.
export const POST_W = 1080;
export const POST_H = 1350;

const PANEL_W = 668;

const questions = [
  {
    q: 'Was inflammation measured on my panel?',
    hint: 'Look for hs-CRP on your results. It isn’t always included by default.',
    done: true,
  },
  {
    q: 'Single-protein or composite marker?',
    hint: 'hs-CRP is one protein. Some panels combine several markers into one score.',
    done: false,
  },
  {
    q: 'If raised, what might be driving it?',
    hint: 'Sleep, stress, recent illness, training load and diet can all play a part.',
    done: false,
  },
];

const answered = questions.filter((x) => x.done).length;

const Lock: React.FC = () => (
  <svg width={13} height={13} viewBox="0 0 24 24" fill="none">
    <rect x="5" y="10.5" width="14" height="10" rx="2.5" stroke={colors.muted} strokeWidth="2" />
    <path d="M8.5 10.5V8a3.5 3.5 0 017 0v2.5" stroke={colors.muted} strokeWidth="2" />
  </svg>
);

const BrowserBar: React.FC = () => (
  <div
    style={{
      height: 58,
      display: 'flex',
      alignItems: 'center',
      padding: '0 22px',
      gap: 18,
      borderBottom: `1px solid ${colors.line}`,
      background: colors.cream,
    }}
  >
    <div style={{display: 'flex', gap: 8}}>
      {[0, 1, 2].map((i) => (
        <div key={i} style={{width: 11, height: 11, borderRadius: 6, background: colors.line}} />
      ))}
    </div>
    <div
      style={{
        flex: 1,
        height: 32,
        borderRadius: 16,
        background: colors.paper,
        border: `1px solid ${colors.line}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 7,
        fontSize: 14,
        color: colors.muted,
        letterSpacing: 0.1,
      }}
    >
      <Lock />
      thewellness.com/health-check
    </div>
    <div style={{width: 51}} />
  </div>
);

const SiteNav: React.FC = () => (
  <div
    style={{
      height: 70,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 32px',
      borderBottom: `1px solid ${colors.line}`,
    }}
  >
    <div style={{fontFamily: fonts.serif, fontSize: 23, color: colors.espresso, letterSpacing: -0.2}}>
      The Wellness
    </div>
    <div style={{display: 'flex', alignItems: 'center', gap: 24, fontSize: 14.5, color: colors.muted}}>
      <span>Tests</span>
      <span style={{color: colors.espresso, fontWeight: 500}}>Checklists</span>
      <div
        style={{
          height: 36,
          padding: '0 18px',
          borderRadius: 18,
          background: colors.espresso,
          color: colors.cream,
          fontWeight: 500,
          display: 'flex',
          alignItems: 'center',
        }}
      >
        Book
      </div>
    </div>
  </div>
);

const Checkbox: React.FC<{done: boolean}> = ({done}) => (
  <div
    style={{
      width: 28,
      height: 28,
      borderRadius: 14,
      flexShrink: 0,
      marginTop: 1,
      boxSizing: 'border-box',
      border: done ? 'none' : `1.5px solid ${colors.taupe}`,
      background: done ? colors.caramel : '#fff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    {done ? <Check color="#fff" size={16} /> : null}
  </div>
);

const ChecklistPage: React.FC = () => (
  <div
    style={{
      width: 540,
      borderRadius: 26,
      overflow: 'hidden',
      background: '#fff',
      border: `1px solid ${colors.line}`,
      boxShadow: '0 2px 4px rgba(62,47,35,0.04), 0 24px 60px rgba(62,47,35,0.12)',
    }}
  >
    <BrowserBar />
    <SiteNav />

    <div style={{padding: '34px 32px 32px'}}>
      <div
        style={{
          fontSize: 12.5,
          letterSpacing: 1.8,
          textTransform: 'uppercase',
          color: colors.caramel,
          fontWeight: 600,
        }}
      >
        Checklist · Blood work
      </div>
      <div
        style={{
          fontFamily: fonts.serif,
          fontSize: 34,
          lineHeight: 1.15,
          color: colors.espresso,
          marginTop: 12,
          letterSpacing: -0.3,
        }}
      >
        Three questions for your next health check
      </div>

      {/* Progress */}
      <div style={{display: 'flex', alignItems: 'center', gap: 14, marginTop: 22}}>
        <div style={{flex: 1, height: 4, borderRadius: 2, background: colors.sand, overflow: 'hidden'}}>
          <div
            style={{
              width: `${(answered / questions.length) * 100}%`,
              height: '100%',
              borderRadius: 2,
              background: colors.caramel,
            }}
          />
        </div>
        <div style={{fontSize: 13.5, color: colors.muted, fontVariantNumeric: 'tabular-nums'}}>
          {answered} of {questions.length} asked
        </div>
      </div>

      {/* Items */}
      <div style={{marginTop: 18}}>
        {questions.map((item, i) => (
          <div
            key={item.q}
            style={{
              display: 'flex',
              gap: 18,
              padding: '20px 0',
              borderTop: i ? `1px solid ${colors.line}` : 'none',
            }}
          >
            <Checkbox done={item.done} />
            <div style={{flex: 1}}>
              <div
                style={{
                  fontSize: 19,
                  lineHeight: 1.35,
                  fontWeight: 500,
                  color: item.done ? colors.muted : colors.espresso,
                }}
              >
                {item.q}
              </div>
              <div style={{fontSize: 15, lineHeight: 1.45, color: colors.muted, marginTop: 6}}>{item.hint}</div>
            </div>
            <div
              style={{
                fontFamily: fonts.serif,
                fontSize: 15,
                color: colors.taupe,
                marginTop: 3,
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              0{i + 1}
            </div>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div style={{display: 'flex', gap: 12, marginTop: 10}}>
        <div
          style={{
            flex: 1,
            height: 54,
            borderRadius: 27,
            background: colors.espresso,
            color: colors.cream,
            fontSize: 16,
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
          }}
        >
          Take this to my appointment
          <ArrowRight color={colors.cream} size={17} />
        </div>
        <div
          style={{
            height: 54,
            padding: '0 22px',
            borderRadius: 27,
            border: `1px solid ${colors.line}`,
            color: colors.espresso,
            fontSize: 16,
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          Save
        </div>
      </div>
    </div>
  </div>
);

export const InflammationPost: React.FC = () => (
  <AbsoluteFill style={{background: colors.paper, fontFamily: fonts.sans}}>
    {/* Left panel */}
    <div style={{position: 'absolute', left: 0, top: 0, width: PANEL_W, height: POST_H}}>
      <div style={{position: 'absolute', left: 64, top: 84, width: 540}}>
        <div
          style={{
            fontFamily: fonts.serif,
            fontSize: 42,
            lineHeight: 1.15,
            color: colors.espresso,
            letterSpacing: -0.4,
          }}
        >
          You can’t feel low-grade inflammation.
        </div>
        <div style={{fontSize: 22, lineHeight: 1.45, color: colors.muted, marginTop: 18, width: 470}}>
          You can ask whether your blood work measures it.
        </div>
      </div>

      <div style={{position: 'absolute', left: 64, top: 392}}>
        <ChecklistPage />
      </div>
    </div>

    {/* Right photo */}
    <div style={{position: 'absolute', left: PANEL_W, top: 0, right: 0, bottom: 0, overflow: 'hidden'}}>
      <Img
        src={staticFile('posts/interior.jpg')}
        style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top'}}
      />
      <div
        style={{
          position: 'absolute',
          right: 38,
          bottom: 44,
          fontFamily: fonts.serif,
          fontSize: 27,
          color: colors.cream,
          letterSpacing: -0.3,
        }}
      >
        The Wellness
      </div>
    </div>
  </AbsoluteFill>
);
