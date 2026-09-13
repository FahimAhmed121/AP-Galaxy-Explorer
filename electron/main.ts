import { app, BrowserWindow, shell } from 'electron';
import path from 'node:path';
import http from 'node:http';
import fs from 'node:fs';

// Guard against duplicate application instances
const hasSingleInstanceLock = app.requestSingleInstanceLock();
if (!hasSingleInstanceLock) {
  console.log('[Electron Main] Another instance is already running. Quitting.');
  app.quit();
} else {
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
   * Check if a URL is an authorized internal application URL
   */
  function isAllowedInternalUrl(targetUrl: string, isDev: boolean, activePort: number | null): boolean {
    try {
      const parsed = new URL(targetUrl);
      if (isDev) {
        return (
          (parsed.protocol === 'http:' || parsed.protocol === 'https:') &&
          (parsed.hostname === 'localhost' || parsed.hostname === '127.0.0.1')
        );
      }
      if (activePort !== null) {
        return (
          parsed.protocol === 'http:' &&
          parsed.hostname === '127.0.0.1' &&
          parsed.port === String(activePort)
        );
      }
      return false;
    } catch {
      return false;
    }
  }

  const DEFAULT_PRODUCTION_PORT = 39228;

  /**
   * Reads the previously used loopback port from userData to ensure origin persistence
   * for localStorage and Firebase session across application restarts.
   */
  function getPersistedPort(): number {
    try {
      const portFilePath = path.join(app.getPath('userData'), 'app_port.json');
      if (fs.existsSync(portFilePath)) {
        const content = fs.readFileSync(portFilePath, 'utf-8');
        const parsed = JSON.parse(content);
        if (typeof parsed.port === 'number' && parsed.port >= 1024 && parsed.port <= 65535) {
          return parsed.port;
        }
      }
    } catch (err) {
      console.warn('[Electron Main] Could not read persisted port file:', err);
    }
    return DEFAULT_PRODUCTION_PORT;
  }

  /**
   * Saves the bound port to userData to reuse it across future launches.
   */
  function persistPort(port: number): void {
    try {
      const portFilePath = path.join(app.getPath('userData'), 'app_port.json');
      fs.writeFileSync(portFilePath, JSON.stringify({ port, updatedAt: Date.now() }), 'utf-8');
    } catch (err) {
      console.warn('[Electron Main] Could not write persisted port file:', err);
    }
  }

  /**
   * Helper to attempt binding the HTTP server to a specific port on 127.0.0.1
   */
  function tryListen(server: http.Server, port: number): Promise<number> {
    return new Promise((resolve, reject) => {
      const onListening = () => {
        cleanup();
        const address = server.address();
        if (address && typeof address === 'object') {
          resolve(address.port);
        } else {
          resolve(port);
        }
      };

      const onError = (err: any) => {
        cleanup();
        reject(err);
      };

      const cleanup = () => {
        server.removeListener('listening', onListening);
        server.removeListener('error', onError);
      };

      server.once('listening', onListening);
      server.once('error', onError);
      server.listen(port, '127.0.0.1');
    });
  }

  /**
   * Start an embedded loopback server to serve built files in production on 127.0.0.1
   * Guarantees origin compatibility with Firebase Auth, Firestore, and localStorage persistence.
   */
  function startLocalProductionServer(distPath: string): Promise<number> {
    return new Promise((resolve, reject) => {
      // If server is already running, reuse the active port
      if (staticServer && serverPort !== null) {
        resolve(serverPort);
        return;
      }

      const resolvedDistPath = path.resolve(distPath);
      const distRootPrefix = resolvedDistPath.endsWith(path.sep)
        ? resolvedDistPath
        : resolvedDistPath + path.sep;

      staticServer = http.createServer((req, res) => {
        const parsedUrl = new URL(req.url || '/', 'http://127.0.0.1');
        let reqPath = decodeURIComponent(parsedUrl.pathname);

        if (reqPath === '/' || !path.extname(reqPath)) {
          reqPath = '/index.html';
        }

        const filePath = path.normalize(path.join(resolvedDistPath, reqPath));

        // Prevent path traversal and directory-boundary escapes
        if (filePath !== resolvedDistPath && !filePath.startsWith(distRootPrefix)) {
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

      const preferredPort = getPersistedPort();
      const candidatePorts = [preferredPort, preferredPort + 1, preferredPort + 2, preferredPort + 3, 0];

      (async () => {
        for (const port of candidatePorts) {
          try {
            const boundPort = await tryListen(staticServer!, port);
            serverPort = boundPort;
            persistPort(boundPort);
            console.log(`[Electron Main] Embedded production server bound to http://127.0.0.1:${boundPort}`);
            resolve(boundPort);
            return;
          } catch (err: any) {
            if (err?.code === 'EADDRINUSE') {
              console.warn(`[Electron Main] Port ${port} in use, trying next candidate...`);
              continue;
            }
            console.error('[Electron Main] Error starting loopback server:', err);
            reject(err);
            return;
          }
        }
        reject(new Error('Failed to bind embedded production server to any candidate port'));
      })().catch(reject);
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

      // Security: Deny-by-default for new windows; route legitimate external links to OS browser
      mainWindow.webContents.setWindowOpenHandler(({ url }) => {
        try {
          const parsed = new URL(url);
          if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
            if (!isAllowedInternalUrl(url, isDev, serverPort)) {
              shell.openExternal(url);
            }
          }
        } catch (err) {
          console.warn('[Electron Main] Blocked window open:', url, err);
        }
        return { action: 'deny' };
      });

      // Security: Deny-by-default navigation handler
      mainWindow.webContents.on('will-navigate', (event, url) => {
        if (isAllowedInternalUrl(url, isDev, serverPort)) {
          return;
        }
        event.preventDefault();
        try {
          const parsed = new URL(url);
          if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
            shell.openExternal(url);
          }
        } catch (err) {
          console.warn('[Electron Main] Blocked navigation:', url, err);
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
}
