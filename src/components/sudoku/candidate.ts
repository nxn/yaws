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
        this.cell.events.attach(CellEvents.ValueChanged, this.validate);
    }

    validate = (cell: ICell, newValue: number, oldValue: number) => {
        // I suspect there might be an issue with view event listeners not being attached soon enough to catch 
        // validation change events when a cell value is cleared and candidates are re-added to the DOM. To work around
        // this for the time being the "this.cell === cell" condition is necessary as it will skip marking the candidate
        // as invalid should its parent cell get set to its value. This way if the cell value gets cleared later the
        // candidate will no longer automatically be in an invalid state due to its own cell's value.
        if (this.cell.isStatic() || this.cell === cell || !cell.rcb.has(this.cell)) { 
            return; 
        }

        if (this.value === newValue) {
            this.setValid(false);
        }

        if (this.value === oldValue) {
            let valid = true;
            for (const associatedCell of this.cell.rcb) {
                if (associatedCell.getValue() === oldValue) {
                    valid = false;
                    break;
                }
            }
            if (this.cell === cell) {
                console.log(valid);
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
