import '../../loadFonts';
import {AbsoluteFill, Img, staticFile} from 'remotion';

// Six-slide Instagram carousel (1080×1350): "What Gisele, David, Steph & Serena
// know about aging well". Editorial template: cream page, hairline inner frame,
// handle and site above it, share/save below, tall serif headlines with a script accent.
export const SLIDE_W = 1080;
export const SLIDE_H = 1350;

const c = {
  page: '#F7F4EF',
  panel: '#EDE7DE',
  line: '#CBC2B6',
  ink: '#2A2521',
  muted: '#8B8279',
};

const f = {
  display: '"Antic Didone", "Playfair Display", Georgia, serif',
  script: '"Herr Von Muellerhoff", cursive',
  sans: 'Inter, -apple-system, "Helvetica Neue", Arial, sans-serif',
};

const handle = '@thewellness';
const site = 'thewellness.com';

// Muted, warm near-monochrome so the four very different photos read as one shoot.
const tone = 'grayscale(0.92) sepia(0.16) contrast(1.03) brightness(1.02)';

// Inner frame, in page coordinates. Slide content is laid out inside it.
const FRAME = {x: 44, y: 76, w: SLIDE_W - 88, h: SLIDE_H - 152};

/* ---------- Pieces ---------- */

const Photo: React.FC<{file: string; w: number; h: number; pos?: string; style?: React.CSSProperties}> = ({
  file,
  w,
  h,
  pos = '50% 20%',
  style,
}) => (
  <Img
    src={staticFile(`posts/aging/${file}`)}
    style={{width: w, height: h, objectFit: 'cover', objectPosition: pos, filter: tone, display: 'block', ...style}}
  />
);

// Serif line(s) with a script word tucked underneath, as in the reference.
const Title: React.FC<{
  lines: string[];
  script: string;
  size?: number;
  align?: 'center' | 'left';
}> = ({lines, script, size = 88, align = 'center'}) => (
  <div style={{textAlign: align, color: c.ink}}>
    {lines.map((l) => (
      <div key={l} style={{fontFamily: f.display, fontSize: size, lineHeight: 1.02, letterSpacing: -1}}>
        {l}
      </div>
    ))}
    <div
      style={{
        fontFamily: f.script,
        fontSize: size * 1.25,
        lineHeight: 0.9,
        marginTop: -size * 0.08,
        paddingLeft: align === 'center' ? size * 0.9 : size * 0.6,
      }}
    >
      {script}
    </div>
  </div>
);

const Body: React.FC<{children: React.ReactNode; width: number; align?: 'center' | 'left'}> = ({
  children,
  width,
  align = 'center',
}) => (
  <div
    style={{
      width,
      fontFamily: f.sans,
      fontSize: 21,
      lineHeight: 1.55,
      color: c.muted,
      textAlign: align,
      margin: align === 'center' ? '0 auto' : 0,
    }}
  >
    {children}
  </div>
);

const Pill: React.FC<{label: string}> = ({label}) => (
  <div
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 28,
      height: 54,
      padding: '0 26px 0 30px',
      borderRadius: 27,
      border: `1.5px solid ${c.ink}`,
      fontFamily: f.sans,
      fontSize: 13,
      fontWeight: 500,
      letterSpacing: 2.4,
      textTransform: 'uppercase',
      color: c.ink,
    }}
  >
    {label}
    <svg width={34} height={12} viewBox="0 0 34 12" fill="none">
      <path d="M0 6h32M27 1l5 5-5 5" stroke={c.ink} strokeWidth="1.5" />
    </svg>
  </div>
);

const Eyebrow: React.FC<{children: React.ReactNode}> = ({children}) => (
  <div
    style={{
      fontFamily: f.sans,
      fontSize: 14,
      fontWeight: 500,
      letterSpacing: 3.5,
      textTransform: 'uppercase',
      color: c.muted,
    }}
  >
    {children}
  </div>
);

const icon = {stroke: c.ink, strokeWidth: 1.5, fill: 'none', strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const};

