import { ICell, Constants as CellConstants } from "../models/cell";

import type { IBoard } from "../models/board";
import type { IPuzzleInfo } from "../models/puzzleinfo";
import type { IStorageCollection } from "@components/contracts/storageprovider";
import type { ISudokuProvider, IGenerateRequestData as IPuzzleSettings } from "@components/contracts/sudokuprovider";

import { deflateRaw as compress, inflateRaw as expand } from '@lib/pako/pako';

export interface ICellData {
    v: number;
    c: number[];
    s: boolean;
};

export interface ILocation {
    origin: string;
    pathname: string;
}

export interface IPuzzleActions {
    listSaved(): { id: number, info: IPuzzleInfo }[];

    open(board: IBoard, id: number): void;
    openLink(board: IBoard, link: string): void;
    openMostRecent(board: IBoard): void;
    generate(board: IBoard, settings: IPuzzleSettings): void;

    getLink(board: IBoard, includeProgress: boolean, location: ILocation): string;

    save(board: IBoard, info?: IPuzzleInfo): void;
    rename(id: number, name: string):  void;
    delete(id: number): void;
}

export const createPuzzleActions = (storage: IStorageCollection<Uint8Array>, sudoku: ISudokuProvider): IPuzzleActions => ({
    listSaved: function() {
        return storage.list().map(r => ({ id: r.id, info: r.meta }));
    },

    save: function(board: IBoard, info: IPuzzleInfo = board.getPuzzleInfo()) {
        if (info.storageId) {
            storage.update(info.storageId, getBinary(board))
        }
        else {
            const rec = storage.save(getBinary(board));
            info.storageId = rec.id;
        }

        storage.meta(info.storageId, info);
        board.setPuzzleInfo(info);
    },

    open: function(board: IBoard, id: number) {
        const puzzle = storage.get(id);

        if (!puzzle) {
            throw new Error(`[Error] PuzzleManager::open(${ id }): Puzzle with given id not found`);
        }

        loadBinary(board, puzzle.buffer);
        board.setPuzzleInfo(storage.meta(id));
    },

    openMostRecent: function(board: IBoard) {
        const list = storage.list()
        const mostRecentId = Math.max(...list.map(r => r.id));

        loadBinary(board, storage.get(mostRecentId));
        board.setPuzzleInfo(storage.meta(mostRecentId));
    },

    generate: async function(board: IBoard, settings: IPuzzleSettings) {
        const response = await sudoku.generate(settings);
        loadValueArray(board, response.puzzle);

        const now = Date.now();
        board.setPuzzleInfo({
            name: `Generated Puzzle [${response.difficulty}]`,
            created: now,
            modified: now,

            difficulty: response.difficulty,
            solution: response.solution,
            settings: settings
        });
    },

    getLink: function(board: IBoard, includeProgress: boolean, locationObj: ILocation = location) {
        const l = locationObj;
        // In the case of an 81 digit number, simply substituting sequences of 0s that are 3 units of length or greater is
        // more effective than pako/zlib compression. The latter requires base64 encoding and, as a result, loses any
        // compression gains due to added overhead.
        const p = includeProgress
            ? btoa(compress(getBinary(board, true), { level: 9, to: 'string' }) as string)
            : getValueString(board).replace(/(0{3,})/g, m => `(${m.length})`);
    
        return `${ l.origin }${ l.pathname }?p=${ encodeURIComponent(p) }`;
    },
    
    openLink: function(board: IBoard, link: string) {
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
            loadValueString(board, p);
        }
        else {
            loadBinary(board, (expand(atob(p)) as Uint8Array).buffer);
        }
    
        const now = Date.now();
        board.setPuzzleInfo({
            name: 'Linked Puzzle',
            created: now,
            modified: now
        });
    },

    delete: function(id: number) {
        storage.remove(id);
    },

    rename: function(id: number, newName: string) {
        const info: IPuzzleInfo = storage.meta(id);
        info.name = newName;
        storage.meta(id, info);
    },
});

function getValueArray(board: IBoard) {
    return Uint8Array.from(board.cells.map(c => c.isStatic() ? c.getValue() : 0));
}

