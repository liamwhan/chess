import Cell from "./Cell";
import { Point } from "./Math/Point";
import { King, Queen, Bishop, Knight, Rook, Pawn, Piece } from "./Pieces/Pieces";
import { Player } from "./Pieces/Player";

export default class BoardManager {
    private whitePieces: Piece[] = [
        new Rook(Player.WHITE, {x: 0, y: 0}),
        new Knight(Player.WHITE, {x: 1, y: 0}),
        new Bishop(Player.WHITE, {x: 2, y: 0}),
        new King(Player.WHITE, {x: 3, y: 0}),
        new Queen(Player.WHITE, {x: 4, y: 0}),
        new Bishop(Player.WHITE, {x: 5, y: 0}),
        new Knight(Player.WHITE, {x: 6, y: 0}),
        new Rook(Player.WHITE, {x: 7, y: 0}),
        
        new Pawn(Player.WHITE, {x: 0, y: 1}),
        new Pawn(Player.WHITE, {x: 1, y: 1}),
        new Pawn(Player.WHITE, {x: 2, y: 1}),
        new Pawn(Player.WHITE, {x: 3, y: 1}),
        new Pawn(Player.WHITE, {x: 4, y: 1}),
        new Pawn(Player.WHITE, {x: 5, y: 1}),
        new Pawn(Player.WHITE, {x: 6, y: 1}),
        new Pawn(Player.WHITE, {x: 7, y: 1}),
    ]
    
    private blackPieces: Piece[] = [
        new Rook(Player.BLACK, {x: 0, y: 7}),
        new Knight(Player.BLACK, {x: 1, y: 7}),
        new Bishop(Player.BLACK, {x: 2, y: 7}),
        new King(Player.BLACK, {x: 3, y: 7}),
        new Queen(Player.BLACK, {x: 4, y: 7}),
        new Bishop(Player.BLACK, {x: 5, y: 7}),
        new Knight(Player.BLACK, {x: 6, y: 7}),
        new Rook(Player.BLACK, {x: 7, y: 7}),
        
        new Pawn(Player.BLACK, {x: 0, y: 6}),
        new Pawn(Player.BLACK, {x: 1, y: 6}),
        new Pawn(Player.BLACK, {x: 2, y: 6}),
        new Pawn(Player.BLACK, {x: 3, y: 6}),
        new Pawn(Player.BLACK, {x: 4, y: 6}),
        new Pawn(Player.BLACK, {x: 5, y: 6}),
        new Pawn(Player.BLACK, {x: 6, y: 6}),
        new Pawn(Player.BLACK, {x: 7, y: 6}),
    ]

    private get allPieces(): Piece[] {
        return this.whitePieces.concat(this.blackPieces);
    }

    public board: Cell[] = [];

    constructor() {
        for(let y = 0; y < 8; y++) {
            for(let x = 0; x < 8; x++) {
                const point = new Point(x, y);
                const occupant = this.allPieces.find(p => point.Equals(p.GridPosition));
                const cell = new Cell(point, occupant);
                this.board.push(cell);
            }
        }
    }
}