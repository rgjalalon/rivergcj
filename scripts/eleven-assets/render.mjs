import {chromium} from 'playwright-core';
import fs from 'fs';
const [,, id, from, to, n, elev, outdir, roll = "0"] = process.argv;
const browser = await chromium.launch({executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args: ['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const page = await browser.newPage();
page.on('console', m => console.log('page:', m.text()));
await page.goto('http://127.0.0.1:8765/index.html');
await page.waitForFunction(() => window.ready === true, null, {timeout: 60000});
await page.evaluate(([id, elev]) => window.load(id, +elev), [id, elev]);
fs.mkdirSync(outdir, {recursive: true});
for (let i = 0; i < +n; i++) {
  const yaw = +n === 1 ? +from : +from + (+to - +from) * i / (+n - 1);
  const url = await page.evaluate((yaw) => window.frame(yaw[0], yaw[1]), [yaw, +roll]);
  fs.writeFileSync(`${outdir}/${String(i).padStart(3,'0')}.png`, Buffer.from(url.split(',')[1], 'base64'));
}
await browser.close();
console.log('done', id);
