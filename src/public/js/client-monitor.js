const WebSocket = require('ws');
const os = require('os');
const { app } = require('electron');
const fs = require('fs').promises;
const path = require('path');

let monitorSocket = null;
let clientuuid = null;
let initialized = false;

const url = "localhost";
const port = "5050";


function connectToMonitor(mainWindow) {
  monitorSocket = new WebSocket(`ws://${url}:${port}`);

  monitorSocket.on('open', async () => {
    console.log('[Cliente] Conectando al monitor...');
  });

  monitorSocket.on('message', async (msg) => {
    const data = JSON.parse(msg);
    if (data.type === 'error') {
      console.warn('Servidor:', data.message);
      ws.close();
      return;
    }
    if (data.type === 'id-assign') {
      clientuuid = data.uuid;
      console.log(`[Cliente] UUID asignado: ${clientuuid}`);//Enviar ultima sesion
      const { content, filename } = await getLastSession(mainWindow);
      sendToMonitor({ type: 'last-session', payload: JSON.parse(content), filename: filename });

      // if (!initialized) {
      //   initialized = true;
      //   startMonitoring(mainWindow);
      // }
      // return;
    }
    if (data.type === 'current-state') {
      getCurrentState(mainWindow)
    }

    if (data.type === 'apply-adaptation') {
      //console.log('ESTO SE HA RECIBIDO:\n===========================\n', data);

      const packAdap = data.pack;
      const adaptations = packAdap.adaptations;
      for (const adaptation of adaptations) {
        console.log(`[Cliente] Aplicando mutación: ${adaptation.key} -> ${adaptation.valor}`);
        mainWindow.webContents.executeJavaScript(`mc.mutate("${adaptation.key}", "${adaptation.valor}")`);
      }


      // console.log(`[Cliente] Aplicando mutación: ${data.mutation} -> ${data.value}`);
      // mainWindow.webContents.executeJavaScript('mc.mutate("' + data.mutation + '", "' + data.value + '")');
    }
  });

  monitorSocket.on('close', () => {
    console.log('[Cliente] Conexion al monitor cerrada, reintentando en 10s...');
    initialized = false;
    setTimeout(() => connectToMonitor(mainWindow), 10000);
  });

  monitorSocket.on('error', (err) => console.error('[Cliente] Error WS:', err.message));
}

// Helper functions
function getArch() {
  const arch = os.arch();
  switch (arch) {
    case 'arm':
      return 'ARM 32 bits';
    case 'arm64':
      return 'ARM 64 bits';
    case 'ia32':
      return '32 bits (Intel/AMD)';
    case 'x64':
      return '64 bits (Intel/AMD)';
    default:
      return 'Otras arquitecturas';
  }
}
async function getGlobalState(mainWindow) {
  try {
    // --- User information ---
    const userInfo = await mainWindow.webContents.executeJavaScript('pfc.profile');
    // --- Platform information ---
    const mostrarHora = () => new Date().toLocaleTimeString();
    const so = os.version();
    const arch = getArch();
    const nCoreCPU = os.cpus().length;
    const sizeRAM = (os.totalmem() / (1024 ** 3)).toFixed(2);
    const defaultLang = app.getLocale();
    // --- App information ---
    const bounds = mainWindow.getBounds();
    const appName = app.getName();
    const renderEngine = process.versions.chrome;
    const nodeVersion = process.version;
    const electronVersion = process.versions.electron;
    const mutations = await mainWindow.webContents.executeJavaScript('mc.mutations');
    const allMutations = await mainWindow.webContents.executeJavaScript('mc.all_mutations');
    const navigationHistory = await mainWindow.webContents.executeJavaScript('window.api.getSessionNavigation()');
    // --- Preparing session data structure document
    const usuario = {
      name: userInfo.userInfo?.clientData.name || "",
      lastName: userInfo.userInfo?.clientData.lastName || "",
      genre: userInfo.userInfo?.clientData.genre || "",
      birthDate: userInfo.userInfo?.clientData.birthDate || "",
      email: userInfo.userInfo?.clientData.email || "",
      roadMainInfo: userInfo.userInfo?.shipmentData.roadMainInfo || "",
      roadExtraInfo: userInfo.userInfo?.shipmentData.roadExtraInfo || "",
      city: userInfo.userInfo?.shipmentData.city || "",
      country: userInfo.userInfo?.shipmentData.country || ""
    };
    const plataforma = {
      time: mostrarHora(),
      so: so,
      arch: arch,
      cpu: nCoreCPU,
      ram: sizeRAM,
      defaultLang: defaultLang
    };
    const aplicacion = {
      name: appName,
      engine: renderEngine,
      node: nodeVersion,
      electron: electronVersion,
      windowSize: { width: bounds.width, height: bounds.height },
      applied_adaptations: mutations,
      available_adaptations: allMutations,
      navigation: navigationHistory
    };
    return { user: usuario, platform: plataforma, app: aplicacion };
  } catch (err) {
    console.error('[gGS] Error while getting app\'s current state: ', err);
  }
}

async function saveSession(mainWindow) {
  try {
    const data = await getGlobalState(mainWindow);
    const username = `${data.user.name}${data.user.lastName}`.replace(/\s+/g, '');
    const appname = `${data.app.name}`;
    return { data, username, appname };
    /* sendToMonitor({
      type: 'last-session-data',
      payload: {
        time: mostrarHora(),
        platform: {
          os: so,
          arch: arch,
          cpu: nCoreCPU,
          ram: sizeRAM,
          defaultLang: defaultLang
        },
        app: {
          name: appName,
          engine: renderEngine,
          node: nodeVersion,
          electron: electronVersion,
          windowSize: { width: bounds.width, height: bounds.height },
          applied_adaptations: mutations,
          available_adaptations: allMutations
        },
        user: userInfo,
        navigation: navigationHistory
      } */
    //});
  } catch (error) {
    console.error('[Session] Error guardando sesión de usuario:', error);
    //console.error('[Cliente] Error al enviar la información de la ultima sesion al monitor:', error);
  }
}

async function getCurrentState(mainWindow) {
  try {
    const { platform, app } = await getGlobalState(mainWindow);

    sendToMonitor({
      type: 'current-state',
      payload: {
        time: platform.time,
        windowSize: app.window_size,
        navigation: app.navigation,
        applied_adaptations: app.applied_adaptations
      }
    });
  } catch (err) {
    console.log('[gCS] Error al enviar el contexto actual al monitor: ', err);
  }
}

async function getLastSession(mainWindow) {
  const currentSession = await getGlobalState(mainWindow);
  const filename = `${currentSession.app.name}_${currentSession.user.name}${currentSession.user.lastName}.txt`;
  // Ruta absoluta a la raíz del proyecto
  const rootPath = path.resolve(__dirname, '../../../');
  const filePath = path.join(rootPath, filename);

  try {
    const content = await fs.readFile(filePath, 'utf-8');
    return { content, filename };
  } catch {
    // Si el archivo no existe
    return { content: JSON.stringify(currentSession, null, 2), filename: filename };
  }
}


// function startMonitoring(mainWindow) {
//   console.log('[Cliente] Empezando monitorización...');
//   setInterval(() => getCurrentState(mainWindow), 60000);
// }

// Generic function to send data anywhere to app monitor.
function sendToMonitor(data) {
  if (monitorSocket && monitorSocket.readyState === WebSocket.OPEN) {
    monitorSocket.send(JSON.stringify(data));
  }
}

module.exports = { connectToMonitor, saveSession };
