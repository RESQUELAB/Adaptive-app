const WebSocket = require('ws');
const os = require('os');
const { app } = require('electron');

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
  });

  monitorSocket.on('close', () => {
    console.log('[Cliente] Conexion al monitor cerrada, reintentando en 10s...');
    initialized = false;
    setTimeout(() => connectToMonitor(mainWindow), 10000);
  });

  monitorSocket.on('error', (err) => console.error('[Cliente] Error WS:', err.message));
}

function startMonitoring(mainWindow) {
  console.log('[Cliente] Empezando monitorización...');
  const sendPlatformInfo = async () => {
    try {
      const mostrarHora = () => new Date().toLocaleTimeString();
      const so = os.version();
      const arch = getArch();
      const nCoreCPU = os.cpus().length;
      const sizeRAM = (os.totalmem() / (1024 ** 3)).toFixed(2);
      const defaultLang = app.getLocale();

      sendToMonitor({
        type: 'platform-info',
        payload: {
          time: mostrarHora(),
          os: so,
          arch: arch,
          cpu: nCoreCPU,
          ram: sizeRAM,          
          defaultLang: defaultLang
        }
      });
    } catch (error) {
      console.error('[Cliente] Error al obtener información de la plataforma:', error);
    }
  };

  const sendAppInfo = async () => {
    try {
      const mostrarHora = () => new Date().toLocaleTimeString();
      const bounds = mainWindow.getBounds();
      //const isFS = mainWindow.isFullScreen();
      const appName = app.getName();
      const renderEngine = process.versions.chrome;
      const nodeVersion = process.version;
      const electronVersion = process.versions.electron;
      const mutations = await mainWindow.webContents.executeJavaScript('mc.mutations');
      const allMutations = await mainWindow.webContents.executeJavaScript('mc.all_mutations');

      sendToMonitor({
        type: 'app-info',
        payload: {
          time: mostrarHora(),
          app: appName,
          engine: renderEngine,
          node: nodeVersion,
          electron: electronVersion,
          windowSize: { width: bounds.width, height: bounds.height },
          mutations,
          all_mutations: allMutations
        }
      });
    } catch (err) {
      console.warn('[Cliente] No se pudo enviar info al monitor:', err.message);
    }
  };

  const sendUserInfo = async () => {
    try {
      const mostrarHora = () => new Date().toLocaleTimeString();
      const userInfo = await mainWindow.webContents.executeJavaScript('pfc.getProfileData()');
      console.log('[Cliente] Info de usuario obtenida:', userInfo);
      sendToMonitor({
        type: 'user-info',
        payload: { time: mostrarHora(), user: userInfo }
      });
    } catch (err) {
      console.warn('[Cliente] No se pudo enviar info de usuario al monitor:', err.message);
    }
  };


  setInterval(sendPlatformInfo, 30000);
  setInterval(sendUserInfo, 30000);
  setInterval(sendAppInfo, 30000);

  // Escuchar cambios de tamaño de ventana
  mainWindow.on('resize', () => {
    const b = mainWindow.getBounds();
    sendToMonitor({
      type: 'window-resize',
      payload: { width: b.width, height: b.height }
    });
  });
}

// Función genérica para enviar info al monitor en cualquier momento
function sendToMonitor(data) {
  if (monitorSocket && monitorSocket.readyState === WebSocket.OPEN) {
    monitorSocket.send(JSON.stringify(data));
  }
}

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

module.exports = { connectToMonitor, sendToMonitor };
