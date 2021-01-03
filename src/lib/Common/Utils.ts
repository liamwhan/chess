import { Player } from "../Controls/Pieces";

export function isNullOrUndefined(input: any): boolean {
    return (input === undefined || input === null || typeof(input) === "undefined");
}

export function isMacOs(): boolean {
    return process.platform === "darwin";
}

export function isWin32(): boolean {
    return process.platform === "win32";
}

export function isNix(): boolean {
    return process.platform === "linux" || process.platform === "freebsd"
}

export function isAndroid(): boolean {
    return process.platform === "android";
}

export function GetPlayer(turn: number): Player {
    return turn % 2 === 0 ? Player.BLACK : Player.WHITE; // Turns start at 1, so blacks are even whites are odd.
}