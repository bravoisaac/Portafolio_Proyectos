const http = require('http');
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const port = 4301;
const root = path.join(__dirname, '..', 'dist', 'junio-codelab', 'browser');
const imageDir = path.join(__dirname, '..', 'docs', 'images');
const types = {
  '.css': 'text/css',
  '.html': 'text/html',
  '.ico': 'image/x-icon',
  '.js': 'text/javascript',
};

fs.mkdirSync(imageDir, { recursive: true });

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

  await page.goto(`http://localhost:${port}`, { waitUntil: 'networkidle' });
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: 'networkidle' });

  await page.screenshot({
    path: path.join(imageDir, 'home-full.png'),
    fullPage: true,
  });

  await page.locator('#tests').scrollIntoViewIfNeeded();
  await page.screenshot({
    path: path.join(imageDir, 'tests-paginator.png'),
    fullPage: false,
  });

  await page.getByRole('button', { name: 'Python', exact: true }).click();
  await page.getByRole('button', { name: 'Python: crear API con PokeAPI' }).click();
  await page.getByRole('button', { name: 'Ejecutar' }).click();
  await page.waitForTimeout(9000);
  await page.screenshot({
    path: path.join(imageDir, 'pokeapi-result.png'),
    fullPage: false,
  });

  await browser.close();
  console.log(`Screenshots saved in ${imageDir}`);
})()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => {
    server.close();
  });
