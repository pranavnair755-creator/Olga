import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;
const HOST = '0.0.0.0';

// Custom MIME mapping for any edge-case extensions
const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.mp3': 'audio/mpeg',
  '.wav': 'audio/wav',
  '.ttf': 'font/ttf',
  '.otf': 'font/otf',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.eot': 'application/vnd.ms-fontobject',
};

function serveFileWithMime(res, filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (mimeTypes[ext]) {
    res.setHeader('Content-Type', mimeTypes[ext]);
  }
  return res.sendFile(filePath);
}

// Entrypoint
app.get(['/', '/index.html', '/default.html'], (req, res) => {
  const indexHtml = path.join(__dirname, 'index.html');
  if (fs.existsSync(indexHtml)) {
    return serveFileWithMime(res, indexHtml);
  }
  return serveFileWithMime(res, path.join(__dirname, 'default.html'));
});

// Smart static asset handler
app.use((req, res, next) => {
  let decodedPath = '';
  try {
    decodedPath = decodeURIComponent(req.path);
  } catch (err) {
    decodedPath = req.path;
  }

  // 1. Direct path from root
  const directPath = path.join(__dirname, decodedPath);
  if (fs.existsSync(directPath)) {
    try {
      const stat = fs.statSync(directPath);
      if (stat.isFile()) {
        return serveFileWithMime(res, directPath);
      }
    } catch (e) {
      // Ignore stat error and continue
    }
  }

  // 2. Basename resolution (maps /Images/foo.png or /Images/timer/bar/clockbar1.png -> /clockbar1.png)
  const baseName = path.basename(decodedPath);
  if (baseName && baseName !== '.') {
    const rootPath = path.join(__dirname, baseName);
    if (fs.existsSync(rootPath)) {
      try {
        const stat = fs.statSync(rootPath);
        if (stat.isFile()) {
          return serveFileWithMime(res, rootPath);
        }
      } catch (e) {
        // Ignore stat error and continue
      }
    }
  }

  next();
});

// Fallback to Express static
app.use(express.static(__dirname));

// Start server
app.listen(PORT, HOST, () => {
  console.log(`Who Wants To Be A Millionaire server running at http://${HOST}:${PORT}`);
});
