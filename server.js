'use strict';

const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');

const ROOT = __dirname;
const CONTENT_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.png': 'image/png'
};

function createServer() {
  return http.createServer((request, response) => {
    let url;
    try {
      url = new URL(request.url, 'http://localhost');
    } catch {
      response.writeHead(400);
      response.end();
      return;
    }
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      response.setHeader('Allow', 'GET, HEAD');
      response.writeHead(405);
      response.end();
      return;
    }

    let pathname;
    try {
      pathname = decodeURIComponent(url.pathname);
    } catch {
      response.writeHead(400);
      response.end();
      return;
    }

    const relativePath = pathname === '/' ? 'index.html' : pathname.replace(/^\/+/, '');
    const filePath = path.resolve(ROOT, relativePath);
    const resolvedRelativePath = path.relative(ROOT, filePath);
    const extension = path.extname(filePath).toLowerCase();
    if (resolvedRelativePath.startsWith('..') ||
        path.isAbsolute(resolvedRelativePath) ||
        relativePath.split(/[\\/]/).some((part) => part.startsWith('.')) ||
        !CONTENT_TYPES[extension]) {
      response.writeHead(404);
      response.end('Not found');
      return;
    }

    fs.readFile(filePath, (error, contents) => {
      if (error) {
        response.writeHead(error.code === 'ENOENT' ? 404 : 500);
        response.end(error.code === 'ENOENT' ? 'Not found' : 'Unable to read file');
        return;
      }
      response.writeHead(200, { 'Content-Type': CONTENT_TYPES[extension] });
      response.end(request.method === 'HEAD' ? undefined : contents);
    });
  });
}

if (require.main === module) {
  const port = Number(process.env.PORT || 3000);
  const host = process.env.HOST || '127.0.0.1';
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    console.error('PORT must be an integer between 1 and 65535.');
    process.exitCode = 1;
  } else {
    createServer().listen(port, host, () => {
      console.log('Transportation solver is available at http://' + host + ':' + port);
    });
  }
}

module.exports = { createServer };
