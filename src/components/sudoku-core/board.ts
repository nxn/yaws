import { IBoard  }                  from './interfaces';
import { create as createSet }      from './set';
import { create as createCell }     from './cell';
import { create as createCursor }   from './cursor';

let boardCount = 1;

export const constants = Object.create(null,
    { rowCount      : { value: 9 }
    , columnCount   : { value: 9 }
    , boxCount      : { value: 9 }
    , boxColumnCount: { value: 3 }
    , boxRowCount   : { value: 3 }
    }
);
Object.freeze(constants);

export function create(id = `g${boardCount}`): IBoard {
    boardCount++;
    
    const cells   = new Array(constants.rowCount * constants.columnCount);
    const rows    = new Array(constants.rowCount);
    const columns = new Array(constants.columnCount);
    const boxes   = new Array(constants.boxCount);

    const length = Math.max(
        constants.rowCount, 
        constants.columnCount, 
        constants.boxCount
    );

    let loaded = false;

    // Create API object
    const board: IBoard = Object.create(null,
        { id:           { get: () => id }
        , cells:        { get: () => cells }
        , rows:         { get: () => rows }
        , columns:      { get: () => columns }
        , boxes:        { get: () => boxes }
        , cursor:       { get: () => cursor }
        , isLoaded:     { get: () => loaded
                        , set: f  => { if (typeof f === 'boolean') loaded = f }
                        }
        , clear:        { value: () => clear(board) }
        , reset:        { value: () => reset(board) }
        }
    );

    // initialize row/col/box sets
    for (let i = 0; i < length; i++) {
        rows[i]    = createSet(board, `r${i + 1}`, i);
        columns[i] = createSet(board, `c${i + 1}`, i);
        boxes[i]   = createSet(board, `b${i + 1}`, i);
    }

    // initialize cells
    for (let rowIndex = 0; rowIndex < constants.rowCount; rowIndex++)
    for (let colIndex = 0; colIndex < constants.columnCount; colIndex++) {
        let row = rows[rowIndex];
        let col = columns[colIndex];
        let box = boxes[Math.floor(colIndex/3) + Math.floor(rowIndex/3)*3];
        let cIndex = colIndex + (rowIndex * constants.rowCount);
        
        let c = createCell(board, cIndex, row, col, box);
        row.cells.push(c);
        col.cells.push(c);
        box.cells.push(c);
        board.cells[cIndex] = c;
    }
    
    const cursor = createCursor(board);

    Object.freeze(board);
    return board;
}

function clear(board: IBoard): IBoard {
    board.cells.forEach(c => c.clear());
    return board;
}

function reset(board: IBoard): IBoard {
    board.cells.forEach(c => !c.isStatic && c.clear());
    return board;
}
