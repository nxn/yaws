import { ICandidate, ICell, IEventStore, IEventManager, ModelType } from './interfaces';
import { CandidateEvents, CellEvents } from "./events";

export const constants = Object.freeze({
    candidateCount: 9
});

export function create(events: IEventStore, value: number, cell: ICell): ICandidate {
    const candidateEvents = events.get(ModelType.Candidate);
    return new Candidate(value, cell, candidateEvents);
}

class Candidate implements ICandidate {
    readonly type = ModelType.Candidate;

    constructor(
        readonly value: number,
        readonly cell: ICell,
        readonly events: IEventManager
    ) {
        this.cell.events.on(CellEvents.ValueChanged, this.validate);
    }

    validate = (cell: ICell, newValue: number, oldValue: number) => {
        if (this.cell.isStatic() || !cell.rcb.has(this.cell)) { return; }

        if (this.value === newValue) {
            this.setValid(false);
        }

        if (this.value === oldValue) {
            let valid = true;
            for (const cell of this.cell.rcb) {
                if (cell.getValue() === oldValue) {
                    valid = false;
                    break;
                }
            }
            this.setValid(valid);
        }
    }

    private valid = true;
    isValid() {
        if (!this.isSelected()) { return true; }
        return this.valid;
    }
    setValid(valid: boolean, silent = false) {
        if (typeof valid !== "boolean" || this.valid === valid) {
            return;
        }

        this.valid = valid;

        if (!silent) {
            this.events.fire(CandidateEvents.ValidityChanged, this, this.valid);
        }
    }

    private selected = false;
    isSelected() {
        return !this.cell.isStatic() && this.selected;
    };
    setSelected(selected: boolean, silent = false) {
        if (typeof selected !== "boolean") {
            return;
        }
        let previous = this.selected;
        this.selected = selected && !this.cell.isStatic()

        if ((previous !== this.selected) && !silent) {
            this.events.fire(CandidateEvents.SelectedChanged, this, this.value, this.selected);
        }
    }
}
