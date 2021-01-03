import { ipcRenderer, remote } from "electron";
import * as log from "electron-log";
import IPCEventType from "./IPCEventType";
import { KeyState } from "./Common/InputState";
import { Board } from "./Controls/Board";
import { PubSub } from "./Common/PubSub";
import { Channel } from "./Common/Channels";
import { isMacOs, GetPlayer } from "./Common/Utils";

const
    $btnMinimise = $("#btnMinimise"),
    $btnMaximise = $("#btnMaximise"),
    $btnQuit = $("#btnQuit"),
    $btnDevTools = $("#btnDevTools"),
    $whiteName = $("#whiteName"),
    $blackName = $("#blackName"),
    $turn = $("#turn"),
    $player = $("#player"),
    $undo = $("#undo"),
    $redo = $("#redo"),
    subId = "IndexView"
    ;


$(() => {
    if (isMacOs()) {
        $(".hide-mac").remove();
    }
    KeyState.Init();
    $btnMinimise.on("click", () => { remote.getCurrentWindow().minimize(); });
    $btnMaximise.on("click", () => { (remote.getCurrentWindow().isMaximized()) ? remote.getCurrentWindow().unmaximize() : remote.getCurrentWindow().maximize(); });
    $btnQuit.on("click", () => { ipcRenderer.send(IPCEventType.APP_QUIT); });
    $btnDevTools.on("click", () => { ipcRenderer.send(IPCEventType.SHOW_DEV_TOOLS); });
    $blackName.on("change", (e: JQuery.ChangeEvent) => PubSub.Publish(Channel.UI_BLACK_NAME_CHANGE, $(e.currentTarget).val()))
    $whiteName.on("change", (e: JQuery.ChangeEvent) => PubSub.Publish(Channel.UI_WHITE_NAME_CHANGE, $(e.currentTarget).val()))
    $undo.on("click", () => PubSub.Publish(Channel.GAME_STATE_UNDO));
    $redo.on("click", () => PubSub.Publish(Channel.GAME_STATE_REDO));
    
    ipcRenderer.on(IPCEventType.SAVE_DIALOG_RESULT, (_e: Electron.IpcRendererEvent, result: string) => PubSub.Publish(Channel.UI_SAVE_DIALOG_RESULT, result));
    ipcRenderer.on(IPCEventType.OPEN_DIALOG_RESULT, (_e: Electron.IpcRendererEvent, result: string) => PubSub.Publish(Channel.UI_OPEN_DIALOG_RESULT, result));
    
    PubSub.Subscribe(Channel.GAME_STATE_TURN_CHANGE, subId, (turn: number) => OnTurnChange(turn));
    PubSub.Subscribe(Channel.GAME_STATE_SET_BLACK_NAME, subId, (name?: string) => $blackName.val(name));
    PubSub.Subscribe(Channel.GAME_STATE_SET_WHITE_NAME, subId, (name?: string) => $blackName.val(name));


    new Board()
        .DrawBoard()
        .DrawPieces()
        ;

    log.info(`Page Loaded...`);
});

function OnTurnChange(turn: number) {
    $turn.val(turn);
    $player.val(GetPlayer(turn));

}
