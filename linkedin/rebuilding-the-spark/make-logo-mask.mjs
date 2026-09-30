// Turns the supplied black-on-white logo into black-on-transparent so CSS can recolour it.
import { createRequire } from 'module';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
const require = createRequire(import.meta.url);
const { chromium } = require(path.join(execSync('npm root -g').toString().trim(), 'playwright'));
const dir = path.dirname(new URL(import.meta.url).pathname);
const src = 'data:image/png;base64,' + fs.readFileSync(path.join(dir, 'assets/the-wellness-logo.png')).toString('base64');
const browser = await chromium.launch();
const page = await browser.newPage();
const out = await page.evaluate(async (src) => {
  const img = new Image(); img.src = src; await img.decode();
  const c = document.createElement('canvas'); c.width = img.width; c.height = img.height;
  const x = c.getContext('2d'); x.drawImage(img, 0, 0);
  const d = x.getImageData(0, 0, c.width, c.height);
  for (let i = 0; i < d.data.length; i += 4) {
    const lum = (d.data[i] + d.data[i + 1] + d.data[i + 2]) / 3;
    d.data[i + 3] = Math.round((255 - lum) * d.data[i + 3] / 255);
    d.data[i] = d.data[i + 1] = d.data[i + 2] = 0;
  }
  x.putImageData(d, 0, 0);
  return c.toDataURL('image/png');
}, src);
await browser.close();
fs.writeFileSync(path.join(dir, 'assets/logo.css'), `:root { --logo: url("${out}"); }\n`);
console.log('logo mask written');
