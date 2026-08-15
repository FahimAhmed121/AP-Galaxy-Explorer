import { app, BrowserWindow, shell } from 'electron';
import path from 'node:path';
import http from 'node:http';
import fs from 'node:fs';

let mainWindow: BrowserWindow | null = null;
let staticServer: http.Server | null = null;

// MIME types for embedded local loopback server
const MIME_TYPES: Record<string, string> = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.mjs': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.wasm': 'application/wasm',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
};

/**
 * Start an embedded loopback server to serve built files in production on 127.0.0.1
 * This guarantees 100% origin compatibility with Firebase Auth (Google OAuth & Email/Password) and Firestore.
 */
function startLocalProductionServer(distPath: string): Promise<number> {
  return new Promise((resolve, reject) => {
    staticServer = http.createServer((req, res) => {
      const parsedUrl = new URL(req.url || '/', 'http://127.0.0.1');
      let reqPath = decodeURIComponent(parsedUrl.pathname);

      if (reqPath === '/' || !path.extname(reqPath)) {
        reqPath = '/index.html';
      }

      const filePath = path.join(distPath, reqPath);

      // Prevent path traversal
      if (!filePath.startsWith(distPath)) {
        res.writeHead(403);
        res.end('Access Denied');
        return;
      }

      fs.readFile(filePath, (err, data) => {
        if (err) {
          // SPA fallback to index.html
          fs.readFile(path.join(distPath, 'index.html'), (fallbackErr, fallbackData) => {
            if (fallbackErr) {
              res.writeHead(404);
              res.end('Not Found');
            } else {
              res.writeHead(200, { 'Content-Type': 'text/html' });
              res.end(fallbackData);
            }
          });
          return;
        }

        const ext = path.extname(filePath).toLowerCase();
        const contentType = MIME_TYPES[ext] || 'application/octet-stream';
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(data);
      });
    });

    staticServer.listen(0, '127.0.0.1', () => {
      const address = staticServer?.address();
      if (address && typeof address === 'object') {
        resolve(address.port);
      } else {
        reject(new Error('Failed to bind embedded production server'));
      }
    });

    staticServer.on('error', (err) => {
      console.error('[Electron Main] Local server error:', err);
      reject(err);
    });
  });
}

async function createWindow(): Promise<void> {
  const isDev = !app.isPackaged && (process.env.NODE_ENV === 'development' || !!process.env.VITE_DEV_SERVER_URL);

  mainWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    minWidth: 1024,
    minHeight: 600,
    title: 'AP Galaxy Explorer',
    backgroundColor: '#030712',
    show: false,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
      webSecurity: true,
      allowRunningInsecureContent: false,
      preload: path.join(__dirname, 'preload.cjs'),
    },
  });

  // Graceful show on ready to prevent white flash
  mainWindow.once('ready-to-show', () => {
    mainWindow?.show();
  });

  // Security: Intercept external navigation and route to default system browser
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    // Only allow internal loopback/dev URLs in Electron window; open external links (YouTube, Wikimedia) in OS browser
    if (url.startsWith('https:') || url.startsWith('http:')) {
      const parsed = new URL(url);
      if (parsed.hostname !== 'localhost' && parsed.hostname !== '127.0.0.1') {
        shell.openExternal(url);
        return { action: 'deny' };
      }
    }
    return { action: 'allow' };
  });

  mainWindow.webContents.on('will-navigate', (event, url) => {
    if (url.startsWith('https:') || url.startsWith('http:')) {
      const parsed = new URL(url);
      if (parsed.hostname !== 'localhost' && parsed.hostname !== '127.0.0.1') {
        event.preventDefault();
        shell.openExternal(url);
      }
    }
  });

  if (isDev) {
    const devUrl = process.env.VITE_DEV_SERVER_URL || 'http://localhost:3000';
    await mainWindow.loadURL(devUrl);
  } else {
    // Production: serve from dist via local loopback
    const distPath = path.join(__dirname, '../dist');
    try {
      const port = await startLocalProductionServer(distPath);
      await mainWindow.loadURL(`http://127.0.0.1:${port}`);
    } catch (err) {
      console.warn('[Electron Main] Fallback to direct loadFile:', err);
      await mainWindow.loadFile(path.join(distPath, 'index.html'));
    }
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(async () => {
  await createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (staticServer) {
    staticServer.close();
    staticServer = null;
  }
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
