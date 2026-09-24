import {AbsoluteFill, interpolate} from 'remotion';
import {fonts} from '../theme';
import {easeOut} from '../timeline';

// Animatic stand-ins for the live-action shots, drawn at the picture size
// (1080×1040). Subjects sit in soft focus with blurred backgrounds and bokeh,
// so the frame reads like shallow depth of field until real clips replace them.

const W = 1080;
const H = 1040;

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

const Stage: React.FC<{children: React.ReactNode; bg: string}> = ({children, bg}) => (
  <AbsoluteFill style={{background: bg}}>
    <svg width="100%" height="100%" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice" style={{position: 'absolute', inset: 0}}>
      <defs>
        {[2, 4, 8, 14, 24, 40].map((b) => (
          <filter key={b} id={`b${b}`} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation={b} />
          </filter>
        ))}
      </defs>
      {children}
    </svg>
  </AbsoluteFill>
);

/** Out-of-focus light discs. */
const Bokeh: React.FC<{t: number; dots: [number, number, number, string, number][]; blur?: number}> = ({t, dots, blur = 8}) => (
  <g filter={`url(#b${blur})`}>
    {dots.map(([x, y, r, c, o], i) => (
      <circle key={i} cx={x + Math.sin((t + i * 17) / 40) * 6} cy={y} r={r} fill={c} opacity={o * (0.85 + 0.15 * Math.sin((t + i * 11) / 18))} />
    ))}
  </g>
);

type P = [number, number];
const limb = (pts: P[]) => pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x} ${y}`).join(' ');

/**
 * A soft silhouette built from round-capped strokes. Blurred slightly, it
 * reads as a figure in low light rather than a drawing.
 */
const Figure: React.FC<{
  head: P;
  headR?: number;
  neck: P;
  hip: P;
  arms: P[][];
  legs?: P[][];
  fill: string;
  blur?: number;
  hair?: React.ReactNode;
  torsoW?: number;
}> = ({head, headR = 46, neck, hip, arms, legs = [], fill, blur = 2, hair, torsoW = 118}) => (
  <g filter={`url(#b${blur})`} stroke={fill} fill={fill} strokeLinecap="round" strokeLinejoin="round">
    {legs.map((l, i) => (
      <path key={`l${i}`} d={limb(l)} strokeWidth={46} fill="none" />
    ))}
    <path d={limb([neck, hip])} strokeWidth={torsoW} fill="none" />
    <path d={limb([head, neck])} strokeWidth={34} fill="none" />
    {arms.map((a, i) => (
      <path key={`a${i}`} d={limb(a)} strokeWidth={30} fill="none" />
    ))}
    {hair}
    <ellipse cx={head[0]} cy={head[1]} rx={headR * 0.9} ry={headR} stroke="none" />
  </g>
);

// ─── 1. Lab results on a laptop, over the shoulder ────────────────────────

const labRows = [
  ['Hemoglobin', '12.9', 'g/dL', '12.0 – 15.5'],
  ['Ferritin', '18', 'ng/mL', '15 – 150'],
  ['TSH', '2.1', 'mIU/L', '0.4 – 4.0'],
  ['Vitamin D', '31', 'ng/mL', '30 – 100'],
  ['Vitamin B12', '412', 'pg/mL', '200 – 900'],
  ['Glucose', '88', 'mg/dL', '70 – 99'],
];

