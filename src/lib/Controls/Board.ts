import Graphics from "./Graphics";

export class Board {

    private readonly canvas: HTMLCanvasElement;
    private readonly width: number;
    private readonly height: number;

    private get context(): CanvasRenderingContext2D {
        const ctx = this.canvas.getContext("2d");
        ctx.scale(Graphics.Dpi, Graphics.Dpi);
        return ctx;
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

        this.SetupBoard();
    }

    private SetupBoard(): void {
        const ctx = this.context;
        const l = this.width / 8;
        let isWhite = true;

        for (let yi = 0, y = 0; yi < 8; yi++) {
            y = yi * l;
            isWhite = yi % 2 == 0;
            for (let xi = 0, x = 0; xi < this.width; xi++) {
                x = xi * l;
                ctx.fillStyle = (isWhite) ? "#ffffff" : "#000000";
                ctx.beginPath();
                ctx.rect(x, y, l, l);
                ctx.fill();

                isWhite = !isWhite;
            }
        }

    }
}