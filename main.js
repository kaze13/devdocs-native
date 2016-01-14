'use strict';

const electron = require('electron');
// Module to control application life.
const app = electron.app;
const Menu = electron.Menu;
const Tray = electron.Tray;
const globalShortcut = electron.globalShortcut;
const BrowserWindow = electron.BrowserWindow;

let mainWindow;
let appIcon = null;

function createWindow() {
  mainWindow = new BrowserWindow({width: 1000, height: 600,center:true, autoHideMenuBar: true});

  mainWindow.loadURL('http://devdocs.io/');

  mainWindow.on('closed', function () {
    mainWindow = null;
  });
}

function showWindow() {
  if (!mainWindow) {
    createWindow();
  } else {
    mainWindow.show();
  }
}

function toggleWindow() {
  if (mainWindow.isVisible()) {
    mainWindow.hide();
  } else {
    showWindow();
  }
}

function registerEvent() {
  globalShortcut.register('ctrl+esc', toggleWindow);
}

function prepareTray() {
  appIcon = new Tray('./favicon.png');
  appIcon.on('click', showWindow);

  var contextMenu = Menu.buildFromTemplate([
    {
      label: 'Quit', click: function () {
      app.quit();
    }
    }

  ]);
  appIcon.setToolTip('devdocs.io');
  appIcon.setContextMenu(contextMenu);
}

app.on('ready', function () {
  prepareTray();
  createWindow();
  registerEvent();
});

app.on('window-all-closed', function () {
  //if (process.platform !== 'darwin') {
  //  app.quit();
  //}
});

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow();
  }
});

app.on('will-quit', function () {
  globalShortcut.unregisterAll();
});
