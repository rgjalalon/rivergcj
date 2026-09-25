// builds canva/index.html (absolute image URLs, for Canva import) and canva/preview.html (local)
const fs=require('fs');
const BASE='https://raw.githubusercontent.com/rgjalalon/rivergcj/claude/eager-wozniak-lex3fo/carousels/cortisol-cocktails/canva/';
const INK='#111111',GREY='#8A7E74',BG='#F8F8F8',AMBER='#EBA53E';
const page=(label,inner,bg=BG)=>`<div data-document-role="page" data-label="${label}" style="width:1080px;height:1350px;position:relative;overflow:hidden;background:${bg}">${inner}</div>\n`;
const abs=(css,inner='')=>`<div style="position:absolute;${css}">${inner}</div>`;
const img=(src,css)=>`<img src="${src}" style="position:absolute;display:block;object-fit:cover;${css}">`;
const logo=(css,light)=>img(light?'wm-light.png':'wm-dark.png',`height:22px;width:auto;object-fit:contain;${css}`);
const num=(n,css,light)=>abs(`font-size:18px;letter-spacing:.12em;color:${light?'rgba(255,255,255,.8)':GREY};${css}`,`0${n} / 07`);
const src=(t,css,light)=>abs(`font-family:Arial,sans-serif;font-size:19px;color:${light?'rgba(255,255,255,.85)':GREY};${css}`,t);
const body='font-weight:300;line-height:1.4;';

