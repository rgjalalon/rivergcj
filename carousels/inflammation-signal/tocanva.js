const fs=require('fs'),juice=require('juice').default;
const {chromium}=require('playwright');
const BASE='https://raw.githubusercontent.com/rgjalalon/rivergcj/claude/eager-wozniak-lex3fo/carousels/inflammation-signal/canva/';
(async()=>{
let h=fs.readFileSync('carousel.html','utf8');

h=h.replace('<h1>The inflammation signal your standard blood test <em>misses</em></h1>','<h1>The inflammation<br>signal your standard<br>blood test <em>misses</em></h1>')
 .replace('.s1 h1{font-weight:300;font-size:104px;','.s1 h1{font-weight:300;font-size:92px;')
 .replace(/<small>%<\/small>/g,'%')
 .replace('.s2 .big{font-weight:300;font-size:128px;','.s2 .big{white-space:nowrap;font-weight:300;font-size:112px;')
 .replace('.s4 .num{font-weight:300;font-size:150px;','.s4 .num{white-space:nowrap;font-weight:300;font-size:128px;')
 .replace('<h2>You can&#8217;t feel low&#8209;grade <em>inflammation.</em></h2>','<h2>You can&#8217;t feel<br>low-grade <em>inflammation.</em></h2>')
 .replace('.s5 .left{position:absolute;left:72px;top:150px;width:548px}','.s5 .left{position:absolute;left:72px;top:150px;width:560px}')
 .replace('.s5 h2{font-weight:300;font-size:60px;','.s5 h2{font-weight:300;font-size:56px;')
 .replace('<div class="tag">Three questions to ask</div>','')
 .replace('.s5 .card{position:absolute;left:72px;top:452px;','.s5 .card{position:absolute;left:72px;top:490px;')
 .replace('<p>So one high reading may not show your baseline.</p>','<p>So one high reading may not show your baseline.</p>');
// icons -> png
const svgs=[...h.matchAll(/<svg width=[\s\S]*?<\/svg>/g)].map(m=>m[0]);
const names=['arrow','save','share'];
const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
const p=await b.newPage({deviceScaleFactor:3});
for(let i=0;i<svgs.length;i++){
  const svg=svgs[i].replace('stroke="currentColor"','stroke="#ffffff"').replace(/stroke="rgba\([^)]*\)"/,'');
  await p.setContent(`<body style="margin:0;background:transparent">${svg}</body>`);
  await (await p.$('svg')).screenshot({path:`canva/${names[i]}.png`,omitBackground:true});
  const w=svg.match(/width="(\d+)"/)[1],hh=svg.match(/height="(\d+)"/)[1];
  h=h.replace(svgs[i],`<img src="${names[i]}.png" style="width:${w}px;height:${hh}px;display:block">`);
}
// css tweaks
h=h.replace(/@font-face[^}]*}\n/g,'').replace(/font-family:DM,sans-serif/,"font-family:'DM Sans',sans-serif")
 .replace(/\.grain::after\{[\s\S]*?\}\n/,'')
 .replace(/\.run::after\{[^}]*\}\n/,'.run .rule{position:absolute;left:0;right:0;top:34px;height:1px;background:var(--line)}\n')
 .replace(/\.run\.l::after\{[^}]*\}\n/,'.run.l .rule{background:var(--lineL)}\n')
 .replace(/\.s6 \.kick::before,\.s6 \.kick::after\{([^}]*)\}/,'.s6 .kick .dash{display:inline-block;$1}')
 .replace('<title>','<link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300;1,9..40,400&display=swap" rel="stylesheet"><title>');
// resolve css vars
const vars={};h.replace(/--([\w]+):([^;]+);/g,(m,k,v)=>vars[k]=v.trim());
h=h.replace(/var\(--(\w+)\)/g,(m,k)=>vars[k]);
h=h.replace(/:root\{[\s\S]*?\}\n/,'');
// structure
h=h.replace(/<div class="run( l)?">([\s\S]*?)<\/div>/g,(m,l,inner)=>`<div class="run${l||''}">${inner}<div class="rule"></div></div>`);
h=h.replace('<div class="kick l">The takeaway</div>','<div class="kick l"><span class="dash"></span>The takeaway<span class="dash"></span></div>');
const labels=['Cover','The usual test','GlycA','The evidence','Checklist','Takeaway'];
let n=0;
h=h.replace(/<section class="slide ([^"]*)" id="s(\d)">/g,(m,c,i)=>`<div data-document-role="page" data-label="${labels[i-1]}" class="slide ${c.replace(' grain','')}" id="s${i}"><img class="bg" src="bg${i}.jpg">`).replace(/<\/section>/g,'</div>');
h=h.replace(/<img class="bg" src="bg(\d).jpg">\s*<img class="bg" src="assets\/[^"]+">\s*(<div class="scrim"><\/div>)?/g,'<img class="bg" src="bg$1.jpg">');
h=h.replace('.slide{width:1080px;height:1350px;position:relative;overflow:hidden;background:#F2ECE4;margin:0 0 40px}','.slide{width:1080px;height:1350px;position:relative;overflow:hidden;background:#F2ECE4}');
h=h.replace('body{background:#777;','body{background:#F2ECE4;');
// inline
h=juice(h,{removeStyleTags:true,preserveMediaQueries:false});
// absolute urls
h=h.replace(/src="(?:assets\/)?([\w-]+\.(?:png|jpg))"/g,(m,f)=>`src="${BASE}${f}"`);
fs.writeFileSync('canva/index.html',h);
// local preview copy
fs.writeFileSync('canva/preview.html',h.split(BASE).join(''));
await b.close();
})();
