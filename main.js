'use strict'

const electron = require('electron')
const fs = require('fs')
// Module to control application life.
const app = electron.app
const Menu = electron.Menu
const Tray = electron.Tray
const globalShortcut = electron.globalShortcut
const BrowserWindow = electron.BrowserWindow
const ipcMain = require('electron').ipcMain

let local = {
  mainWindow: null,
  preferenceWindow: null,
  appIcon: null,
  setting: {}
}
//let local.mainWindow
//let local.preferenceWindow
//let local.appIcon = null
//let setting = {}

app.on('ready', function () {
  prepareTray()
  createWindow()
  readSetting(function (setting) {
    updateSetting(setting)
  })
})

app.on('window-all-closed', function () {
  //if (process.platform !== 'darwin') {
  //  app.quit()
  //}
})

app.on('activate', function () {
  if (local.mainWindow === null) {
    createWindow()
  }
})

app.on('will-quit', function () {
  globalShortcut.unregisterAll()
})

// In main process.
ipcMain.on('save-preference', function (event, arg) {
  console.log('save preference' + arg)
  var newSetting = JSON.parse(arg)
  saveSetting(newSetting)
  updateSetting(newSetting)
})

ipcMain.on('request-preference', function (event, arg) {
  console.log('request pref')  // prints "ping"
  event.sender.send('request-preference-reply', JSON.stringify(local.setting))
})

ipcMain.on('cancel-preference', function (event, arg) {
  console.log('close preference')
  hidePreference()
})

function createWindow() {
  local.mainWindow = new BrowserWindow({width: 1000, height: 600, center: true, autoHideMenuBar: true})

  local.mainWindow.loadURL('http://devdocs.io/')

  local.mainWindow.on('closed', function () {
    local.mainWindow = null
  })
}

function showWindow() {
  if (!local.mainWindow) {
    createWindow()
  } else {
    local.mainWindow.show()
  }
}

function toggleWindow() {
  if (local.mainWindow.isVisible()) {
    local.mainWindow.hide()
  } else {
    showWindow()
  }
}

function updateSetting(setting) {
  registerEvent(setting.shortcut)
}

function createPreference() {
  local.preferenceWindow = new BrowserWindow({width: 285, height: 200, center: true, autoHideMenuBar: true})
  local.preferenceWindow.loadURL('file://' + __dirname + '/preference.html')
  local.preferenceWindow.on('closed', function () {
    local.preferenceWindow = null
  })
}

function showPreference() {
  if (!local.preferenceWindow) {
    createPreference()
  } else {
    local.preferenceWindow.show()
  }
}

function hidePreference() {
  local.preferenceWindow.hide()
}

function saveSetting(newSetting) {
  if (newSetting.autoStartup) {
    local.setting.autoStartup = newSetting.autoStartup
  }
  if (newSetting.shortcut) {
    local.setting.shortcut = newSetting.shortcut
  }
  fs.writeFile('./setting.json', JSON.stringify(local.setting), function (err) {
    if (err) {
      console.error('failed to save setting: ' + err)
      return
    }
    console.log('setting saved')
  })
  hidePreference()
}

function registerEvent(shortcut) {
  try {
    globalShortcut.unregisterAll()
    globalShortcut.register(shortcut, toggleWindow)
  } catch (e) {
    console.error('shortcut ' + shortcut + ' registeration failed: ' + e)
    //globalShortcut.register('ctrl+esc', toggleWindow)
  }
}

function readSetting(callback) {
  fs.readFile('./setting.json', function (err, data) {
    try {
      if (err) throw err
      local.setting = JSON.parse(data)
    } catch (e) {
      console.error('failed to read setting: ' + err)
      local.setting = {autoStartup: false, shortcut: 'ctrl+esc'} //default
    }
    console.log(JSON.stringify(local.setting))
    if (callback) callback(local.setting)
  })
}

function prepareTray() {
  local.appIcon = new Tray('./favicon.png')
  local.appIcon.on('click', showWindow)

  var contextMenu = Menu.buildFromTemplate([
    {
      label: 'Open', click: function () {
      showWindow()
    }
    },
    {
      label: 'Preference', click: function () {
      showPreference()
    }
    },
    {
      label: 'Quit', click: function () {
      app.quit()
    }
    }

  ])
  local.appIcon.setToolTip('devdocs.io')
  local.appIcon.setContextMenu(contextMenu)
}
