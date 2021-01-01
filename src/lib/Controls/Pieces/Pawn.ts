import { IPoint, Point } from "../Math/Point";
import { Vector2 } from "../Math/Vector2";
import { PieceName } from "./PieceNames";
import { Player } from "./Player";
import { Piece } from "./Pieces";


export class Pawn extends Piece {
    public CalculatePossibleMoves(): Point[] {
        const moves: Point[] = [];
        const moveDirection = this.GetMoveDirection();
        if (!this.hasMoved) {
            // Add pawn initial 2 square move
            moves.push(new Point(this.gridPosition.Add({ x: 0, y: 2 * moveDirection.y })));
        }
        moves.push(new Point(this.gridPosition.Add({ x: 0, y: moveDirection.y })));
        return moves;
    }

    protected GetMoveDirection(): Vector2 {
        if (this.player === Player.WHITE)
            return Vector2.DOWN;
        return Vector2.UP;
    }

    constructor(player: Player, gridPosition: IPoint) {
        super(player, PieceName.PAWN, gridPosition);
    }
}
