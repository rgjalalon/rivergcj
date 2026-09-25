// builds canva/index.html (absolute image URLs, for Canva import) and canva/preview.html (local)
const fs=require('fs');
const BASE='https://raw.githubusercontent.com/rgjalalon/rivergcj/7f2ed69cda389f77753e4d028c61d90600ec3cdc/carousels/cortisol-cocktails/canva/';
const INK='#2B2019',MUTE='#8A7B6D',CREAM='#F3EDE4',PAPER='#FAF7F2',AMBER='#D98A2B',GOLD='#F2B45E';
const page=(label,inner,bg=CREAM)=>`<div data-document-role="page" data-label="${label}" style="width:1080px;height:1350px;position:relative;overflow:hidden;background:${bg}">${inner}</div>\n`;
const abs=(css,inner='')=>`<div style="position:absolute;${css}">${inner}</div>`;
const img=(src,css)=>`<img src="${src}" style="position:absolute;display:block;object-fit:cover;${css}">`;
const logo=(css,light)=>img(light?'wm-light.png':'wm-dark.png',`height:24px;width:auto;object-fit:contain;${css}`);
const rail=(t,css,light)=>abs(`font-size:20px;letter-spacing:.14em;font-weight:500;color:${light?'rgba(255,255,255,.85)':MUTE};${css}`,t);
const src=(t,css,light)=>abs(`font-size:18px;color:${light?'rgba(255,255,255,.8)':MUTE};${css}`,t);
const kicker=(t,css,c=AMBER)=>abs(`font-size:20px;letter-spacing:.2em;font-weight:500;color:${c};${css}`,t);
const H=(size)=>`font-size:${size}px;line-height:1.02;font-weight:300;letter-spacing:-.03em;`;
const acc=(t,c=AMBER)=>`<em style="font-style:italic;color:${c}">${t}</em>`;
const body='font-weight:300;line-height:1.45;';
const rule=(css)=>abs(`width:64px;height:2px;background:${AMBER};${css}`);

