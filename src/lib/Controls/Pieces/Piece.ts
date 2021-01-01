import Cell from "../Cell";
import { IPoint, Point } from "../Math/Point";
import { Icon, GetIcon } from "./Icon";
import { PieceName } from "./PieceNames";
import { Player } from "./Player";
import { BoardPiece } from "../State/Types";
import { Vector2 } from "../Math/Vector2";

export abstract class Piece {

    protected player: Player;
    protected name: PieceName;
    protected gridPosition: Point;
    protected icon: Icon;
    protected hasMoved: boolean = false;
    protected readonly pathBlockable: boolean;

    public Cell: Cell;

    public GetState(): BoardPiece {
        return {
            id: this.name,
            player: this.player
        };
    }

    public static FromState(state: BoardPiece, position: IPoint): Piece {
        switch (state.id) {
            case PieceName.KING:
                return new King(state.player, position);
            case PieceName.QUEEN:
                return new Queen(state.player, position);
            case PieceName.BISHOP:
                return new Bishop(state.player, position);
            case PieceName.KNIGHT:
                return new Knight(state.player, position);
            case PieceName.ROOK:
                return new Rook(state.player, position);
            case PieceName.PAWN:
                return new Pawn(state.player, position);
            default:
                throw new Error(`Invalid piece id: ${state.id}`);
        }
    }

    public get Icon(): Icon {
        return this.icon;
    }
    
    public get GridPosition(): Point {
        return this.gridPosition.Clone();
    }

    public MoveTo(cell: Cell): void {
        this.gridPosition = new Point(cell.Coordinates);
        this.Cell = cell;
    }

    /**
     * Gets all possible moves, not legal moves. i.e. this function has no
     * awareness of the other pieces on the board, it only searches out from it's position 
     * and gets the tiles it could move to.
     */
    public abstract CalculatePossibleMoves(): Point[];

    constructor(player: Player, piece: PieceName, gridPosition: IPoint, pathBlockable: boolean = true)
    {
        this.player = player;
        this.name = piece;
        this.gridPosition = new Point(gridPosition);
        this.icon = GetIcon(player, piece);
        this.pathBlockable = pathBlockable;
    }

}

export class King extends Piece {
    public CalculatePossibleMoves(): Point[] {
        throw new Error("Method not implemented.");
    }
    constructor(player: Player, gridPosition: IPoint) {
        super(player, PieceName.KING, gridPosition);
    }
}

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

export class Knight extends Piece {
    public CalculatePossibleMoves(): Point[] {
        throw new Error("Method not implemented.");
    }
    constructor(player: Player, gridPosition: IPoint) {
        super(player, PieceName.KNIGHT, gridPosition, false);
    }
}

export class Queen extends Piece {
    public CalculatePossibleMoves(): Point[] {
        throw new Error("Method not implemented.");
    }
    constructor(player: Player, gridPosition: IPoint) {
        super(player, PieceName.QUEEN, gridPosition);
    }
}

export class Bishop extends Piece {
    public CalculatePossibleMoves(): Point[] {
        throw new Error("Method not implemented.");
    }
    constructor(player: Player, gridPosition: IPoint) {
        super(player, PieceName.BISHOP, gridPosition);
    }
}

export class Rook extends Piece {
    public CalculatePossibleMoves(): Point[] {
        throw new Error("Method not implemented.");
    }
    constructor(player: Player, gridPosition: IPoint) {
        super(player, PieceName.ROOK, gridPosition);
    }
}