export const Labs: React.FC<{t: number}> = ({t}) => {
  const push = interpolate(t, [0, 100], [1, 1.12], {...clamp, easing: easeOut});
  const cursorY = interpolate(t, [10, 60], [520, 452], {...clamp, easing: easeOut});
  const hl = interpolate(t, [56, 72], [0, 1], clamp);
  return (
    <AbsoluteFill style={{background: '#0E0907'}}>
      <Stage bg="transparent">
        <Bokeh t={t} blur={24} dots={[[110, 180, 60, '#C89B6D', 0.35], [220, 90, 34, '#E8C9A0', 0.25], [980, 140, 44, '#8A5E34', 0.3]]} />
        {/* Screen glow on the room */}
        <ellipse cx={640} cy={520} rx={620} ry={420} fill="#F5F0E8" opacity={0.07} filter="url(#b40)" />
      </Stage>
      {/* Laptop screen, angled away, in focus */}
      <AbsoluteFill style={{perspective: 1400, transform: `scale(${push})`, transformOrigin: '62% 44%'}}>
        <div
          style={{
            position: 'absolute',
            left: 300,
            top: 150,
            width: 700,
            height: 500,
            transform: 'rotateY(-16deg) rotateX(4deg)',
            borderRadius: 14,
            background: '#1A1310',
            padding: 16,
            boxShadow: '0 0 120px 20px rgba(245,240,232,0.10)',
          }}
        >
          <div style={{width: '100%', height: '100%', borderRadius: 6, background: '#E9E2D6', overflow: 'hidden', fontFamily: fonts.sans, color: '#3A302A', position: 'relative'}}>
            <div style={{height: 34, background: '#D8D0C3', display: 'flex', alignItems: 'center', padding: '0 14px', fontSize: 13, color: '#6B5E52'}}>
              results_sep12.pdf
            </div>
            <div style={{padding: '18px 26px'}}>
              <div style={{fontSize: 20, fontWeight: 600}}>Laboratory Report</div>
              <div style={{fontSize: 12, color: '#7A6E62', marginTop: 4}}>Collected 12 Sep · Fasting · Primary care</div>
              <div style={{display: 'grid', gridTemplateColumns: '1.4fr 0.6fr 0.7fr 1fr 0.8fr', fontSize: 14, marginTop: 18, rowGap: 0}}>
                {['Test', 'Result', 'Units', 'Reference', 'Flag'].map((h) => (
                  <div key={h} style={{fontSize: 11.5, color: '#8A7E72', paddingBottom: 8, borderBottom: '1px solid #CFC6B8', textTransform: 'uppercase', letterSpacing: 0.8}}>
                    {h}
                  </div>
                ))}
                {labRows.map((r) =>
                  [...r, 'Normal'].map((c, j) => (
                    <div
                      key={r[0] + j}
                      style={{
                        padding: '9px 0',
                        borderBottom: '1px solid #DDD5C8',
                        background: r[0] === 'Ferritin' ? `rgba(200,155,109,${0.28 * hl})` : 'transparent',
                        fontWeight: r[0] === 'Ferritin' && j === 1 ? 600 : 400,
                      }}
                    >
                      {c}
                    </div>
                  )),
                )}
              </div>
            </div>
            {/* Cursor drifting to the ferritin row */}
            <svg width="18" height="24" viewBox="0 0 18 24" style={{position: 'absolute', left: 250, top: cursorY - 150}}>
              <path d="M1 1l15 12-7 1 4 8-3 1-4-8-5 5z" fill="#1A1310" stroke="#fff" strokeWidth="1.2" />
            </svg>
          </div>
        </div>
      </AbsoluteFill>
      {/* Foreground: blurred shoulder and head, out of focus */}
      <Stage bg="transparent">
        <g filter="url(#b24)" fill="#0A0605">
          <ellipse cx={150} cy={520} rx={170} ry={210} />
          <path d="M-80 1040 C -60 780, 120 690, 330 720 C 420 740, 460 860, 470 1040 Z" />
        </g>
        <path d="M250 380 C 300 470, 310 600, 300 700" stroke="#F5F0E8" strokeWidth={10} opacity={0.12} filter="url(#b14)" fill="none" />
      </Stage>
    </AbsoluteFill>
  );
};

// ─── 2. 2am, desk lamp, rubbing temples ────────────────────────────────────

