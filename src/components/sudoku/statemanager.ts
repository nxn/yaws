import type { IBoard } from './models/board';
import { ICell, ICellData, Constants as CellConstants } from './models/cell';
import { deflateRaw as compress, inflateRaw as expand } from '@lib/pako/pako';

export interface IStateManager {
    getString:      () => string;
    loadString:     (puzzle: string) => IBoard;
    getTypedArray:  () => Uint8Array;
    loadTypedArray: (array: Uint8Array) => IBoard;
    getLink:        (includeProgress: boolean, location: ILocation) => string;
    loadLink:       (link: string) => IBoard;
    getData:        (ignoreHiddenCandidates?: boolean) => ICellData[];
    loadData:       (data: ICellData[]) => IBoard;
    getBinary:      (ignoreHiddenCandidates?: boolean) => Uint8Array;
    loadBinary:     (buffer: ArrayBuffer) => IBoard;
}

export interface ILocation {
    origin: string;
    pathname: string;
}

export class StateManager implements IStateManager {
    private constructor(
        readonly board: IBoard
    ) { }

    static create(board: IBoard): IStateManager {
        return new StateManager(board);
    }

    loadTypedArray(array: Uint8Array): IBoard {
        if (array.length !== this.board.cells.length) {
            return this.board;
        }

        this.board.setReady(false);
    
        for (let i = 0; i < this.board.cells.length; i++) {
            let value = array[i];
            let cell = this.board.cells[i];
            this.loadCellData(cell, { v: value, s: value !== 0, c: [] });
        }
    
        this.board.validate(true);
        this.board.setReady(true);
        return this.board;
    }
    
    getTypedArray(): Uint8Array {
        return Uint8Array.from(this.board.cells.map(c => c.isStatic() ? c.getValue() : 0));
    }
    
    getData(ignoreHiddenCandidates?: boolean): ICellData[] {
        return this.board.cells.map(cell => this.getCellData(cell, ignoreHiddenCandidates));
    }
    
    loadData(data: ICellData[]): IBoard {
        if (!(Array.isArray(data) && data.length === this.board.cells.length)) {
            return this.board;
        }

        this.board.setReady(false);
    
        const iter = data[Symbol.iterator]();
        this.board.cells.forEach(cell => this.loadCellData(cell, iter.next().value));
    
        this.board.validate(true);
        this.board.setReady(true);
        return this.board;
    }
    
    getString(): string {
        return this.board.cells.map(c => c.isStatic ? c.getValue() : 0).join('');
    }
    
    loadString(puzzle: string): IBoard {
        puzzle = puzzle && typeof puzzle.toString === 'function'
            ? puzzle.toString().trim()
            : "";
    
        // Verify string represents 81 digit number
        if (!/^\d{81}$/.test(puzzle)) {
            return this.board;
        }

        this.board.setReady(false);
    
        const iter = puzzle[Symbol.iterator]();
        this.board.cells.forEach(cell => {
            let v = parseInt(iter.next().value);
            this.loadCellData(cell, { v: v, s: v !== 0, c: [] });
        });
    
        this.board.validate(true);
        this.board.setReady(true);
        return this.board;
    }
    
    getBinary(ignoreHiddenCandidates?: boolean): Uint8Array { 
        const cells = this.board.cells;
        // 9 columns * 9 rows * 2 bytes per cell = 162 bytes
        const buffer = new ArrayBuffer(
            cells.length * CellConstants.byteLength
        );
    
        const view16 = new Uint16Array(buffer);
        
        for (let i = 0; i < view16.length; i++) {
            view16[i] = this.getCellBinary(cells[i], ignoreHiddenCandidates);
        }
    
        // return byte array instead of Uint16Array since it is more practical
        return new Uint8Array(buffer);
    }
    
    loadBinary(buffer: ArrayBuffer): IBoard {
        const cells = this.board.cells;
        const view16 = new Uint16Array(buffer);
        
        if (cells.length !== view16.length) {
            return this.board;
        }

        this.board.setReady(false);
    
        for (let i = 0; i < view16.length; i++) {
            this.loadCellBinary(cells[i], view16[i]);
        }
    
        this.board.validate(true);
        this.board.setReady(true);
        return this.board;
    }
    
    getLink(includeProgress: boolean, locationObj:ILocation = location): string {
        const l = locationObj;
        // In the case of an 81 digit number, simply substituting sequences of 0s that are 3 units of length or greater is
        // more effective than pako/zlib compression. The latter requires base64 encoding and, as a result, loses any
        // compression gains due to added overhead.
        const p = includeProgress
            ? btoa(compress(this.getBinary(true), { level: 9, to: 'string' }) as string)
            : this.getString().replace(/(0{3,})/g, m => `(${m.length})`);
    
        return `${l.origin}${l.pathname}?p=${encodeURIComponent(p)}`;
    }
    
    loadLink(link:string): IBoard {
        const url    = new URL(link);
        const params = new URLSearchParams(url.search);
        let p = params.get('p');
    
        if (!p) { return this.board; }
    
        p = decodeURIComponent(p);
    
        // Check if any sequences of 0s were trimmed out; fill them in if so.
        if (/\(\d+\)/g.test(p)) {
            p = p.replace(/\((\d+)\)/g, (_,g) => Array(parseInt(g)).fill(0).join(''));
        }
    
        // Verify 81 digit number, otherwise assume base64 binary.
        if (/^\d{81}$/.test(p)) {
            this.loadString(p);
        }
        else {
            this.loadBinary((expand(atob(p)) as Uint8Array).buffer);
        }
    
        return this.board;
    }
    
    private getCellData(cell: ICell, ignoreHiddenCandidates: boolean): ICellData {
        const skip = cell.getValue() > 0 && ignoreHiddenCandidates;
    
        return { v: cell.getValue()
               , s: cell.isStatic()
               , c: cell.candidates.filter(c => c.isSelected() && !skip).map(c => c.value)
               };
    }
    
    private loadCellData(cell: ICell, data: ICellData): void {
        if (typeof data !== 'object') {
            return;
        }
    
        // Set cell as non-static so we can update its values
        cell.setStatic(false, true);
    
        if (data.v >= 0 && data.v < 10) {
            cell.setValue(data.v, true, false);
        }
    
        if (Array.isArray(data.c)) {
            cell.candidates.forEach(c => c.setSelected(data.c.indexOf(c.value) >= 0, true));
        }
    
        if (typeof data.s === 'boolean') {
            cell.setStatic(data.s, true);
        }
    }
    
    private getCellBinary(cell: ICell, ignoreHiddenCandidates: boolean): number {
        let v = cell.getValue();
    
        const skip = v > 0 && ignoreHiddenCandidates;
        v = v << 1 | (cell.isStatic() ? 1 : 0);
    
        for (let i = cell.candidates.length - 1; i >= 0; i--) {
            v = v << 1 | (cell.candidates[i].isSelected() && !skip ? 1: 0);
        }
    
        return v;
    }
    
    private loadCellBinary(cell: ICell, v: number): void {
        cell.setStatic(false, true);
    
        // Cell values are only valid if they're in the 0 to 16383 range (4 bits for value, 1 isStatic bit, 9 bits to mark
        // whether each candidate is selected).
        if (v < 0 || v >= 2 ** CellConstants.bitLength) {
            return;
        }
    
        for (let i = 0; i < cell.candidates.length; i++) {
            cell.candidates[i].setSelected(!!(v&1), true);
            v = v >> 1;
        }
    
        const isStatic = !!(v&1);
    
        cell.setValue(v >> 1, true, false);
        cell.setStatic(isStatic, true);
    }
}
