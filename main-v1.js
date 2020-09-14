// app 模块是为了控制整个应用的生命周期设计的。
// BrowserWindow 类让你有创建一个浏览器窗口的权力。
const {app, BrowserWindow, Menu, ipcMain, globalShortcut} = require('electron');
const nativeImage = require('electron').nativeImage;
var overlay = nativeImage.createFromPath('./assets/img/logo.png');

const mainWindowURL = 'http://www.jsca119.cn/fire/';

let mainWindow;


//api:https://wizardforcel.gitbooks.io/electron-doc/content/api/browser-window.html
function createWindow() {
    console.log("createWindow......");
    mainWindow = new BrowserWindow({
        fullscreen: true,
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
    mainWindow.setAutoHideMenuBar(true);    //自动隐藏菜单
    mainWindow.loadURL(mainWindowURL);
    app.commandLine.appendSwitch("--disable-http-cache") //禁用缓存
    mainWindow.webContents.openDevTools({mode: 'right'});
    mainWindow.show();
    
}

app.on('ready', function () {
    console.log("ready......");
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
        globalShortcut.unregister("F12")
        globalShortcut.unregister("ctrl+e")
        globalShortcut.unregisterAll()
    }
})

// Quit when all windows are closed.
app.whenReady().then(() => {
    globalShortcut.register('F5', () => {
        console.log("F5 global refresh......");
        mainWindow.webContents.reload()
    })
})
