import { IPoint } from "./Point";

export interface IRect extends IPoint {
    width: number;
    height: number;
}

export class Rect implements IRect {
    public x: number;
    public y: number;
    public width: number;
    public height: number;

    constructor(x: number | IRect, y?: number, width?: number, height?: number) {
        if (typeof(x) === "number") {
            this.x = x;
            this.y = y; 
            this.width = width;
            this.height = height;
        } else {
            this.x = (x as IRect).x;
            this.y = (x as IRect).y;
            this.width = (x as IRect).width;
            this.height = (x as IRect).height;
        }
    }

}