
import { TSudokuPuzzle, IBoard, ICell, ICellData, ILocation, IGameState } from './interfaces';
import { deflateRaw as compress, inflateRaw as expand } from '@lib/pako/pako';

const cellConstants = Object.create(null,
    { byteLength:       { value: 2 }
    , bitLength:        { value: 14 }
    }
);

export function createManager(board: IBoard) {
    const manager: IGameState = Object.create(null,
        { getString:        { value: () => getString(board) }
        , loadString:       { value: (p:string) => loadString(board, p) }
        , getTypedArray:    { value: () => getTypedArray(board) }
        , loadTypedArray:   { value: (a:Uint8Array) => loadTypedArray(board, a) }
        , getLink:          { value: (f:boolean, l:ILocation) => getLink(board, f, l) }
        , loadLink:         { value: (l:string) => loadLink(board, l) }
        , getData:          { value: (f:boolean) => getData(board, f) }
        , loadData:         { value: (d:ICellData[]) => loadData(board, d) }
        , getBinary:        { value: (f:boolean) => getBinary(board, f) }
        , loadBinary:       { value: (b:ArrayBuffer) => loadBinary(board, b) }
        }
    );
    
    Object.freeze(manager);
    return manager;
}

//#region Board State

function loadTypedArray(board: IBoard, array: Uint8Array): IBoard {
    if (array.length !== board.cells.length) {
        return board;
    }

    for (let i = 0; i < board.cells.length; i++) {
        let value = array[i];
        let cell = board.cells[i];
        loadCellData(cell, { v: value, s: value !== 0, c: [] });
    }

    board.isLoaded = true;
    return board;
}

function getTypedArray(board: IBoard): Uint8Array {
    return Uint8Array.from(board.cells.map(c => c.isStatic ? c.value : 0));
}

function getData(board: IBoard, ignoreHiddenCandidates?: boolean): ICellData[] {
    return board.cells.map(cell => getCellData(cell, ignoreHiddenCandidates));
}

function loadData(board: IBoard, data: ICellData[]): IBoard {
    if (!(Array.isArray(data) && data.length === board.cells.length)) {
        return board;
    }

    const iter = data[Symbol.iterator]();
    board.cells.forEach(cell => loadCellData(cell, iter.next().value));

    board.isLoaded = true;
    return board;
}

function getString(board: IBoard): string {
    return board.cells.map(c => c.isStatic ? c.value : 0).join('');
}

function loadString(board: IBoard, puzzle: string): IBoard {
    puzzle = puzzle && typeof puzzle.toString === 'function'
        ? puzzle.toString().trim()
        : "";

    // Verify string represents 81 digit number
    if (!/^\d{81}$/.test(puzzle)) {
        return board;
    }

    const iter = puzzle[Symbol.iterator]();
    board.cells.forEach(cell => {
        let v = parseInt(iter.next().value);
        loadCellData(cell, { v: v, s: v !== 0, c: [] });
    });

    board.isLoaded = true;
    return board;
}

function getBinary(board: IBoard, ignoreHiddenCandidates?: boolean): Uint8Array { 
    const cells = board.cells;
    // 9 columns * 9 rows * 2 bytes per cell = 162 bytes
    const buffer = new ArrayBuffer(
        cells.length * cellConstants.byteLength
    );

    const view16 = new Uint16Array(buffer);
    
    for (let i = 0; i < view16.length; i++) {
        view16[i] = getCellBinary(cells[i], ignoreHiddenCandidates);
    }

    // return byte array instead of Uint16Array since it is more practical
    return new Uint8Array(buffer);
}

function loadBinary(board: IBoard, buffer: ArrayBuffer): IBoard {
    const cells = board.cells;
    const view16 = new Uint16Array(buffer);
    
    if (cells.length !== view16.length) {
        return;
    }

    for (let i = 0; i < view16.length; i++) {
        loadCellBinary(cells[i], view16[i]);
    }

    board.isLoaded = true;
    return board;
}

function getLink(board: IBoard, includeProgress: boolean, locationObj:ILocation = location): string {
    const l = locationObj;
    // In the case of an 81 digit number, simply substituting sequences of 0s that are 3 units of length or greater is
    // more effective than pako/zlib compression. The latter requires base64 encoding and, as a result, loses any
    // compression gains due to added overhead.
    const p = includeProgress
        ? btoa(compress(getBinary(board, true), { level: 9, to: 'string' }) as string)
        : getString(board).replace(/(0{3,})/g, m => `(${m.length})`);

    return `${l.origin}${l.pathname}?p=${encodeURIComponent(p)}`;
}

function loadLink(board: IBoard, link:string): IBoard {
    const url    = new URL(link);
    const params = new URLSearchParams(url.search);
    let p = params.get('p');

    if (!p) { return; }

    p = decodeURIComponent(p);

    // Check if any sequences of 0s were trimmed out; fill them in if so.
    if (/\(\d+\)/g.test(p)) {
        p = p.replace(/\((\d+)\)/g, (m,g) => Array(parseInt(g)).fill(0).join(''));
    }

    // Verify 81 digit number, otherwise assume base64 binary.
    if (/^\d{81}$/.test(p)) {
        loadString(board, p);
    }
    else {
        loadBinary(board, (expand(atob(p)) as Uint8Array).buffer);
    }

    return board;
}
//#endregion

//#region Cell State
function getCellData(cell: ICell, ignoreHiddenCandidates: boolean): ICellData {
    const skip = cell.value > 0 && ignoreHiddenCandidates;

    return { v: cell.value
           , s: cell.isStatic
           , c: cell.candidates.filter(c => c.selected && !skip).map(c => c.value)
           };
}

function loadCellData(cell: ICell, data: ICellData): void {
    if (typeof data !== 'object') {
        return;
    }

    // Set cell as non-static so we can update its values
    cell.isStatic = false;

    if (data.v >= 0 && data.v < 10) {
        cell.value = data.v;
    }

    if (Array.isArray(data.c)) {
        cell.candidates.forEach(c => c.selected = data.c.indexOf(c.value) >= 0);
    }

    if (typeof data.s === 'boolean') {
        cell.isStatic = data.s;
    }
}

function getCellBinary(cell: ICell, ignoreHiddenCandidates: boolean): number {
    let v = cell.value;

    const skip = v > 0 && ignoreHiddenCandidates;
    v = v << 1 | (cell.isStatic ? 1 : 0);

    for (let i = cell.candidates.length - 1; i >= 0; i--) {
        v = v << 1 | (cell.candidates[i].selected && !skip ? 1: 0);
    }

    return v;
}

function loadCellBinary(cell: ICell, v: number): void {
    cell.isStatic = false;

    // Cell values are only valid if they're in the 0 to 16383 range (4 bits for value, 1 isStatic bit, 9 bits to mark
    // whether each candidate is selected).
    if (v < 0 || v >= 2 ** cellConstants.bitLength) {
        return;
    }

    for (let i = 0; i < cell.candidates.length; i++) {
        cell.candidates[i].selected = !!(v&1);
        v = v >> 1;
    }

    const isStatic = !!(v&1);

    cell.value = v >> 1;
    cell.isStatic = isStatic;
}
//#endregion