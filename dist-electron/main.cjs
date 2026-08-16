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
}
var mainWindow = null;
var staticServer = null;
var serverPort = null;
var isCreatingWindow = false;
var MIME_TYPES = {
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
function startLocalProductionServer(distPath) {
  return new Promise((resolve, reject) => {
    if (staticServer && serverPort !== null) {
      resolve(serverPort);
      return;
    }
    const resolvedDistPath = import_node_path.default.resolve(distPath);
    staticServer = import_node_http.default.createServer((req, res) => {
      const parsedUrl = new URL(req.url || "/", "http://127.0.0.1");
      let reqPath = decodeURIComponent(parsedUrl.pathname);
      if (reqPath === "/" || !import_node_path.default.extname(reqPath)) {
        reqPath = "/index.html";
      }
      const filePath = import_node_path.default.normalize(import_node_path.default.join(resolvedDistPath, reqPath));
      if (!filePath.startsWith(resolvedDistPath)) {
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
    staticServer.listen(0, "127.0.0.1", () => {
      const address = staticServer?.address();
      if (address && typeof address === "object") {
        serverPort = address.port;
        resolve(serverPort);
      } else {
        reject(new Error("Failed to bind embedded production server"));
      }
    });
    staticServer.on("error", (err) => {
      console.error("[Electron Main] Local server error:", err);
      reject(err);
    });
  });
}
function stopLocalProductionServer() {
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
}
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
      if (url.startsWith("https:") || url.startsWith("http:")) {
        const parsed = new URL(url);
        if (parsed.hostname !== "localhost" && parsed.hostname !== "127.0.0.1") {
          import_electron.shell.openExternal(url);
          return { action: "deny" };
        }
      }
      return { action: "allow" };
    });
    mainWindow.webContents.on("will-navigate", (event, url) => {
      if (url.startsWith("https:") || url.startsWith("http:")) {
        const parsed = new URL(url);
        if (parsed.hostname !== "localhost" && parsed.hostname !== "127.0.0.1") {
          event.preventDefault();
          import_electron.shell.openExternal(url);
        }
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
