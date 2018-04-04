const electron = require('electron')
const url = require('url')
const path = require('path')

const { app, BrowserWindow, Menu } = electron

let mainWindow

// LIsten for the app to be ready
app.on('ready', function () {
  // create new window
  mainWindow = new BrowserWindow({})

  // load html file into window
  mainWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, 'mainWindow.html'),
      protocol: 'file:',
      slashes: true
      // file://dirname/mainwindow.html
    })
  )

  // build menu from template
  const mainMenu = Menu.buildFromTemplate(mainMenuTemplate)

  // insert menu
  Menu.setApplicationMenu(mainMenu)
})

// create menu template
const mainMenuTemplate = [
  {
    label: 'File',
    submenu: [
      {
        label: 'Add Item'
      },
      {
        label: 'Clear Items'
      },
      {
        label: 'Quit',
        //determine platform
        accelerator: process.platform == 'darwin' ? 'Command+Q': 'Ctrl+Q',
        click(){
          app.quit()
        }
      }

    ]
  }
]
