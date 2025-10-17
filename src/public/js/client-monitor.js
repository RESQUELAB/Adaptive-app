const WebSocket = require('ws');
const os = require('os');
const { app } = require('electron');

let monitorSocket = null;
let clientuuid = null;
let initialized = false;

const url = "localhost";
const port = "5050";

// Obtener arquitectura del sistema
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


function connectToMonitor(mainWindow) {
  monitorSocket = new WebSocket(`ws://${url}:${port}`);

  monitorSocket.on('open', async () => {
    console.log('[Cliente] Conectando al monitor...');
  });

  monitorSocket.on('message', async (msg) => {
    const data = JSON.parse(msg);
    if (data.type === 'id-assign') {
      clientuuid = data.uuid;
      console.log(`[Cliente] UUID asignado: ${clientuuid}`);

      if (!initialized) {
        initialized = true;
        startMonitoring(mainWindow);
      }
      return;
    }

    if (data.type === 'mutate') {
      console.log(`[Cliente] Aplicando mutación: ${data.mutation} -> ${data.value}`);
      mainWindow.webContents.executeJavaScript('mc.mutate("' + data.mutation + '", "' + data.value + '")');
    }
    if (data.type === 'request-last-session') {
      await getLastSession(mainWindow);
    }
  });

  monitorSocket.on('close', () => {
    console.log('[Cliente] Conexion al monitor cerrada, reintentando en 10s...');
    initialized = false;
    setTimeout(() => connectToMonitor(mainWindow), 10000);
  });

  monitorSocket.on('error', (err) => console.error('[Cliente] Error WS:', err.message));
}


async function getLastSession(mainWindow) {
  try {
    const mostrarHora = () => new Date().toLocaleTimeString();
    // --- Información de la plataforma ---
    const so = os.version();
    const arch = getArch();
    const nCoreCPU = os.cpus().length;
    const sizeRAM = (os.totalmem() / (1024 ** 3)).toFixed(2);
    const defaultLang = app.getLocale();
    // --- Información de la aplicación ---
    const bounds = mainWindow.getBounds();
    const appName = app.getName();
    const renderEngine = process.versions.chrome;
    const nodeVersion = process.version;
    const electronVersion = process.versions.electron;
    const mutations = await mainWindow.webContents.executeJavaScript('mc.mutations');
    const allMutations = await mainWindow.webContents.executeJavaScript('mc.all_mutations');
    // --- Información del usuario ---
    const userInfo = await mainWindow.webContents.executeJavaScript('pfc.profile');
    const navigationHistory = await mainWindow.webContents.executeJavaScript('window.api.getSessionNavigation()');

    sendToMonitor({
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
      }
    });
  } catch (error) {
    console.error('[Cliente] Error al enviar la información de la ultima sesion al monitor:', error);
  }
}

async function getContext(mainWindow) {
  try {
    const mostrarHora = () => new Date().toLocaleTimeString();
    const navigationHistory = await mainWindow.webContents.executeJavaScript('window.api.getSessionNavigation()');
    const mutations = await mainWindow.webContents.executeJavaScript('mc.mutations');
    sendToMonitor({
      type: 'recent-context',
      payload: {
        time: mostrarHora(),
        navigation: navigationHistory,
        applied_adaptations: mutations
      }
    });

  } catch (err) {
    console.log('[Cliente] Error al enviar el contexto actual al monitor: ', err);
  }
}
function startMonitoring(mainWindow) {
  console.log('[Cliente] Empezando monitorización...');
  setInterval(() => getContext(mainWindow), 60000);
}

// Función genérica para enviar info al monitor en cualquier momento
function sendToMonitor(data) {
  if (monitorSocket && monitorSocket.readyState === WebSocket.OPEN) {
    monitorSocket.send(JSON.stringify(data));
  }
}

module.exports = { connectToMonitor, sendToMonitor };
