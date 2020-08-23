import { IBoard, ISet, ICell, ICellCandidate } from './interfaces';

export const constants = {
    candidateCount: 9
};
Object.freeze(constants);

export function create(board: IBoard, index: number, row: ISet, col: ISet, box: ISet, isStatic = false): ICell {
    let value = 0;

    const id         = `${board.id}-${row.name}${col.name}`;
    const name       = `${row.name}${col.name}`;
    const candidates = new Array(constants.candidateCount);

    const cell: ICell = Object.create(null,
        { id:         { get: () => id }
        , name:       { get: () => name }
        , row:        { get: () => row }
        , column:     { get: () => col }
        , box:        { get: () => box }
        , index:      { get: () => index }
        , candidates: { get: () => candidates }
        , isStatic:   { get: () => isStatic
                      , set: f  => { if (typeof f === "boolean") isStatic = f }
                      }
        , value:      { get: () => value
                      , set: (v:number) => value = cellValue(cell, v)
                      }
        , isValid:    { get: () => isCellValid(cell) }
        , clear:      { value: () => clear(cell) }
        }
    );
    Object.freeze(cell);

    for (let i = 0; i < candidates.length; i++) {
        candidates[i] = createCandidate(cell, i+1);
    }

    return cell;
}

function createCandidate(cell: ICell, value: number): ICellCandidate {
    let selected = false;

    const candidate:ICellCandidate = Object.create(null,
        { value:    { get: () => value }
        , cell:     { get: () => cell }
        , isValid:  { get: () => isCandidateValid(candidate) }
        , selected: { get: () => !cell.isStatic && selected
                    , set: (f:boolean) => { if (typeof f === "boolean") selected = f && !cell.isStatic }
                    }
        }
    );
    Object.freeze(candidate);

    return candidate;
}

function isCandidateValid(candidate: ICellCandidate) : boolean {
    if (!candidate.selected) { return true; }

    const cell = candidate.cell;
    const selectedValue = (c:ICell) => c.value === candidate.value;

    return !cell.row.cells.find(selectedValue)
        && !cell.column.cells.find(selectedValue)
        && !cell.box.cells.find(selectedValue);
}

function isCellValid(cell:ICell) : boolean { 
    if (cell.value === 0) { return true; }

    const duplicate = (c:ICell) => c !== cell && c.value === cell.value;

    return !cell.row.cells.find(duplicate)
        && !cell.column.cells.find(duplicate)
        && !cell.box.cells.find(duplicate);
}

function cellValue(cell: ICell, value: number): number {
    if (cell.isStatic || !Number.isInteger(value) || value < 0 || value > 9) {
        return cell.value
    }

    return value;
}

function clear(cell : ICell) : void {
    cell.isStatic = false;
    cell.value = 0;
    cell.candidates.forEach(c => c.selected = false);
}
