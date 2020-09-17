import { IEventStore, IEventManager, IBoard, ISet, ICell, ICandidate, ModelType } from './interfaces';
import { CellEvents } from './events';
import { constants, create as createCandidate } from './candidate';

export function create(
    events:     IEventStore, 
    board:      IBoard, 
    index:      number, 
    row:        ISet, 
    col:        ISet, 
    box:        ISet, 
    isStatic =  false
): ICell {
    const cellEvents = events.get(ModelType.Cell);

    const id         = `${board.id}-${row.name}${col.name}`;
    const name       = `${row.name}${col.name}`;
    const candidates = new Array(constants.candidateCount);

    const cell = new Cell(id, name, index, row, col, box, candidates, cellEvents);

    cell.setStatic(isStatic, true);

    for (let i = 0; i < candidates.length; i++) {
        candidates[i] = createCandidate(events, i+1, cell);
    }

    return cell;
}

type  CellSets = { "row": ISet, "column": ISet, "box": ISet };
const CellSetValidationMap: { [P in keyof CellSets]: (keyof CellSets)[] } = {
    'row':      ['column',  'box'],
    'column':   ['row',     'box'],
    'box':      ['row',     'column']
};

class Cell implements ICell {
    readonly type = ModelType.Cell;

    constructor(
        readonly id:            string,
        readonly name:          string,
        readonly index:         number,
        readonly row:           ISet,
        readonly column:        ISet,
        readonly box:           ISet,
        readonly candidates:    ICandidate[],
        readonly events:        IEventManager
    ) { }
    
    private _rcb: Set<ICell>;
    get rcb() {
        if (this._rcb) { return this._rcb; }
        this._rcb = new Set([this.row.cells, this.column.cells, this.box.cells].flat());
        return this._rcb;
    }

    private value = 0;
    getValue() { return this.value; }
    setValue(value: number, silent = false, validate = true) { 
        if (this.static || !Number.isInteger(value) || value < 0 || value > 9 || this.value === value) {
            return;
        }
    
        let previous = this.value;
        this.value = value;

        if (!silent) {
            this.events.fire(CellEvents.ValueChanged, this, value, previous)
        }

        if (validate) {
            this.validate();
        }
    }

    private valid = true;
    isValid() {
        if (this.value === 0) { return true; }
        return this.valid;
    }
    setValid(valid: boolean, silent = false) {
        if (typeof valid !== "boolean" || this.valid === valid) {
            return;
        }

        this.valid = valid;

        if (!silent) {
            this.events.fire(CellEvents.ValidityChanged, this, this.valid);
        }
    }

    private static = false;
    isStatic() { return this.static; };
    setStatic(value: boolean, silent = false) {
        if (typeof value !== "boolean" || this.static === value) {
            return;
        }

        this.static = value;

        if (!silent) {
            this.events.fire(CellEvents.StaticChanged, this, value);
        }
    }

    clear(silent = false) {
        this.static = false;
        this.value = 0;
        this.candidates.forEach(c => c.setSelected(false, silent));

        if (!silent) {
            this.events.fire(CellEvents.Cleared, this);
        }
    };

    private validate() {
        // In addition to checking each individual cell in this cell's Row, Column, and Box for duplicates, it is also 
        // necessary to verify the validity of the cross sets of each of those cells as well. Without this check it
        // would be possible to set a neighboring cell as valid (if it has no local conflicts in this Row, Column,
        // and/or Box), despite it still having conflicts in its own Row, Column, or Box sets.
        
        // For example, when validing the cells in this Row, it is necessary to check those cells' Column and Box sets
        // to ensure there aren't any conflicts there; or when validing the cells in this Column, their Row and Box sets
        // should be looked at as well, and so on. The @CellSetValidationMap table defines the structure of the 
        // necessary checks.

        // TODO: The following can be optimized; in its current state it is performing duplicate checks when sets 
        // overlap (example: when iterating down a column as the local set, the box cross-set will be checked multiple
        // times despite it being exactly the same for the first three cells). Also, as the local set changes from row 
        // to column, the cross-set will be the same as the previous local set.
        let localSetKey: keyof CellSets;
        for (localSetKey in CellSetValidationMap) {
            const localCells = this[localSetKey].cells

            // aggregate cell values into { value: count } lookup object
            const counts = localCells.reduce(
                (counts: { [key: number]: number}, cell) => {
                    let value = cell.getValue();
                    if (value === 0) { return counts; }
                    counts[value] = (counts[value] || 0)+1;
                    return counts;
                }, {}
            );

            for(const localCell of localCells) {
                const localCellValue = localCell.getValue();
                if (localCellValue === 0) { continue; }

                let valid = counts[localCellValue] <= 1;
                for (const pivot of CellSetValidationMap[localSetKey]) {
                    if (!valid) { break; }

                    valid = valid && localCell[pivot].cells.filter(
                        c => c.getValue() === localCellValue
                    ).length <= 1;
                }
                localCell.setValid(valid);
            }
        }
    }
}
