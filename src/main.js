const { app, BrowserWindow, globalShortcut } = require('electron');
const path = require('path');
const isDev = true; // Temporär für Entwicklung

let mainWindow;

function createWindow() {
  // Aktiviere Live Reload im Entwicklungsmodus
  if (isDev) {
    require('electron-reload')(__dirname, {
      electron: path.join(__dirname, '../node_modules', '.bin', 'electron'),
      forceHardReset: true,
      hardResetMethod: 'exit'
    });
    console.log('Live reload enabled');
  }
  console.log('Creating main window...');
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    },
    fullscreen: true  // Startet im Vollbildmodus
  });

  // Sicherstellen, dass das Fenster im Vollbildmodus ist
  mainWindow.setFullScreen(true);

  console.log('Loading application...');
  if (isDev) {
    console.log('Loading development URL...');
    mainWindow.loadURL('http://localhost:3000').then(() => {
      console.log('Successfully loaded from Vite dev server');
      mainWindow.webContents.openDevTools();
    }).catch((error) => {
      console.error('Failed to load from Vite dev server:', error);
      app.quit();
    });
  } else {
    mainWindow.loadFile('index.html').then(() => {
      console.log('Successfully loaded index.html');
    }).catch((error) => {
      console.error('Failed to load index.html:', error);
      app.quit();
    });
  }

  mainWindow.webContents.on('did-finish-load', () => {
    console.log('Window content fully loaded');
  });

  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
    console.error('Failed to load window content:', errorCode, errorDescription);
  });

  // Vollbild-Tastenkombination registrieren
  globalShortcut.register('F11', () => {
    const isFullScreen = mainWindow.isFullScreen();
    mainWindow.setFullScreen(!isFullScreen);
    console.log('Toggled fullscreen mode:', !isFullScreen);
  });

  mainWindow.on('closed', function () {
    console.log('Window closed');
    mainWindow = null;
  });
}

app.on('ready', () => {
  console.log('App ready, creating window...');
  createWindow();
});

app.on('will-quit', () => {
  // Tastenkombination beim Beenden freigeben
  globalShortcut.unregisterAll();
});

app.on('window-all-closed', function () {
  console.log('All windows closed');
  if (process.platform !== 'darwin') {
    console.log('Quitting app...');
    app.quit();
  }
});

app.on('activate', function () {
  console.log('App activated');
  if (mainWindow === null) {
    console.log('No window exists, creating new one...');
    createWindow();
  }
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught exception:', error);
});

process.on('unhandledRejection', (error) => {
  console.error('Unhandled rejection:', error);
});
