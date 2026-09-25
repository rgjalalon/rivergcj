const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});const p=await b.newPage({viewport:{width:1080,height:1350},deviceScaleFactor:1});
await p.goto('file://'+__dirname+'/carousel.html');await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(300);
require('fs').mkdirSync('out',{recursive:true});
for(let i=1;i<=6;i++){await (await p.$('#s'+i)).screenshot({path:`out/${i}.png`});}
await b.close();})();
