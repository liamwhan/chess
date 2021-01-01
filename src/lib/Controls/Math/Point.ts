import { Rect } from ".";
import { isNullOrUndefined } from "../../Common/Utils";

export interface IPoint {
    x: number;
    y: number;
}

export class Point implements IPoint {
    public x: number;
    public y: number;

    public get IPoint(): IPoint {
        return {
            x: this.x,
            y: this.y
        };
    }

    public static AABBCollision(rect1: Rect, rect2: Rect): boolean {
        return (rect1.x < rect2.x + rect2.width &&
            rect1.x + rect1.width > rect2.x &&
            rect1.y < rect2.y + rect2.height &&
            rect1.height + rect1.y > rect2.y);
    }

    constructor(x: number | IPoint, y?: number) {
        if (typeof (x) === "number") {
            this.x = x;
            this.y = y;
        } else {
            this.x = (x as IPoint).x;
            this.y = (x as IPoint).y;

        }
    }

    public toString(subId: boolean = false): string {
        return subId ? `${this.x}-${this.y}` : JSON.stringify(this.IPoint);
    }

    public ToRect(w: number, h?: number): Rect {
        if (isNullOrUndefined(h)) h = w;
        return new Rect(this.x, this.y, w, h);
    }

    public Equals(other: IPoint): boolean {
        return this.x === other.x && this.y === other.y;
    }

    public Clone(): Point {
        return new Point(this.x, this.y);
    }

    public Sub(other: IPoint): Point {
        return new Point(this.x - other.x, this.y - other.y);
    }

    public Add(other: IPoint): Point {
        return new Point(this.x + other.x, this.y + other.y);
    }

    public Scale(scalar: number): Point {
        return new Point(this.x * scalar, this.y * scalar);
    }

    public DistanceTo(other: IPoint): number {
        return Math.sqrt(((this.x - other.x) ** 2) + ((this.y - other.y) ** 2));
    }
    public SqDistanceTo(other: IPoint): number {
        return ((this.x - other.x) ** 2) + ((this.y - other.y) ** 2);
    }

    public CircleCollision(other: IPoint, searchRadius: number = 4) {
        const sqRadius = searchRadius ** 2;
        const sqD = this.SqDistanceTo(other);
        return sqD <= sqRadius;
    }
}