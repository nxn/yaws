import type { IBoard } from "../models/board";
import type { ICell } from "../models/cell";
import type { ISet } from "../models/set";

import { Constants as gc } from '../models/board';

export interface ICursorActions {
    setCursor:      (board: IBoard, cell: ICell) => void;
    columnLeft:     (board: IBoard) => void;
    columnRight:    (board: IBoard) => void;
    rowUp:          (board: IBoard) => void;
    rowDown:        (board: IBoard) => void;
    boxLeft:        (board: IBoard) => void;
    boxRight:       (board: IBoard) => void;
    boxUp:          (board: IBoard) => void;
    boxDown:        (board: IBoard) => void;
    previousError:  (board: IBoard) => void;
    nextError:      (board: IBoard) => void;
}

type TCellSelector = (set: ISet) => ICell;

export const createCursorActions = (): ICursorActions => ({
    setCursor: function(board: IBoard, cell: ICell) {
        if (board.getCursor() === cell) {
            return;
        }

        board.setCursor(cell);
    },

    previousError: function(board: IBoard) {
        // Starting from the previous index, return the first invalid cell occurence
        for (let i = board.getCursor().index - 1; i >= 0; i--) {
            let cell = board.cells[i];
            if (!cell.isStatic && !cell.isValid) {
                board.setCursor(cell);
                return;
            }
        }
    
        // Loop around and repeat from the end of the array
        for (let i = board.cells.length - 1; i > board.getCursor().index; i--) {
            let cell = board.cells[i];
            if (!cell.isStatic && !cell.isValid) {
                board.setCursor(cell);
                return;
            }
        }
    },
    
    nextError: function(board: IBoard) {
        // Starting from the next index, return the first invalid cell occurence
        for (let i = board.getCursor().index + 1; i < board.cells.length; i++) {
            let cell = board.cells[i];
            if (!cell.isStatic && !cell.isValid) {
                board.setCursor(cell);
                return;
            }
        }
    
        // Loop around and repeat from the beginning of the array 
        for (let i = 0; i < board.getCursor().index; i++) {
            let cell = board.cells[i];
            if (!cell.isStatic && !cell.isValid) {
                board.setCursor(cell);
                return;
            }
        }
    },
    
    rowUp: function(board: IBoard) {
        const cursor = offset(board.getCursor().row.index).by(-1).in(board.rows).select(
            row => row.cells[board.getCursor().column.index]
        );
        board.setCursor(cursor);
    },
    
    columnLeft: function(board: IBoard) {
        const cursor = offset(board.getCursor().column.index).by(-1).in(board.columns).select(
            col => col.cells[board.getCursor().row.index]
        );
        board.setCursor(cursor);
    },
    
    rowDown: function(board: IBoard) {
        const cursor = offset(board.getCursor().row.index).by(+1).in(board.rows).select(
            row => row.cells[board.getCursor().column.index]
        );
        board.setCursor(cursor)
    },
    
    columnRight: function(board: IBoard) {
        const cursor = offset(board.getCursor().column.index).by(+1).in(board.columns).select(
            col => col.cells[board.getCursor().row.index]
        );
        board.setCursor(cursor);
    },
    
    boxUp: function(board: IBoard) {
        const cursor = offset(board.getCursor().row.index).by(-gc.boxRowCount).in(board.rows).select(
            row => row.cells[board.getCursor().column.index]
        );
        board.setCursor(cursor);
    },
    
    boxLeft: function(board: IBoard) {
        const cursor = offset(board.getCursor().column.index).by(-gc.boxColumnCount).in(board.columns).select(
            col => col.cells[board.getCursor().row.index]
        );
        board.setCursor(cursor);
    },
    
    boxDown: function(board: IBoard) {
        const cursor = offset(board.getCursor().row.index).by(+gc.boxRowCount).in(board.rows).select(
            row => row.cells[board.getCursor().column.index]
        );
        board.setCursor(cursor);
    },
    
    boxRight: function(board: IBoard) {
        const cursor = offset(board.getCursor().column.index).by(+gc.boxColumnCount).in(board.columns).select(
            col => col.cells[board.getCursor().row.index]
        );
        board.setCursor(cursor);
    }
});


function offset(position: number) {
    const exec = (amount: number, sets: ISet[], selector: TCellSelector) => {
        const index = position + amount;

        if (Math.abs(amount) >= sets.length) {
            // Return the old position if the amount we're moving by is larger than the space that we're moving through.
            return selector(sets[position]);
        }

        if (index >= sets.length) {
            // If the new cursor position is off the board in a positive direction use the remainder of the new index 
            // modulus the sets length to loop around to a valid position.
            return selector(sets[index % sets.length]);
        }

        if (index < 0) {
            // If the new cursor position is off the board in a negative direction use the new index from the tail end
            // of the sets array to loop around to a valid position.
            return selector(sets[sets.length + index]);
        }

        return selector(sets[index]);
    };

    // Return an object chain to help with code readablity when setting new cursor positions
    return { 
        by: (amount: number) => {
            return {
                in: (sets: ISet[]) => {
                    return { select: (fn: TCellSelector) => exec(amount, sets, fn) }
                }
            }
        }
    }
}