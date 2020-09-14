import { constants as gc } from './board';
import { create as createEventManager } from './events';
import { BoardEvents, CellEvents, IBoard, IBoardController, ICell, IEventManager, ISet } from './interfaces';

export function create(): IBoardController {
    return new BoardController(createEventManager());
}

type TCellSelector = (set: ISet) => ICell;

class BoardController implements IBoardController {
    constructor(private events: IEventManager) {
        this.events.on(CellEvents.CellValueChanged, (cell: ICell) => {
            this.events.fire(CellEvents.CellChanged, cell);
        });

        this.events.on(CellEvents.CellCandidatesChanged, (cell: ICell) => {
            this.events.fire(CellEvents.CellChanged, cell);
        });

        this.events.on(CellEvents.CellChanged, (cell: ICell) => {
            this.events.fire(BoardEvents.StateChanged, cell);
        });

        this.events.on(BoardEvents.CursorMoved, (cell: ICell) => {
            this.events.fire(BoardEvents.StateChanged, cell);
        });
    }

    on(eventName: string, listener: (...eventArgs:any[]) => any) {
        return this.events.on(eventName, listener);
    }

    detach(eventName: string, listener: (...eventArgs:any[]) => any) {
        return this.events.detach(eventName, listener);
    }

    toggleCandidate = (board: IBoard, cell: ICell, value: number) => {
        if (board.cursor !== cell) {
            this.setCursor(board, cell);
        }

        let candidate = cell.candidates[value - 1];
        candidate.isSelected = !candidate.isSelected;
        this.events.fire(CellEvents.CellCandidatesChanged, cell);
    };
    
    setCellValue = (board: IBoard, cell: ICell, value: number) => {
        if (board.cursor !== cell) {
            this.setCursor(board, cell);
        }

        let previous = cell.value;
        // if there is already a set value in the cursor cell and the new one is the same, clear the value instead.
        cell.value = cell.value > 0 && cell.value === value ? 0 : value;

        if (cell.value !== previous) {
            this.events.fire(CellEvents.CellValueChanged, cell);
        }
    };
    
    clear = (board: IBoard, cell: ICell) => {
        if (board.cursor !== cell) {
            this.setCursor(board, cell);
        }

        if (cell.value > 0) {
            // If the cell has a value clear it
            cell.value = 0;
            this.events.fire(CellEvents.CellValueChanged, cell);
        }
        else {
            let hadSelections = false;
            // If it doesn't, proceed to clearing the candidates/notes
            cell.candidates.forEach(c => {
                if (c.isSelected) {
                    hadSelections = true;
                }
                c.isSelected = false;
            });

            if (hadSelections) {
                this.events.fire(CellEvents.CellCandidatesChanged, cell);
            }
        }
    };

    setCursor = (board: IBoard, to: ICell) => {
        if (board.cursor === to) {
            return;
        }

        let from = board.cursor;
        board.cursor = to;
        this.events.fire(BoardEvents.CursorMoved, to, from);
    };

    previousError = (board: IBoard) => {
        // Starting from the previous index, return the first invalid cell occurence
        for (let i = board.cursor.index - 1; i >= 0; i--) {
            let cell = board.cells[i];
            if (!cell.isStatic && !cell.isValid) {
                board.cursor = cell;
                this.events.fire(BoardEvents.CursorMoved, board.cursor);
                return;
            }
        }
    
        // Loop around and repeat from the end of the array
        for (let i = board.cells.length - 1; i > board.cursor.index; i--) {
            let cell = board.cells[i];
            if (!cell.isStatic && !cell.isValid) {
                board.cursor = cell;
                this.events.fire(BoardEvents.CursorMoved, board.cursor);
                return;
            }
        }
    };
    
    nextError = (board: IBoard) => {
        // Starting from the next index, return the first invalid cell occurence
        for (let i = board.cursor.index + 1; i < board.cells.length; i++) {
            let cell = board.cells[i];
            if (!cell.isStatic && !cell.isValid) {
                board.cursor = cell;
                this.events.fire(BoardEvents.CursorMoved, board.cursor);
                return;
            }
        }
    
        // Loop around and repeat from the beginning of the array 
        for (let i = 0; i < board.cursor.index; i++) {
            let cell = board.cells[i];
            if (!cell.isStatic && !cell.isValid) {
                board.cursor = cell;
                this.events.fire(BoardEvents.CursorMoved, board.cursor);
                return;
            }
        }
    };
    
    rowUp = (board: IBoard) => {
        board.cursor = this.offset(board.cursor.row.index).by(-1).in(board.rows).select(
            row => row.cells[board.cursor.column.index]
        );
        this.events.fire(BoardEvents.CursorMoved, board.cursor);
    };
    
    columnLeft = (board: IBoard) => {
        board.cursor = this.offset(board.cursor.column.index).by(-1).in(board.columns).select(
            col => col.cells[board.cursor.row.index]
        );
        this.events.fire(BoardEvents.CursorMoved, board.cursor);
    };
    
    rowDown = (board: IBoard) => {
        board.cursor = this.offset(board.cursor.row.index).by(+1).in(board.rows).select(
            row => row.cells[board.cursor.column.index]
        );
        this.events.fire(BoardEvents.CursorMoved, board.cursor);
    };
    
    columnRight = (board: IBoard) => {
        board.cursor = this.offset(board.cursor.column.index).by(+1).in(board.columns).select(
            col => col.cells[board.cursor.row.index]
        );
        this.events.fire(BoardEvents.CursorMoved, board.cursor);
    };
    
    boxUp = (board: IBoard) => {
        board.cursor = this.offset(board.cursor.row.index).by(-gc.boxRowCount).in(board.rows).select(
            row => row.cells[board.cursor.column.index]
        );
        this.events.fire(BoardEvents.CursorMoved, board.cursor);
    };
    
    boxLeft = (board: IBoard) => {
        board.cursor = this.offset(board.cursor.column.index).by(-gc.boxColumnCount).in(board.columns).select(
            col => col.cells[board.cursor.row.index]
        );
        this.events.fire(BoardEvents.CursorMoved, board.cursor);
    };
    
    boxDown = (board: IBoard) => {
        board.cursor = this.offset(board.cursor.row.index).by(+gc.boxRowCount).in(board.rows).select(
            row => row.cells[board.cursor.column.index]
        );
        this.events.fire(BoardEvents.CursorMoved, board.cursor);
    };
    
    boxRight = (board: IBoard) => {
        board.cursor = this.offset(board.cursor.column.index).by(+gc.boxColumnCount).in(board.columns).select(
            col => col.cells[board.cursor.row.index]
        );
        this.events.fire(BoardEvents.CursorMoved, board.cursor);
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

