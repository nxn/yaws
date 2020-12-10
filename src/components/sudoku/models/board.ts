import type { IEventManager, IEventStore } from '../events';
import { IModel, ModelType } from './model';
import { ISet, Set } from './set';
import { ICell, Cell } from './cell';
import { Puzzle, IPuzzle, IPuzzleInfo } from './puzzle';

let boardCount = 1;

export const Constants = Object.freeze({
    rowCount:       9,
    columnCount:    9,
    boxCount:       9,
    boxColumnCount: 3,
    boxRowCount:    3
});

export type BoardEvents = "CursorMoved" | "ReadyStateChanged" | "PuzzleChanged" | "Solved" | "Cleared" | "Reset";

export const BoardEvents = {
    get CursorMoved(): BoardEvents          { return "CursorMoved" },
    get ReadyStateChanged(): BoardEvents    { return "ReadyStateChanged" },
    get PuzzleChanged(): BoardEvents        { return "PuzzleChanged" },
    get Solved(): BoardEvents               { return "Solved" },
    get Cleared(): BoardEvents              { return "Cleared" },
    get Reset(): BoardEvents                { return "Reset" }
};

export const StateChangeEvents = [
    BoardEvents.CursorMoved, 
    BoardEvents.ReadyStateChanged,
    BoardEvents.PuzzleChanged,
    BoardEvents.Reset, 
    BoardEvents.Cleared
];

export interface IBoard extends IModel {
    type:           "Board";
    id:             string;
    cells:          ICell[];
    rows:           ISet[];
    columns:        ISet[];
    boxes:          ISet[];
    getCursor:      () => ICell;
    setCursor:      (to: ICell, silent?: boolean) => void;
    getPuzzle:      () => IPuzzle | null;
    setPuzzle:      (info: IPuzzleInfo, silent?: boolean) => void;
    isReady:        () => boolean;
    setReady:       (value: boolean, silent?: boolean) => void;
    validate:       (silent?: boolean) => IBoard;
    clear:          (silent?: boolean) => IBoard;
    reset:          (silent?: boolean) => IBoard;
};

export class Board implements IBoard {
    readonly type = "Board";

    private constructor(
        readonly id:        string, 
        readonly cells:     ICell[], 
        readonly rows:      ISet[],
        readonly columns:   ISet[], 
        readonly boxes:     ISet[],
        readonly puzzle:    IPuzzle,
        readonly events:    IEventStore
    ) { }

    static create(events: IEventManager, id = `g${boardCount}`): IBoard {
        boardCount++;
    
        const boardEvents = events.type(ModelType.Board);
        
        const cells   = new Array(Constants.rowCount * Constants.columnCount);
        const rows    = new Array(Constants.rowCount);
        const columns = new Array(Constants.columnCount);
        const boxes   = new Array(Constants.boxCount);
        const puzzle  = Puzzle.create();
    
        const board = new Board(id, cells, rows, columns, boxes, puzzle, boardEvents);
    
        const length = Math.max(
            Constants.rowCount, 
            Constants.columnCount, 
            Constants.boxCount
        );
    
        // initialize row/col/box sets
        for (let i = 0; i < length; i++) {
            rows[i]    = Set.create(board, `r${i + 1}`, i);
            columns[i] = Set.create(board, `c${i + 1}`, i);
            boxes[i]   = Set.create(board, `b${i + 1}`, i);
        }
    
        // initialize cells
        for (let rowIndex = 0; rowIndex < Constants.rowCount; rowIndex++)
        for (let colIndex = 0; colIndex < Constants.columnCount; colIndex++) {
            let row = rows[rowIndex];
            let col = columns[colIndex];
            let box = boxes[Math.floor(colIndex/3) + Math.floor(rowIndex/3)*3];
            let cIndex = colIndex + (rowIndex * Constants.rowCount);
            
            let c = Cell.create(events, board, cIndex, row, col, box);
            row.cells.push(c);
            col.cells.push(c);
            box.cells.push(c);
            board.cells[cIndex] = c;
        }
    
        // Default cursor to middle of grid
        board.setCursor(board.cells[board.cells.length >> 1], true);
    
        return board;
    }

    private ready = false;
    isReady() { return this.ready } 
    setReady(ready: boolean, silent = false) {
        if (typeof ready !== 'boolean' || this.ready === ready) {
            return;
        }

        this.ready = ready;

        if (!silent) {
            this.events.get(BoardEvents.ReadyStateChanged).fire(this);
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
            this.events.get(BoardEvents.CursorMoved).fire(this, to, from);
        }
    };

    getPuzzle() { return this.puzzle; }
    setPuzzle(info: IPuzzleInfo, silent = false) {
        this.puzzle.info(info);

        if (!silent) {
            this.events.get(BoardEvents.PuzzleChanged).fire(this, this.puzzle);
        }
    }

    clear(silent = false): IBoard {
        this.cells.forEach(c => c.clear(silent));
        if (!silent) {
            this.events.get(BoardEvents.Cleared).fire(this);
        }
        return this;        
    };

    reset(silent = false): IBoard {
        this.cells.forEach(c => !c.isStatic() && c.clear(silent));
        if (!silent) {
            this.events.get(BoardEvents.Reset).fire(this);
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
};