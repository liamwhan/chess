import { ipcRenderer, remote } from "electron";
import * as log from "electron-log";
import IPCEventType from "./Channels";
import { KeyState } from "./InputState";
import { Board } from "./Controls/Board";
const
    $btnMinimise = $("#btnMinimise"),
    $btnMaximise = $("#btnMaximise"),
    $btnQuit = $("#btnQuit"),
    $btnDevTools = $("#btnDevTools")
    ;

$(() => {
    KeyState.Init();
    $btnMinimise.on("click", () => { remote.getCurrentWindow().minimize(); });
    $btnMaximise.on("click", () => { (remote.getCurrentWindow().isMaximized()) ? remote.getCurrentWindow().unmaximize() : remote.getCurrentWindow().maximize(); });
    $btnQuit.on("click", () => { ipcRenderer.send(IPCEventType.APP_QUIT); });
    $btnDevTools.on("click", () => { ipcRenderer.send(IPCEventType.SHOW_DEV_TOOLS); });
    new Board()
        .DrawBoard()
        .DrawPieces()
        ;

    log.info(`Page Loaded...`);
});
