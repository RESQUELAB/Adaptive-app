// Variables (globales) en renderer.
const { contextBridge, ipcRenderer } = require('electron')

// Expose loadPage function on WebContents
contextBridge.exposeInMainWorld(
  'loadPage', (where) => ipcRenderer.send("loadPage", where)
)



contextBridge.exposeInMainWorld('electron', {
  ipcRenderer,
  invoke: (event) => ipcRenderer.invoke(event),
  getImage: () => ipcRenderer.invoke('getImage'),
});

ipcRenderer.on('proxy-output', (event, data) => {
  console.log(`[----Proxy Output]: ${data}`);
});

ipcRenderer.on('proxy-error', (event, data) => {
  console.error(`[Proxy Error]: ${data}`);
});

ipcRenderer.on('proxy-exit', (event, code) => {
  console.log(`[Proxy Exit]: Process exited with code ${code}`);
});
