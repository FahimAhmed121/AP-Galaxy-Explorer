import { app, BrowserWindow, shell } from 'electron';
import path from 'node:path';
import http from 'node:http';
import fs from 'node:fs';

// Guard against duplicate application instances
const hasSingleInstanceLock = app.requestSingleInstanceLock();
if (!hasSingleInstanceLock) {
  console.log('[Electron Main] Another instance is already running. Quitting.');
  app.quit();
}

let mainWindow: BrowserWindow | null = null;
let staticServer: http.Server | null = null;
let serverPort: number | null = null;
let isCreatingWindow = false;

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
 * Guarantees origin compatibility with Firebase Auth and Firestore while isolating local assets.
 */
function startLocalProductionServer(distPath: string): Promise<number> {
  return new Promise((resolve, reject) => {
    // If server is already running, reuse the active port
    if (staticServer && serverPort !== null) {
      resolve(serverPort);
      return;
    }

    const resolvedDistPath = path.resolve(distPath);

    staticServer = http.createServer((req, res) => {
      const parsedUrl = new URL(req.url || '/', 'http://127.0.0.1');
      let reqPath = decodeURIComponent(parsedUrl.pathname);

      if (reqPath === '/' || !path.extname(reqPath)) {
        reqPath = '/index.html';
      }

      const filePath = path.normalize(path.join(resolvedDistPath, reqPath));

      // Prevent path traversal
      if (!filePath.startsWith(resolvedDistPath)) {
        res.writeHead(403);
        res.end('Access Denied');
        return;
      }

      fs.readFile(filePath, (err, data) => {
        if (err) {
          // SPA fallback to index.html
          fs.readFile(path.join(resolvedDistPath, 'index.html'), (fallbackErr, fallbackData) => {
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
        serverPort = address.port;
        resolve(serverPort);
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

/**
 * Stop the embedded production loopback server safely
 */
function stopLocalProductionServer(): Promise<void> {
  return new Promise((resolve) => {
    if (!staticServer) {
      serverPort = null;
      resolve();
      return;
    }

    const serverToClose = staticServer;
    staticServer = null;
    serverPort = null;

    serverToClose.close((err) => {
      if (err) {
        console.warn('[Electron Main] Error closing embedded server:', err);
      }
      resolve();
    });
  });
}

async function createWindow(): Promise<void> {
  // Prevent duplicate concurrent window creation
  if (isCreatingWindow) return;
  if (mainWindow && !mainWindow.isDestroyed()) {
    if (mainWindow.isMinimized()) mainWindow.restore();
    mainWindow.focus();
    return;
  }

  isCreatingWindow = true;

  try {
    const isDev = !app.isPackaged && (process.env.NODE_ENV === 'development' || !!process.env.VITE_DEV_SERVER_URL);

    mainWindow = new BrowserWindow({
      width: 1280,
      height: 720,
      minWidth: 1024,
      minHeight: 600,
      center: true,
      resizable: true,
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
      if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.show();
      }
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
  } finally {
    isCreatingWindow = false;
  }
}

// Second instance event handler: restore and focus existing window
app.on('second-instance', () => {
  if (mainWindow && !mainWindow.isDestroyed()) {
    if (mainWindow.isMinimized()) mainWindow.restore();
    mainWindow.focus();
  }
});

app.whenReady().then(async () => {
  await createWindow();

  app.on('activate', () => {
    // Recreate window on macOS when dock icon is clicked and no windows exist
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  // On macOS it is common for apps to stay open until explicit Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('will-quit', async () => {
  await stopLocalProductionServer();
});