export const Temples: React.FC<{t: number}> = ({t}) => {
  const rub = Math.sin(t / 6) * 5;
  return (
    <Stage bg="#0D0907">
      {/* Night window, cool and far away */}
      <rect x={640} y={80} width={380} height={520} fill="#1B2230" opacity={0.7} filter="url(#b14)" />
      <Bokeh t={t} blur={14} dots={[[700, 220, 16, '#E8C9A0', 0.5], [790, 300, 12, '#C8D2E0', 0.35], [900, 180, 20, '#E8C9A0', 0.4], [960, 380, 14, '#C89B6D', 0.45], [760, 470, 10, '#E8C9A0', 0.4]]} />
      {/* Lamp pool of light on the desk */}
      <ellipse cx={330} cy={770} rx={420} ry={120} fill="#C89B6D" opacity={0.4} filter="url(#b40)" />
      <ellipse cx={260} cy={330} rx={340} ry={360} fill="#E8B982" opacity={0.18} filter="url(#b40)" />
      {/* Lamp */}
      <g filter="url(#b4)">
        <path d="M150 210 L 330 210 L 290 120 L 190 120 Z" fill="#2A1D14" />
        <ellipse cx={240} cy={214} rx={90} ry={12} fill="#FFE2B8" opacity={0.9} />
        <path d="M240 214 L 240 740" stroke="#2A1D14" strokeWidth={10} />
      </g>
      {/* Desk */}
      <rect x={0} y={760} width={W} height={300} fill="#1E1510" />
      <rect x={0} y={760} width={W} height={6} fill="#C89B6D" opacity={0.25} />
      {/* Blurred clock glow on the desk: 2:07 */}
      <g filter="url(#b4)" opacity={0.75}>
        <rect x={860} y={700} width={150} height={60} rx={10} fill="#130D0A" />
        <text x={935} y={743} textAnchor="middle" fontFamily="Inter" fontSize={34} fill="#E08A5A">
          2:07
        </text>
      </g>
      {/* Figure in profile, elbow on the desk, fingers pressed to her temple */}
      <g filter="url(#b2)" fill="#2B1D14" stroke="#2B1D14" strokeLinecap="round">
        <path d="M600 700 C 590 620, 600 560, 640 530 C 690 500, 770 520, 800 570 C 830 620, 840 700, 840 780 L 600 780 Z" stroke="none" />
        <path d="M612 470 L 650 540" strokeWidth={46} fill="none" />
        <ellipse cx={590} cy={425} rx={52} ry={62} transform="rotate(-18 590 425)" stroke="none" />
        <path d="M600 372 C 660 360, 690 420, 680 490 C 676 540, 700 570, 730 590 L 660 600 C 640 560, 630 520, 632 480 Z" stroke="none" />
        <path d={`M630 560 L 520 748`} strokeWidth={50} fill="none" />
        <path d={`M520 748 L ${552 + rub * 0.3} ${452 + rub}`} strokeWidth={40} fill="none" />
        <ellipse cx={550 + rub * 0.3} cy={430 + rub} rx={26} ry={36} transform={`rotate(-14 ${550 + rub * 0.3} ${430 + rub})`} stroke="none" />
      </g>
      {/* Warm rim light from the lamp on her face and forearm */}
      <path d="M548 385 C 536 410, 534 440, 546 470" stroke="#E8B982" strokeWidth={5} opacity={0.55} fill="none" filter="url(#b2)" />
      <path d={`M500 740 C 510 640, 522 540, ${530 + rub * 0.3} ${470 + rub}`} stroke="#E8B982" strokeWidth={6} opacity={0.4} fill="none" filter="url(#b4)" />
    </Stage>
  );
};

// ─── 3. Runner stopped mid-run, catching her breath ────────────────────────

export const Runner: React.FC<{t: number}> = ({t}) => {
  const breath = Math.sin(t / 8) * 6;
  return (
    <Stage bg="#1A120D">
      <defs>
        <linearGradient id="dusk" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2A1E17" />
          <stop offset="0.5" stopColor="#6B4730" />
          <stop offset="0.72" stopColor="#C8895A" />
          <stop offset="0.8" stopColor="#4A3223" />
        </linearGradient>
      </defs>
      <rect width={W} height={H} fill="url(#dusk)" />
      <circle cx={300} cy={690} r={80} fill="#FFD9A6" opacity={0.85} filter="url(#b24)" />
      {/* Treeline, far and soft */}
      <path d="M0 720 C 80 650, 160 700, 240 660 C 330 620, 420 690, 520 650 C 620 610, 720 690, 820 640 C 920 600, 1000 680, 1080 650 L 1080 800 L 0 800 Z" fill="#2A1C14" filter="url(#b8)" />
      <Bokeh t={t} blur={14} dots={[[120, 640, 22, '#FFD9A6', 0.35], [460, 660, 16, '#FFD9A6', 0.3], [880, 630, 26, '#E8B982', 0.3]]} />
      {/* Path */}
      <path d="M0 1040 L 360 790 L 720 790 L 1080 1040 Z" fill="#2E2018" />
      <rect x={0} y={790} width={W} height={260} fill="#1A110C" opacity={0.6} />
      {/* Runner, bent forward, hands on knees */}
      <Figure
        fill="#140D09"
        blur={2}
        head={[800, 630 + breath * 0.6]}
        headR={40}
        neck={[760, 640 + breath * 0.5]}
        hip={[620, 690]}
        torsoW={96}
        arms={[
          [[740, 650 + breath * 0.5], [720, 720], [690, 780]],
          [[760, 650 + breath * 0.5], [750, 725], [730, 780]],
        ]}
        legs={[
          [[620, 690], [690, 790], [680, 920]],
          [[610, 700], [620, 800], [580, 920]],
        ]}
        hair={<path d={`M780 600 C 740 590, 700 600, 680 ${640 + breath}`} strokeWidth={22} fill="none" />}
      />
      {/* Rim light from the low sun */}
      <path d={`M620 660 C 660 640, 720 628, 770 ${616 + breath * 0.5}`} stroke="#FFD2A0" strokeWidth={4} opacity={0.45} fill="none" filter="url(#b2)" />
    </Stage>
  );
};

