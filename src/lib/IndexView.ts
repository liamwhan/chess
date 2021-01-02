import { ipcRenderer, remote } from "electron";
import * as log from "electron-log";
import IPCEventType from "./IPCEventType";
import { KeyState } from "./Common/InputState";
import { Board } from "./Controls/Board";
import { PubSub } from "./Common/PubSub";
import { Channel } from "./Common/Channels";
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
    ipcRenderer.on(IPCEventType.SAVE_DIALOG_RESULT, (e: Electron.IpcRendererEvent, result: string) => PubSub.Publish(Channel.UI_SAVE_DIALOG_RESULT, result));
    ipcRenderer.on(IPCEventType.OPEN_DIALOG_RESULT, (e: Electron.IpcRendererEvent, result: string) => PubSub.Publish(Channel.UI_OPEN_DIALOG_RESULT, result));
    new Board()
        .DrawBoard()
        .DrawPieces()
        ;

    log.info(`Page Loaded...`);
});
