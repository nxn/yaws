import type { IEventManager, IEventStore } from './events';
import { IModel, ModelType } from './model';
import { ICell, CellEvents } from './cell';

export const Constants = Object.freeze({
    candidateCount: 9
});

export type CandidateEvents = "SelectedChanged" | "ValidityChanged";

export const CandidateEvents = {
    get SelectedChanged(): CandidateEvents { return "SelectedChanged" },
    get ValidityChanged(): CandidateEvents { return "ValidityChanged" }
}

export const StateChangeEvents = [
    CandidateEvents.SelectedChanged,
    CandidateEvents.ValidityChanged
]

export interface ICandidate extends IModel {
    type:           "Candidate";
    value:          number;
    isValid:        () => boolean;
    setValid:       (value: boolean, silent?: boolean) => void;
    isSelected:     () => boolean;
    setSelected:    (value: boolean, silent?: boolean) => void;
}

export class Candidate implements ICandidate {
    readonly type = "Candidate";

    private constructor(
        readonly value: number,
        readonly cell: ICell,
        readonly events: IEventStore
    ) {
        this.cell.events.get(CellEvents.ValueChanged).attach(this.validate);
    }

    static create(events: IEventManager, value: number, cell: ICell): ICandidate {
        return new Candidate(value, cell, events.type(ModelType.Candidate));
    }

    validate = (cell: ICell, newValue: number, oldValue: number) => {
        // There might be an issue with view event listeners not being attached in time to receive validation change 
        // events when a cell value is cleared and candidates are re-rendered to the DOM. To work around this problem 
        // the "this.cell === cell" early return condition is necessary as it will skip marking the candidate as invalid
        // should its parent cell get set to its value. This way if the cell value gets cleared later the candidate will
        // no longer automatically be in an invalid state due to its own cell's prior value.
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
            this.events.get(CandidateEvents.ValidityChanged).fire(this, this.valid);
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
            this.events.get(CandidateEvents.SelectedChanged).fire(this, this.value, this.selected);
        }
    }
}
