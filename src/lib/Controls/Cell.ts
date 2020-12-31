import { Piece } from "./Pieces/Pieces";
import { Point, IPoint } from "./Math/Point";
import { PubSub } from "../Common/PubSub";
import { Channel } from "../Common/Channels";

export default class Cell {
    private coordinates: Point;
    private occupant: Piece = null;
    private cellSize: number;
    private selected: boolean = false;

    public get Coordinates(): Point {
        return this.coordinates.Clone();
    }

    public get CanvasCoordinates(): Point {
        return this.coordinates.Scale(this.cellSize);
    }

    public get Occupant(): Piece {
        return this.occupant;
    }

    public set Occupant(value: Piece) {
        this.occupant = value;
    }

    public IsColliding(point: IPoint) : boolean {
        return Point.AABBCollision(new Point(point).ToRect(1), this.CanvasCoordinates.ToRect(this.cellSize))
    }

    public OnCollision(): void {
        this.selected = !this.selected;
        if (this.selected) {
            PubSub.Publish(Channel.DRAW_CELL_OUTLINE, this);
        } else {
            PubSub.Publish(Channel.CLEAR_CELL_OUTLINE, this);
        }
    }

    constructor(cellSize: number, coordinates: IPoint, occupant?: Piece) {
        this.cellSize = cellSize;
        this.coordinates = new Point(coordinates);
        this.occupant = occupant;
    }

}