const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const base = __dirname;
const port = Number(process.env.PORT) || 3000;
const mime = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.json': 'application/json; charset=utf-8',
  '.ico': 'image/x-icon',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.webp': 'image/webp'
};

http.createServer((req, res) => {
  let urlPath;
  try { urlPath = decodeURIComponent(new URL(req.url, `http://localhost:${port}`).pathname); }
  catch { res.writeHead(400); return res.end('Bad request'); }
  const file = path.resolve(base, '.' + (urlPath === '/' ? '/index.html' : urlPath));
  if (file !== base && !file.startsWith(base + path.sep)) {
    res.writeHead(403); return res.end('Forbidden');
  }
  fs.stat(file, (err, stat) => {
    if (err || !stat.isFile()) { res.writeHead(404); return res.end('Not found'); }
    res.setHeader('Content-Type', mime[path.extname(file).toLowerCase()] || 'application/octet-stream');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Cache-Control', /\.(webp|mp4|webm|jpg|png)$/.test(file) ? 'public, max-age=86400' : 'no-cache');
    res.setHeader('Accept-Ranges', 'bytes');
    const range = req.headers.range;
    if (range) {
      const match = /^bytes=(\d*)-(\d*)$/.exec(range);
      if (!match) { res.writeHead(416, { 'Content-Range': `bytes */${stat.size}` }); return res.end(); }
      const start = match[1] ? Number(match[1]) : Math.max(0, stat.size - (Number(match[2]) || 0));
      const end = match[1] ? Math.min(match[2] ? Number(match[2]) : stat.size - 1, stat.size - 1) : stat.size - 1;
      if (start >= stat.size || start > end) { res.writeHead(416, { 'Content-Range': `bytes */${stat.size}` }); return res.end(); }
      res.writeHead(206, { 'Content-Range': `bytes ${start}-${end}/${stat.size}`, 'Content-Length': end - start + 1 });
      if (req.method === 'HEAD') return res.end();
      fs.createReadStream(file, { start, end }).pipe(res);
      return;
    }
    res.setHeader('Content-Length', stat.size);
    if (req.method === 'HEAD') return res.end();
    fs.createReadStream(file).pipe(res);
  });
}).listen(port, '0.0.0.0', () => {
  console.log(`\nNUSA LINGUA berjalan di http://localhost:${port}\nTekan Ctrl+C untuk berhenti.\n`);
});
