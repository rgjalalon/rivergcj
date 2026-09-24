import {AbsoluteFill, Img, staticFile} from 'remotion';

// Magazine cover (1080×1350) for "What Gisele, David, Steph and Serena know about
// aging well". No type: four arched portraits rise left to right like a staircase,
// leaving the top-left open for the masthead and cover lines.
export const COVER_W = 1080;
export const COVER_H = 1350;

const MARGIN_X = 64;
const GUTTER = 16;
const BOTTOM = 1238;
const CELL_W = (COVER_W - MARGIN_X * 2 - GUTTER * 3) / 4;

// `top` sets the step; `x` keeps each face centred in the narrow arch.
const photos = [
  {file: '1.jpg', top: 560, x: '44%'},
  {file: '2.jpg', top: 460, x: '51%'},
  {file: '3.jpg', top: 360, x: '56%'},
  {file: '4.jpg', top: 260, x: '49%'},
];

// `mono` renders the portraits in warm black and white for a more unified, editorial look.
export const CoverCollage: React.FC<{mono?: boolean}> = ({mono = false}) => (
  <AbsoluteFill style={{background: '#F8F8F8'}}>
    {photos.map((p, i) => (
      <div
        key={p.file}
        style={{
          position: 'absolute',
          left: MARGIN_X + i * (CELL_W + GUTTER),
          top: p.top,
          width: CELL_W,
          height: BOTTOM - p.top,
          borderRadius: `${CELL_W / 2}px ${CELL_W / 2}px 0 0`,
          overflow: 'hidden',
          background: '#E9E6E1',
        }}
      >
        <Img
          src={staticFile(`posts/cover/${p.file}`)}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: `${p.x} 0%`,
            filter: mono ? 'grayscale(1) sepia(0.12) contrast(1.06)' : undefined,
          }}
        />
      </div>
    ))}
  </AbsoluteFill>
);
