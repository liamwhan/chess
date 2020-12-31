import { IPoint, Point } from "../Math/Point";
import { Icon, GetIcon } from "./Icon";
import { PieceName } from "./PieceNames";
import { Player } from "./Player";

export abstract class Piece {

    protected player: Player;
    protected name: PieceName;
    protected gridPosition: Point;
    protected icon: Icon;

    public get Icon(): Icon {
        return this.icon;
    }
    
    public get GridPosition(): Point {
        return this.gridPosition.Clone();
    }

    public MoveTo(position: IPoint): void {
        this.gridPosition = new Point(position);
    }

    constructor(player: Player, piece: PieceName, gridPosition: IPoint)
    {
        this.player = player;
        this.name = piece;
        this.gridPosition = new Point(gridPosition);
        this.icon = GetIcon(player, piece);
    }

}

export class Pawn extends Piece {
    constructor(player: Player, gridPosition: IPoint) {
        super(player, PieceName.PAWN, gridPosition); 
    }
}

export class Rook extends Piece {
    constructor(player: Player, gridPosition: IPoint) {
        super(player, PieceName.ROOK, gridPosition); 
    }
}

export class Knight extends Piece {
    constructor(player: Player, gridPosition: IPoint) {
        super(player, PieceName.KNIGHT, gridPosition); 
    }
}

export class Bishop extends Piece {
    constructor(player: Player, gridPosition: IPoint) {
        super(player, PieceName.BISHOP, gridPosition); 
    }
}

export class Queen extends Piece {
    constructor(player: Player, gridPosition: IPoint) {
        super(player, PieceName.QUEEN, gridPosition); 
    }
}
export class King extends Piece {
    constructor(player: Player, gridPosition: IPoint) {
        super(player, PieceName.KING, gridPosition); 
    }
}
