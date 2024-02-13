// Modules to control application life and create native browser window
const {app, BrowserWindow, ipcMain} = require('electron')
const path = require('path')

const pagesFolder = 'release/public/'

function createWindow () {
	// Browser window
	const mainWindow = new BrowserWindow({
		width: 1240,
		height: 780,
		minWidth: 1024,
		minHeight: 768,
		autoHideMenuBar: true,
		webPreferences: {
			preload: path.join(__dirname, 'preload.js'),
		}
	})

	// Link emulating on electron
	ipcMain.on('loadPage', (event, p) => {
		mainWindow.loadFile(pagesFolder + p);
	})

	// Load the catalog.html of the app
	mainWindow.loadFile(pagesFolder + 'index.html')

	// Open the DevTools.
	// mainWindow.webContents.openDevTools()
}


app.whenReady().then(() => {
	createWindow()

	// On macOS it's common to re-create a window in the app when the
	// dock icon is clicked and there are no other windows open.
	app.on('activate', function () {
		if (BrowserWindow.getAllWindows().length === 0) createWindow()
	})

	const { io } = require("socket.io-client");
	const socket = io('ws://localhost:9999');
})

// Quit when all windows are closed, except on macOS.
// There, it's common to stay active until the user quits explicitly with Cmd + Q.
app.on('window-all-closed', function () {
	if (process.platform !== 'darwin') app.quit()
})

