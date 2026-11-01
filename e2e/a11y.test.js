// Runs axe-core against the demo page in its initial state and with the modal open.
// Run with `npm run test:a11y` (requires Chrome; set CHROME_BIN to override).
const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const puppeteer = require('puppeteer-core');
const { Launcher } = require('chrome-launcher');

const root = path.join(__dirname, '..');
const types = { '.html': 'text/html', '.js': 'text/javascript' };
const tags = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'];
let server, browser, page;

function format(violations) {
  return violations.map(v =>
    `${v.id} (${v.impact}): ${v.help}\n` +
    v.nodes.map(n => `    ${n.target.join(' ')}`).join('\n')
  ).join('\n');
}

async function scan() {
  const results = await page.evaluate(tags =>
    axe.run(document, { runOnly: { type: 'tag', values: tags } }), tags);
  return results.violations;
}

before(async () => {
  server = http.createServer((req, res) => {
    const file = path.join(root, decodeURIComponent(req.url.split('?')[0]));
    if (!file.startsWith(root) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
      res.writeHead(404).end();
      return;
    }
    res.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'text/plain' });
    fs.createReadStream(file).pipe(res);
  });
  await new Promise(r => server.listen(0, r));

  const executablePath = process.env.CHROME_BIN || Launcher.getFirstInstallation();
  browser = await puppeteer.launch({ executablePath, headless: 'new', args: ['--no-sandbox'] });
  page = await browser.newPage();
  await page.goto(`http://localhost:${server.address().port}/examples/index.html`);
  await page.addScriptTag({ path: require.resolve('axe-core/axe.min.js') });
});

after(async () => {
  if (browser) await browser.close();
  if (server) server.close();
});

test('demo page has no WCAG 2.1 A/AA violations', async () => {
  const violations = await scan();
  assert.equal(violations.length, 0, '\n' + format(violations));
});

test('demo page with the modal open has no WCAG 2.1 A/AA violations', async () => {
  await page.click('button[ng-click="vm.open()"]');
  await page.waitForSelector('.dialog');
  const violations = await scan();
  assert.equal(violations.length, 0, '\n' + format(violations));
});
