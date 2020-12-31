export function isNullOrUndefined(input: any): boolean {
    return (input === undefined || input === null || typeof(input) === "undefined");
}