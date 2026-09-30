// Builds rebuilding-the-spark.pptx: the same 10-page carousel as article.html, but with
// every heading, paragraph and quote as a native text box so it imports editable into Canva.
// Needs pptxgenjs and sharp:  npm i pptxgenjs sharp  (or run with NODE_PATH pointing at them)
const path = require('path');
const fs = require('fs');
const pptxgen = require('pptxgenjs');
const sharp = require('sharp');

const dir = __dirname;
const out = (f) => path.join(dir, f);

// Canvas is 1080×1350 px, same as the HTML pages. 144 px = 1 inch, 2 px = 1 pt.
const W = 1080, H = 1350;
const u = (px) => px / 144;
const pt = (px) => px / 2;

const C = {
  cream: 'F5F0E8', paper: 'FBF8F3', sand: 'EDE5D9', line: 'D9CCBA', lineDark: '5D4F43',
  taupe: 'B8A691', caramel: 'C89B6D', deep: '8A5E34', espresso: '3E2F23', ink: '2E231A', muted: '7D6D5C',
};
const F = { display: 'Playfair Display', text: 'Newsreader', label: 'Inter' };

async function logoPng(hex) {
  const { data, info } = await sharp(out('assets/the-wellness-logo.png')).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16));
  for (let i = 0; i < data.length; i += 4) {
    const lum = (data[i] + data[i + 1] + data[i + 2]) / 3;
    data[i + 3] = Math.round((255 - lum) * data[i + 3] / 255);
    data[i] = r; data[i + 1] = g; data[i + 2] = b;
  }
  const buf = await sharp(data, { raw: info }).trim({ threshold: 1 }).png().toBuffer();
  const m = await sharp(buf).metadata();
  return { data: 'image/png;base64,' + buf.toString('base64'), ratio: m.width / m.height };
}

async function sparkPng() {
  const svg = fs.readFileSync(out('article.html'), 'utf8').match(/<svg class="art"[\s\S]*?<\/svg>/)[0]
    .replace('<svg class="art"', '<svg xmlns="http://www.w3.org/2000/svg"');
  const buf = await sharp(Buffer.from(svg), { density: 216 }).png().toBuffer();
  return 'image/png;base64,' + buf.toString('base64');
}