// ─── 4. Morning sunlight through a window ──────────────────────────────────

const Motes: React.FC<{t: number}> = ({t}) => (
  <g>
    {Array.from({length: 26}).map((_, i) => {
      const x = (i * 97) % 520 + 60;
      const y = ((i * 131 + t * (0.6 + (i % 5) * 0.15)) % 900) + 40;
      return <circle key={i} cx={x + Math.sin((t + i * 13) / 30) * 12} cy={1000 - y} r={1.5 + (i % 3)} fill="#FFF3DE" opacity={0.55} filter="url(#b2)" />;
    })}
  </g>
);

const MorningRoom: React.FC<{t: number; children: React.ReactNode}> = ({t, children}) => (
  <Stage bg="#8C6A4E">
    <defs>
      <linearGradient id="room" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#F3DDBE" />
        <stop offset="0.45" stopColor="#C9A07A" />
        <stop offset="1" stopColor="#6E4F39" />
      </linearGradient>
      <linearGradient id="beam" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#FFF4E2" stopOpacity="0.75" />
        <stop offset="1" stopColor="#FFF4E2" stopOpacity="0" />
      </linearGradient>
    </defs>
    <rect width={W} height={H} fill="url(#room)" />
    {/* Window, blown out */}
    <g filter="url(#b14)">
      <rect x={-40} y={60} width={420} height={760} fill="#FFF8EC" />
      <rect x={160} y={60} width={16} height={760} fill="#D9B892" opacity={0.6} />
      <rect x={-40} y={420} width={420} height={14} fill="#D9B892" opacity={0.6} />
    </g>
    {/* Linen curtain */}
    <path d="M380 0 C 400 300, 360 600, 400 1040 L 470 1040 C 440 600, 470 300, 450 0 Z" fill="#F5E9D6" opacity={0.55} filter="url(#b8)" />
    {/* Light beams across the room */}
    <path d={`M300 80 L 1080 ${600 + Math.sin(t / 50) * 10} L 1080 900 L 300 700 Z`} fill="url(#beam)" opacity={0.5} filter="url(#b24)" />
    <Motes t={t} />
    {children}
  </Stage>
);

export const Sunlight: React.FC<{t: number}> = ({t}) => {
  const tilt = interpolate(t, [0, 90], [0, -14], {...clamp, easing: easeOut});
  return (
    <MorningRoom t={t}>
      <Figure
        fill="#5A3E2B"
        blur={4}
        head={[620, 470 + tilt * 0.3]}
        headR={52}
        neck={[640, 570]}
        hip={[660, 1000]}
        torsoW={150}
        arms={[
          [[610, 600], [590, 800], [610, 960]],
          [[680, 600], [700, 800], [690, 960]],
        ]}
        hair={<path d="M650 420 C 720 430, 730 560, 700 660 L 660 650 C 680 560, 670 480, 640 450 Z" stroke="none" />}
      />
      {/* Sun on her face */}
      <path d={`M578 ${440 + tilt * 0.3} C 564 470, 566 500, 584 ${522 + tilt * 0.3}`} stroke="#FFE8C4" strokeWidth={8} opacity={0.7} fill="none" filter="url(#b4)" />
      <path d="M592 590 C 570 700, 566 820, 580 1000" stroke="#FFE8C4" strokeWidth={8} opacity={0.35} fill="none" filter="url(#b8)" />
    </MorningRoom>
  );
};

export const Stretch: React.FC<{t: number}> = ({t}) => {
  const up = interpolate(t, [6, 60], [0, 1], {...clamp, easing: easeOut});
  const elbowL: P = [interpolate(up, [0, 1], [560, 560]), interpolate(up, [0, 1], [780, 470])];
  const handL: P = [interpolate(up, [0, 1], [580, 628]), interpolate(up, [0, 1], [950, 330])];
  const elbowR: P = [interpolate(up, [0, 1], [740, 740]), interpolate(up, [0, 1], [780, 470])];
  const handR: P = [interpolate(up, [0, 1], [720, 672]), interpolate(up, [0, 1], [950, 330])];
  return (
    <MorningRoom t={t + 90}>
      <Figure
        fill="#4E3525"
        blur={4}
        head={[650, 480 - up * 10]}
        headR={52}
        neck={[650, 580]}
        hip={[655, 1000]}
        torsoW={150}
        arms={[
          [[610, 610], elbowL, handL],
          [[690, 610], elbowR, handR],
        ]}
        hair={<ellipse cx={650} cy={430 - up * 10} rx={40} ry={26} stroke="none" />}
      />
      <path d={`M606 610 L ${elbowL[0] - 12} ${elbowL[1]} L ${handL[0] - 10} ${handL[1]}`} stroke="#FFE8C4" strokeWidth={6} opacity={0.45} fill="none" filter="url(#b4)" />
    </MorningRoom>
  );
};

