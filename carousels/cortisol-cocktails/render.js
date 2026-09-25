// renders canva/preview.html to export/N.png (fonts loaded locally for the preview)
const {chromium}=require(require('child_process').execSync('npm root -g').toString().trim()+'/playwright');
const fs=require('fs');fs.mkdirSync(__dirname+'/export',{recursive:true});
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1080,height:1350}});
await p.route(/fonts\.googleapis/,r=>r.abort());
await p.goto('file://'+__dirname+'/canva/preview.html');
const css=fs.readFileSync(process.env.FONTCSS,'utf8').replace(/url\(fonts\//g,'url(file://'+require('path').dirname(process.env.FONTCSS)+'/fonts/');
await p.addStyleTag({content:css});await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(500);
const s=await p.$$('[data-document-role=page]');for(let i=0;i<s.length;i++)await s[i].screenshot({path:__dirname+'/export/'+(i+1)+'.png'});
await b.close();})();
