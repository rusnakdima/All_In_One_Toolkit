const { app, BrowserWindow } = require('electron');
const path = require('path');

var win;

function createWindow () {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    icon: path.join(__dirname, '/public/assets/img/icon.png'),
    title: 'Electron Test App',
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      devTools: true
    }
  })

  win.loadFile('./public/index.html');

  win.on('closed', () => {
    win = null;
  })
}

app.on('ready', () => {
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
})

app.on('activate', () => {
  if (win === null) {
    createWindow();
  }
})