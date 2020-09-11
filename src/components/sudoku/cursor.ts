import { IBoard, ISet, ICell, ICursor, ModelType } from './interfaces';
import { constants as gc } from './board';

type TCellSelector = (set: ISet) => ICell;

class Cursor implements ICursor {
    readonly type = ModelType.Cursor;

    constructor(private board: IBoard) {
        // Start the cursor in the middle of the board
        this.current = board.cells[board.cells.length >> 1];
    }

    private current: ICell;
    get cell() { return this.current; }
    set cell(cell: ICell) { this.current = cell }

    columnLeft()    { return this.current = columnLeft(this.current, this.board) }
    columnRight()   { return this.current = columnRight(this.current, this.board) }
    rowUp()         { return this.current = rowUp(this.current, this.board) }
    rowDown()       { return this.current = rowDown(this.current, this.board) }
    boxLeft()       { return this.current = boxLeft(this.current, this.board) }
    boxRight()      { return this.current = boxRight(this.current, this.board) }
    boxUp()         { return this.current = boxUp(this.current, this.board) }
    boxDown()       { return this.current = boxDown(this.current, this.board) }
    previousError() { return this.current = previousError(this.current, this.board) }
    nextError()     { return this.current = nextError(this.current, this.board) }
    clear()         { return this.current = clear(this.current) }
}

export function create(board: IBoard): ICursor {
    return new Cursor(board);
}

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

function clear(cell: ICell): ICell {
    if (cell.value > 0) {
        // If the cell has a value clear that
        cell.value = 0;
    }
    else {
        // Otherwise clear the candidates
        cell.candidates.forEach(c => c.isSelected = false);
    }
    return cell;
}

function previousError(current: ICell, board: IBoard): ICell {
    // Starting from the previous index, return the first invalid cell occurence
    for (let i = current.index - 1; i >= 0; i--) {
        let cell = board.cells[i];
        if (!cell.isStatic && !cell.isValid) {
            return cell;
        }
    }

    // Loop around and repeat from the end of the array
    for (let i = board.cells.length - 1; i > current.index; i--) {
        let cell = board.cells[i];
        if (!cell.isStatic && !cell.isValid) {
            return cell;
        }
    }

    return current;
}

function nextError(current: ICell, board: IBoard): ICell {
    // Starting from the next index, return the first invalid cell occurence
    for (let i = current.index + 1; i < board.cells.length; i++) {
        let cell = board.cells[i];
        if (!cell.isStatic && !cell.isValid) {
            return cell;
        }
    }

    // Loop around and repeat from the beginning of the array 
    for (let i = 0; i < current.index; i++) {
        let cell = board.cells[i];
        if (!cell.isStatic && !cell.isValid) {
            return cell;
        }
    }

    // If nothing was found return the current cell
    return current;
}

function rowUp(current: ICell, board: IBoard): ICell {
    return offset(current.row.index).by(-1).in(board.rows).select(
        row => row.cells[current.column.index]
    );
}

function columnLeft(current: ICell, board: IBoard): ICell {
    return offset(current.column.index).by(-1).in(board.columns).select(
        col => col.cells[current.row.index]
    );
}

function rowDown(current: ICell, board: IBoard): ICell {
    return offset(current.row.index).by(+1).in(board.rows).select(
        row => row.cells[current.column.index]
    );
}

function columnRight(current: ICell, board: IBoard): ICell {
    return offset(current.column.index).by(+1).in(board.columns).select(
        col => col.cells[current.row.index]
    );
}

function boxUp(current: ICell, board: IBoard): ICell {
    return offset(current.row.index).by(-gc.boxRowCount).in(board.rows).select(
        row => row.cells[current.column.index]
    );
}

function boxLeft(current: ICell, board: IBoard): ICell {
    return offset(current.column.index).by(-gc.boxColumnCount).in(board.columns).select(
        col => col.cells[current.row.index]
    );
}

function boxDown(current: ICell, board: IBoard): ICell {
    return offset(current.row.index).by(+gc.boxRowCount).in(board.rows).select(
        row => row.cells[current.column.index]
    );
}

function boxRight(current: ICell, board: IBoard): ICell {
    return offset(current.column.index).by(+gc.boxColumnCount).in(board.columns).select(
        col => col.cells[current.row.index]
    );
}
