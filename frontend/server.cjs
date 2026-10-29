// Serve Vite build and expose a non-secret, runtime-configurable API URL.
const express = require('express');
const path = require('path');
const app = express();
const port = Number(process.env.PORT) || 8080;
const apiBase = (process.env.API_BASE_URL || 'http://localhost:5000').replace(/\/$/, '');
app.disable('x-powered-by');
app.get('/config.js', (req, res) => {
  res.type('application/javascript');
  res.set('Cache-Control', 'no-store');
  res.send(`window.__APP_CONFIG__ = ${JSON.stringify({ API_BASE_URL: apiBase }).replace(/</g, '\\u003c')};`);
});
app.use(express.static(path.join(__dirname, 'dist')));
app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'dist', 'index.html')));
app.listen(port, '0.0.0.0', () => console.log(`Web: http://localhost:${port}; API: ${apiBase}`));
