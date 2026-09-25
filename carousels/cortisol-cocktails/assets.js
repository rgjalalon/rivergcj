// renders the non-text graphics (glasses chart with curve, shades) as PNGs for Canva
const {chromium}=require(require('child_process').execSync('npm root -g').toString().trim()+'/playwright');
const chart=`<svg xmlns="http://www.w3.org/2000/svg" width="920" height="330" viewBox="0 0 920 330">
<g fill="none" stroke="#2B2019" stroke-width="2.5"><path d="M10 10 L30 320 L170 320 L190 10"/><path d="M250 10 L270 320 L410 320 L430 10"/><path d="M490 10 L510 320 L650 320 L670 10"/><path d="M730 10 L750 320 L890 320 L910 10"/></g>
<g fill="#E9A23F"><path d="M15 80 L31 316 L169 316 L185 80Z"/><path d="M259 170 L271 316 L409 316 L421 170Z"/><path d="M503 220 L511 316 L649 316 L657 220Z"/><path d="M747 290 L749 316 L891 316 L893 290Z"/></g>
<path d="M100 80 C220 120 260 170 340 170 S520 215 580 220 S760 280 820 290" fill="none" stroke="#D98A2B" stroke-width="2.5" stroke-dasharray="6 8"/>
<g fill="#2B2019"><circle cx="100" cy="80" r="7"/><circle cx="340" cy="170" r="7"/><circle cx="580" cy="220" r="7"/><circle cx="820" cy="290" r="7"/></g></svg>`;
const shades={'shade-top':'linear-gradient(180deg,rgba(30,20,14,.45),rgba(30,20,14,0))',
 'shade-bottom':'linear-gradient(180deg,rgba(30,20,14,.1) 30%,rgba(30,20,14,.8) 100%)',
 'shade-dark':'linear-gradient(180deg,rgba(30,20,14,.25) 0%,rgba(30,20,14,.35) 40%,rgba(30,20,14,.88) 100%)'};
(async()=>{const b=await chromium.launch();const p=await b.newPage({deviceScaleFactor:2});
await p.setContent(`<body style="margin:0;background:transparent">${chart}</body>`);
await (await p.$('svg')).screenshot({path:'canva/chart.png',omitBackground:true});
await p.setViewportSize({width:540,height:675});
for(const [n,g] of Object.entries(shades)){
 await p.setContent(`<body style="margin:0;background:transparent"><div style="width:540px;height:675px;background:${g}"></div></body>`);
 await (await p.$('div')).screenshot({path:`canva/${n}.png`,omitBackground:true});}
await b.close();})();
