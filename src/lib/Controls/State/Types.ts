import {Player} from "../Pieces/Player";
import {IPoint} from "../Math";
import { PieceName } from "../Pieces/PieceNames";
import { CellShade } from "../CellShade";

export interface GameState {
    turn: number;
    player: Player;
    filename?: string;
    history: GameTurnHistory;
}

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
    shade: CellShade;
}

export interface BoardPiece {
    id: string;
    player: Player;
}