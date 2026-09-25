// crops the photos out of the original slides into standalone images for Canva
const {chromium}=require(require('child_process').execSync('npm root -g').toString().trim()+'/playwright');
const fs=require('fs');
const crops={ // name: [slide, x, y, w, h]
 cover:[1,0,0,1080,860], orange:[2,0,143,540,883], light:[3,440,0,640,1350],
 shadow:[4,80,260,520,692], glow:[5,530,180,470,1007], petals:[7,0,0,840,860]};
(async()=>{const b=await chromium.launch();const p=await b.newPage();
for(const [n,[s,x,y,w,h]] of Object.entries(crops)){
 await p.setViewportSize({width:w,height:h});
 fs.writeFileSync(__dirname+'/_c.html',`<body style="margin:0;overflow:hidden"><img src="original/${s}.png" style="position:absolute;left:-${x}px;top:-${y}px">`);
 await p.goto('file://'+__dirname+'/_c.html');
 await p.screenshot({path:`canva/${n}.jpg`,type:'jpeg',quality:92});}
fs.unlinkSync(__dirname+'/_c.html');await b.close();})();
