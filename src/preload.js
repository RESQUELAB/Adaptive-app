    // Variables (globales) en renderer.
const { contextBridge, ipcRenderer } = require('electron')

// Expose loadPage function on WebContents
contextBridge.exposeInMainWorld(
    'loadPage', (where) => ipcRenderer.send("loadPage", where)
)