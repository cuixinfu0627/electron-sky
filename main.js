// app 模块是为了控制整个应用的生命周期设计的。
// BrowserWindow 类让你有创建一个浏览器窗口的权力。
const {app, BrowserWindow, Menu, ipcMain, globalShortcut} = require('electron');

const nativeImage = require('electron').nativeImage;
const shell = require('electron').shell

var overlay = nativeImage.createFromPath('./assets/img/logo.png');
const mainWindowURL = 'http://www.jsca119.cn/fire/';

let mainWindow;

//api:https://wizardforcel.gitbooks.io/electron-doc/content/api/browser-window.html
function createWindow() {
    console.log("createWindow......");
    mainWindow = new BrowserWindow({
        title: "智慧消防平台",
        //fullscreen: true,
        maximizable: true, //支持最大化
        show: false,   //为了让初始化窗口显示无闪烁，先关闭显示，等待加载完成后再显示。
        icon: "./assets/img/logo.png",
        defaultFontSize: 100,
        webPreferences: {
            devTools: true
        }
    })

    // Emitted when the window is closed.
    mainWindow.on('closed', function () {
        console.log("closed......");
        mainWindow = null;
    })

    // mainWindow.once('ready-to-show', () => {    //开启这个以后点击了图片虽然没有白屏，但是会感觉不到点了没点
    mainWindow.maximize();    //打开时最大化打开，不是全屏，保留状态栏
    // })

    mainWindow.setOverlayIcon(overlay, "智慧消防") //设置窗口图标与系统托盘图标
    mainWindow.setTitle("智慧消防平台");
    //mainWindow.setAutoHideMenuBar(true);    //自动隐藏菜单
    mainWindow.loadURL(mainWindowURL);
    app.commandLine.appendSwitch("--disable-http-cache") //禁用缓存
    //mainWindow.webContents.openDevTools({mode: 'right'});
    mainWindow.show();

}

app.on('ready', function () {
    console.log("ready......");
    console.log("app set application menu......");
    const menu = Menu.buildFromTemplate(template)
    Menu.setApplicationMenu(menu)

    console.log("createWindow......");
    createWindow();

    //注册一个新的快捷键打开一个新的url -必须在on(ready)中
    globalShortcut.register('ctrl+e', function () {
        console.log("ctrl+e......");
        mainWindow.loadURL('http://fc-jsca.zhxf.ltd/')
    })
    //判断是否绑定成功
    let is_register = globalShortcut.isRegistered('ctrl+e') ? 'TRUE' : 'ERROR'
    console.log(is_register)
});

// Quit when all windows are closed.
app.on('window-all-closed', function () {
    // On OS X it is common for applications and their menu bar
    if (process.platform !== 'darwin') {
        app.quit();
        //注销全局快捷键
        globalShortcut.unregister("F5")
        globalShortcut.unregister("ctrl+e")
        globalShortcut.unregisterAll()
    }
})

app.on('activate', function () {
    if (mainWindow === null) createWindow()
})

app.on('browser-window-created', function () {
    let reopenMenuItem = findReopenMenuItem()
    if (reopenMenuItem) reopenMenuItem.enabled = false
})

app.on('window-all-closed', function () {
    let reopenMenuItem = findReopenMenuItem()
    if (reopenMenuItem) reopenMenuItem.enabled = true
    app.quit()
})

// Quit when all windows are closed.
app.whenReady().then(() => {
    globalShortcut.register('F5', () => {
        console.log("F5 global refresh......");
        mainWindow.webContents.reload()
    })
})


/**
 * 注册键盘快捷键
 * 其中：label: '切换开发者工具',这个可以在发布时注释掉
 */
let template = [
    {
        label: 'Edit ( 操作 )',
        submenu: [{
            label: 'Copy ( 复制 )',
            accelerator: 'CmdOrCtrl+C',
            role: 'copy'
        }, {
            label: 'Paste ( 粘贴 )',
            accelerator: 'CmdOrCtrl+V',
            role: 'paste'
        }, {
            label: 'Reload ( 重新加载 )',
            accelerator: 'CmdOrCtrl+R',
            click: function (item, focusedWindow) {
                if (focusedWindow) {
                    // on reload, start fresh and close any old
                    // open secondary windows
                    if (focusedWindow.id === 1) {
                        BrowserWindow.getAllWindows().forEach(function (win) {
                            if (win.id > 1) {
                                win.close()
                            }
                        })
                    }
                    focusedWindow.reload()
                }
            }
        }]
    },
    {
        label: 'Window ( 窗口 )',
        role: 'window',
        submenu: [{
            label: 'Minimize ( 最小化 )',
            accelerator: 'CmdOrCtrl+M',
            role: 'minimize'
        },{
            label: 'ToggleFullScreen( 全屏 )',
            accelerator: 'togglefullscreen',
            role: 'togglefullscreen'
        },{
            label: 'Close ( 关闭 )',
            accelerator: 'CmdOrCtrl+W',
            role: 'close'
        }, {
            label: '切换开发者工具',
            accelerator: (function () {
                if (process.platform === 'darwin') {
                    return 'Alt+Command+I'
                } else {
                    return 'Ctrl+Shift+I'
                }
            })(),
            click: function (item, focusedWindow) {
                if (focusedWindow) {
                    focusedWindow.toggleDevTools()
                }
            }
        }, {
            type: 'separator'
        }]
    },
    {
        label: 'Help ( 帮助 ) ',
        role: 'help',
        submenu: [{
            label: 'FeedBack ( 意见反馈 )',
            click: function () {
                shell.openExternal('http://www.jsca119.cn/')
            }
        }]
    }
]

/**
 * 增加更新相关的菜单选项
 */
function addUpdateMenuItems(items, position) {
    if (process.mas) return
    const version = app.getVersion()
    let updateItems = [{
        label: `Version ${version}`,
        enabled: false
    }, {
        label: 'Checking for Update',
        enabled: false,
        key: 'checkingForUpdate'
    }, {
        label: 'Check for Update',
        visible: false,
        key: 'checkForUpdate',
        click: function () {
            require('electron').autoUpdater.checkForUpdates()
        }
    }, {
        label: 'Restart and Install Update',
        enabled: true,
        visible: false,
        key: 'restartToUpdate',
        click: function () {
            require('electron').autoUpdater.quitAndInstall()
        }
    }]

    items.splice.apply(items, [position, 0].concat(updateItems))
}

function findReopenMenuItem() {
    const menu = Menu.getApplicationMenu()
    if (!menu) return

    let reopenMenuItem
    menu.items.forEach(function (item) {
        if (item.submenu) {
            item.submenu.items.forEach(function (item) {
                if (item.key === 'reopenMenuItem') {
                    reopenMenuItem = item
                }
            })
        }
    })
    return reopenMenuItem
}

// 针对Mac端的一些配置
if (process.platform === 'darwin') {
    const name = app.getName()
    template.unshift({
        label: name,
        submenu: [{
            label: 'Quit ( 退出 )',
            accelerator: 'Command+Q',
            click: function () {
                app.quit()
            }
        }]
    })

    // Window menu.
    template[3].submenu.push({
        type: 'separator'
    }, {
        label: 'Bring All to Front',
        role: 'front'
    })

    addUpdateMenuItems(template[0].submenu, 1)
}

// 针对Windows端的一些配置
if (process.platform === 'win32') {
    const helpMenu = template[template.length - 1].submenu
    addUpdateMenuItems(helpMenu, 0)
}
