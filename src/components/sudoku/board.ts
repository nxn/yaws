import { IBoard, ISet, ICell, ModelType }from './interfaces';
import { create as createSet }      from './set';
import { create as createCell }     from './cell';

let boardCount = 1;

export const constants = Object.freeze(Object.create(null,
    { rowCount      : { value: 9 }
    , columnCount   : { value: 9 }
    , boxCount      : { value: 9 }
    , boxColumnCount: { value: 3 }
    , boxRowCount   : { value: 3 }
    }
));

class Board implements IBoard {
    readonly type = ModelType.Board;

    constructor(
        readonly id:        string, 
        readonly cells:     ICell[], 
        readonly rows:      ISet[], 
        readonly columns:   ISet[], 
        readonly boxes:     ISet[]
    ) { }

    private loaded = false;
    get isLoaded() { return this.loaded } 
    set isLoaded(value: boolean) {
        if (typeof value === 'boolean') {
            this.loaded = value;
        }
    }

    private _cursor: ICell;
    get cursor() { return this._cursor };
    set cursor(cell: ICell) { this._cursor = cell };

    clear(): IBoard {
        this.cells.forEach(c => c.clear());
        return this;        
    };

    reset(): IBoard {
        this.cells.forEach(c => !c.isStatic && c.clear());
        return this;
    };
}

export function create(id = `g${boardCount}`): IBoard {
    boardCount++;
    
    const cells   = new Array(constants.rowCount * constants.columnCount);
    const rows    = new Array(constants.rowCount);
    const columns = new Array(constants.columnCount);
    const boxes   = new Array(constants.boxCount);

    const board = new Board(id, cells, rows, columns, boxes);

    const length = Math.max(
        constants.rowCount, 
        constants.columnCount, 
        constants.boxCount
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

    // Default cursor to middle of grid
    board.cursor = board.cells[board.cells.length >> 1];

    return board;
}