const electron = require('electron');
const url = require('url');
const path = require('path');

const { app, BrowserWindow, Menu, ipcMain } = electron;

// SET ENV
// process.env.NODE_ENV = 'production';

let mainWindow;
let addWindow;
//listen for app ready
app.on('ready', function () {
    // new window
    mainWindow = new BrowserWindow({
        minWidth: 810,
        minHeight: 600,
        webPreferences: {
            nodeIntegration: true
        }
    });
    // load html
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'mainWindow.html'),
        protocol: 'file',
        slashes: true
    }));
    // Quit app when closed
    mainWindow.on('closed', function () {
        app.quit();
    });
    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
    // Insert menu
    Menu.setApplicationMenu(mainMenu);
});


// Handle creat add window

function createAddWindow() {
    // new window
    addWindow = new BrowserWindow({
        width: 800,
        height: 600,
        title: 'Alarm clock menu',
        webPreferences: {
            nodeIntegration: true
        }
    });
    // load html
    addWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'addWindow.html'),
        protocol: 'file',
        slashes: true
    }));
    addWindow.on('close', function () {
        addWindow = null;
    });
}
// Catch item:add
ipcMain.on('item:add', function (e, item) {
    console.log(item)
    mainWindow.webContents.send('item:add', item);
    addWindow.close()
});


// new template
const mainMenuTemplate = [
    {
        label: 'File',
        submenu: [
            {
                label: 'Add Item',
                click() {
                    createAddWindow();
                }
            },
            {
                label: 'Clear items',
                click() {
                    mainWindow.webContents.send('item:clear');
                }
            },
            {
                label: 'Quit',
                accelerator: process.platform == 'darwin' ? 'Command+Q' : 'Ctrl+Q',
                click() {
                    app.quit();
                }
            }
        ]
    }
];

if (process.platform == 'darwin') {
    mainMenuTemplate.unshift({});
}

// add developer tools item if not in prod
if (process.env.NODE_ENV != 'production') {
    mainMenuTemplate.push({
        label: 'Developer tools',
        submenu: [
            {
                label: 'Toggle developer tools',
                accelerator: process.platform == 'darwin' ? 'Command+I' : 'Ctrl+I',
                click(item, focusedWindow) {
                    focusedWindow.toggleDevTools();
                }
            },
            {
                role: 'reload'
            }
        ]
    });
}