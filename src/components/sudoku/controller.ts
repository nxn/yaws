import type { ICandidate } from './candidate';
import type { ICell } from './cell';
import type { ISet } from './set';
import { IBoard, Constants as gc } from './board';

export interface ICandidateController {
    toggleCandidate:    (board: IBoard, cell: ICell, candidate: ICandidate | number) => void;
}

export interface ICellController extends ICandidateController {
    setCellValue:       (board: IBoard, cell: ICell, value: number) => void;
    clear:              (board: IBoard, cell: ICell) => void;
}

export interface ICursorController {
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

export interface IBoardController extends ICellController, ICursorController { }

type TCellSelector = (set: ISet) => ICell;

export class BoardController implements IBoardController {
    private constructor( ) { }

    static create(): IBoardController {
        return new BoardController();
    }

    toggleCandidate = (board: IBoard, cell: ICell, candidate: ICandidate | number) => {
        if (board.getCursor() !== cell) {
            this.setCursor(board, cell);
        }

        let model = typeof candidate === "number"
            ? cell.candidates[candidate - 1]
            : candidate;

        model.setSelected(!model.isSelected());
    };
    
    setCellValue = (board: IBoard, cell: ICell, value: number) => {
        if (board.getCursor() !== cell) {
            this.setCursor(board, cell);
        }

        // if there is already a set value in the cursor cell and the new one is the same, clear the value instead.
        cell.setValue(cell.getValue() > 0 && cell.getValue() === value ? 0 : value);
    };
    
    clear = (board: IBoard, cell: ICell) => {
        if (board.getCursor() !== cell) {
            this.setCursor(board, cell);
        }

        if (cell.getValue() > 0) {
            // If the cell has a value clear it
            cell.setValue(0);
        }
        else {
            // If it doesn't, proceed to clearing the candidates/notes
            cell.candidates.forEach(c => { c.setSelected(false); });
        }
    };

    setCursor = (board: IBoard, cell: ICell) => {
        if (board.getCursor() === cell) {
            return;
        }

        board.setCursor(cell);
    };

    previousError = (board: IBoard) => {
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
    };
    
    nextError = (board: IBoard) => {
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
    };
    
    rowUp = (board: IBoard) => {
        const cursor = this.offset(board.getCursor().row.index).by(-1).in(board.rows).select(
            row => row.cells[board.getCursor().column.index]
        );
        board.setCursor(cursor);
    };
    
    columnLeft = (board: IBoard) => {
        const cursor = this.offset(board.getCursor().column.index).by(-1).in(board.columns).select(
            col => col.cells[board.getCursor().row.index]
        );
        board.setCursor(cursor);
    };
    
    rowDown = (board: IBoard) => {
        const cursor = this.offset(board.getCursor().row.index).by(+1).in(board.rows).select(
            row => row.cells[board.getCursor().column.index]
        );
        board.setCursor(cursor)
    };
    
    columnRight = (board: IBoard) => {
        const cursor = this.offset(board.getCursor().column.index).by(+1).in(board.columns).select(
            col => col.cells[board.getCursor().row.index]
        );
        board.setCursor(cursor);
    };
    
    boxUp = (board: IBoard) => {
        const cursor = this.offset(board.getCursor().row.index).by(-gc.boxRowCount).in(board.rows).select(
            row => row.cells[board.getCursor().column.index]
        );
        board.setCursor(cursor);
    };
    
    boxLeft = (board: IBoard) => {
        const cursor = this.offset(board.getCursor().column.index).by(-gc.boxColumnCount).in(board.columns).select(
            col => col.cells[board.getCursor().row.index]
        );
        board.setCursor(cursor);
    };
    
    boxDown = (board: IBoard) => {
        const cursor = this.offset(board.getCursor().row.index).by(+gc.boxRowCount).in(board.rows).select(
            row => row.cells[board.getCursor().column.index]
        );
        board.setCursor(cursor);
    };
    
    boxRight = (board: IBoard) => {
        const cursor = this.offset(board.getCursor().column.index).by(+gc.boxColumnCount).in(board.columns).select(
            col => col.cells[board.getCursor().row.index]
        );
        board.setCursor(cursor);
    }

    private offset(position: number) {
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
}

