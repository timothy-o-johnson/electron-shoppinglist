const electron = require('electron')
const url = require('url')
const path = require('path')

const { app, BrowserWindow, Menu, ipcMain } = electron

// set environment
process.env.NODE_ENV = '!production'

let mainWindow
let addWindow

// listen for the app to be ready
app.on('ready', function () {
  // create new window
  mainWindow = new BrowserWindow({})

  // load html file into window
  mainWindow.loadURL(
    // file://dirname/mainwindow.html
    url.format({
      pathname: path.join(__dirname, 'mainWindow.html'),
      protocol: 'file:',
      slashes: true
    })
  )

  // quit app when closed
  mainWindow.on('closed', function () {
    app.quit()
  })

  // build menu from template
  const mainMenu = Menu.buildFromTemplate(mainMenuTemplate)

  // insert menu
  Menu.setApplicationMenu(mainMenu)
})

// handle create add window
function createAddWindow () {
  addWindow = new BrowserWindow({
    width: 300,
    height: 200,
    title: 'Add Shopping List Item'
  })

  addWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, 'addWindow.html'),
      protocol: 'file:',
      slashes: true
    })
  )

  // Garbage collection handle
  addWindow.on('close', function () {
    addWindow = null
  })
}

// catch item:add
ipcMain.on('item:add', function (e, item) {
  console.log(item)

  mainWindow.webContents.send('item:add', item)
  addWindow.close()
})

// create menu template
const mainMenuTemplate = [
  {
    label: 'File',
    submenu: [
      {
        label: 'Add Item',
        accelerator: process.platform == 'darwin' ? 'Command+N' : 'Ctrl+N',
        click () {
          createAddWindow()
        }
      },
      {
        label: 'Clear Items',
        accelerator: process.platform == 'darwin' ? 'Command+E' : 'Ctrl+E',
        click () {
          mainWindow.webContents.send('item:clear')
        }
      },
      {
        label: 'Quit',
        // determine platform
        accelerator: process.platform == 'darwin' ? 'Command+Q' : 'Ctrl+Q',
        click () {
          app.quit()
        }
      }
    ]
  }
]

// if mac, add empty object to menu
if (process.platform == 'darwin') {
  mainMenuTemplate.unshift({})
}

// add developer tools item, if not in production

if (process.env.NODE_ENV !== 'production') {
  mainMenuTemplate.push({
    label: 'Developer Tools',
    submenu: [
      {
        role: 'reload'
      },
      {
        label: 'Toggle DevTools',
        accelerator: process.platform == 'darwin' ? 'Command+I' : 'Ctrl+I',
        click (item, focusedWindow) {
          focusedWindow.toggleDevTools()
        }
      }
    ]
  })
}
