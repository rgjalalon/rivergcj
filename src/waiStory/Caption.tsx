import {useCurrentFrame} from 'remotion';
import {fonts} from '../theme';
import {progress} from '../timeline';
import {captions, PICTURE_H, PICTURE_TOP} from './timeline';

/** Quiet lowercase captions near the bottom of the picture, like subtitles in a film. */
export const StoryCaptions: React.FC = () => {
  const frame = useCurrentFrame();
  const c = captions.find((cap) => frame >= cap.from && frame < cap.to);
  if (!c) return null;
  const out = 1 - progress(frame, c.to - 8, 8);
  return (
    <div
      style={{
        position: 'absolute',
        left: 90,
        right: 90,
        top: PICTURE_TOP + PICTURE_H - 170,
        textAlign: 'center',
        fontFamily: fonts.sans,
        fontWeight: 400,
        fontSize: 42,
        lineHeight: 1.35,
        letterSpacing: 0.2,
        color: '#FFFFFF',
        textShadow: '0 2px 18px rgba(20,12,8,0.6), 0 1px 3px rgba(20,12,8,0.5)',
        opacity: out,
        zIndex: 20,
      }}
    >
      {c.parts.map((p) => {
        const inP = progress(frame, p.at, 12);
        return (
          <span key={p.at} style={{opacity: inP, whiteSpace: 'pre-wrap'}}>
            {p.text}
          </span>
        );
      })}
    </div>
  );
};
