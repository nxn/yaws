import { IEventStore, IEventManager, IBoard, ISet, ICell, ModelType } from './interfaces';
import { BoardEvents }              from './events';
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

export function create(events: IEventStore, id = `g${boardCount}`): IBoard {
    boardCount++;

    const boardEvents = events.get(ModelType.Board);
    
    const cells   = new Array(constants.rowCount * constants.columnCount);
    const rows    = new Array(constants.rowCount);
    const columns = new Array(constants.columnCount);
    const boxes   = new Array(constants.boxCount);

    const board = new Board(id, cells, rows, columns, boxes, boardEvents);

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
        
        let c = createCell(events, board, cIndex, row, col, box);
        row.cells.push(c);
        col.cells.push(c);
        box.cells.push(c);
        board.cells[cIndex] = c;
    }

    // Default cursor to middle of grid
    board.setCursor(board.cells[board.cells.length >> 1], true);

    return board;
}

class Board implements IBoard {
    readonly type = ModelType.Board;

    constructor(
        readonly id:        string, 
        readonly cells:     ICell[], 
        readonly rows:      ISet[], 
        readonly columns:   ISet[], 
        readonly boxes:     ISet[],
        readonly events:    IEventManager
    ) { }

    private ready = false;
    isReady() { return this.ready } 
    setReady(ready: boolean, silent = false) {
        if (typeof ready !== 'boolean' || this.ready === ready) {
            return;
        }

        this.ready = ready;

        if (!silent) {
            this.events.fire(BoardEvents.ReadyStateChanged, this);
        }
    }

    private cursor: ICell;
    getCursor() { return this.cursor };
    setCursor(to: ICell, silent = false) {
        if (to === this.cursor) {
            return;
        }

        let from = this.cursor;
        this.cursor = to;

        if (!silent) {
            this.events.fire(BoardEvents.CursorMoved, this, to, from);
        }
    };

    clear(silent = false): IBoard {
        this.cells.forEach(c => c.clear(silent));
        if (!silent) {
            this.events.fire(BoardEvents.Cleared, this);
        }
        return this;        
    };

    reset(silent = false): IBoard {
        this.cells.forEach(c => !c.isStatic && c.clear(silent));
        if (!silent) {
            this.events.fire(BoardEvents.Reset, this);
        }
        return this;
    };

    validate(silent = false): IBoard {
        for (const cell of this.cells) {
            const valueCounts = new Map<number, number>();
            for (const rcbGroupCell of cell.rcb) {
                const value = rcbGroupCell.getValue();
                if (value === 0) { continue; }
                
                const count = valueCounts.get(value);
                if (count) {
                    valueCounts.set(value, count + 1);
                } else {
                    valueCounts.set(value, 1);
                }
            }
            cell.setValid((valueCounts.get(cell.getValue()) || 0) <= 1, silent);
            cell.candidates.forEach(
                candidate => candidate.setValid(!valueCounts.has(candidate.value), silent)
            );
        }

        return this;
    }
}