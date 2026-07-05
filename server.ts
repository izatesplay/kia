import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

// ESM path helpers if needed
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  // Simple API or health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Kianour Music Server is healthy' });
  });

  // Serving the app
  if (process.env.NODE_ENV !== 'production') {
    // Development mode with Vite Dev Server Middleware
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Production mode - serve pre-built static files from /dist
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    
    // Fallback all other requests to SPA index.html
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`Server is running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
