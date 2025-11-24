const WebSocket = require('ws');
const os = require('os');
const { app } = require('electron');
const fs = require('fs').promises;
const path = require('path');

let monitorSocket = null;
let clientuuid = null;
//let initialized = false;

const url = "localhost";
const port = "5050";


function connectToMonitor(mainWindow) {
  monitorSocket = new WebSocket(`ws://${url}:${port}`);

  monitorSocket.on('open', async () => {
    console.log(`[${new Date().toLocaleTimeString()}] Connecting to monitor...`);
  });

  monitorSocket.on('message', async (msg) => {
    const data = JSON.parse(msg);
    if (data.type === 'error') {
      console.warn(`[${new Date().toLocaleTimeString()}] Server message: ${data.message}.`);
      ws.close();
      return;
    }
    if (data.type === 'id-assign') {
      clientuuid = data.uuid;
      console.log(`[${new Date().toLocaleTimeString()}] Client UUID assigned: ${clientuuid}.`);//Enviar ultima sesion
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
      const packAdap = data.pack;
      const adaptations = packAdap.adaptations;
      for (const adaptation of adaptations) {
        console.log(`[${new Date().toLocaleTimeString()}] Adaptation applied: ${adaptation.key} -> ${adaptation.valor}.`);
        mainWindow.webContents.executeJavaScript(`mc.mutate("${adaptation.key}", "${adaptation.valor}")`);
      }
    }
    if (data.type === 'mutate') {
      console.log(`[Cliente] Aplicando mutación: ${data.mutation} -> ${data.value}`);
      mainWindow.webContents.executeJavaScript('mc.mutate("' + data.mutation + '", "' + data.value + '")');
    }
  });

  monitorSocket.on('close', () => {
    console.log(`[${new Date().toLocaleTimeString()}] Closed connection to monitor. Reconnecting...`);
    initialized = false;
    setTimeout(() => connectToMonitor(mainWindow), 10000);
  });

  monitorSocket.on('error', (err) => console.error(`[${new Date().toLocaleTimeString()}] WebSocket error: ${err.message}.`));
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

async function getPerformanceData() {
  const metrics = app.getAppMetrics();
  let totalRAMUsedMB = 0;
  let totalCPUPercent = 0;

  metrics.forEach(proc => {
    if (proc.cpu && typeof proc.cpu.percentCPUUsage === 'number') {
      totalCPUPercent += proc.cpu.percentCPUUsage;
    }
    if (proc.memory && typeof proc.memory.workingSetSize === 'number') {
      totalRAMUsedMB += proc.memory.workingSetSize / (1024 * 1024);
    }
  });

  return {
    ramUsageMB: totalRAMUsedMB.toFixed(2),
    cpuUsagePercent: totalCPUPercent.toFixed(2)
  };
}


function getAge(birthDate) {
  birthDate = new Date(birthDate);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

function sendToMonitor(data) {
  if (monitorSocket && monitorSocket.readyState === WebSocket.OPEN) {
    monitorSocket.send(JSON.stringify(data));
  }
}

async function getGlobalState(mainWindow) {
  try {
    const genreMap = {
      1: 'Male',
      2: 'Female',
      3: 'Other'
    };
    const countryMap = {
      1: 'Spain',
      2: 'Portugal',
      3: 'France',
      4: 'England',
      5: 'Belgium'
    };

    const userInfo = await mainWindow.webContents.executeJavaScript(`typeof pfc !== "undefined" ? pfc.profile : pc.profile `);
    const mostrarHora = () => new Date().toLocaleTimeString('es-ES', { hour12: false });
    const mostrarFecha = () => {
      const date = new Date();
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const pad = (num) => String(num).padStart(2, '0');
      return `${year}-${pad(month)}-${pad(day)}`;
    };
    const mostrarDiaSemana = () => new Date().toLocaleDateString('en-US', { weekday: 'long' });
    const so = os.version();
    const arch = getArch();
    const nCoreCPU = os.cpus().length;
    const sizeRAM = (os.totalmem() / (1024 ** 3)).toFixed(2);
    const defaultLang = app.getLocale();
    const bounds = mainWindow.getBounds();
    const appName = app.getName();
    //const renderEngine = process.versions.chrome;
    //const nodeVersion = process.version;
    //const electronVersion = process.versions.electron;
    const mutations = await mainWindow.webContents.executeJavaScript('mc.mutations');
    const allMutations = await mainWindow.webContents.executeJavaScript('mc.all_mutations');
    const navigationHistory = await mainWindow.webContents.executeJavaScript('window.api.getSessionNavigation()');
    
    // --- Preparing session data structure document
    const usuario = {
      name: userInfo.userInfo?.clientData.name || "Unname",
      lastName: userInfo.userInfo?.clientData.lastName || "Unknown",
      genre: genreMap[userInfo.userInfo?.clientData.genre] || "Unknown",
      age: getAge(userInfo.userInfo?.clientData.birthDate) || 0,
      city: userInfo.userInfo?.shipmentData.city || "Unknown",
      country: countryMap[userInfo.userInfo?.shipmentData.country] || "Unknown"
      //email: userInfo.userInfo?.clientData.email || "",
      //roadMainInfo: userInfo.userInfo?.shipmentData.roadMainInfo || "",
      //roadExtraInfo: userInfo.userInfo?.shipmentData.roadExtraInfo || "",
    };
    const entorno = {
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      countryCode: Intl.DateTimeFormat().resolvedOptions().locale.split('-').pop(),
      date: mostrarFecha(),
      day: mostrarDiaSemana(),
      time: mostrarHora(),
    };
    const plataforma = {
      os: so,
      arch: arch,
      numCPUs: nCoreCPU,
      ramSizeGB: sizeRAM,
      defaultLang: defaultLang
    };
    const aplicacion = {
      name: appName,
      type: "Catálogo de productos",
      //engine: renderEngine,
      //node: nodeVersion,
      //electron: electronVersion,
      windowSize: { width: bounds.width, height: bounds.height },
      currentAdaptations: mutations,
      availableAdaptations: allMutations,
      navigation: navigationHistory
    };
    return { user: usuario, environment: entorno, platform: plataforma, app: aplicacion };
  } catch (err) {
    console.error(`[${new Date().toLocaleTimeString()}] Error while getting app\'s current state: ${err}.`);
  }
}

async function getLastSession(mainWindow) {
  const currentSession = await getGlobalState(mainWindow);
  const filename = `${currentSession.app.name}_${currentSession.user.name}${currentSession.user.lastName}.txt`;
  const rootPath = path.resolve(__dirname, '../../../');
  const filePath = path.join(rootPath, filename);

  try {
    const content = await fs.readFile(filePath, 'utf-8');
    return { content, filename };
  } catch {
    return { content: JSON.stringify(currentSession, null, 2), filename: filename };
  }
}

async function getCurrentState(mainWindow) {
  try {
    const { environment, app } = await getGlobalState(mainWindow);
    const { ramUsageMB, cpuUsagePercent } = await getPerformanceData();

    sendToMonitor({
      type: 'current-state',
      payload: {
        environment: {
          time: environment.time
        },
        app: {
          windowSize: app.windowSize,
          ramUsageMB: ramUsageMB,
          cpuUsagePercent: cpuUsagePercent,
          currentAdaptations: app.currentAdaptations,
          navigation: app.navigation
        }
      }
    });
  } catch (err) {
    console.log(`[${new Date().toLocaleTimeString()}] Error during sending current context to monitor:  ${err}.`);
  }
}

async function saveSession(mainWindow) {
  try {
    const data = await getGlobalState(mainWindow);
    const username = `${data.user.name}${data.user.lastName}`.replace(/\s+/g, '');
    const appname = `${data.app.name}`;
    return { data, username, appname };
  } catch (err) {
    console.error(`[${new Date().toLocaleTimeString()}] Error while saving user session:  ${err}.`);
  }
}

// function startMonitoring(mainWindow) {
//   console.log('[Cliente] Empezando monitorización...');
//   setInterval(() => getCurrentState(mainWindow), 60000);
// }



module.exports = { connectToMonitor, saveSession };