const ShareIcon: React.FC<{s?: number}> = ({s = 20}) => (
  <svg width={s} height={s} viewBox="0 0 24 24">
    <path d="M21 3L3 10.5l7 2.5 2.5 7L21 3zM10 13l5-5" {...icon} />
  </svg>
);
const SaveIcon: React.FC<{s?: number}> = ({s = 20}) => (
  <svg width={s} height={s} viewBox="0 0 24 24">
    <path d="M6 3h12v18l-6-4.5L6 21V3z" {...icon} />
  </svg>
);
const HeartIcon: React.FC<{s?: number}> = ({s = 20}) => (
  <svg width={s} height={s} viewBox="0 0 24 24">
    <path d="M12 20s-7.5-4.6-7.5-10A4.3 4.3 0 0112 7.3 4.3 4.3 0 0119.5 10c0 5.4-7.5 10-7.5 10z" {...icon} />
  </svg>
);
const CommentIcon: React.FC<{s?: number}> = ({s = 20}) => (
  <svg width={s} height={s} viewBox="0 0 24 24">
    <path d="M20 12a8 8 0 01-11.6 7.1L4 20l1-4.2A8 8 0 1120 12z" {...icon} />
  </svg>
);

const Page: React.FC<{children: React.ReactNode}> = ({children}) => {
  const meta: React.CSSProperties = {
    position: 'absolute',
    fontFamily: f.sans,
    fontSize: 15,
    letterSpacing: 0.4,
    color: c.muted,
  };
  const foot: React.CSSProperties = {
    position: 'absolute',
    bottom: 30,
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    fontFamily: f.sans,
    fontSize: 13,
    fontWeight: 500,
    letterSpacing: 2.4,
    color: c.ink,
  };
  return (
    <AbsoluteFill style={{background: c.page}}>
      <div style={{...meta, top: 34, left: FRAME.x + 4}}>{handle}</div>
      <div style={{...meta, top: 34, right: FRAME.x + 4}}>{site}</div>
      <div
        style={{
          position: 'absolute',
          left: FRAME.x,
          top: FRAME.y,
          width: FRAME.w,
          height: FRAME.h,
          border: `1.5px solid ${c.line}`,
          boxSizing: 'border-box',
          overflow: 'hidden',
        }}
      >
        {children}
      </div>
      <div style={{...foot, left: FRAME.x + 4}}>
        <ShareIcon /> SHARE
      </div>
      <div style={{...foot, right: FRAME.x + 4}}>
        <SaveIcon /> SAVE
      </div>
    </AbsoluteFill>
  );
};

// Absolute box inside the frame.
const At: React.FC<{x?: number; y: number; w?: number; center?: boolean; children: React.ReactNode}> = ({
  x = 0,
  y,
  w,
  center,
  children,
}) => (
  <div
    style={{
      position: 'absolute',
      left: center ? 0 : x,
      right: center ? 0 : undefined,
      top: y,
      width: center ? undefined : w,
      display: center ? 'flex' : 'block',
      flexDirection: 'column',
      alignItems: 'center',
    }}
  >
    {children}
  </div>
);

const Rings: React.FC = () => (
  <svg
    width={FRAME.w}
    height={FRAME.h}
    style={{position: 'absolute', inset: 0}}
    viewBox={`0 0 ${FRAME.w} ${FRAME.h}`}
  >
    <circle cx={FRAME.w / 2} cy={FRAME.h / 2 - 20} r={420} stroke={c.line} strokeWidth={1.5} fill="none" />
    <circle cx={FRAME.w / 2 + 560} cy={FRAME.h / 2 - 20} r={420} stroke={c.line} strokeWidth={1.5} fill="none" />
    <circle cx={FRAME.w / 2 - 560} cy={FRAME.h / 2 - 20} r={420} stroke={c.line} strokeWidth={1.5} fill="none" />
  </svg>
);

/* ---------- Slides ---------- */

const people = [
  {file: '1.jpg', name: 'Gisele'},
  {file: '2.jpg', name: 'David'},
  {file: '3.jpg', name: 'Steph'},
  {file: '4.jpg', name: 'Serena'},
];