const slides=[
page('Cover',
  img('cover.jpg','left:0;top:0;width:1080px;height:860px')+
  abs('left:80px;right:80px;top:945px;font-size:58px;line-height:1.18;font-weight:300;color:'+INK,
    'Cortisol drinks are everywhere.<br>But do you know your cortisol <em>levels?</em>')+
  abs(`left:80px;top:905px;width:80px;height:3px;background:${AMBER}`)+
  logo('left:80px;bottom:66px')+
  abs(`right:80px;bottom:64px;font-size:18px;letter-spacing:.12em;color:${GREY}`,'SWIPE &rarr;')),

page('The trend',
  img('orange.jpg','left:0;top:0;width:500px;height:1350px')+
  logo('left:580px;top:80px')+num(2,'right:80px;top:80px')+
  abs(`left:580px;right:80px;top:200px;font-size:36px;${body}color:${INK}`,
    'Orange juice, coconut water and sea salt. This simple mix has millions of people paying attention to one hormone: cortisol.')+
  abs(`left:580px;top:890px;width:80px;height:3px;background:${AMBER}`)+
  abs(`left:580px;right:80px;top:930px;font-size:66px;line-height:1.1;font-weight:300;color:${INK}`,'And for good <em>reason.</em>')+
  src('Cleveland Clinic (2025); CNN Health (2025)','left:580px;bottom:64px')),

page('Cortisol rhythm',
  img('light.jpg','left:0;top:0;width:1080px;height:1350px')+
  img('shade-left.png','left:0;top:0;width:1080px;height:1350px')+
  logo('left:80px;top:80px',1)+num(3,'right:80px;top:80px',1)+
  abs(`left:80px;width:600px;top:560px;font-size:40px;${body}color:#fff`,
    'Cortisol helps regulate your stress response, metabolism, blood sugar and sleep.')+
  abs(`left:80px;width:600px;top:830px;font-size:30px;${body}color:rgba(255,255,255,.9)`,
    'It also follows a daily rhythm: it peaks within 45 minutes of waking and drops to its lowest point at night.')+
  src('Stalder et al., Endocr Rev (2024)','left:80px;bottom:64px',1)),

page('What a drink cant do',
  logo('left:80px;top:80px')+num(4,'right:80px;top:80px')+
  abs(`left:80px;right:80px;top:170px;font-size:76px;line-height:1.1;font-weight:300;color:${INK}`,'What a drink <em>can\'t</em> do')+
  img('shadow.jpg','left:80px;top:330px;width:540px;height:840px')+
  abs(`left:670px;right:80px;top:330px;font-size:32px;${body}color:${INK}`,
    'The drink can be a healthy part of your routine. But it can\'t tell you what your cortisol levels are.')+
  abs(`left:670px;top:880px;width:80px;height:3px;background:${AMBER}`)+
  abs(`left:670px;right:80px;top:910px;font-size:32px;${body}color:${INK}`,
    'And no study has shown that it actually <em>lowers</em> cortisol.')+
  src('Cleveland Clinic (2025)','left:80px;bottom:64px')),

page('Symptoms',
  img('glow.jpg','left:620px;top:0;width:460px;height:1350px')+
  logo('left:80px;top:80px')+num(5,'left:440px;top:80px')+
  abs(`left:80px;width:480px;top:170px;font-size:76px;line-height:1.1;font-weight:300;color:${INK}`,'Symptoms aren\'t <em>enough</em>')+
  abs(`left:80px;width:490px;top:470px;font-size:31px;${body}color:${INK}`,
    'Tiredness, brain fog, poor sleep and weight changes are often linked to cortisol. But they also overlap with dozens of other conditions, from depression to metabolic syndrome.')+
  abs(`left:80px;top:880px;width:80px;height:3px;background:${AMBER}`)+
  abs(`left:80px;width:490px;top:910px;font-size:31px;${body}color:#444`,
    'Even serious cortisol disorders are easy to miss this way. Cushing\'s syndrome takes nearly three years to diagnose, on average.')+
  src('Rubinstein et al., J Clin Endocrinol Metab (2020)','left:80px;width:500px;bottom:64px')),

page('Daily curve',
  logo('left:80px;top:80px')+num(6,'right:80px;top:80px')+
  abs(`left:80px;right:80px;top:170px;font-size:76px;line-height:1.1;font-weight:300;color:${INK}`,'Measure your daily <em>curve</em>')+
  img('chart.png','left:80px;top:340px;width:920px;height:310px;object-fit:contain')+
  abs(`left:80px;right:80px;top:680px;height:2px;background:#D9D2CB`)+
  abs(`left:80px;top:700px;width:170px;text-align:center;font-size:20px;letter-spacing:.12em;color:${GREY}`,'MORNING')+
  abs(`left:830px;top:700px;width:170px;text-align:center;font-size:20px;letter-spacing:.12em;color:${GREY}`,'NIGHT')+
  abs(`left:80px;right:80px;top:800px;font-size:31px;${body}color:${INK}`,
    'The only way to know your levels is to measure them. Because cortisol changes throughout the day, testing at a few points shows your full daily curve, not just one moment.')+
  abs(`left:80px;right:80px;top:1010px;font-size:31px;${body}color:#444`,
    'And the shape matters too: research links a flatter curve, where levels barely drop from morning to night, to poorer health.')+
  src('Adam et al., Psychoneuroendocrinology (2017)','left:80px;bottom:64px')),

page('Book your test',
  img('petals.jpg','left:0;top:0;width:1080px;height:1350px')+
  img('shade-bottom.png','left:0;top:0;width:1080px;height:1350px')+
  logo('left:80px;top:80px',1)+num(7,'right:80px;top:80px',1)+
  abs('left:80px;right:80px;top:820px;font-size:84px;line-height:1.12;font-weight:300;color:#fff','Enjoy the drink.<br>Know your levels.')+
  abs(`left:80px;top:1060px;width:80px;height:3px;background:${AMBER}`)+
  abs('left:80px;right:80px;top:1100px;font-size:36px;font-weight:300;color:#fff','Book your cortisol test with <em>us.</em>')+
  abs('left:80px;right:80px;top:1165px;font-size:24px;letter-spacing:.04em;color:rgba(255,255,255,.85)','thewellnesslondon.com')),
];

const html=`<!doctype html><html><head><meta charset="utf-8"><link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;1,9..40,300&display=swap" rel="stylesheet"><title>Cortisol Cocktails Carousel</title></head>
<body style="margin:0;background:${BG};font-family:'DM Sans',sans-serif;color:${INK}">
${slides.join('')}</body></html>`;
fs.writeFileSync(__dirname+'/canva/preview.html',html);
fs.writeFileSync(__dirname+'/canva/index.html',html.replace(/src="([\w-]+\.(?:png|jpg))"/g,`src="${BASE}$1"`));
