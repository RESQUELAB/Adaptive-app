// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const fs = require('fs')

const { spawn, fork } = require('child_process');

////////////
const { connectToMonitor, sendToMonitor } = require('./public/js/client-monitor');
/////////////

// const pagesFolder = 'release/public/'
const pagesFolder = 'public/'

let count = 0;

let mainWindow;
let proxyProcess;
let iconFilename = "icon.ico"
let iconPath = path.join(process.resourcesPath, iconFilename);
if (iconPath.includes("node_modules\\electron\\dist\\")) {
	iconPath = iconFilename
}

async function handleGetImage() {
	let image_return = false
	await mainWindow.webContents.capturePage().then(image => {
		//writing  image to the disk
		fs.writeFile(`test.png`, image.toPNG(), (err) => {
			if (err) throw err
			console.log('Image Saved')
			count++
		})
		image_return = image
	})
	return image_return
}

function createWindow() {
	// Browser window
	mainWindow = new BrowserWindow({
		width: 1240,
		height: 780,
		minWidth: 1024,
		minHeight: 768,
		autoHideMenuBar: true,
		webPreferences: {
			preload: path.join(__dirname, 'preload.js'),
			nodeIntegration: true,
			webSecurity: false,
		},
		enableRemoteModule: true,
		icon: iconPath
	})

	// Link emulating on electron
	ipcMain.on('loadPage', (event, p) => {
		mainWindow.loadFile(pagesFolder + p);
	})

	// Load the catalog.html of the app
	mainWindow.loadFile(pagesFolder + 'catalog.html')

	// Open the DevTools.
	// mainWindow.webContents.openDevTools()

	mainWindow.webContents.setWindowOpenHandler(() => {
		return { action: "deny" };
	});

	// Set Window Size
	mainWindow.setSize(1400, 780);

	////////////////////////////////////////
	mainWindow.webContents.once('did-finish-load', () => {
		connectToMonitor(mainWindow);
	});

	mainWindow.on('resize', () => {
		const bounds = mainWindow.getBounds();
		sendToMonitor({ type: 'window-resize', payload: bounds });
	});
	//////////////////////////////////////////
}

function startProxy() {
	let proxyFilename = "proxy.js"
	let proxyPath = path.join(process.resourcesPath, proxyFilename);
	console.log(proxyPath)
	if (proxyPath.includes("node_modules\\electron\\dist\\")) {
		proxyPath = proxyFilename
	}
	mainWindow.webContents.send("proxy-output", "Opnening proxy at: ")
	mainWindow.webContents.send("proxy-output", proxyPath)

	proxyProcess = spawn('node', [proxyPath]);

	// proxyProcess.send(mainWindow);
	// proxyProcess = fork(proxyPath);

	proxyProcess.stderr.on('data', (data) => {
		console.error(`Proxy Error: ${data}`);
		mainWindow.webContents.send('proxy-error', data.toString());
	});

	proxyProcess.stdout.on('data', (data) => {
		console.log(`Proxy SAID: ${data}`);
	});

	proxyProcess.on('close', (code) => {
		console.log(`Proxy process exited with code ${code}`);
		mainWindow.webContents.send('proxy-exit', code);
	});

	proxyProcess.on('getImage', (data) => {
		console.log(`Capturing Count: ${count}`)
		//start capturing the window
		mainWindow.webContents.capturePage().then(image => {
			//writing  image to the disk
			fs.writeFile(`test.png`, image.toPNG(), (err) => {
				if (err) throw err
				console.log('Image Saved')
				count++
			})
		})
	});


}

app.whenReady().then(() => {
	ipcMain.handle('getImage', handleGetImage)
	createWindow()
	// startProxy()

	// On macOS it's common to re-create a window in the app when the
	// dock icon is clicked and there are no other windows open.
	app.on('activate', function () {
		if (BrowserWindow.getAllWindows().length === 0) createWindow()
	})

})

// Quit when all windows are closed, except on macOS.
// There, it's common to stay active until the user quits explicitly with Cmd + Q.
app.on('window-all-closed', function () {
	const now = Date.now();

    // Guardar la última página si existe
    if (lastPage) {
        const duration = now - lastPage.entryTime;
        const record = {
            page: lastPage.page,
            duration: duration,
            timestamp: new Date().toISOString()
        };
        sessionRecords.push(record);
        console.log(`Duración guardada al cerrar: ${lastPage.page} (${duration} ms)`);

        // Guardar la sesión completa en JSON
        const file = path.join(__dirname, 'pageDurations.json');
        try {
            fs.writeFileSync(file, JSON.stringify(sessionRecords, null, 2));
        } catch (err) {
            console.error('Error guardando pageDurations.json:', err);
        }
    }
	if (process.platform !== 'darwin') app.quit()
})

// Additional IPC event to restart the proxy if needed
ipcMain.on('restart-proxy', () => {
	if (proxyProcess) {
		proxyProcess.kill();
	}
	// startProxy();
});

const file = path.join(__dirname, 'pageDurations.json');
const file_ms = path.join(__dirname, 'mouseInteraction.log');

// Variables en memoria para la sesión
let lastPage = null;
let sessionRecords = [];

ipcMain.on('navigation-event', (event, data) => {
    const now = Date.now();

    // Si hay una página anterior, calcular duración y añadir al registro
    if (lastPage) {
        const duration = now - lastPage.entryTime;
        const record = {
            page: lastPage.page,
            duration: duration,
            timestamp: new Date().toISOString()
        };
        sessionRecords.push(record);
        console.log(`Duración guardada: ${lastPage.page} (${duration} ms)`);
    }

    // Actualizar la última página en memoria
    lastPage = {
        page: data.page,
        entryTime: now
    };

    // Guardar toda la secuencia de la sesión en JSON
    try {
        fs.writeFileSync(file, JSON.stringify(sessionRecords, null, 2));
    } catch (err) {
        console.error('Error guardando pageDurations.json:', err);
    }
});

function appendToLog(data) {
    const line = JSON.stringify(data) + "\n"; // JSON por línea
    fs.appendFile(file_ms, line, (err) => {
        if (err) console.error("Error escribiendo log:", err);
    });
}

ipcMain.on('mouse-event', (event, data) => {
    appendToLog({ type: 'click', ...data });
});

// Scrolls
ipcMain.on('scroll-event', (event, data) => {
    appendToLog({ type: 'scroll', ...data });
});