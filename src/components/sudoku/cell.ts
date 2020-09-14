import { IEventStore, IEventManager, IBoard, ISet, ICell, ICandidate, ModelType } from './interfaces';
import { CellEvents } from './events';
import { create as createCandidate } from './candidate';

export const constants = Object.freeze({
    candidateCount: 9
});

export function create(events: IEventStore, board: IBoard, index: number, row: ISet, col: ISet, box: ISet, isStatic = false): ICell {
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
    
    private value = 0;
    getValue() { return this.value; }
    setValue(value: number, silent = false) { 
        if (this.static || !Number.isInteger(value) || value < 0 || value > 9 || this.value === value) {
            return;
        }
    
        let previous = this.value;
        this.value = value;

        if (!silent) {
            this.events.fire(CellEvents.ValueChanged, this, value, previous)
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

    isValid(): boolean {
        if (this.value === 0) { return true; }

        const duplicate = (c: ICell) => c !== this && c.getValue() === this.value;
    
        return !this.row.cells.find(duplicate)
            && !this.column.cells.find(duplicate)
            && !this.box.cells.find(duplicate);
    }

    clear(silent = false) {
        this.static = false;
        this.value = 0;
        this.candidates.forEach(c => c.setSelected(false, silent));

        if (!silent) {
            this.events.fire(CellEvents.Cleared, this);
        }
    };
}
