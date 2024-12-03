// Variables (globales) en renderer.
const { contextBridge, ipcRenderer } = require('electron')

// Expose loadPage function on WebContents
contextBridge.exposeInMainWorld(
  'loadPage', (where) => ipcRenderer.send("loadPage", where)
)

const axios = require('axios');

const SERVER_URL = 'http://158.42.185.67:8000';

contextBridge.exposeInMainWorld('api', {
    loginUser: async (username, password) => {
        console.log("logeando!")
        try {
            const response = await axios.post(`${SERVER_URL}/login/`, {
                username,
                password
            });
            return response.data.token;
        } catch (error) {
            throw error;
        }
    },
    registerUser: async (data) => {
        var username = data.username
        var password1 = data.password
        var password2 = data.password2
        console.log("intentando registrar!!")
        try {
            const response = await axios.post(`${SERVER_URL}/register/`, {
                username,
                password1,
                password2
            });
            console.log("REGISTERED!!! ", response)
            return response.data.token;
        } catch (error) {
            throw error;
        }
    },
    fetchProtectedData: async (token) => {
        try {
            const response = await axios.get(`${SERVER_URL}/protected-endpoint/`, {
                headers: { 'Authorization': `Token ${token}` }
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    }
});

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
