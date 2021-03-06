export enum Channel {
    MOUSE_CLICK,
    
    REDRAW_CELL,
    REDRAW_CELLS,
    REDRAW_ALL_CELLS,
    DESELECT_ALL_CELLS,
    
    LEGAL_MOVES_CALCULATED,
    
    GAME_STATE_PIECE_SELECTED,
    GAME_STATE_PIECE_DESELECTED,
    GAME_STATE_MOVE_PIECE,
    GAME_STATE_END_TURN,
    GAME_STATE_SAVE,
    GAME_STATE_LOAD,
    GAME_STATE_UNDO,
    GAME_STATE_REDO,
    GAME_STATE_COMMIT,
    GAME_STATE_TURN_CHANGE,
    GAME_STATE_SET_BLACK_NAME,
    GAME_STATE_SET_WHITE_NAME,

    UI_SHOW_SAVE_DIALOG,
    UI_SHOW_OPEN_DIALOG,
    UI_SAVE_DIALOG_RESULT,
    UI_OPEN_DIALOG_RESULT,
    UI_BLACK_NAME_CHANGE,
    UI_WHITE_NAME_CHANGE,

}