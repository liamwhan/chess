import { Player } from "../Pieces/Player";
import { Piece } from "../Pieces/Piece";
import Cell from "../Cell";
import { GameMove } from "./Types";

export class Move {
    public player: Player;
    public piece: Piece;
    public from: Cell;
    public to: Cell;
    public capture: boolean;
    
    public GetState(): GameMove {
        const {player, piece, from, to, capture} = this;
        return {
            player,
            piece: piece.GetState(),
            from: from.GetState(),
            to: to.GetState(),
            capture
        };
    };
}
