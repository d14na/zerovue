const {
    app,
    BrowserWindow,
    dialog,
    ipcMain
} = require('electron')

const path = require('path')

/**
 * Main Window
 *
 * NOTE: We keep a global reference of the window object. If we don't,
 *       the window will be closed automatically when the JavaScript object
 *       is garbage collected.
 */
let mainWindow

/**
 * Create Window
 */
function createWindow () {
    /* Create the browser window. */
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            webviewTag: true
        }
    })

    /* Load the index.html of the app. */
    mainWindow.loadFile('src/index.html')

    /* Open the DevTools. */
    // mainWindow.webContents.openDevTools()

    /* Handle window closing. */
    mainWindow.on('closed', function () {
        /* Cleanup. */
        mainWindow = null
    })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) createWindow()
})

/* Initialize menu. */
require('./src/_menu')

/**
 * Get (OS) App Path
 */
ipcMain.on('get-os-app-path', function (event) {
    /* Send response. */
    event.sender.send('got-os-app-path', app.getAppPath())
})

/**
 * Open File Dialog
 */
ipcMain.on('open-file-dialog', function (event) {
    dialog.showOpenDialog({
        properties: ['openFile', 'openDirectory']
    }, function (files) {
        if (files) event.sender.send('selected-directory', files)
    })
})
