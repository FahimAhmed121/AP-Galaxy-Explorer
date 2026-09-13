var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// electron/main.ts
var import_electron = require("electron");
var import_node_path = __toESM(require("node:path"), 1);
var import_node_http = __toESM(require("node:http"), 1);
var import_node_fs = __toESM(require("node:fs"), 1);
var hasSingleInstanceLock = import_electron.app.requestSingleInstanceLock();
if (!hasSingleInstanceLock) {
  console.log("[Electron Main] Another instance is already running. Quitting.");
  import_electron.app.quit();
} else {
  let isAllowedInternalUrl = function(targetUrl, isDev, activePort) {
    try {
      const parsed = new URL(targetUrl);
      if (isDev) {
        return (parsed.protocol === "http:" || parsed.protocol === "https:") && (parsed.hostname === "localhost" || parsed.hostname === "127.0.0.1");
      }
      if (activePort !== null) {
        return parsed.protocol === "http:" && parsed.hostname === "127.0.0.1" && parsed.port === String(activePort);
      }
      return false;
    } catch {
      return false;
    }
  }, getPersistedPort = function() {
    try {
      const portFilePath = import_node_path.default.join(import_electron.app.getPath("userData"), "app_port.json");
      if (import_node_fs.default.existsSync(portFilePath)) {
        const content = import_node_fs.default.readFileSync(portFilePath, "utf-8");
        const parsed = JSON.parse(content);
        if (typeof parsed.port === "number" && parsed.port >= 1024 && parsed.port <= 65535) {
          return parsed.port;
        }
      }
    } catch (err) {
      console.warn("[Electron Main] Could not read persisted port file:", err);
    }
    return DEFAULT_PRODUCTION_PORT;
  }, persistPort = function(port) {
    try {
      const portFilePath = import_node_path.default.join(import_electron.app.getPath("userData"), "app_port.json");
      import_node_fs.default.writeFileSync(portFilePath, JSON.stringify({ port, updatedAt: Date.now() }), "utf-8");
    } catch (err) {
      console.warn("[Electron Main] Could not write persisted port file:", err);
    }
  }, tryListen = function(server, port) {
    return new Promise((resolve, reject) => {
      const onListening = () => {
        cleanup();
        const address = server.address();
        if (address && typeof address === "object") {
          resolve(address.port);
        } else {
          resolve(port);
        }
      };
      const onError = (err) => {
        cleanup();
        reject(err);
      };
      const cleanup = () => {
        server.removeListener("listening", onListening);
        server.removeListener("error", onError);
      };
      server.once("listening", onListening);
      server.once("error", onError);
      server.listen(port, "127.0.0.1");
    });
  }, startLocalProductionServer = function(distPath) {
    return new Promise((resolve, reject) => {
      if (staticServer && serverPort !== null) {
        resolve(serverPort);
        return;
      }
      const resolvedDistPath = import_node_path.default.resolve(distPath);
      const distRootPrefix = resolvedDistPath.endsWith(import_node_path.default.sep) ? resolvedDistPath : resolvedDistPath + import_node_path.default.sep;
      staticServer = import_node_http.default.createServer((req, res) => {
        const parsedUrl = new URL(req.url || "/", "http://127.0.0.1");
        let reqPath = decodeURIComponent(parsedUrl.pathname);
        if (reqPath === "/" || !import_node_path.default.extname(reqPath)) {
          reqPath = "/index.html";
        }
        const filePath = import_node_path.default.normalize(import_node_path.default.join(resolvedDistPath, reqPath));
        if (filePath !== resolvedDistPath && !filePath.startsWith(distRootPrefix)) {
          res.writeHead(403);
          res.end("Access Denied");
          return;
        }
        import_node_fs.default.readFile(filePath, (err, data) => {
          if (err) {
            import_node_fs.default.readFile(import_node_path.default.join(resolvedDistPath, "index.html"), (fallbackErr, fallbackData) => {
              if (fallbackErr) {
                res.writeHead(404);
                res.end("Not Found");
              } else {
                res.writeHead(200, { "Content-Type": "text/html" });
                res.end(fallbackData);
              }
            });
            return;
          }
          const ext = import_node_path.default.extname(filePath).toLowerCase();
          const contentType = MIME_TYPES[ext] || "application/octet-stream";
          res.writeHead(200, { "Content-Type": contentType });
          res.end(data);
        });
      });
      const preferredPort = getPersistedPort();
      const candidatePorts = [preferredPort, preferredPort + 1, preferredPort + 2, preferredPort + 3, 0];
      (async () => {
        for (const port of candidatePorts) {
          try {
            const boundPort = await tryListen(staticServer, port);
            serverPort = boundPort;
            persistPort(boundPort);
            console.log(`[Electron Main] Embedded production server bound to http://127.0.0.1:${boundPort}`);
            resolve(boundPort);
            return;
          } catch (err) {
            if (err?.code === "EADDRINUSE") {
              console.warn(`[Electron Main] Port ${port} in use, trying next candidate...`);
              continue;
            }
            console.error("[Electron Main] Error starting loopback server:", err);
            reject(err);
            return;
          }
        }
        reject(new Error("Failed to bind embedded production server to any candidate port"));
      })().catch(reject);
    });
  }, stopLocalProductionServer = function() {
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
          console.warn("[Electron Main] Error closing embedded server:", err);
        }
        resolve();
      });
    });
  };
  let mainWindow = null;
  let staticServer = null;
  let serverPort = null;
  let isCreatingWindow = false;
  const MIME_TYPES = {
    ".html": "text/html",
    ".js": "text/javascript",
    ".mjs": "text/javascript",
    ".css": "text/css",
    ".json": "application/json",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".svg": "image/svg+xml",
    ".ico": "image/x-icon",
    ".wasm": "application/wasm",
    ".woff": "font/woff",
    ".woff2": "font/woff2",
    ".ttf": "font/ttf"
  };
  const DEFAULT_PRODUCTION_PORT = 39228;
  async function createWindow() {
    if (isCreatingWindow) return;
    if (mainWindow && !mainWindow.isDestroyed()) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
      return;
    }
    isCreatingWindow = true;
    try {
      const isDev = !import_electron.app.isPackaged && (process.env.NODE_ENV === "development" || !!process.env.VITE_DEV_SERVER_URL);
      mainWindow = new import_electron.BrowserWindow({
        width: 1280,
        height: 720,
        minWidth: 1024,
        minHeight: 600,
        center: true,
        resizable: true,
        title: "AP Galaxy Explorer",
        backgroundColor: "#030712",
        show: false,
        autoHideMenuBar: true,
        webPreferences: {
          nodeIntegration: false,
          contextIsolation: true,
          sandbox: true,
          webSecurity: true,
          allowRunningInsecureContent: false,
          preload: import_node_path.default.join(__dirname, "preload.cjs")
        }
      });
      mainWindow.once("ready-to-show", () => {
        if (mainWindow && !mainWindow.isDestroyed()) {
          mainWindow.show();
        }
      });
      mainWindow.webContents.setWindowOpenHandler(({ url }) => {
        try {
          const parsed = new URL(url);
          if (parsed.protocol === "http:" || parsed.protocol === "https:") {
            if (!isAllowedInternalUrl(url, isDev, serverPort)) {
              import_electron.shell.openExternal(url);
            }
          }
        } catch (err) {
          console.warn("[Electron Main] Blocked window open:", url, err);
        }
        return { action: "deny" };
      });
      mainWindow.webContents.on("will-navigate", (event, url) => {
        if (isAllowedInternalUrl(url, isDev, serverPort)) {
          return;
        }
        event.preventDefault();
        try {
          const parsed = new URL(url);
          if (parsed.protocol === "http:" || parsed.protocol === "https:") {
            import_electron.shell.openExternal(url);
          }
        } catch (err) {
          console.warn("[Electron Main] Blocked navigation:", url, err);
        }
      });
      if (isDev) {
        const devUrl = process.env.VITE_DEV_SERVER_URL || "http://localhost:3000";
        await mainWindow.loadURL(devUrl);
      } else {
        const distPath = import_node_path.default.join(__dirname, "../dist");
        try {
          const port = await startLocalProductionServer(distPath);
          await mainWindow.loadURL(`http://127.0.0.1:${port}`);
        } catch (err) {
          console.warn("[Electron Main] Fallback to direct loadFile:", err);
          await mainWindow.loadFile(import_node_path.default.join(distPath, "index.html"));
        }
      }
      mainWindow.on("closed", () => {
        mainWindow = null;
      });
    } finally {
      isCreatingWindow = false;
    }
  }
  import_electron.app.on("second-instance", () => {
    if (mainWindow && !mainWindow.isDestroyed()) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });
  import_electron.app.whenReady().then(async () => {
    await createWindow();
    import_electron.app.on("activate", () => {
      if (import_electron.BrowserWindow.getAllWindows().length === 0) {
        createWindow();
      }
    });
  });
  import_electron.app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
      import_electron.app.quit();
    }
  });
  import_electron.app.on("will-quit", async () => {
    await stopLocalProductionServer();
  });
}
