import { Piece } from "./Pieces/Piece";
import { Point, IPoint } from "./Math/Point";
import { PubSub } from "../Common/PubSub";
import { Channel } from "../Common/Channels";
import {BoardCell} from "./State/Types";
import { isNullOrUndefined } from "../Common/Utils";
import { CellShade } from "./CellShade";
import { CellState } from "./CellState";


export default class Cell {
    private coordinates: Point;
    private occupant: Piece = null;
    private cellSize: number;
    private selected: boolean = false;
    private highlightMove: boolean = false;
    private cellShade: CellShade;
    private cellState: CellState = CellState.None;
    private subId: string;

    constructor(cellShade: CellShade, coordinates: IPoint, occupant?: Piece) {
        const w = $("#container").width();
        this.cellSize = w / 8;
        this.coordinates = new Point(coordinates);
        this.occupant = occupant;
        this.cellShade = cellShade;
        this.subId = "Cell-" + this.coordinates.toString(true);
        PubSub.Subscribe(Channel.DESELECT_ALL_CELLS, this.subId, () => this.OnDeselectAllCells());
    }

    public GetState(): BoardCell {
        return {
            location: this.coordinates.IPoint,
            occupant: (this.IsOccupied) ? this.occupant.GetState() : null,
            shade: this.cellShade
        };
    }

    public static FromState(state: BoardCell): Cell {
        let occupant = isNullOrUndefined(state.occupant) ? null : Piece.FromState(state.occupant, state.location);
        return new Cell(state.shade, state.location, occupant);
    }

    public get Shade(): CellShade {
        return this.cellShade;
    }

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

    public get IsOccupied(): boolean {
        return !isNullOrUndefined(this.occupant);
    }

    public get State(): CellState {
        return this.cellState;
    }

    public IsColliding(point: IPoint): boolean {
        return Point.AABBCollision(new Point(point).ToRect(1), this.CanvasCoordinates.ToRect(this.cellSize))
    }

    private OnDeselectAllCells(): void {
        const redraw = (this.selected || this.highlightMove);
        this.selected = false;
        this.highlightMove = false;
        this.cellState = CellState.None;
        if (redraw) {
            PubSub.Publish(Channel.REDRAW_CELL, this);
        }
    }

    public SetMoveHighlighted(): this {
        this.selected = false;
        this.highlightMove = true;
        this.UpdateCellState();
        return this;
    }

    public OnCollision(): void {

        this.selected = !this.selected;
        this.UpdateCellState();

        if (this.State === CellState.Selected) {
            PubSub.Publish(Channel.LEGAL_MOVES_CALCULATED, this.Occupant.CalculatePossibleMoves());
        }

        PubSub.Publish(Channel.GAME_STATE_PIECE_SELECTED, this, this.Occupant);
        PubSub.Publish(Channel.REDRAW_CELL, this);

    }

    private UpdateCellState(): void {
        if (this.selected) {
            if (this.IsOccupied) {
                this.cellState = CellState.Selected;
                return;
            }
        }
        else
            if (this.highlightMove) {
                this.cellState = CellState.MoveHighlighted;
                return;
            }
        // If we get here we don't want this cell selected at all
        this.selected = false;
        this.cellState = CellState.None;
    }



}