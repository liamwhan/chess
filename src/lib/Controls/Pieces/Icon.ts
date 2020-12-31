import { Player } from "./Player";
import { PieceName } from "./PieceNames";

export interface Icon {
    player: Player;
    piece: PieceName
    path: string;
}

const icons: Icon[] = [
    {
        player: Player.WHITE,
        piece: PieceName.KING,
        path: "king-w.svg"
    },
    {
        player: Player.BLACK,
        piece: PieceName.KING,
        path: "king-b.svg"
    },
    {
        player: Player.WHITE,
        piece: PieceName.QUEEN,
        path: "queen-w.svg"
    },
    {
        player: Player.BLACK,
        piece: PieceName.QUEEN,
        path: "queen-b.svg"
    },
    {
        player: Player.WHITE,
        piece: PieceName.BISHOP,
        path: "bishop-w.svg"
    },
    {
        player: Player.BLACK,
        piece: PieceName.BISHOP,
        path: "bishop-b.svg"
    },
    {
        player: Player.WHITE,
        piece: PieceName.KNIGHT,
        path: "knight-w.svg"
    },
    {
        player: Player.BLACK,
        piece: PieceName.KNIGHT,
        path: "knight-b.svg"
    },
    {
        player: Player.WHITE,
        piece: PieceName.ROOK,
        path: "rook-w.svg"
    },
    {
        player: Player.BLACK,
        piece: PieceName.ROOK,
        path: "rook-b.svg"
    },
    {
        player: Player.WHITE,
        piece: PieceName.PAWN,
        path: "pawn-w.svg"
    },
    {
        player: Player.BLACK,
        piece: PieceName.PAWN,
        path: "pawn-b.svg"
    },
];

export function GetIcon(player: Player, piece: PieceName): Icon {
    return icons.find(i => i.player === player && i.piece === piece);
}