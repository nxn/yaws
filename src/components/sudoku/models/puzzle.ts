import { IBoard } from "./board";
import { ICell, Constants as CellConstants } from "./cell";

import type { IStorageCollection } from "@components/contracts/storageprovider";
import type { ISudokuProvider, IGenerateRequestData as IPuzzleSettings } from "@components/contracts/sudokuprovider";

import { deflateRaw as compress, inflateRaw as expand } from '@lib/pako/pako';

export interface ICellData {
    v: number;
    c: number[];
    s: boolean;
};

export interface IPuzzleInfo {
    storageId?:      number,

    name:           string;
    created:        number;
    modified:       number;

    difficulty?:    number;
    solution?:      Uint8Array;
    settings?:      IPuzzleSettings;
}

export interface ILocation {
    origin: string;
    pathname: string;
}

export interface IPuzzleManager {
    listSaved(): { id: number, info: IPuzzleInfo }[];

    open(id: number): IPuzzleInfo;
    openLink(link: string): IPuzzleInfo;
    openMostRecent(): IPuzzleInfo;
    generate(settings: IPuzzleSettings): Promise<IPuzzleInfo>;

    getLink(includeProgress: boolean, location: ILocation): string;

    save(info?: IPuzzleInfo): void;
    delete(id: number): void;
    rename(id: number, name: string):  void;
}

export class PuzzleManager implements IPuzzleManager {
    private constructor(
        readonly board:     IBoard, 
        readonly storage:   IStorageCollection<Uint8Array>, 
        readonly sudoku:    ISudokuProvider
    ) { }

    private current: IPuzzleInfo;

    static create(board: IBoard, storage: IStorageCollection<Uint8Array>, provider: ISudokuProvider): IPuzzleManager {
        return new PuzzleManager(board, storage, provider);
    }

    listSaved() {
        return this.storage.list().map(r => ({ id: r.id, info: r.meta }))
    }

    save(info: IPuzzleInfo = this.current) {
        if (info.storageId) {
            this.storage.update(info.storageId, this.getBinary())
        }
        else {
            const rec = this.storage.save(this.getBinary());
            info.storageId = rec.id;
        }
        this.storage.meta(info.storageId, info);
        this.current = info;
    }

    open(id: number) {
        const puzzle = this.storage.get(id);

        if (!puzzle) {
            throw new Error(`[Error] PuzzleManager::open(${ id }): Puzzle with given id not found`);
        }

        this.loadBinary(puzzle.buffer);

        this.current = this.storage.meta(id);

        return this.current;
    }

    openMostRecent() {
        const list = this.storage.list()
        const mostRecentId = Math.max(...list.map(r => r.id));

        this.loadBinary(this.storage.get(mostRecentId));
        this.current = this.storage.meta(mostRecentId);

        return this.current;
    }

    async generate(settings: IPuzzleSettings): Promise<IPuzzleInfo> {
        const response = await this.sudoku.generate(settings);
        this.loadValueArray(response.puzzle);

        const now = Date.now();
        this.current = {
            name: `Generated Puzzle [${response.difficulty}]`,
            created: now,
            modified: now,

            difficulty: response.difficulty,
            solution: response.solution,
            settings: settings
        };

        return this.current;
    }

    getLink(includeProgress: boolean, locationObj: ILocation = location): string {
        const l = locationObj;
        // In the case of an 81 digit number, simply substituting sequences of 0s that are 3 units of length or greater is
        // more effective than pako/zlib compression. The latter requires base64 encoding and, as a result, loses any
        // compression gains due to added overhead.
        const p = includeProgress
            ? btoa(compress(this.getBinary(true), { level: 9, to: 'string' }) as string)
            : this.getValueString().replace(/(0{3,})/g, m => `(${m.length})`);
    
        return `${ l.origin }${ l.pathname }?p=${ encodeURIComponent(p) }`;
    }
    