// ─── 6. A laugh over coffee ────────────────────────────────────────────────

const Steam: React.FC<{x: number; y: number; t: number; seed: number}> = ({x, y, t, seed}) => (
  <g filter="url(#b4)" opacity={0.5}>
    {[0, 1, 2].map((i) => {
      const s = t / 14 + seed + i * 2;
      const d = `M${x + i * 14 - 14} ${y} C ${x + Math.sin(s) * 24} ${y - 60}, ${x - Math.sin(s + 1) * 24} ${y - 120}, ${x + Math.sin(s + 2) * 18} ${y - 190}`;
      return <path key={i} d={d} stroke="#FFF6E8" strokeWidth={5} fill="none" strokeLinecap="round" />;
    })}
  </g>
);

export const Coffee: React.FC<{t: number}> = ({t}) => {
  // Shoulders shake when they laugh.
  const laugh = interpolate(t, [20, 34], [0, 1], clamp) * (1 - interpolate(t, [70, 90], [0, 1], clamp));
  const bobA = Math.abs(Math.sin(t / 3.2)) * 10 * laugh;
  const bobB = Math.abs(Math.sin(t / 3.6 + 1)) * 8 * laugh;
  return (
    <Stage bg="#A07B5A">
      <defs>
        <linearGradient id="cafe" x1="0" y1="0" x2="1" y2="0.3">
          <stop offset="0" stopColor="#F2DCBC" />
          <stop offset="0.6" stopColor="#B88A62" />
          <stop offset="1" stopColor="#6B4C37" />
        </linearGradient>
      </defs>
      <rect width={W} height={H} fill="url(#cafe)" />
      <Bokeh t={t} blur={14} dots={[[140, 160, 50, '#FFF4E2', 0.6], [300, 90, 30, '#FFF4E2', 0.5], [880, 200, 44, '#FFE0B4', 0.45], [990, 380, 30, '#FFE0B4', 0.35]]} />
      {/* Two friends, soft focus behind the table */}
      <Figure fill="#5E4230" blur={8} head={[320, 400 - bobA]} headR={60} neck={[330, 510 - bobA * 0.7]} hip={[340, 760]} torsoW={170}
        arms={[[[280, 540 - bobA * 0.7], [260, 700], [380, 720]]]}
        hair={<path d={`M270 ${360 - bobA} C 250 440, 260 520, 280 ${560 - bobA * 0.7} L 360 ${540 - bobA * 0.7} C 380 460, 380 400, 340 ${350 - bobA} Z`} stroke="none" />}
      />
      <Figure fill="#4A3324" blur={8} head={[780, 380 - bobB]} headR={58} neck={[770, 490 - bobB * 0.7]} hip={[760, 760]} torsoW={170}
        arms={[[[810, 520 - bobB * 0.7], [840, 690], [720, 720]]]}
      />
      {/* Table, in focus */}
      <rect x={0} y={620} width={W} height={440} fill="#3E2B1F" />
      <rect x={0} y={620} width={W} height={5} fill="#F2DCBC" opacity={0.4} />
      {/* Mugs */}
      {[
        [400, 650, '#F5F0E8'],
        [660, 668, '#C89B6D'],
      ].map(([x, y, c], i) => (
        <g key={i}>
          <ellipse cx={(x as number) + 6} cy={(y as number) + 118} rx={82} ry={14} fill="#1E140E" opacity={0.5} filter="url(#b4)" />
          <path d={`M${(x as number) - 70} ${y} L ${(x as number) - 60} ${(y as number) + 110} Q ${x} ${(y as number) + 126} ${(x as number) + 60} ${(y as number) + 110} L ${(x as number) + 70} ${y} Z`} fill={c as string} />
          <path d={`M${(x as number) + 68} ${(y as number) + 24} C ${(x as number) + 118} ${(y as number) + 24}, ${(x as number) + 118} ${(y as number) + 84}, ${(x as number) + 62} ${(y as number) + 84}`} stroke={c as string} strokeWidth={14} fill="none" />
          <ellipse cx={x as number} cy={y as number} rx={70} ry={14} fill="#3B2518" />
          <ellipse cx={(x as number) - 20} cy={(y as number) - 2} rx={24} ry={4} fill="#C89B6D" opacity={0.5} />
          <Steam x={x as number} y={(y as number) - 16} t={t} seed={i * 3} />
        </g>
      ))}
    </Stage>
  );
};
