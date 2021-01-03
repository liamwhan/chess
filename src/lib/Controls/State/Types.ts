import {Player} from "../Pieces/Player";
import {IPoint} from "../Math";
import { PieceName } from "../Pieces/PieceNames";
import { CellShade } from "../CellShade";

export interface GameState {
    turn: number;
    nextPlayer: "Black"|"White";
    filename?: string;
    whiteName?: string;
    blackName?: string;
    history: GameTurnHistory;
}

export interface GameTurnHistory {
    turns: GameTurn[];
}

export interface GameTurn {
    player: "Black"|"White";
    boardState: BoardCell[];
    number: number;
    move?: GameMove;
}

export interface GameMove {
    player: "Black"|"White";
    piece: BoardPiece;
    from: BoardCell;
    to: BoardCell;
    capture: boolean;
}

export interface BoardCell {
    location: IPoint;
    occupant?: BoardPiece;
    shade: CellShade;
}

export interface BoardPiece {
    id: string;
    player: Player;
}