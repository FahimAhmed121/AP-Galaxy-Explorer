import { contextBridge } from 'electron';

// Minimal context bridge exposing only platform identification to renderer
contextBridge.exposeInMainWorld('electron', {
  isDesktop: true,
  platform: process.platform,
});