(async () => {
  const logoDark = await logoPng(C.espresso);
  const logoLight = await logoPng(C.cream);
  const spark = await sparkPng();

  const pres = new pptxgen();
  pres.defineLayout({ name: 'LINKEDIN_PORTRAIT', width: u(W), height: u(H) });
  pres.layout = 'LINKEDIN_PORTRAIT';
  pres.title = 'Rebuilding the Spark We Thought We Lost';
  pres.author = 'The Wellness';

  const X = 96, CW = W - 2 * X; // side margin and content width

  const text = (s, runs, { x = X, y, w = CW, h, ...o }) =>
    s.addText(runs, { x: u(x), y: u(y), w: u(w), h: u(h), margin: 0, valign: 'top', isTextBox: true, fit: 'none', ...o });
  const hline = (s, y, color, { x = X, w = CW, weight = 0.75 } = {}) =>
    s.addShape(pres.shapes.LINE, { x: u(x), y: u(y), w: u(w), h: 0, line: { color, width: weight } });
  const logo = (s, l, x, y, h) => s.addImage({ data: l.data, x: u(x), y: u(y), h: u(h), w: u(h * l.ratio), altText: 'The Wellness' });

  const label = (color, size = 17, bold = false) =>
    ({ fontFace: F.label, fontSize: pt(size), color, bold, charSpacing: pt(size * 0.2) });
  const body = (color = C.ink, size = 30) => ({ fontFace: F.text, fontSize: pt(size), color, lineSpacing: pt(size * 1.5) });
  const cite = (t, color = C.muted) => ({ text: t, options: { fontFace: F.text, italic: true, fontSize: pt(24), color } });
  const plain = (t, extra = {}) => ({ text: t, options: extra });

  function page(num, { dark = false, bg = C.cream, footer }) {
    const s = pres.addSlide();
    s.background = { color: dark ? C.espresso : bg };
    const fg = dark ? C.taupe : C.muted;
    logo(s, dark ? logoLight : logoDark, X, 97, 34);
    text(s, 'REBUILDING THE SPARK', { x: 300, y: 99, w: 480, h: 30, align: 'center', ...label(fg) });
    text(s, `${String(num).padStart(2, '0')} / 10`, { x: 784, y: 99, w: 200, h: 30, align: 'right', ...label(fg) });
    hline(s, 162, dark ? C.lineDark : C.line);
    if (footer) {
      text(s, footer.toUpperCase(), { y: 1236, w: 700, h: 30, ...label(fg, 16) });
      text(s, '→', { x: 884, y: 1232, w: 100, h: 30, align: 'right', fontFace: F.label, fontSize: 10, color: dark ? C.caramel : C.deep });
    }
    return s;
  }
  function kicker(s, t, y, dark = false) {
    const color = dark ? C.caramel : C.deep;
    text(s, t.toUpperCase(), { y, w: 600, h: 28, ...label(color, 17, true) });
    const tw = t.length * 14.2;
    hline(s, y + 11, color, { x: X + tw + 18, w: 64 });
  }
  // plainPart may contain '\n' to force the same line break as the HTML design.
  const heading = (s, plainPart, em, y, h, size = 64, dark = false) =>
    text(s, [
      ...plainPart.split('\n').map((t, i, a) => plain(i < a.length - 1 || !t ? t : t + ' ', { breakLine: i < a.length - 1 })),
      plain(em, { italic: true, color: dark ? C.caramel : C.deep }),
    ],
      { y, h, fontFace: F.display, fontSize: pt(size), color: dark ? C.cream : C.ink, lineSpacing: pt(size * 1.08) });

  // 01 · Cover
  {
    const s = pres.addSlide();
    s.background = { color: C.cream };
    s.addImage({ data: spark, x: u(W - 620 + 150), y: u(150), w: u(620), h: u(620) });
    logo(s, logoDark, X, 108, 58);
    text(s, 'ESSAY\nIDENTITY & GROWTH', { x: 584, y: 96, w: 400, h: 70, align: 'right', ...label(C.muted, 16), lineSpacing: pt(26) });
    text(s, [
      plain('Rebuilding', { breakLine: true }),
      plain('the '), plain('Spark', { italic: true, color: C.deep, breakLine: true }),
      plain('We Thought', { breakLine: true }),
      plain('We Lost'),
    ], { y: 548, h: 500, fontFace: F.display, fontSize: pt(124), color: C.espresso, lineSpacing: pt(122) });
    text(s, 'On memory, identity, and the quiet work of beginning again.',
      { y: 1068, w: 760, h: 110, fontFace: F.text, italic: true, fontSize: pt(34), color: C.muted, lineSpacing: pt(48) });
    hline(s, 1219, C.line);
    text(s, 'A REFLECTION · 10 PAGES', { y: 1242, w: 500, h: 30, ...label(C.muted, 16) });
    text(s, 'SWIPE TO READ →', { x: 584, y: 1242, w: 400, h: 30, align: 'right', ...label(C.deep, 16) });
  }

  // 02 · Opening
  {
    const s = page(2, { bg: C.paper, footer: 'Introduction' });
    text(s, 'There is a particular kind of grief that comes with losing one’s spark.',
      { y: 380, h: 120, fontFace: F.text, italic: true, fontSize: pt(38), color: C.espresso, lineSpacing: pt(52) });
    hline(s, 528, C.line);
    text(s, [
      plain('It is not always dramatic or immediately visible. Sometimes, it happens quietly. It can emerge after a disappointing outcome despite significant effort, after losing someone meaningful, after a dream takes an unexpected direction, after a relationship ends, or after prolonged periods of stress slowly transform passion into simply trying to survive each day.', { breakLine: true }),
      plain('Society often celebrates individuals who maintain their motivation, confidence, and sense of purpose. However, less attention is given to the moments when that inner spark begins to fade. The experience of rebuilding oneself after difficult seasons of life is rarely discussed, even though it is a meaningful part of human development.'),
    ], { y: 566, h: 560, ...body(), paraSpaceAfter: 11 });
  }

  // 03 · Stories
  {
    const s = page(3, { footer: 'Narrative identity' });
    kicker(s, 'I · Narrative', 226);
    heading(s, 'The Stories We Tell Ourselves\nShape', 'Who We Become', 268, 150);
    text(s, [
      plain('Psychologists have long explored how individuals create meaning from their experiences. Through autobiographical memory, people preserve important moments that contribute to their sense of identity and continuity. These memories become part of the personal narratives people construct about who they were, who they are, and who they hope to become '),
      cite('(McAdams, 2001; McAdams & McLean, 2013)'), plain('.', { breakLine: true }),
      plain('Life experiences are not simply remembered as isolated events. Instead, they are often organized into stories that help individuals understand change, growth, and personal transformation.'),
    ], { y: 450, h: 470, ...body(), paraSpaceAfter: 11 });
  }

  // 04 · Stories cont. + Loss
  {
    const s = page(4, { footer: 'Grieving the past self' });
    text(s, 'This is why certain chapters of life continue to hold emotional significance. People often return to memories of earlier versions of themselves, particularly those that existed before major changes occurred.',
      { y: 222, h: 190, ...body() });
    hline(s, 447, C.espresso, { weight: 1.5 });
    text(s, [
      plain('“', { color: C.caramel }),
      plain('These memories may represent periods of confidence, curiosity, hope, or purpose that feel distant during times of uncertainty.'),
      plain('”', { color: C.caramel }),
    ], { y: 476, h: 170, fontFace: F.display, italic: true, fontSize: pt(42), color: C.espresso, lineSpacing: pt(53) });
    hline(s, 678, C.line);
    kicker(s, 'II · Loss', 742);
    heading(s, 'Grieving the Person\n', 'We Used to Be', 786, 150);
    text(s, 'At times, what people grieve is not only who they used to be, but also the emotions associated with that version of themselves. They may miss a previous sense of confidence, excitement, belonging, or direction.',
      { y: 955, h: 190, ...body() });
  }

  // 05 · Quote (dark)
  {
    const s = page(5, { dark: true, footer: 'Grieving the past self' });
    text(s, [
      plain('This experience is a natural part of adapting to change. Identity is not a fixed concept; it continues to develop as individuals encounter new experiences and reinterpret their past '),
      cite('(McLean & Syed, 2015)', C.taupe), plain('.'),
    ], { y: 205, w: 820, h: 190, ...body(C.sand) });
    hline(s, 425, C.lineDark);
    text(s, '“', { y: 470, w: 200, h: 110, fontFace: F.display, fontSize: pt(160), color: C.caramel, lineSpacing: pt(150) });
    text(s, 'Missing a previous version of oneself does not necessarily mean dissatisfaction with the present.',
      { y: 590, w: 820, h: 400, fontFace: F.display, italic: true, fontSize: pt(68), color: C.cream, lineSpacing: pt(76) });
    text(s, 'Instead, it can reflect an awareness of how deeply meaningful certain periods of life have been.',
      { y: 1030, w: 820, h: 110, fontFace: F.text, italic: true, fontSize: pt(32), color: C.taupe, lineSpacing: pt(47) });
  }

  // 06 · Nostalgia
  {
    const s = page(6, { bg: C.paper, footer: 'The role of nostalgia' });
    kicker(s, 'III · Nostalgia', 226);
    heading(s, 'Why Looking Back Can\nHelp Us', 'Move Forward', 268, 150);
    text(s, [
      plain('Research on nostalgia suggests that reflecting on meaningful memories is not simply an attempt to remain trapped in the past. Nostalgia can serve important psychological functions by strengthening self-continuity, reconnecting individuals with personal values, and encouraging motivation toward future goals '),
      cite('(Routledge et al., 2011)'), plain('.', { breakLine: true }),
      plain('Rather than preventing growth, memories of meaningful experiences can remind individuals of qualities they still carry within themselves. Confidence, creativity, determination, and hope may not disappear completely; they may simply take different forms throughout life.', { breakLine: true }),
      plain('Recent research further suggests that nostalgia can function as a source of motivation by helping people maintain a sense of connection between their past experiences and future aspirations '),
      cite('(Sedikides & Wildschut, 2022)'), plain('.'),
    ], { y: 450, h: 720, ...body(), paraSpaceAfter: 11 });
  }

  // 07 · Growth + Neuroplasticity
  {
    const s = page(7, { footer: 'Change & the brain' });
    kicker(s, 'IV · Growth', 220);
    heading(s, 'Growth Does Not Mean\nBecoming', 'Who We Were', 262, 130, 56);
    text(s, 'Although it is natural to wish for the return of a previous version of oneself, personal growth does not come from recreating the past. Growth occurs when individuals allow themselves to change. The goal is not to become the exact person they were before challenges altered their path. Instead, growth involves integrating past experiences while creating space for a new identity to develop.',
      { y: 412, h: 290, ...body() });
    hline(s, 725, C.line);
    kicker(s, 'V · Neuroplasticity', 772);
    heading(s, 'The Brain’s Ability to\nAdapt and', 'Begin Again', 814, 130, 56);
    text(s, 'The human brain’s ability to adapt through neuroplasticity demonstrates that people are not permanently defined by past experiences. Neuroplasticity refers to the brain’s capacity to reorganize itself in response to learning, experiences, and environmental changes.',
      { y: 962, h: 240, ...body() });
  }

  // 08 · Neuroplasticity cont. + New spark
  {
    const s = page(8, { footer: 'Creating a new spark' });
    text(s, [
      plain('Challenges, failures, and significant life events can influence neural pathways, shaping how individuals think, respond, and understand themselves over time '),
      cite('(Kolb & Gibb, 2011)'),
      plain('. Periods of uncertainty, therefore, do not always indicate that someone is moving in the wrong direction. Sometimes, losing a familiar sense of identity becomes part of discovering a deeper understanding of oneself beyond previous expectations.'),
    ], { y: 218, h: 330, ...body() });
    kicker(s, 'VI · Renewal', 580);
    heading(s, 'Creating a', 'New Spark', 622, 80);
    text(s, 'Every person is shaped by the many versions of themselves that came before:', { y: 722, h: 100, ...body() });
    const versions = ['the confident version,', 'the uncertain version,', 'the exhausted version,', 'the hopeful version,', 'and the versions that continued despite difficulty.'];
    const top = 835, rowH = 66;
    hline(s, top, C.line);
    versions.forEach((v, i) => {
      const y = top + i * rowH;
      text(s, String(i + 1).padStart(2, '0'), { y: y + 26, w: 50, h: 24, ...label(C.deep, 15, true) });
      text(s, v, { x: X + 62, y: y + 10, w: CW - 62, h: 50, fontFace: F.display, italic: true, fontSize: pt(36), color: C.espresso });
      hline(s, y + rowH, C.line);
    });
  }

  // 09 · Closing (dark)
  {
    const s = page(9, { dark: true, footer: 'The Wellness' });
    text(s, 'Perhaps the goal is not to recover the exact spark that once existed.',
      { y: 214, w: 820, h: 110, fontFace: F.text, italic: true, fontSize: pt(36), color: C.taupe, lineSpacing: pt(50) });
    text(s, [plain('Perhaps the goal is to '), plain('create a new one.', { italic: true, color: C.caramel })],
      { y: 360, w: 820, h: 200, fontFace: F.display, fontSize: pt(88), color: C.cream, lineSpacing: pt(92) });
    hline(s, 600, C.lineDark);
    text(s, [
      plain('Although human beings naturally return to memories of the past, growth requires recognizing that the past is only one part of the journey. Previous experiences may influence who people become, but they do not determine the full extent of who they can still become.', { breakLine: true }),
      plain('The spark that was lost may not return in the same form. Instead, it may evolve into something different, a renewed sense of purpose, a deeper understanding of oneself, and the ability to continue moving forward.'),
    ], { y: 642, h: 320, ...body(C.sand, 28), paraSpaceAfter: 11 });
    text(s, [plain('Because becoming someone new does not mean losing who one was. '), plain('It means carrying every version of oneself forward.', { italic: true, color: C.caramel })],
      { y: 1020, w: 820, h: 180, fontFace: F.display, fontSize: pt(44), color: C.cream, lineSpacing: pt(55) });
  }

  // 10 · References
  {
    const s = page(10, { bg: C.paper });
    kicker(s, 'Further reading', 220);
    text(s, 'References', { y: 262, h: 80, fontFace: F.display, fontSize: pt(64), color: C.ink });
    const refs = [
      ['Kolb, B., & Gibb, R. (2011). Brain plasticity and behaviour in the developing brain. ', 'Journal of the Canadian Academy of Child and Adolescent Psychiatry, 20', '(4), 265–276.', ''],
      ['McAdams, D. P. (2001). The psychology of life stories. ', 'Review of General Psychology, 5', '(2), 100–122. ', 'doi.org/10.1037/1089-2680.5.2.100'],
      ['McAdams, D. P., & McLean, K. C. (2013). Narrative identity. ', 'Current Directions in Psychological Science, 22', '(3), 233–238. ', 'doi.org/10.1177/0963721413475622'],
      ['McLean, K. C., & Syed, M. (2015). Personal, master, and alternative narratives: An integrative framework for understanding identity development in context. ', 'Human Development, 58', '(6), 318–349. ', 'doi.org/10.1159/000445817'],
      ['Routledge, C., Arndt, J., Sedikides, C., & Wildschut, T. (2011). The past makes the present meaningful: Nostalgia as an existential resource. ', 'Journal of Personality and Social Psychology, 101', '(3), 638–652. ', 'doi.org/10.1037/a0024292'],
      ['Sedikides, C., & Wildschut, T. (2022). Nostalgia as motivation. ', 'Current Opinion in Psychology, 46', ', 101284. ', 'doi.org/10.1016/j.copsyc.2022.101284'],
    ];
    const lines = [2, 2, 2, 3, 3, 2];
    let y = 360;
    hline(s, y, C.line);
    refs.forEach(([a, journal, b, doi], i) => {
      const h = 40 + lines[i] * 33;
      const runs = [plain(a), plain(journal, { italic: true }), plain(b)];
      if (doi) runs.push(plain(doi, { fontFace: F.label, fontSize: pt(17), color: C.muted, hyperlink: { url: 'https://' + doi } }));
      text(s, runs, { y: y + 20, h: h - 30, fontFace: F.text, fontSize: pt(23), color: C.ink, lineSpacing: pt(33), indent: 0, paraSpaceAfter: 0 });
      y += h;
      hline(s, y, C.line);
    });
    logo(s, logoDark, (W - 220) / 2, 1212, 220 / logoDark.ratio);
  }

  await pres.writeFile({ fileName: out('rebuilding-the-spark.pptx') });
  console.log('wrote rebuilding-the-spark.pptx');
})();
