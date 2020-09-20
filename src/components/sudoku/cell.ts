import type { IEventManager, IEventStore } from './events';
import type { IBoard } from './board';
import type { ISet } from './set';
import { IModel, ModelType } from './model';

import { ICandidate, Candidate, Constants as CandidateConstants } from './candidate';

export const Constants = Object.freeze({
    byteLength: 2,
    bitLength:  14
});

export type CellEvents = "ValueChanged" | "StaticChanged" | "ValidityChanged" | "Cleared";

export const CellEvents = {
    get ValueChanged(): CellEvents      { return "ValueChanged" },
    get StaticChanged(): CellEvents     { return "StaticChanged" },
    get ValidityChanged(): CellEvents   { return "ValidityChanged" },
    get Cleared(): CellEvents           { return "Cleared" }
}

export const StateChangeEvents = [
    CellEvents.ValueChanged, 
    CellEvents.ValidityChanged, 
    CellEvents.StaticChanged, 
    CellEvents.Cleared
]

export interface ICell extends IModel {
    type:           "Cell";
    id:             string;
    name:           string;
    index:          number;
    row:            ISet;
    column:         ISet;
    box:            ISet;
    rcb:            Set<ICell>;
    candidates:     ICandidate[];
    getValue:       () => number;
    setValue:       (value: number, silent?: boolean, validate?: boolean) => void;
    isStatic:       () => boolean;
    setStatic:      (value: boolean, silent?: boolean) => void;
    isValid:        () => boolean;
    setValid:       (value: boolean, silent?: boolean) => void;
    clear:          (silent?: boolean) => void;
}

export interface ICellData {
    v: number;
    c: number[];
    s: boolean;
}

export class Cell implements ICell {
    readonly type = "Cell";

    private constructor(
        readonly id:            string,
        readonly name:          string,
        readonly index:         number,
        readonly row:           ISet,
        readonly column:        ISet,
        readonly box:           ISet,
        readonly candidates:    ICandidate[],
        readonly events:        IEventStore
    ) { }

    static create(
        events:     IEventManager, 
        board:      IBoard, 
        index:      number, 
        row:        ISet, 
        col:        ISet, 
        box:        ISet, 
        isStatic =  false
    ): ICell {
        const cellEvents = events.type(ModelType.Cell);
    
        const id         = `${board.id}-${row.name}${col.name}`;
        const name       = `${row.name}${col.name}`;
        const candidates = new Array(CandidateConstants.candidateCount);
    
        const cell = new Cell(id, name, index, row, col, box, candidates, cellEvents);
    
        cell.setStatic(isStatic, true);
    
        for (let i = 0; i < candidates.length; i++) {
            candidates[i] = Candidate.create(events, i+1, cell);
        }
    
        return cell;
    }
    
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

        if (validate && this.value > 0) {
            this.validate();
        }

        // Updates validity of candidates within this row, column, and box.
        for (const associatedCell of this.rcb) {
            // If the new value isn't empty (0), the only thing that is needed is to set the candidates corresponding to
            // the new value as invalid.
            if (this.value > 0) {
                associatedCell.candidates[this.value - 1].setValid(false);
            }
            // In the case of updating the validity of candidates corresponding to the previous value, their own RCBs
            // need to be checked to determine whether the previous value is valid in their region of the board or not.
            if (previous > 0) {
                associatedCell.candidates[previous - 1].validate();
            }
        }

        // This event must fire *after* validation has been performed; doing so beforehand causes problems whenever a 
        // cell value is removed and candidates are rendered. Specifically, the new empty cell value causes candidates 
        // to render with whatever validity state they had at the time of the value change. Their listener for tracking 
        // state changes doesn't get attached until after this event loop cycle is complete, so as a consequence they 
        // miss the valid/invalid state updates entirely. Performing validation before firing the ValueChanged event 
        // avoids the issue entirely.

        // For the time being this is fine, though ideally new events should be setup specifically for signaling when
        // state changes are fully complete so that there is less ambiguity about when it is safe to add or remove
        // components.
        if (!silent) {
            this.events.get(CellEvents.ValueChanged).fire(this, value, previous)
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
            this.events.get(CellEvents.ValidityChanged).fire(this, this.valid);
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
            this.events.get(CellEvents.StaticChanged).fire(this, value);
        }
    }

    clear(silent = false) {
        this.static = false;
        this.value = 0;
        this.candidates.forEach(c => c.setSelected(false, silent));

        if (!silent) {
            this.events.get(CellEvents.Cleared).fire(this);
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
                    counts[value] = (counts[value] || 0) + 1;
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

type  CellSets = { "row": ISet, "column": ISet, "box": ISet };
const CellSetValidationMap: { [K in keyof CellSets]: (keyof CellSets)[] } = {
    'row':      ['column',  'box'],
    'column':   ['row',     'box'],
    'box':      ['row',     'column']
};