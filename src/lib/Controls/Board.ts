import Graphics from "./Graphics";
import GameManager from "./GameManager";
import {Colour} from "./Colours";
import {PubSub} from "../Common/PubSub";
import { Channel } from "../Common/Channels";
import { IPoint, Point, Rect } from "./Math";
import Cell from "./Cell";
import { CellState } from "./CellState";
import { CellShade } from "./CellShade";

export class Board {

    private readonly canvas: HTMLCanvasElement;
    private readonly width: number;
    private readonly height: number;
    private readonly cellWidth: number;
    private readonly pieceOffset: number;
    private readonly imgSize: number;
    private readonly gameManager: GameManager;
    private readonly subId: string = "BoardControl";

    private get context(): CanvasRenderingContext2D {
        return this.canvas.getContext("2d");
    }

    private get cells(): Cell[] {
        return this.gameManager.Cells;
    }

    constructor() {
        const container = $("#container");
        this.canvas = document.getElementById("board") as HTMLCanvasElement;
        this.width = container.width();
        this.height = container.height();
        this.canvas.width = Graphics.Scale(container.width());
        this.canvas.height = Graphics.Scale(container.height());
        this.canvas.style.width = container.width() + "px";
        this.canvas.style.height = container.height() + "px";
        this.cellWidth = this.width / 8;
        this.pieceOffset = this.cellWidth / 4;
        this.imgSize = this.cellWidth / 2;
        this.gameManager = new GameManager();

        // Initialise the scaling here (not in the context getter) otherwise calls to scale() are cumulative!
        const ctx = this.canvas.getContext("2d");
        ctx.scale(Graphics.Dpi, Graphics.Dpi);
        ctx.save();

        PubSub.Subscribe(Channel.MOUSE_CLICK, this.subId, (p: IPoint) => this.OnClick(p));
        PubSub.Subscribe(Channel.REDRAW_CELL, this.subId, (c: Cell) => this.OnRedrawCell(c));
        PubSub.Subscribe(Channel.REDRAW_CELLS, this.subId, (c: Cell[]) => this.OnRedrawCells(c));
        PubSub.Subscribe(Channel.REDRAW_ALL_CELLS , this.subId, () => this.OnRedrawAllCells());
    }

    private OnRedrawCells(cells: Cell[]): void {
        for(const cell of cells) {
            this.DrawCell(cell);
        }
    }
    
    private OnRedrawAllCells(): void {
        for(const cell of this.cells) {
            this.DrawCell(cell);
        }
    }

    private DrawOutline(cell: Cell, colour: Colour): void {
        const {x, y, width, height} = cell.CanvasCoordinates.ToRect(this.cellWidth);
        const ctx = this.context;
        const lw = 4;
        const halfLw = lw / 2;
        ctx.strokeStyle = colour;
        ctx.lineWidth = lw;
        ctx.beginPath();
        ctx.rect(x + halfLw, y + halfLw, width - lw, height - lw);
        ctx.stroke();
    }

    private OnRedrawCell(cell: Cell): void {
        this.DrawCell(cell);
    }

    private DrawCell(cell: Cell): void {
        const cellColour = cell.Shade === CellShade.LIGHT ? Colour.WHITE_CELL : Colour.BLACK_CELL;
        const rect = cell.CanvasCoordinates.ToRect(this.cellWidth);
        const ctx = this.context;
        ctx.fillStyle = cellColour;
        ctx.beginPath();
        ctx.rect(rect.x, rect.y, rect.width, rect.height);
        ctx.fill();
        
        if (cell.State === CellState.Selected) this.DrawOutline(cell, Colour.GREEN);
        if (cell.State === CellState.MoveHighlighted) this.DrawOutline(cell, Colour.YELLOW);
        if (!cell.IsOccupied) return;
        this.DrawCellPiece(cell);
    }

    private OnClick(clickPos: IPoint) : void {
        PubSub.Publish(Channel.DESELECT_ALL_CELLS);
        if (!this.IsWithinCanvas(clickPos)) return;
        const canvasSpace = this.ToCanvasSpace(clickPos);
        this.gameManager.OnClick(canvasSpace);
    }

    private IsWithinCanvas(point: IPoint): boolean {
        const canvas = this.canvas;
        const boundingRect = new Rect(canvas.getBoundingClientRect());
        const mouseRect = new Point(point).ToRect(1);
        return Point.AABBCollision(mouseRect, boundingRect);
    }

    private ToCanvasSpace(point: IPoint): Point {
        const canvasRect = this.canvas.getBoundingClientRect();
        const { x, y } = point;
        return new Point({
            x: x - canvasRect.left,
            y: y - canvasRect.top
        });
    }

    public DrawBoard(): this {
        for(const cell of this.gameManager.Cells)
        {
            this.DrawCell(cell);
        }
        return this;
    }

    public DrawPieces(): this {
        const cells = this.gameManager.Cells;
        for (let i = 0; i < cells.length; i++) {
            const cell = cells[i];

            if (!cell.Occupant) continue;
            this.DrawCellPiece(cell);
            
        }
        return this;
    }

    public DrawCellPiece(cell: Cell): void {
        const ctx = this.context;
        const piece = cell.Occupant;
        const x = cell.Coordinates.x * this.cellWidth + this.pieceOffset;
        const y = cell.Coordinates.y * this.cellWidth + this.pieceOffset;
        const icon = piece.Icon;
        const imgSize = this.imgSize;
        const img = new Image(imgSize, imgSize);
        img.onload = function() {
            ctx.drawImage(img, x, y, imgSize, imgSize);
        }
        img.src = `../../img/${icon.path}`;
    }
}