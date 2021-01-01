import { IPoint, Point } from "../Math/Point";
import { PieceName } from "./PieceNames";
import { Player } from "./Player";
import { Piece } from "./Pieces";


export class King extends Piece {
    public CalculatePossibleMoves(): Point[] {
        throw new Error("Method not implemented.");
    }
    constructor(player: Player, gridPosition: IPoint) {
        super(player, PieceName.KING, gridPosition);
    }
}
