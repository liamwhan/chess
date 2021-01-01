import {Player} from "../Pieces/Player";
import {IPoint} from "../Math";

export interface GameTurnHistory {
    turns: GameTurn[];
}

export interface GameTurn {
    player: Player;
    boardState: BoardCell[];
    number: number;
    move?: GameMove;
}

export interface GameMove {
    player: Player;
    piece: BoardPiece;
    from: BoardCell;
    to: BoardCell;
    capture: boolean;
}

export interface BoardCell {
    location: IPoint;
    occupant?: BoardPiece;
}

export interface BoardPiece {
    id: string;
    player: Player;
}