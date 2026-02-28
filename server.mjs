// Local development API server — mirrors Vercel serverless function behavior
// Run with: node server.mjs (alongside vite)
import http from 'http';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';

// Load .env manually (no dotenv dependency needed)
try {
  const env = readFileSync(new URL('./.env', import.meta.url), 'utf8');
  env.split('\n').forEach(line => {
    const eq = line.indexOf('=');
    if (eq > 0) process.env[line.slice(0, eq).trim()] = line.slice(eq + 1).trim();
  });
} catch { /* .env not found — use existing env vars */ }

const { default: handler } = await import('./api/chat.mjs');

http.createServer((req, res) => {
  // CORS headers for Vite dev proxy
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') { res.writeHead(204); return res.end(); }

  if (req.url === '/api/chat' && req.method === 'POST') {
    let body = '';
    req.on('data', c => body += c);
    req.on('end', () => {
      try { req.body = JSON.parse(body); } catch { req.body = {}; }
      // Wrap Node's res with Express-like helpers (Vercel function expects these)
      res.status = (code) => { res.statusCode = code; return res; };
      res.json = (data) => {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(data));
      };
      handler(req, res);
    });
  } else {
    res.writeHead(404);
    res.end();
  }
}).listen(3001, () => console.log('API server → http://localhost:3001'));
