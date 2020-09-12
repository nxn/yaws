import { IBoard, ISet, ICell, ICandidate, ModelType } from './interfaces';
import { create as createCandidate } from './candidate';

export const constants = Object.freeze({
    candidateCount: 9
});

export function create(board: IBoard, index: number, row: ISet, col: ISet, box: ISet, isStatic = false): ICell {
    const id         = `${board.id}-${row.name}${col.name}`;
    const name       = `${row.name}${col.name}`;
    const candidates = new Array(constants.candidateCount);

    const cell = new Cell(id, name, index, row, col, box, candidates);

    cell.isStatic = isStatic;

    for (let i = 0; i < candidates.length; i++) {
        candidates[i] = createCandidate(i+1, cell);
    }

    return cell;
}

class Cell implements ICell {
    readonly type = ModelType.Cell;

    constructor(
        readonly id:            string,
        readonly name:          string,
        readonly index:         number,
        readonly row:           ISet,
        readonly column:        ISet,
        readonly box:           ISet,
        readonly candidates:    ICandidate[]
    ) { }
    
    private cellValue = 0;
    get value() { return this.cellValue; }
    set value(value: number) { 
        if (this.isStatic || !Number.isInteger(value) || value < 0 || value > 9) {
            return;
        }
    
        this.cellValue = value;
    }

    private static = false;
    get isStatic() { return this.static; };
    set isStatic(value: boolean) {
        if (typeof value === "boolean") {
            this.static = value;
        }
    }

    get isValid(): boolean {
        if (this.value === 0) { return true; }

        const duplicate = (c: ICell) => c !== this && c.value === this.value;
    
        return !this.row.cells.find(duplicate)
            && !this.column.cells.find(duplicate)
            && !this.box.cells.find(duplicate);
    }

    clear() {
        this.isStatic = false;
        this.value = 0;
        this.candidates.forEach(c => c.isSelected = false);
    };
}
