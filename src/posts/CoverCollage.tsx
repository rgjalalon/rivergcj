import {AbsoluteFill, Img, staticFile} from 'remotion';

// Minimalist magazine cover (1080×1350) with no type: open space at the top for a
// masthead and a four-photo grid below. Text is added afterwards.
export const COVER_W = 1080;
export const COVER_H = 1350;

const MARGIN_X = 92;
const TOP = 214;
const GUTTER = 16;
const CELL_W = (COVER_W - MARGIN_X * 2 - GUTTER) / 2;
const CELL_H = 520;

// objectPosition keeps each face in frame when the photo is cropped to the cell.
const photos = [
  {file: '1.jpg', position: '50% 20%'},
  {file: '2.jpg', position: '50% 30%'},
  {file: '3.jpg', position: '50% 25%'},
  {file: '4.jpg', position: '50% 15%'},
];

export const CoverCollage: React.FC = () => (
  <AbsoluteFill style={{background: '#F8F8F8'}}>
    {photos.map((p, i) => (
      <Img
        key={p.file}
        src={staticFile(`posts/cover/${p.file}`)}
        style={{
          position: 'absolute',
          left: MARGIN_X + (i % 2) * (CELL_W + GUTTER),
          top: TOP + Math.floor(i / 2) * (CELL_H + GUTTER),
          width: CELL_W,
          height: CELL_H,
          objectFit: 'cover',
          objectPosition: p.position,
        }}
      />
    ))}
  </AbsoluteFill>
);
