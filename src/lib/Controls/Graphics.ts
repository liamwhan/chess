export default class Graphics {
    
    public static get Dpi(): number {
        return window.devicePixelRatio;
    }

    public static Scale(input: number): number {
        return Math.round(input * this.Dpi);
    }

    
}