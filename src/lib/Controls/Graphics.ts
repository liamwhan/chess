export default class Graphics {
    private static readonly dpi: number = window.devicePixelRatio;

    public static get Dpi(): number {
        return this.dpi;
    }

    public static Scale(input: number): number {
        return Math.round(input * this.dpi);
    }

    
}