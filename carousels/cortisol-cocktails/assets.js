// renders the non-text graphics (glasses chart, dark gradients) as PNGs for Canva
const {chromium}=require(require('child_process').execSync('npm root -g').toString().trim()+'/playwright');
const glass=(x,lvl)=>`<path d="M${x} 0 L${x+12} 300 L${x+158} 300 L${x+170} 0" fill="none" stroke="#3A2A20" stroke-width="2.5"/>`+
 (lvl?`<path d="M${x+(300-lvl)*12/300+4} ${300-lvl} L${x+14} 297 L${x+156} 297 L${x+170-(300-lvl)*12/300-4} ${300-lvl}Z" fill="#EBA53E"/>`:'')+
 `<line x1="${x+12}" y1="300" x2="${x+158}" y2="300" stroke="#3A2A20" stroke-width="4"/>`;
const chart=`<svg xmlns="http://www.w3.org/2000/svg" width="920" height="310" viewBox="0 0 920 310">${glass(0,240)+glass(250,145)+glass(500,92)+glass(750,0)}</svg>`;
(async()=>{const b=await chromium.launch();const p=await b.newPage({deviceScaleFactor:2});
await p.setContent(`<body style="margin:0;background:transparent">${chart}</body>`);
await (await p.$('svg')).screenshot({path:'canva/chart.png',omitBackground:true});
for(const [n,g] of [['shade-bottom','linear-gradient(180deg,rgba(0,0,0,0) 35%,rgba(20,12,6,.75) 100%)'],['shade-left','linear-gradient(90deg,rgba(20,12,6,.7) 0%,rgba(20,12,6,.35) 55%,rgba(0,0,0,0) 100%)']]){
 await p.setViewportSize({width:540,height:675});p.setContent('');
 await p.setContent(`<body style="margin:0;background:transparent"><div style="width:540px;height:675px;background:${g}"></div></body>`);
 await (await p.$('div')).screenshot({path:`canva/${n}.png`,omitBackground:true});}
await b.close();})();
