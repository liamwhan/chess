import { Channel } from "../Common/Channels";
import { PubSub } from "../Common/PubSub";
import { isNullOrUndefined } from "../Common/Utils";
import Cell from "./Cell";
import { CellShade } from "./CellShade";
import { Point } from "./Math/Point";
import { Bishop, King, Knight, Pawn, Piece, Queen, Rook } from "./Pieces";
import { Player } from "./Pieces/Player";
import { GameTurn, GameTurnHistory, GameState } from "./State/Types";
import { Move } from "./State/Move";
import * as fs from "fs";
import * as path from "path";

export interface Selection {
    cell: Cell;
    piece?: Piece
}

export default class GameManager {
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
    ];
    
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
    ];

    private subId: string = "GameManager";
    private currentSelection: Selection;
    private currentGameState: GameTurn;
    private currentTurnPlayer: Player = Player.WHITE;
    private currentTurnNumber: number = 1;
    private turnHistory: GameTurnHistory = {
        turns: []
    };

    constructor() {
        this.SetupGameBoard();
        this.turnHistory.turns.push(this.GetState());
        PubSub.Subscribe(Channel.LEGAL_MOVES_CALCULATED, this.subId, (m: Point[]) => this.OnLegalMovesCalculated(m));
        PubSub.Subscribe(Channel.GAME_STATE_PIECE_SELECTED, this.subId, (c: Cell, p?: Piece) => this.OnPieceSelected(c, p));
        PubSub.Subscribe(Channel.DESELECT_ALL_CELLS, this.subId, () => this.OnDeselectAll());
        PubSub.Subscribe(Channel.GAME_STATE_SAVE, this.subId, () => this.SaveGame());
        PubSub.Subscribe(Channel.GAME_STATE_LOAD, this.subId, (f?: string) => this.LoadGame(f));
    }

    private GetState(): GameTurn {
        return {
            boardState: this.cells.map(c => c.GetState()),
            player: this.currentTurnPlayer,
            number: this.currentTurnNumber,
            move: null
        }
    }

    private LoadGame(filename?: string) {
        const filepath = path.resolve(__dirname, `../../../game.json`);
        const serialised = fs.readFileSync(filepath, {
            encoding: "utf8"
        });
        const newState: GameState = JSON.parse(serialised);
        this.LoadState(newState);
        PubSub.Publish(Channel.REDRAW_ALL_CELLS);
    }

    private LoadState(state: GameState): void {
        const latestTurn = state.history.turns[state.history.turns.length - 1];
        const cells = latestTurn.boardState.map(c => Cell.FromState(c));
        this.cells = cells;

    }

    private SaveGame(): void {
        const gameState: GameState = {
            history: this.turnHistory,
            player: this.currentTurnPlayer,
            turn: this.currentTurnNumber,
            filename: "game.json"
        }

        const outfile = path.resolve(__dirname, `../../../${gameState.filename}`);
        const serialized = JSON.stringify(gameState, null, 2);
        fs.writeFileSync(outfile, serialized, {
            encoding: "utf8"
        });
        console.log("Game saved to", outfile);
    }

    private CommitTurn(move: Move) {
        const state = this.GetState();
        state.move = move.GetState();
        this.turnHistory.turns.push(state);
        this.currentTurnNumber++;
        this.currentTurnPlayer = GameManager.GetNextPlayer(this.currentTurnPlayer);
    }

    private static GetNextPlayer(currentPlayer: Player): Player {
        if (currentPlayer === Player.WHITE) return Player.BLACK;
        return Player.WHITE;
    }

    private SetupGameBoard(): void {
        let isWhite = true;

        for (let y = 0; y < 8; y++) {
            isWhite = y % 2 == 0;
            for (let x = 0; x < 8; x++) {
                const pos = new Point(x, y);
                const shade = (isWhite) ? CellShade.LIGHT : CellShade.DARK;
                const occupant = this.GetCellOccupant(pos);
                const cell = new Cell(shade, pos, occupant);
                this.cells.push(cell);

                isWhite = !isWhite;
            }
        }
    }

    private OnDeselectAll(): void {
        this.currentSelection = null;
    }

    private OnPieceSelected(cell: Cell, piece?: Piece): void {
        this.currentSelection = { cell, piece };
    }

    private OnLegalMovesCalculated(moves: Point[]): void {
        const cells = this.Cells
            .filter(c => moves.some(m => m.Equals(c.Coordinates)))
            .map(c => c.SetMoveHighlighted());

        PubSub.Publish(Channel.REDRAW_CELLS, cells);
    }

    private get allPieces(): Piece[] {
        return this.whitePieces.concat(this.blackPieces);
    }

    private cells: Cell[] = [];
    public get Cells(): Cell[] {
        return this.cells;
    };

    public GetCellOccupant(point: Point): Piece {
        return this.allPieces.find(p => point.Equals(p.GridPosition));
    }

    public OnClick(clickPosCS: Point): void {
        const clickedCell = this.Cells.find(c => c.IsColliding(clickPosCS));
        if (isNullOrUndefined(clickedCell)) return;

        clickedCell.OnCollision();
    }
}