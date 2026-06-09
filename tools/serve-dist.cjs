const http = require('http');
const fs = require('fs');
const path = require('path');

const port = Number(process.env.PORT || 4200);
const root = path.join(__dirname, '..', 'dist', 'junio-codelab', 'browser');
const types = {
  '.css': 'text/css',
  '.html': 'text/html',
  '.ico': 'image/x-icon',
  '.js': 'text/javascript',
};

http
  .createServer((request, response) => {
    const requestPath = decodeURIComponent(new URL(request.url || '/', `http://localhost:${port}`).pathname);
    const safePath = path.normalize(requestPath).replace(/^(\.\.[/\\])+/, '');
    const filePath = path.join(root, safePath === '/' ? 'index.html' : safePath);
    const target = filePath.startsWith(root) && fs.existsSync(filePath) ? filePath : path.join(root, 'index.html');

    response.writeHead(200, {
      'Content-Type': types[path.extname(target)] || 'application/octet-stream',
      'Cache-Control': 'no-store',
    });
    fs.createReadStream(target).pipe(response);
  })
  .listen(port, () => {
    console.log(`Serving ${root} on http://localhost:${port}`);
  });
