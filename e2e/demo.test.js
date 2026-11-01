// End-to-end test: drives examples/index.html in a real browser.
// Run with `npm run test:e2e` (requires Chrome; set CHROME_BIN to override).
const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const puppeteer = require('puppeteer-core');
const { Launcher } = require('chrome-launcher');

const root = path.join(__dirname, '..');
const types = { '.html': 'text/html', '.js': 'text/javascript' };
let server, browser, page, url;
const pageErrors = [];

const pause = ms => new Promise(r => setTimeout(r, ms));
const active = () => page.evaluate(() => {
  const el = document.activeElement;
  return el.id || el.getAttribute('aria-label') || el.textContent.trim().slice(0, 30) || el.nodeName;
});
const log = () => page.$eval('#live-log', e => e.innerText);

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
  url = `http://localhost:${server.address().port}/examples/index.html`;

  const executablePath = process.env.CHROME_BIN || Launcher.getFirstInstallation();
  browser = await puppeteer.launch({ executablePath, headless: 'new', args: ['--no-sandbox'] });
  page = await browser.newPage();
  page.on('pageerror', e => pageErrors.push(e.message));
  await page.goto(url);
});

after(async () => {
  if (browser) await browser.close();
  if (server) server.close();
});

test('page loads without script errors', () => {
  assert.deepEqual(pageErrors, []);
});

test('nga11yAnnounce writes to polite and assertive live regions', async () => {
  await page.click('button[ng-click="vm.polite()"]');
  await page.click('button[ng-click="vm.assertive()"]');
  const text = await log();
  assert.match(text, /\[polite\] Polite message/);
  assert.match(text, /\[assertive\] Assertive message/);
});

test('nga11y-focus restores focus after the focused view is replaced', async () => {
  await page.focus('button[ng-click="vm.swapView()"]');
  await page.keyboard.press('Enter');
  await pause(200);
  assert.match(await active(), /^Swap view \(current: 2\)/);
});

test('nga11y-form focuses the first invalid field on submit', async () => {
  await page.click('button[type=submit]');
  assert.equal(await active(), 'firstName');
});

test('nga11y-validation sets aria attributes and announces on blur', async () => {
  await page.type('#firstName', 'Al');
  await page.type('#email', 'bad');
  await page.keyboard.press('Tab');
  await pause(200);
  const [invalid, describedby] = await page.$eval('#email', e => [
    e.getAttribute('aria-invalid'), e.getAttribute('aria-describedby')
  ]);
  assert.equal(invalid, 'true');
  assert.match(describedby, /emailError/);
  assert.match(await log(), /\[assertive\] Previous field invalid\. Requires a valid email/);
});

test('nga11y-modal moves focus in, traps Tab, closes on Escape and restores focus', async () => {
  await page.focus('button[ng-click="vm.open()"]');
  await page.keyboard.press('Enter');
  await pause(100);
  assert.equal(await active(), 'dlg-container');

  const seen = [];
  for (let i = 0; i < 4; i++) {
    await page.keyboard.press('Tab');
    seen.push(await active());
  }
  assert.deepEqual(seen, ['Sample input', 'Other action', 'Close', 'Sample input']);
  const inside = await page.evaluate(() => !!document.activeElement.closest('.dialog'));
  assert.ok(inside, 'focus stays inside the dialog');

  await page.keyboard.press('Escape');
  await pause(100);
  assert.equal(await page.$('.dialog'), null);
  assert.equal(await active(), 'Open modal');
});

test('editable-grid labels inputs and supports arrow-key row navigation', async () => {
  const inputs = await page.$$('table input');
  assert.equal(inputs.length, 6);
  const labelledby = await page.$eval('table input', e => e.getAttribute('aria-labelledby'));
  assert.equal(labelledby.split(' ').length, 2);

  await inputs[0].focus();
  const before = await page.evaluate(() => document.activeElement.closest('tr').rowIndex);
  await page.keyboard.press('ArrowDown');
  const after = await page.evaluate(() => document.activeElement.closest('tr').rowIndex);
  assert.equal(after, before + 1);
});
