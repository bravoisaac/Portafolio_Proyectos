const http = require('http');
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const port = 4300;
const root = path.join(__dirname, '..', 'dist', 'junio-codelab', 'browser');
const types = {
  '.css': 'text/css',
  '.html': 'text/html',
  '.ico': 'image/x-icon',
  '.js': 'text/javascript',
};

const server = http.createServer((request, response) => {
  const requestPath = decodeURIComponent(new URL(request.url || '/', `http://localhost:${port}`).pathname);
  const safePath = path.normalize(requestPath).replace(/^(\.\.[/\\])+/, '');
  const filePath = path.join(root, safePath === '/' ? 'index.html' : safePath);
  const isFile = filePath.startsWith(root) && fs.existsSync(filePath) && fs.statSync(filePath).isFile();
  const target = isFile ? filePath : path.join(root, 'index.html');

  response.writeHead(200, {
    'Content-Type': types[path.extname(target)] || 'application/octet-stream',
    'Cache-Control': 'no-store',
  });
  fs.createReadStream(target).pipe(response);
});

(async () => {
  await new Promise((resolve) => server.listen(port, resolve));

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  const consoleErrors = [];

  page.on('console', (message) => {
    if (message.type() === 'error') consoleErrors.push(message.text());
  });
  page.on('pageerror', (error) => consoleErrors.push(error.message));

  await page.goto(`http://localhost:${port}`, { waitUntil: 'networkidle' });
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: 'networkidle' });
  await page.screenshot({ path: 'output/playwright/junio-codelab.png', fullPage: true });

  const title = await page.locator('h1').innerText({ timeout: 5000 });
  await page.getByRole('button', { name: 'Ejecutar' }).click();
  await page.waitForTimeout(500);

  const output = await page.locator('pre').innerText();
  await page.getByRole('button', { name: 'Python', exact: true }).click();
  await page.getByRole('button', { name: 'Python: crear API con PokeAPI' }).click();
  await page.getByRole('button', { name: 'Ejecutar' }).click();
  await page.waitForTimeout(9000);

  const pokeOutput = await page.locator('pre').innerText();
  console.log(JSON.stringify({ title, output, pokeOutput, consoleErrors }, null, 2));

  await browser.close();
})()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => {
    server.close();
  });
