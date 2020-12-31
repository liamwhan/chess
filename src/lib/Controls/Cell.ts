import { Piece } from "./Pieces/Pieces";
import { Point, IPoint } from "./Math/Point";

export default class Cell {
    private coordinates: Point;
    private occupant: Piece = null;

    public get Coordinates(): IPoint {
        return this.coordinates.IPoint;
    }

    public get Occupant(): Piece {
        return this.occupant;
    }

    public set Occupant(value: Piece) {
        this.occupant = value;
    }

    constructor(coordinates: IPoint, occupant?: Piece) {
        this.coordinates = new Point(coordinates);
        this.occupant = occupant;
    }

}