const { app, BrowserWindow, ipcMain } = require('electron');
const { autoUpdater } = require('electron-updater');
require('dotenv').config();

let mainWindow;

function createWindow () {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    frame: false,
    backgroundColor: '#FFF',
    webPreferences: {
      nodeIntegration: true, 
      enableRemoteModule: true
  }
});
  mainWindow.loadFile('index-newStyle.html');
  
  // Open the DevTools. 
  mainWindow.webContents.openDevTools() 
  
  mainWindow.once('ready-to-show', () => {
    autoUpdater.checkForUpdatesAndNotify();
  });
}

app.on('ready', () => {
  createWindow();
});

app.on('window-all-closed', function () {
  //if (process.platform !== 'darwin') {
    app.quit();
  //}
});

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow();
  }
});

ipcMain.on('app_version', (event) => {
  event.sender.send('app_version', { version: app.getVersion() });
});

ipcMain.on('restart_app', () => {
    autoUpdater.quitAndInstall();
  });

autoUpdater.on('update-available', () => {
    mainWindow.webContents.send('update_available');
  });
  autoUpdater.on('update-downloaded', () => {
    mainWindow.webContents.send('update_downloaded');
  });

  function handleSquirrelEvent(application) {
    if (process.argv.length === 1) {
        return false;
    }
  
    const ChildProcess = require('child_process');
    const path = require('path');
  
    const appFolder = path.resolve(process.execPath, '..');
    const rootAtomFolder = path.resolve(appFolder, '..');
    const updateDotExe = path.resolve(path.join(rootAtomFolder, 'Update.exe'));
    const exeName = path.basename(process.execPath);
  
    const spawn = function(command, args) {
        let spawnedProcess, error;
  
        try {
            spawnedProcess = ChildProcess.spawn(command, args, {
                detached: true
            });
        } catch (error) {}
  
        return spawnedProcess;
    };
  
    const spawnUpdate = function(args) {
        return spawn(updateDotExe, args);
    };
  
    const squirrelEvent = process.argv[1];
    switch (squirrelEvent) {
        case '--squirrel-install':
        case '--squirrel-updated':
            // Optionally do things such as:
            // - Add your .exe to the PATH
            // - Write to the registry for things like file associations and
            //   explorer context menus
  
            // Install desktop and start menu shortcuts
            spawnUpdate(['--createShortcut', exeName]);
  
            setTimeout(application.quit, 1000);
            return true;
  
        case '--squirrel-uninstall':
            // Undo anything you did in the --squirrel-install and
            // --squirrel-updated handlers
  
            // Remove desktop and start menu shortcuts
            spawnUpdate(['--removeShortcut', exeName]);
  
            setTimeout(application.quit, 1000);
            return true;
  
        case '--squirrel-obsolete':
            // This is called on the outgoing version of your app before
            // we update to the new version - it's the opposite of
            // --squirrel-updated
  
            application.quit();
            return true;
    }
  };

  