// 'use strict'

import { app, protocol, BrowserWindow, ipcMain } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
// import installExtension, { VUEJS3_DEVTOOLS } from 'electron-devtools-installer'
import installExtension from 'electron-devtools-installer'
const isDevelopment = process.env.NODE_ENV !== 'production'







// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
])

async function createWindow() {

  // Create the browser window.
  const win = new BrowserWindow({
    width: 1200,
    height: 760,

    frame: false, // 无边框窗口
    transparent: true, // 窗口透明
    // backgroundColor: '#10000000', // 背景色（10 透明度，000000 色值）
    minWidth: 380,
    minHeight: 500,
    webPreferences: {
      //这两句好像不行
      // nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
      // contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION,
      //允许node的相关代码,非常重要，否则报require undefined错误  
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true, // 使用remote模块
      // devTools: false
    }
  })

  //配置启动的环境模式
  if (process.env.WEBPACK_DEV_SERVER_URL) {
    //development mode
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    win.loadURL('app://./index.html')
  }





  // 监听窗口拖动

  ipcMain.on('move-application', (event, pos) => {
    win.setPosition(pos.posX, pos.posY, false)

  })
  // 窗口最大化
  ipcMain.on('window-max', () => {
    win.maximize()
  })

  // 监听窗口的最小化
  ipcMain.on('window-min', () => {
    win.minimize()

    // win.setSize(400, 120)
    // win.setMaximumSize(400, 120);
    // win.setMinimumSize(400, 120);
  })

  // 监听窗口的关闭
  ipcMain.on('window-close', () => {
    win.close()
  })
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {




  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    // try {
    //   await installExtension(VUEJS3_DEVTOOLS)
    // } catch (e) {
    //   console.error('Vue Devtools failed to install:', e.toString())
    // }
  }
  createWindow()
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}




// export default 'xxx'


// const { ipcMain } = require('electron');

// // 监听窗口的最小化
// ipcMain.on('window-min', () => {
//   mainWindow.minimize()
// })

// // 监听窗口的关闭
// ipcMain.on('window-close', () => {
//   mainWindow.hide()
// })