    openLink(link: string): IPuzzleInfo {
        const url    = new URL(link);
        const params = new URLSearchParams(url.search);
        let p = params.get('p');
    
        if (!p) { 
            throw new Error(`[Error] PuzzleManager::loadLink(link: string): Link does not contain query string "p"`);
        }
    
        p = decodeURIComponent(p);
    
        // Check if any sequences of 0s were trimmed out; fill them in if so.
        if (/\(\d+\)/g.test(p)) {
            p = p.replace(/\((\d+)\)/g, (_,g) => Array(parseInt(g)).fill(0).join(''));
        }
    
        // Verify 81 digit number, otherwise assume base64 binary.
        if (/^\d{81}$/.test(p)) {
            this.loadValueString(p);
        }
        else {
            this.loadBinary((expand(atob(p)) as Uint8Array).buffer);
        }
    
        const now = Date.now();
        this.current = {
            name: 'Linked Puzzle',
            created: now,
            modified: now
        };

        return this.current;
    }

    delete(id: number) {
        this.storage.remove(id);
    }

    rename(id: number, newName: string) {
        const info: IPuzzleInfo = this.storage.meta(id);
        info.name = newName;
        this.storage.meta(id, info);
    }

    private getValueArray(): Uint8Array {
        return Uint8Array.from(
            this.board.cells.map(c => c.isStatic() ? c.getValue() : 0)
        );
    }

    private loadValueArray(array: Uint8Array) {
        if (array.length !== this.board.cells.length) {
            throw new Error(`[Error] PuzzleManager::loadValueArray(array: Uint8Array): Unexpected array.length (${ array.length })`);
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
    
    private getData(ignoreHiddenCandidates?: boolean): ICellData[] {
        return this.board.cells.map(cell => this.getCellData(cell, ignoreHiddenCandidates));
    }
    
    private loadData(data: ICellData[]) {
        if (!Array.isArray(data)) {
            throw new Error(`[Error] PuzzleManager::loadData(data: ICellData[]): Unexpected data (not array)`);
        }

        if (data.length !== this.board.cells.length) {
            throw new Error(`[Error] PuzzleManager::loadData(data: ICellData[]): Unexpected data.length (${ data.length })`);
        }

        this.board.setReady(false);
    
        const iter = data[Symbol.iterator]();
        this.board.cells.forEach(cell => this.loadCellData(cell, iter.next().value));
    
        this.board.validate(true);
        this.board.setReady(true);
    }
    
    private getValueString(): string {
        return this.board.cells.map(c => c.isStatic ? c.getValue() : 0).join('');
    }
    
    private loadValueString(puzzle: string) {
        puzzle = puzzle && typeof puzzle.toString === 'function'
            ? puzzle.toString().trim()
            : "";
    
        // Verify string represents 81 digit number
        if (!/^\d{81}$/.test(puzzle)) {
            throw new Error(`[Error] PuzzleManager::loadValueString(puzzle: string): Unexpected puzzle string format (${ puzzle })`);
        }

        this.board.setReady(false);
    
        const iter = puzzle[Symbol.iterator]();
        this.board.cells.forEach(cell => {
            let v = parseInt(iter.next().value);
            this.loadCellData(cell, { v: v, s: v !== 0, c: [] });
        });
    
        this.board.validate(true);
        this.board.setReady(true);
    }
    
    private getBinary(ignoreHiddenCandidates?: boolean): Uint8Array { 
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
    
    private loadBinary(buffer: ArrayBuffer) {
        const cells = this.board.cells;
        const view16 = new Uint16Array(buffer);
        
        if (cells.length !== view16.length) {
            throw new Error(`[Error] PuzzleManager::loadBinary(buffer: ArrayBuffer): Unexpected buffer.length (${ view16.length })`);
        }

        this.board.setReady(false);
    
        for (let i = 0; i < view16.length; i++) {
            this.loadCellBinary(cells[i], view16[i]);
        }
    
        this.board.validate(true);
        this.board.setReady(true);
    }
    
    private getCellData(cell: ICell, ignoreHiddenCandidates: boolean): ICellData {
        const skip = cell.getValue() > 0 && ignoreHiddenCandidates;
    
        return { v: cell.getValue()
               , s: cell.isStatic()
               , c: cell.candidates.filter(c => c.isSelected() && !skip).map(c => c.value)
               };
    }
    
    private loadCellData(cell: ICell, data: ICellData) {
        if (typeof data !== 'object') {
            throw new Error(`[Error] PuzzleManager::loadCellData(cell: ICell, data: ICellData): Unexpected data, not an object (${ typeof data })`);
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
            throw new Error(`[Error] PuzzleManager::loadCellBinary(cell: ICell, value: number): Unexpected binary value (${ v })`);
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