// 1. Cover: headline over a row of four portraits.
const Cover: React.FC = () => (
  <Page>
    <At center y={124}>
      <Eyebrow>The longevity issue</Eyebrow>
    </At>
    <At center y={182}>
      <Title lines={['What Gisele, David,', 'Steph & Serena know']} script="about aging well" size={84} />
    </At>
    <At x={50} y={590} w={FRAME.w - 100}>
      <div style={{display: 'flex', gap: 16}}>
        {people.map((p) => (
          <div key={p.name} style={{flex: 1}}>
            <Photo file={p.file} w={211} h={360} pos="50% 15%" />
            <div
              style={{
                marginTop: 14,
                fontFamily: f.sans,
                fontSize: 13,
                letterSpacing: 3,
                textTransform: 'uppercase',
                color: c.muted,
                textAlign: 'center',
              }}
            >
              {p.name}
            </div>
          </div>
        ))}
      </div>
    </At>
    <At center y={1072}>
      <Pill label="Swipe to read" />
    </At>
  </Page>
);

// 2. Gisele: vertical title beside a tall portrait.
const Gisele: React.FC = () => (
  <Page>
    <div
      style={{
        position: 'absolute',
        left: 60,
        top: 70,
        width: 250,
        height: 760,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div style={{transform: 'rotate(-90deg)', whiteSpace: 'nowrap'}}>
        <Title lines={['Rest is her']} script="ritual" size={96} align="left" />
      </div>
    </div>
    <At x={330} y={70} w={600}>
      <Photo file="1.jpg" w={600} h={760} pos="44% 10%" />
    </At>
    <At x={330} y={880} w={600}>
      <Eyebrow>01 · Gisele</Eyebrow>
      <div style={{height: 18}} />
      <Body width={600} align="left">
        Yoga, meditation and early nights have long anchored her routine. Recovery isn’t the extra. It’s the plan.
      </Body>
    </At>
  </Page>
);

// 3. David: headline on top, portrait centred, copy and button below.
const David: React.FC = () => (
  <Page>
    <At center y={70}>
      <Title lines={['Discipline,']} script="every day" size={96} />
    </At>
    <At center y={330}>
      <Photo file="2.jpg" w={470} h={560} pos="50% 30%" />
    </At>
    <At center y={930}>
      <Eyebrow>02 · David</Eyebrow>
      <div style={{height: 18}} />
      <Body width={640}>Training most days, for decades. Over a lifetime, consistency beats intensity.</Body>
    </At>
  </Page>
);

// 4. Steph: framed photo panel on top, headline underneath.
const Steph: React.FC = () => (
  <Page>
    <div
      style={{
        position: 'absolute',
        left: 60,
        right: 60,
        top: 60,
        height: 600,
        background: c.panel,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-end',
        overflow: 'hidden',
      }}
    >
      <Photo file="3.jpg" w={420} h={560} pos="55% 20%" />
    </div>
    <At center y={700}>
      <Title lines={['Sleep is the']} script="secret" size={92} />
    </At>
    <At center y={960}>
      <Eyebrow>03 · Steph</Eyebrow>
      <div style={{height: 18}} />
      <Body width={640}>He treats sleep as part of training. Deep rest is when the body repairs, and it compounds.</Body>
    </At>
  </Page>
);

// 5. Serena: portrait inside the ring motif, headline below.
const Serena: React.FC = () => (
  <Page>
    <Rings />
    <At center y={90}>
      <Photo file="4.jpg" w={440} h={620} pos="50% 10%" />
    </At>
    <At center y={740}>
      <Title lines={['Strength']} script="that lasts" size={96} />
    </At>
    <At center y={990}>
      <Eyebrow>04 · Serena</Eyebrow>
      <div style={{height: 18}} />
      <Body width={640}>Strength work and recovery kept her winning well into her thirties. Muscle is a longevity asset.</Body>
    </At>
  </Page>
);

// 6. Closing: save/share prompt inside the rings.
const Outro: React.FC = () => (
  <Page>
    <Rings />
    <At center y={420}>
      <Title lines={['Was this post']} script="useful?" size={96} />
    </At>
    <At center y={720}>
      <Eyebrow>Save it · Send it to a friend</Eyebrow>
      <div style={{display: 'flex', gap: 22, marginTop: 26}}>
        <HeartIcon s={26} />
        <CommentIcon s={26} />
        <ShareIcon s={26} />
        <SaveIcon s={26} />
      </div>
    </At>
  </Page>
);

export const SLIDES = [Cover, Gisele, David, Steph, Serena, Outro];

export const AgingWellSlide: React.FC<{index: number}> = ({index}) => {
  const Slide = SLIDES[index];
  return <Slide />;
};
