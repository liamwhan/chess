import { App, BrowserWindow, ipcMain, dialog } from "electron";
import * as log from "electron-log";
import * as path from "path";
import * as url from "url";
import IPCEventType from "./IPCEventType";
import { Config } from "./Config";
import { isMacOs, isWin32 } from "./Common/Utils";

function GetIcon(): string {
    if (isMacOs()) {
        return "CustomIcon.icns";
    }

    if (isWin32()) {
        return "CustomIcon.ico";
    }
    
    return "CustomIcon.png";
}
// Initialise Logging plugin
log.transports.file.level = (Config.Logging.File.Enabled) ? Config.Logging.File.Level : false;
log.transports.console.level = (Config.Logging.Console.Enabled) ? Config.Logging.Console.Level : false;
log.transports.file.format = (Config.Logging.File.Enabled && Config.Logging.File.Format) ? Config.Logging.File.Format : log.transports.file.format;
log.transports.console.format = (Config.Logging.Console.Enabled && Config.Logging.Console.Format) ? Config.Logging.Console.Format : log.transports.console.format;
log.transports.file.file = (Config.Logging.File.Enabled) ? Config.Logging.SavePath : log.transports.file.file;

export default class Main {
    public static MainWindow: BrowserWindow = null;
    public static Application: App;

    public static IndexPath: string;
    public static MaskPath: string;
    public static RegionPath: string;

    public static Init(application: App) {
        Main.Application = application;
        Main.Application.on("ready", Main.OnReady);
    }

    public static OnReady() {
        Main.IndexPath = path.join(__dirname, "..", "views", "main_window.html");
        Main.CreateMain();
    }

    public static OnReadyToShow(win: BrowserWindow) {
        win.show();
        // Main.ShowDevTools(win);
    }

    public static CreateMain() {
        const mainOpts: Electron.BrowserWindowConstructorOptions = {
            width: 1920,
            height: 1080,
            frame: false,
            show: false,
            icon: path.resolve(__dirname, `../../icons/${GetIcon()}`),
            titleBarStyle: "hidden",
            trafficLightPosition: { x: 16, y: 16 },
            webPreferences: {
                devTools: true,
                nodeIntegration: true,
                contextIsolation: false,
                enableRemoteModule: true,
            }
        };

        Main.MainWindow = new BrowserWindow(mainOpts);
        Main.MainWindow.once("ready-to-show", () => { Main.OnReadyToShow(Main.MainWindow); });
        Main.MainWindow.center();

        Main.MainWindow.on("blur", () => {
            Main.MainWindow.webContents.send(IPCEventType.MAIN_WINDOW_BLUR);
        });
        Main.MainWindow.on("focus", () => {
            Main.MainWindow.webContents.send(IPCEventType.MAIN_WINDOW_BLUR);
        });

        Main.MainWindow.loadURL(url.format({ pathname: Main.IndexPath, protocol: "file", slashes: true }));

        Main.SetupIPC();

    }

    public static ShowDevTools(win: BrowserWindow): void {
        if (!win.webContents.isDevToolsOpened()) {
            win.webContents.openDevTools();
            win.webContents.on("devtools-opened", () => {
                win.webContents.devToolsWebContents.focus();
            });
            return;
        }
        win.webContents.devToolsWebContents.focus();
    }

    public static ShowSaveDialog(win: BrowserWindow): void {
        const saveFile = dialog.showSaveDialogSync(win, {
            buttonLabel: "Save",
            title: "Save Game",
            filters: [
                { name: "Chess JSON Files", extensions: ["cjson", "json"] }
            ],
            properties: [
                "createDirectory",
                "showOverwriteConfirmation",
                "showHiddenFiles"
            ]

        });
        if (saveFile !== undefined) {
            win.webContents.send(IPCEventType.SAVE_DIALOG_RESULT, saveFile);
        }
    }

    public static ShowOpenDialog(win: BrowserWindow): void {
        const openFiles = dialog.showOpenDialogSync(win, {
            title: "Load Game",
            buttonLabel: "Open Game",
            filters: [
                { name: "Chess JSON Files", extensions: ["cjson", "json"] }
            ],
            properties: ["openFile"]
        });

        if (openFiles !== undefined) {
            win.webContents.send(IPCEventType.OPEN_DIALOG_RESULT, openFiles.pop());
        }
    }

    public static SetupIPC() {
        ipcMain.on(IPCEventType.SHOW_DEV_TOOLS, () => { Main.ShowDevTools(Main.MainWindow); });
        ipcMain.on(IPCEventType.SHOW_DIALOG_SAVE, () => Main.ShowSaveDialog(Main.MainWindow));
        ipcMain.on(IPCEventType.SHOW_DIALOG_OPEN, () => Main.ShowOpenDialog(Main.MainWindow));
        ipcMain.on(IPCEventType.APP_QUIT, () => {
            if (Main.MainWindow.isClosable()) { Main.MainWindow.close(); }
            Main.Application.quit();
        });

    }
}
