const electron = require('electron');
const url = require('url');
const path = require('path');

const {
    app,
    BrowserWindow,
    Menu,
    ipcMain
} = electron;

// SET ENV
// process.env.NODE_ENV = 'production';

let mainWindow;
let settingsWindow;
//listen for app ready
app.on('ready', function () {
    // new window
    mainWindow = new BrowserWindow({
        minWidth: 810,
        minHeight: 650,
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

function createSettingsWindow() {
    // new window
    settingsWindow = new BrowserWindow({
        width: 800,
        height: 600,
        title: 'Alarm clock menu',
        webPreferences: {
            nodeIntegration: true
        }
    });
    // load html
    settingsWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'settingsWindow.html'),
        protocol: 'file',
        slashes: true
    }));
    settingsWindow.on('close', function () {
        settingsWindow = null;
    });
}
// Handle javascript request
ipcMain.on('createSettingsWindow', () => {
    createSettingsWindow();
});

// new template
const mainMenuTemplate = [{
        label: 'File',
        submenu: [{
                label: 'Settings',
                click() {
                    createSettingsWindow();
                }
            },
            {
                type: 'separator'
            },
            {
                label: 'Quit',
                accelerator: process.platform == 'darwin' ? 'Command+Q' : 'Ctrl+Q',
                click() {
                    app.quit();
                }
            }
        ]
    },
    {
        label: 'Developer tools',
        submenu: [{
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
    }
];

if (process.platform == 'darwin') {
    mainMenuTemplate.unshift({});
}