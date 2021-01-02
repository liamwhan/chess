import { ipcRenderer } from "electron";
import IPCEventType from "../IPCEventType";
import { Channel } from "./Channels";
import { PubSub } from "./PubSub";
declare const window: any;

/**
 * Some KeyCodes that correspond to the value passed in event.which on keydown, keyup etc. events
 * @see https://css-tricks.com/snippets/javascript/javascript-keycodes/#article-header-id-1
 */
export enum KeyCode {
    BACKSPACE       = 8,
    DELETE          = 46,
    ALT             = 18,
    EQUALS          = 187,
    MINUS           = 189,
    ZERO            = 48,
    KEYPAD_PLUS     = 107,
    KEYPAD_MINUS    = 109,
    KEYPAD_ZERO     = 96,
    CONTROL         = 17,
    COMMAND_LEFT    = 91,
    COMMAND_RIGHT   = 93,
    SHIFT           = 16,
    C               = 67,
    L               = 76,
    S               = 83,
    Q               = 81,
    Z               = 90,
    Y               = 89,
    ARROW_UP        = 38,
    ARROW_DOWN      = 40,
    ARROW_LEFT      = 37,
    ARROW_RIGHT     = 39,

}

/**
 * MouseCode values that correspond to event.which on mousedown, mouseup etc. events
 */
export enum MouseCode {
    LEFT            = 1,
    MIDDLE          = 2,
    RIGHT           = 3
}

/**
 * Custom KeyDown Handlers can be added here
 */
export class KeyState {
    public static CtrlKeyDown: boolean = false;
    public static AltKeyDown: boolean = false;
    public static ShiftKeyDown: boolean = false;
    public static Init() {
        $(window).on("keydown", (e: JQuery.Event) => this.onKeyDown(e));
        $(window).on("keyup", (e: JQuery.Event) => this.onKeyUp(e));
        $(window).on("click", (e: JQuery.ClickEvent) => this.onClick(e))

        ipcRenderer.on(IPCEventType.MAIN_WINDOW_BLUR, this.onMainWindowFocusChange);
        ipcRenderer.on(IPCEventType.MAIN_WINDOW_FOCUS, this.onMainWindowFocusChange);
    }

    private static onClick(e: JQuery.ClickEvent) : void {
        const {clientX, clientY} = e;
        PubSub.Publish(Channel.MOUSE_CLICK, {x: clientX, y: clientY});
    }

    private static onMainWindowFocusChange(): void {
        this.CtrlKeyDown = false;
        this.AltKeyDown = false;
        this.ShiftKeyDown = false;
    }

    private static onKeyDown(e: JQuery.Event): void {
        switch (e.which) {
            case KeyCode.CONTROL:
            case KeyCode.COMMAND_LEFT:
            case KeyCode.COMMAND_RIGHT:
                if (this.CtrlKeyDown) return;
                e.preventDefault();
                this.CtrlKeyDown = true;
                break;
            case KeyCode.SHIFT:
                if (this.ShiftKeyDown) return;
                e.preventDefault();
                this.ShiftKeyDown = true;
                break;
            case KeyCode.C:
                if (!(this.ShiftKeyDown && this.CtrlKeyDown)) return;
                e.preventDefault();
                PubSub.Publish(Channel.GAME_STATE_COMMIT);
                break;
            case KeyCode.Q:
                if (!this.CtrlKeyDown) return;
                e.preventDefault();
                ipcRenderer.send(IPCEventType.APP_QUIT);
                break;
            case KeyCode.S:
                if (!this.CtrlKeyDown) return;
                e.preventDefault();
                PubSub.Publish(Channel.GAME_STATE_SAVE);
                break;case KeyCode.S:
            case KeyCode.L:
                if (!this.CtrlKeyDown) return;
                e.preventDefault();
                PubSub.Publish(Channel.GAME_STATE_LOAD);
                break;
            case KeyCode.Z:
                if (!this.CtrlKeyDown) return;
                e.preventDefault();
                PubSub.Publish(Channel.GAME_STATE_UNDO);
                break;
            case KeyCode.Y:
                if (!this.CtrlKeyDown) return;
                e.preventDefault();
                PubSub.Publish(Channel.GAME_STATE_REDO);
                break;
            
            default:
                return;
        }
    }

    private static onKeyUp(e: JQuery.Event): void {
        switch (e.which) {
            case KeyCode.CONTROL:
            case KeyCode.COMMAND_LEFT:
            case KeyCode.COMMAND_RIGHT:
                if (!this.CtrlKeyDown) return;
                this.CtrlKeyDown = false;
                break;
            case KeyCode.SHIFT:
                if (!this.ShiftKeyDown) return;
                e.preventDefault();
                this.ShiftKeyDown = false;
                break;
            default:
                return;
        }
    }
}
