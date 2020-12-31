import Graphics from "./Graphics";
import BoardManager from "./BoardManager";
import {Colour} from "./Colours";
import {PubSub} from "../Common/PubSub";
import { Channel } from "../Common/Channels";
import { IPoint, Point, Rect } from "./Math";
import Cell from "./Cell";

export class Board {

    private readonly canvas: HTMLCanvasElement;
    private readonly width: number;
    private readonly height: number;
    private readonly cellWidth: number;
    private readonly boardManager: BoardManager;
    private readonly subId: string = "BoardControl";

    private get context(): CanvasRenderingContext2D {
        return this.canvas.getContext("2d");
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
        this.boardManager = new BoardManager(this.cellWidth);

        // Initialise the scaling here (not in the context getter) otherwise calls to scale() are cumulative!
        const ctx = this.canvas.getContext("2d");
        ctx.scale(Graphics.Dpi, Graphics.Dpi);
        ctx.save();

        PubSub.Subscribe(Channel.MOUSE_CLICK, this.subId, (p: IPoint) => this.OnClick(p));
        PubSub.Subscribe(Channel.DRAW_CELL_OUTLINE, this.subId, (c: Cell) => this.OnDrawCellOutline(c))
    }

    private OnDrawCellOutline(cell: Cell): void {
        const {x, y, width, height} = cell.CanvasCoordinates.ToRect(this.cellWidth);
        const ctx = this.context;
        ctx.strokeStyle = Colour.GREEN;
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.rect(x, y, width, height);
        ctx.stroke();

    }
    private OnClick(clickPos: IPoint) : void {
        if (!this.IsWithinCanvas(clickPos)) return;
        const canvasSpace = this.ToCanvasSpace(clickPos);
        this.boardManager.OnClick(canvasSpace);
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
        const ctx = this.context;
    
        const l = this.width / 8;
        let isWhite = true;

        for (let yi = 0, y = 0; yi < 8; yi++) {
            y = yi * l;
            isWhite = yi % 2 == 0;
            for (let xi = 0, x = 0; xi < this.width; xi++) {
                x = xi * l;
                ctx.fillStyle = (isWhite) ? Colour.WHITE_CELL : Colour.BLACK_CELL;
                ctx.beginPath();
                ctx.rect(x, y, l, l);
                ctx.fill();

                isWhite = !isWhite;
            }
        }
        return this;
    }

    public DrawPieces(): this {
        const ctx = this.context;
        const cells = this.boardManager.cells;
        const l = this.width / 8;
        const offset = l / 4;
        const imgSize = l / 2;
        console.log(Graphics.Dpi);
        console.log(ctx.getTransform());

        ctx.restore();
        for (let i = 0; i < cells.length; i++) {
            const cell = cells[i];

            if (!cell.Occupant) continue;
            const piece = cell.Occupant;
            const x = cell.Coordinates.x * l + offset;
            const y = cell.Coordinates.y * l + offset;
            const icon = piece.Icon;
            const img = new Image(imgSize, imgSize);
            img.onload = function() {
                ctx.drawImage(img, x, y, imgSize, imgSize);
            }
            img.src = `../../img/${icon.path}`;
        }

        return this;
    }
}