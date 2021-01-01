import Cell from "../Cell";
import { IPoint, Point } from "../Math/Point";
import { Icon, GetIcon } from "./Icon";
import { PieceName } from "./PieceNames";
import { Player } from "./Player";
import { BoardPiece } from "../State/Types";



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