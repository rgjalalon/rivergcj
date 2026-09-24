import '../../loadFonts';
import {AbsoluteFill, Img, staticFile} from 'remotion';

// Five-slide magazine carousel (1080×1350): "What Gisele, David, Steph & Serena know
// about ageing well". White page, one grid for every slide: running head and rule at
// the top, numbered headline, photo and text columns that swap sides slide to slide,
// a research stat pinned to the photo's baseline, and the wordmark as the footer.
export const SLIDE_W = 1080;
export const SLIDE_H = 1350;

const c = {
  page: '#FFFFFF',
  ink: '#1F1B18',
  body: '#5E5852',
  muted: '#9A938B',
  rule: '#E4DFD8',
};

const sans = '"DM Sans", Inter, -apple-system, "Helvetica Neue", Arial, sans-serif';

const M = 72; // outer margin
const COL_GAP = 40;
const PHOTO_W = 470;
const TEXT_W = SLIDE_W - M * 2 - PHOTO_W - COL_GAP;
const BODY_TOP = 430;
const PHOTO_H = 700;

const img = (f: string) => staticFile(`posts/aging2/${f}`);

type Story = {
  n: string;
  headline: string;
  name: string;
  photo: string;
  pos: string;
  body: string;
  figure?: string;
  stat: string;
  source: string;
};

const stories: Story[] = [
  {
    n: '01',
    headline: 'Eat for the long game.',
    name: 'Gisele Bündchen, 46',
    photo: 'gisele.jpg',
    pos: '55% 20%',
    body: 'A plant-forward, Mediterranean-style diet for over a decade. Vegetables, good fats, almost no processed food. She’s called food her medicine.',
    figure: '~30%',
    stat: 'fewer major cardiovascular events on a Mediterranean diet with olive oil or nuts, in the PREDIMED trial of about 7,400 people.',
    source: 'New England Journal of Medicine, 2018',
  },
  {
    n: '02',
    headline: 'Choose consistency over intensity.',
    name: 'David Beckham, 51',
    photo: 'david.jpg',
    pos: '47% 20%',
    body: 'Strength sessions, ice baths, daily discipline. He’s said staying in shape stopped being about football a long time ago. Now it’s about being healthy for his family.',
    figure: '10–17%',
    stat: 'lower risk of early death with regular muscle-strengthening activity.',
    source: 'British Journal of Sports Medicine, 2022',
  },
  {
    n: '03',
    headline: 'Recover smarter than you train.',
    name: 'Stephen Curry, 38',
    photo: 'steph.jpg',
    pos: '55% 20%',
    body: 'His edge isn’t talent anymore, it’s recovery. Float tanks, mobility work, strict sleep, and a training staff that treats his body like a long-term investment.',
    figure: '199',
    stat: 'cohort studies (20.9 million observations) found cardiorespiratory fitness is one of the strongest predictors of living longer.',
    source: 'British Journal of Sports Medicine, 2024',
  },
  {
    n: '04',
    headline: 'Build strength you can retire on.',
    name: 'Serena Williams, 44',
    photo: 'serena.jpg',
    pos: '50% 15%',
    body: 'She won a Grand Slam at 35, while pregnant, on a foundation of strength training. Muscle isn’t aesthetics. It’s insurance.',
    stat: 'In older adults, more muscle mass was linked to significantly lower mortality, independent of weight.',
    source: 'American Journal of Medicine, 2014',
  },
];

/* ---------- Shared pieces ---------- */

const Caps: React.FC<{children: React.ReactNode; size?: number; color?: string; spacing?: number}> = ({
  children,
  size = 13,
  color = c.muted,
  spacing = 3,
}) => (
  <div
    style={{
      fontFamily: sans,
      fontSize: size,
      fontWeight: 500,
      letterSpacing: spacing,
      textTransform: 'uppercase',
      color,
    }}
  >
    {children}
  </div>
);

const RunningHead: React.FC<{right: string}> = ({right}) => (
  <>
    <div style={{position: 'absolute', left: M, right: M, top: 52, display: 'flex', justifyContent: 'space-between'}}>
      <Caps>The longevity issue</Caps>
      <Caps>{right}</Caps>
    </div>
    <div style={{position: 'absolute', left: M, right: M, top: 88, height: 1, background: c.rule}} />
  </>
);

const Wordmark: React.FC<{height: number; top?: number; bottom?: number}> = ({height, top, bottom}) => (
  <div style={{position: 'absolute', left: 0, right: 0, top, bottom, display: 'flex', justifyContent: 'center'}}>
    <Img src={img('wordmark.png')} style={{height, display: 'block'}} />
  </div>
);

const Page: React.FC<{children: React.ReactNode}> = ({children}) => (
  <AbsoluteFill style={{background: c.page, fontFamily: sans, color: c.ink}}>{children}</AbsoluteFill>
);

/* ---------- Cover ---------- */

