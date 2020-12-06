import type { ICandidate } from '../models/candidate';
import type { ICell } from '../models/cell';
import type { ISet } from '../models/set';
import { IBoard, Constants as gc } from '../models/board';

/* The board controller encompoasses Cell, Candidate, and Cursor controller functionality. While those could be
 * made into their own distinct controllers, their individual action sets are minimal enough that they do not
 * warrant the additional complexity of having to propagate multiple controllers through React's component tree.
 * */
export interface ICandidateController {
    toggleCandidate:    (cell: ICell, candidate: ICandidate | number) => void;
}

export interface ICellController extends ICandidateController {
    setCellValue:       (cell: ICell, value: number) => void;
    clear:              (cell: ICell) => void;
}

export interface ICursorController {
    setCursor:      (cell: ICell) => void;
    columnLeft:     () => void;
    columnRight:    () => void;
    rowUp:          () => void;
    rowDown:        () => void;
    boxLeft:        () => void;
    boxRight:       () => void;
    boxUp:          () => void;
    boxDown:        () => void;
    previousError:  () => void;
    nextError:      () => void;
}

export interface IBoardController extends ICellController, ICursorController { }

type TCellSelector = (set: ISet) => ICell;

export class BoardController implements IBoardController {
    private constructor(readonly board: IBoard) { }

    static create(board: IBoard): IBoardController {
        return new BoardController(board);
    }

    toggleCandidate = (cell: ICell, candidate: ICandidate | number) => {
        if (this.board.getCursor() !== cell) {
            this.setCursor(cell);
        }

        let model = typeof candidate === "number"
            ? cell.candidates[candidate - 1]
            : candidate;

        model.setSelected(!model.isSelected());
    };
    
    setCellValue = (cell: ICell, value: number) => {
        if (this.board.getCursor() !== cell) {
            this.setCursor(cell);
        }

        // if there is already a set value in the cursor cell and the new one is the same, clear the value instead.
        cell.setValue(cell.getValue() > 0 && cell.getValue() === value ? 0 : value);
    };
    
    clear = (cell: ICell) => {
        if (this.board.getCursor() !== cell) {
            this.setCursor(cell);
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

    setCursor = (cell: ICell) => {
        if (this.board.getCursor() === cell) {
            return;
        }

        this.board.setCursor(cell);
    };

    previousError = () => {
        // Starting from the previous index, return the first invalid cell occurence
        for (let i = this.board.getCursor().index - 1; i >= 0; i--) {
            let cell = this.board.cells[i];
            if (!cell.isStatic && !cell.isValid) {
                this.board.setCursor(cell);
                return;
            }
        }
    
        // Loop around and repeat from the end of the array
        for (let i = this.board.cells.length - 1; i > this.board.getCursor().index; i--) {
            let cell = this.board.cells[i];
            if (!cell.isStatic && !cell.isValid) {
                this.board.setCursor(cell);
                return;
            }
        }
    };
    
    nextError = () => {
        // Starting from the next index, return the first invalid cell occurence
        for (let i = this.board.getCursor().index + 1; i < this.board.cells.length; i++) {
            let cell = this.board.cells[i];
            if (!cell.isStatic && !cell.isValid) {
                this.board.setCursor(cell);
                return;
            }
        }
    
        // Loop around and repeat from the beginning of the array 
        for (let i = 0; i < this.board.getCursor().index; i++) {
            let cell = this.board.cells[i];
            if (!cell.isStatic && !cell.isValid) {
                this.board.setCursor(cell);
                return;
            }
        }
    };
    
    rowUp = () => {
        const cursor = this.offset(this.board.getCursor().row.index).by(-1).in(this.board.rows).select(
            row => row.cells[this.board.getCursor().column.index]
        );
        this.board.setCursor(cursor);
    };
    
    columnLeft = () => {
        const cursor = this.offset(this.board.getCursor().column.index).by(-1).in(this.board.columns).select(
            col => col.cells[this.board.getCursor().row.index]
        );
        this.board.setCursor(cursor);
    };
    
    rowDown = () => {
        const cursor = this.offset(this.board.getCursor().row.index).by(+1).in(this.board.rows).select(
            row => row.cells[this.board.getCursor().column.index]
        );
        this.board.setCursor(cursor)
    };
    
    columnRight = () => {
        const cursor = this.offset(this.board.getCursor().column.index).by(+1).in(this.board.columns).select(
            col => col.cells[this.board.getCursor().row.index]
        );
        this.board.setCursor(cursor);
    };
    
    boxUp = () => {
        const cursor = this.offset(this.board.getCursor().row.index).by(-gc.boxRowCount).in(this.board.rows).select(
            row => row.cells[this.board.getCursor().column.index]
        );
        this.board.setCursor(cursor);
    };
    
    boxLeft = () => {
        const cursor = this.offset(this.board.getCursor().column.index).by(-gc.boxColumnCount).in(this.board.columns).select(
            col => col.cells[this.board.getCursor().row.index]
        );
        this.board.setCursor(cursor);
    };
    
    boxDown = () => {
        const cursor = this.offset(this.board.getCursor().row.index).by(+gc.boxRowCount).in(this.board.rows).select(
            row => row.cells[this.board.getCursor().column.index]
        );
        this.board.setCursor(cursor);
    };
    
    boxRight = () => {
        const cursor = this.offset(this.board.getCursor().column.index).by(+gc.boxColumnCount).in(this.board.columns).select(
            col => col.cells[this.board.getCursor().row.index]
        );
        this.board.setCursor(cursor);
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

