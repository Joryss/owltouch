const electron = require('electron');
const url = require('url');
const path = require('path');

const { app, BrowserWindow } = electron;

let mainWindow;

app.on('ready', () => {

    // Create new windows
    mainWindow = new BrowserWindow({
        width: 1280,
        height: 720
    });

    // Load HTML into Window
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'mainWindow.html'),
        protocol: 'file',
        slashes: true
    }));

    // BUild menu from template
    const mainMenu = electron.Menu.buildFromTemplate(mainMenuTemplate)

    // Insert menu
    electron.Menu.setApplicationMenu(mainMenu)

    // Open dev tools
    mainWindow.webContents.toggleDevTools();

    // Quit app when closed
    mainWindow.on('closed', () => {
        app.quit();
    })

});

const mainMenuTemplate = [
    {
        label: 'Fichier',
        submenu: [
            {
                label: 'Nouveau trajet',
                accelerator: process.plateform == 'darwin' ? 'Command+N' : 'Ctrl+N',
                click() {

                }
            },
            {
                label: 'Ouvrir un trajet',
                accelerator: process.plateform == 'darwin' ? 'Command+O' : 'Ctrl+O',
                click() {

                }
            },
            {
                label: 'Sauvegarder le trajet',
                accelerator: process.plateform == 'darwin' ? 'Command+S' : 'Ctrl+S',
                click() {

                }
            },
            {
                label: 'Quitter',
                accelerator: process.plateform == 'darwin' ? 'Command+Q' : 'Ctrl+Q',
                role: 'quit'
            },
            {
                label: 'Reload',
                accelerator: process.plateform == 'darwin' ? 'Command+R' : 'Ctrl+R',
                role: 'reload'
            }
        ]
    }
]