function loadValueArray(board: IBoard, array: Uint8Array) {
    if (array.length !== board.cells.length) {
        throw new Error(`[Error] PuzzleManager::loadValueArray(array: Uint8Array): Unexpected array.length (${ array.length })`);
    }

    board.setReady(false);

    for (let i = 0; i < board.cells.length; i++) {
        let value = array[i];
        let cell = board.cells[i];
        loadCellData(cell, { v: value, s: value !== 0, c: [] });
    }

    board.validate(true);
    board.setReady(true);
}

function getData(board: IBoard, ignoreHiddenCandidates?: boolean) {
    return board.cells.map(cell => getCellData(cell, ignoreHiddenCandidates));
}

function loadData(board: IBoard, data: ICellData[]) {
    if (!Array.isArray(data)) {
        throw new Error(`[Error] PuzzleManager::loadData(data: ICellData[]): Unexpected data (not array)`);
    }

    if (data.length !== board.cells.length) {
        throw new Error(`[Error] PuzzleManager::loadData(data: ICellData[]): Unexpected data.length (${ data.length })`);
    }

    board.setReady(false);

    const iter = data[Symbol.iterator]();
    board.cells.forEach(cell => loadCellData(cell, iter.next().value));

    board.validate(true);
    board.setReady(true);
}

function getValueString(board: IBoard) {
    return board.cells.map(c => c.isStatic ? c.getValue() : 0).join('');
}

function loadValueString(board: IBoard, puzzle: string) {
    puzzle = puzzle && typeof puzzle.toString === 'function'
        ? puzzle.toString().trim()
        : "";

    // Verify string represents 81 digit number
    if (!/^\d{81}$/.test(puzzle)) {
        throw new Error(`[Error] PuzzleManager::loadValueString(puzzle: string): Unexpected puzzle string format (${ puzzle })`);
    }

    board.setReady(false);

    const iter = puzzle[Symbol.iterator]();
    board.cells.forEach(cell => {
        let v = parseInt(iter.next().value);
        loadCellData(cell, { v: v, s: v !== 0, c: [] });
    });

    board.validate(true);
    board.setReady(true);
};

function getBinary(board: IBoard, ignoreHiddenCandidates?: boolean): Uint8Array { 
    const cells = board.cells;
    // 9 columns * 9 rows * 2 bytes per cell = 162 bytes
    const buffer = new ArrayBuffer(
        cells.length * CellConstants.byteLength
    );

    const view16 = new Uint16Array(buffer);
    
    for (let i = 0; i < view16.length; i++) {
        view16[i] = getCellBinary(cells[i], ignoreHiddenCandidates);
    }

    // return byte array instead of Uint16Array since it is more practical
    return new Uint8Array(buffer);
}

function loadBinary(board: IBoard, buffer: ArrayBuffer) {
    const cells = board.cells;
    const view16 = new Uint16Array(buffer);
    
    if (cells.length !== view16.length) {
        throw new Error(`[Error] PuzzleManager::loadBinary(buffer: ArrayBuffer): Unexpected buffer.length (${ view16.length })`);
    }

    board.setReady(false);

    for (let i = 0; i < view16.length; i++) {
        loadCellBinary(cells[i], view16[i]);
    }

    board.validate(true);
    board.setReady(true);
}

function getCellData(cell: ICell, ignoreHiddenCandidates: boolean): ICellData {
    const skip = cell.getValue() > 0 && ignoreHiddenCandidates;

    return (
        { v: cell.getValue()
        , s: cell.isStatic()
        , c: cell.candidates.filter(c => c.isSelected() && !skip).map(c => c.value)
        }
    );
}

function loadCellData(cell: ICell, data: ICellData) {
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

function getCellBinary(cell: ICell, ignoreHiddenCandidates: boolean): number {
    let v = cell.getValue();

    const skip = v > 0 && ignoreHiddenCandidates;
    v = v << 1 | (cell.isStatic() ? 1 : 0);

    for (let i = cell.candidates.length - 1; i >= 0; i--) {
        v = v << 1 | (cell.candidates[i].isSelected() && !skip ? 1: 0);
    }

    return v;
}

function loadCellBinary(cell: ICell, v: number): void {
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