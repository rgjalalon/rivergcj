const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
const p=await b.newPage({viewport:{width:1080,height:1350}});
await p.goto('file://'+__dirname+'/carousel.html');await p.evaluate(()=>document.fonts.ready);
await p.addStyleTag({content:'.slide > *:not(.bg):not(.scrim){visibility:hidden!important}'});
require('fs').mkdirSync('canva',{recursive:true});
for(let i=1;i<=6;i++){await (await p.$('#s'+i)).screenshot({path:`canva/bg${i}.jpg`,type:'jpeg',quality:90});}
await b.close();})();
