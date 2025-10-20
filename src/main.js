// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const { spawn, fork } = require('child_process');
const { connectToMonitor, saveSession } = require('./public/js/client-monitor');

// const pagesFolder = 'release/public/'
const pagesFolder = 'public/'

let count = 0;

/////////
let sessionHistory = [];
let lastPage = null;
/////////

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

	mainWindow.on('close', async (event) => {
		event.preventDefault()
		try {
			// Llamamos a la función y esperamos el resultado
			const result = await saveSession(mainWindow);
			if (result) {
				const { data, username, appname } = result;
				const filename = path.join(__dirname, `${appname}_${username}.txt`);
				fs.writeFileSync(filename, JSON.stringify(data, null, 2));
				console.log(`Actividad de la sesión guardada en: ${filename}`);
				mainWindow.destroy();
			}
		} catch (err) {
			console.error('Error guardando sesión de usuario:', err);
		}
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
	if (process.platform !== 'darwin') app.quit()
})

// Additional IPC event to restart the proxy if needed
ipcMain.on('restart-proxy', () => {
	if (proxyProcess) {
		proxyProcess.kill();
	}
	// startProxy();
});



// Escuchar eventos de navegación
ipcMain.on('navigation-event', (event, data) => {
	if (!lastPage || lastPage !== data.page) {
		sessionHistory.push(data);
		lastPage = data.page;
		//console.log('Página registrada:', data.page);
	} else {
		console.log('Duplicado consecutivo ignorado:', data.page);
	}
});

ipcMain.handle('get-session-navigation', () => {
	return sessionHistory;
});

ipcMain.handle('get-file', async (event, file) => {
	const filePath = path.join(__dirname, file);
	try {
		// Comprobamos si existe
		if (fs.existsSync(filePath)) {
			// Leemos el contenido
			const content = fs.readFileSync(filePath, 'utf-8');
			return { exists: true, content };
		} else {
			return { exists: false };
		}
	} catch (error) {
		return { exists: false, error: error.message };
	}
});