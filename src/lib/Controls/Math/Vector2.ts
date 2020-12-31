import { IPoint, Point } from "./Point";

export class Vector2 extends Point {
    public static readonly UP: Vector2 = new Vector2(0, -1);
    public static readonly DOWN: Vector2 = new Vector2(0, 1);
    public static readonly RIGHT: Vector2 = new Vector2(1, 0);
    public static readonly LEFT: Vector2 = new Vector2(-1, 0);
    public static readonly NORTH: Vector2 = new Vector2(0, -1);
    public static readonly EAST: Vector2 = new Vector2(1, 0);
    public static readonly SOUTH: Vector2 = new Vector2(0, 1);
    public static readonly WEST: Vector2 = new Vector2(-1, 0);
    public static readonly NORTHEAST: Vector2 = new Vector2(1, -1);
    public static readonly SOUTHEAST: Vector2 = new Vector2(1, 1);
    public static readonly SOUTHWEST: Vector2 = new Vector2(-1, -1);
    public static readonly NORTHWEST: Vector2 = new Vector2(-1, 1);
    public static readonly BASISX: Vector2 = new Vector2(1, 0);
    public static readonly BASISY: Vector2 = new Vector2(0, 1);

    public get Magnitude(): number {
        return Math.sqrt(this.x ** 2 + this.y ** 2);
    }

    public get Unit(): Vector2 {
        return new Vector2({ x: this.x / this.Magnitude, y: this.y / this.Magnitude });
    }

    public static Cross(A: IPoint, B: IPoint): number {
        return (A.x * B.y) - (A.y * B.x);
    }
    
    public static Direction(origin: IPoint, target: IPoint): Vector2 {
        return new Vector2(target.x - origin.x, target.y - origin.y);
    }

    public static DirectionVectorUnit(origin: IPoint, target: IPoint): Vector2 {
        const d = Vector2.Direction(origin, target);
        const m = Math.sqrt(d.x * d.x + d.y * d.y);
        return new Vector2(d.x / m, d.y / m);
    }

    public Dot(other: IPoint): number {
        return (this.x * other.x) + (this.y * other.y);
    }

    public Invert(): Vector2 {
        return new Vector2(this.x * -1, this.y * -1);
    }

}