const coverPhotos = [
  {f: 'gisele.jpg', name: 'Gisele', pos: '58% 0%'},
  {f: 'david.jpg', name: 'David', pos: '47% 0%'},
  {f: 'steph.jpg', name: 'Steph', pos: '52% 0%'},
  {f: 'serena.jpg', name: 'Serena', pos: '50% 0%'},
];

const Cover: React.FC = () => {
  const w = (SLIDE_W - M * 2 - 16 * 3) / 4;
  return (
    <Page>
      <Wordmark height={40} top={58} />
      <div style={{position: 'absolute', left: M, right: M, top: 124, height: 1, background: c.rule}} />
      <div style={{position: 'absolute', left: M, right: M, top: 144, display: 'flex', justifyContent: 'space-between'}}>
        <Caps>The longevity issue</Caps>
        <Caps>Four rules</Caps>
      </div>

      <div
        style={{
          position: 'absolute',
          left: M,
          right: M,
          top: 222,
          textAlign: 'center',
          fontSize: 86,
          fontWeight: 300,
          lineHeight: 1.04,
          letterSpacing: -2.2,
        }}
      >
        What Gisele, David,
        <br />
        Steph &amp; Serena know
        <br />
        about ageing well
      </div>

      <div style={{position: 'absolute', left: M, top: 560, display: 'flex', gap: 16}}>
        {coverPhotos.map((p) => (
          <div key={p.name} style={{width: w}}>
            <Img
              src={img(p.f)}
              style={{width: w, height: 470, objectFit: 'cover', objectPosition: p.pos, display: 'block'}}
            />
            <div style={{marginTop: 16, textAlign: 'center'}}>
              <Caps>{p.name}</Caps>
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          position: 'absolute',
          left: M,
          right: M,
          top: 1128,
          textAlign: 'center',
          fontSize: 24,
          fontWeight: 300,
          lineHeight: 1.45,
          color: c.body,
        }}
      >
        Successful people optimise their businesses.
        <br />
        High performers optimise themselves.
      </div>

      <div style={{position: 'absolute', right: M, bottom: 56}}>
        <Caps color={c.ink}>Swipe →</Caps>
      </div>
    </Page>
  );
};

/* ---------- Story slides ---------- */

const StorySlide: React.FC<{s: Story; flip: boolean}> = ({s, flip}) => {
  const photoX = flip ? SLIDE_W - M - PHOTO_W : M;
  const textX = flip ? M : M + PHOTO_W + COL_GAP;
  return (
    <Page>
      <RunningHead right={`${s.n} / 04`} />

      {/* Numbered headline, bottom-aligned so every slide's headline ends at the same height */}
      <div
        style={{
          position: 'absolute',
          left: M,
          right: M,
          top: 132,
          height: BODY_TOP - 132 - 40,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div style={{fontSize: 22, fontWeight: 400, letterSpacing: 1, color: c.muted}}>No. {s.n}</div>
        <div
          style={{
            marginTop: 'auto',
            fontSize: 84,
            fontWeight: 300,
            lineHeight: 1.02,
            letterSpacing: -2.2,
            maxWidth: 900,
          }}
        >
          {s.headline}
        </div>
      </div>

      {/* Photo */}
      <Img
        src={img(s.photo)}
        style={{
          position: 'absolute',
          left: photoX,
          top: BODY_TOP,
          width: PHOTO_W,
          height: PHOTO_H,
          objectFit: 'cover',
          objectPosition: s.pos,
        }}
      />

      {/* Text column: name and story at the top, stat pinned to the photo's baseline */}
      <div
        style={{
          position: 'absolute',
          left: textX,
          top: BODY_TOP,
          width: TEXT_W,
          height: PHOTO_H,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Caps size={15} color={c.ink} spacing={3.5}>
          {s.name}
        </Caps>
        <div style={{marginTop: 22, fontSize: 25, fontWeight: 300, lineHeight: 1.5, color: c.body}}>{s.body}</div>

        <div style={{marginTop: 'auto', borderTop: `1px solid ${c.rule}`, paddingTop: 22}}>
          {s.figure ? (
            <div style={{fontSize: 68, fontWeight: 300, lineHeight: 1, letterSpacing: -1.5}}>{s.figure}</div>
          ) : null}
          <div
            style={{
              marginTop: s.figure ? 12 : 0,
              fontSize: 18,
              fontWeight: 400,
              lineHeight: 1.45,
              color: c.ink,
            }}
          >
            {s.stat}
          </div>
          <div style={{marginTop: 12, fontSize: 13, color: c.muted}}>{s.source}</div>
        </div>
      </div>

      <Wordmark height={24} bottom={58} />
    </Page>
  );
};

export const SLIDES: React.FC[] = [
  Cover,
  ...stories.map((s, i) => {
    const Slide: React.FC = () => <StorySlide s={s} flip={i % 2 === 1} />;
    return Slide;
  }),
];

export const AgingWellSlide: React.FC<{index: number}> = ({index}) => {
  const Slide = SLIDES[index];
  return <Slide />;
};