const slides=[
page('Cover',
  img('cover.jpg','left:0;top:0;width:1080px;height:820px')+
  img('shade-top.png','left:0;top:0;width:1080px;height:220px;object-fit:fill')+
  logo('left:80px;top:66px',1)+rail('THE CORTISOL ISSUE','right:80px;top:64px',1)+
  kicker('WELLNESS, DECODED','left:80px;top:880px')+
  abs(`left:80px;right:80px;top:925px;${H(78)}color:${INK}`,`Cortisol drinks are everywhere. But do you know your ${acc('levels?')}`)+
  rail('01 / 07','left:80px;bottom:60px')+rail('SWIPE &rarr;','right:80px;bottom:60px')),

page('The trend',
  img('orange.jpg','left:0;top:0;width:500px;height:1350px')+
  logo('left:580px;top:66px')+rail('02','right:80px;top:64px')+
  kicker('THE TREND','left:580px;top:250px')+
  abs(`left:580px;right:80px;top:300px;font-size:32px;${body}color:${INK}`,'Orange juice, coconut water and sea salt. This simple mix has millions of people paying attention to one hormone:')+
  abs(`left:580px;right:80px;top:560px;${H(96)}font-style:italic;color:${INK}`,'cortisol.')+
  rule('left:580px;top:880px')+
  abs(`left:580px;right:80px;top:915px;${H(68)}color:${INK}`,`And for good ${acc('reason.')}`)+
  src('Cleveland Clinic (2025); CNN Health (2025)','left:580px;bottom:60px')),

page('Cortisol rhythm',
  img('light.jpg','left:0;top:0;width:1080px;height:1350px')+
  img('shade-dark.png','left:0;top:0;width:1080px;height:1350px')+
  logo('left:80px;top:66px',1)+rail('03','right:80px;top:64px',1)+
  kicker('WHY IT MATTERS','left:80px;top:560px',GOLD)+
  abs('left:80px;top:600px;font-size:220px;line-height:1;font-weight:300;letter-spacing:-.05em;color:#fff','45')+
  abs('left:370px;top:720px;font-size:60px;font-style:italic;font-weight:300;color:#fff','minutes')+
  abs('left:80px;right:80px;top:840px;font-size:34px;line-height:1.35;font-weight:400;color:#fff','is when cortisol peaks after you wake. It hits its lowest point at night.')+
  abs(`left:80px;width:820px;top:980px;font-size:28px;${body}color:rgba(255,255,255,.85)`,'Cortisol helps regulate your stress response, metabolism, blood sugar and sleep, following a daily rhythm.')+
  src('Stalder et al., Endocr Rev (2024)','left:80px;bottom:60px',1)),

page('What a drink cant do',
  logo('left:80px;top:66px')+rail('04','right:80px;top:64px')+
  abs(`left:80px;right:80px;top:150px;${H(96)}color:${INK}`,`What a drink ${acc("can't")} do`)+
  img('shadow.jpg','left:80px;top:330px;width:540px;height:840px')+
  abs(`left:670px;right:80px;top:330px;font-size:30px;${body}color:${INK}`,"The drink can be a healthy part of your routine. But it can't tell you what your cortisol levels are.")+
  abs(`left:670px;right:80px;top:880px;height:2px;background:${AMBER}`)+
  abs(`left:670px;right:80px;top:910px;${H(46)}line-height:1.12;color:${INK}`,`No study has shown it actually ${acc('lowers','inherit')} cortisol.`)+
  src('Cleveland Clinic (2025)','left:80px;bottom:60px')),

page('Symptoms',
  img('glow.jpg','left:640px;top:0;width:440px;height:1350px')+
  logo('left:80px;top:66px')+rail('05','left:540px;top:64px')+
  abs(`left:80px;width:520px;top:160px;${H(92)}color:${INK}`,`Symptoms aren't ${acc('enough')}`)+
  ['Tiredness','Brain fog','Poor sleep','Weight changes'].map((t,i)=>abs(`left:${[80,245,405,80][i]}px;top:${i<3?470:540}px;border:1.5px solid ${INK};border-radius:999px;padding:9px 22px;font-size:22px;color:${INK}`,t)).join('')+
  abs(`left:80px;width:520px;top:630px;font-size:27px;${body}color:${INK}`,'Often linked to cortisol, but they overlap with dozens of other conditions, from depression to metabolic syndrome.')+
  abs(`left:80px;width:520px;top:850px;height:2px;background:${AMBER}`)+
  abs(`left:80px;top:880px;font-size:150px;line-height:1;font-weight:300;letter-spacing:-.05em;color:${AMBER}`,'~3')+
  abs(`left:270px;top:960px;font-size:50px;font-style:italic;font-weight:300;color:${INK}`,'years')+
  abs(`left:80px;width:520px;top:1060px;font-size:26px;${body}color:${INK}`,"the average time to diagnose Cushing's syndrome. Even serious disorders are easy to miss.")+
  src('Rubinstein et al., JCEM (2020)','left:80px;bottom:60px')),

page('Daily curve',
  logo('left:80px;top:66px')+rail('06','right:80px;top:64px')+
  kicker('THE ANSWER','left:80px;top:160px')+
  abs(`left:80px;right:40px;top:200px;${H(86)}color:${INK}`,`Measure your ${acc('daily curve')}`)+
  img('chart.png','left:80px;top:400px;width:920px;height:330px;object-fit:contain')+
  abs('left:80px;right:80px;top:770px;height:1.5px;background:#CBBFB1')+
  ['WAKE','MIDDAY','AFTERNOON','NIGHT'].map((t,i)=>abs(`left:${80+240*i}px;width:200px;top:795px;text-align:center;font-size:20px;letter-spacing:.12em;font-weight:500;color:${MUTE}`,t)).join('')+
  abs(`left:80px;width:200px;top:830px;text-align:center;font-size:28px;font-style:italic;font-weight:300;color:${INK}`,'peak')+
  abs(`left:800px;width:200px;top:830px;text-align:center;font-size:28px;font-style:italic;font-weight:300;color:${INK}`,'lowest')+
  abs(`left:80px;width:432px;top:930px;font-size:26px;${body}color:${INK}`,'The only way to know your levels is to measure them. Testing at a few points shows your full daily curve, not just one moment.')+
  abs(`left:568px;width:432px;top:930px;font-size:26px;${body}color:${INK}`,'And the shape matters: research links a <b style="font-weight:500">flatter curve</b>, where levels barely drop from morning to night, to poorer health.')+
  src('Adam et al., Psychoneuroendocrinology (2017)','left:80px;bottom:60px'),PAPER),

page('Book your test',
  img('petals.jpg','left:0;top:0;width:1080px;height:1350px')+
  img('shade-bottom.png','left:0;top:0;width:1080px;height:1350px')+
  logo('left:80px;top:66px',1)+rail('07 / 07','right:80px;top:64px',1)+
  abs(`left:80px;right:80px;top:700px;${H(110)}color:#fff`,`Enjoy the drink.<br>${acc('Know your levels.',GOLD)}`)+
  abs('left:80px;top:990px;background:#fff;border-radius:999px;padding:22px 40px;font-size:28px;font-weight:500;color:#1E140E','Book your cortisol test &rarr;')+
  abs('left:80px;top:1110px;font-size:22px;letter-spacing:.12em;color:rgba(255,255,255,.85)','THEWELLNESSLONDON.COM')),
];

const html=`<!doctype html><html><head><meta charset="utf-8"><link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap" rel="stylesheet"><title>Cortisol Cocktails Carousel</title></head>
<body style="margin:0;background:${CREAM};font-family:'DM Sans',sans-serif;color:${INK}">
${slides.join('')}</body></html>`;
fs.writeFileSync(__dirname+'/canva/preview.html',html);
fs.writeFileSync(__dirname+'/canva/index.html',html.replace(/src="([\w-]+\.(?:png|jpg))"/g,`src="${BASE}$1"`));
