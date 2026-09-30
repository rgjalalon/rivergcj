// Renders article.html to a LinkedIn document PDF and one PNG per page.
import { createRequire } from 'module';
import { execSync } from 'child_process';
import path from 'path';
const require = createRequire(import.meta.url);
const { chromium } = require(path.join(execSync('npm root -g').toString().trim(), 'playwright'));

const dir = path.dirname(new URL(import.meta.url).pathname);
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1080, height: 1350 }, deviceScaleFactor: 2 });
await page.goto('file://' + path.join(dir, 'article.html'));
await page.evaluate(() => document.fonts.ready);

const overflow = await page.$$eval('.page', (els) =>
  els.map((el, i) => { const c = el.lastElementChild.getBoundingClientRect(), p = el.getBoundingClientRect();
    return c.bottom > p.bottom - 60 ? i + 1 : null; }).filter(Boolean));
if (overflow.length) console.warn('Pages with tight/overflowing content:', overflow);

const pages = await page.$$('.page');
for (let i = 0; i < pages.length; i++) {
  await pages[i].screenshot({ path: path.join(dir, 'pages', `page-${String(i + 1).padStart(2, '0')}.png`) });
}
await page.pdf({ path: path.join(dir, 'rebuilding-the-spark.pdf'), width: '1080px', height: '1350px', printBackground: true });
await browser.close();
console.log(`Rendered ${pages.length} pages`);
