import type { IEventManager, IEventStore } from '../events';
import { IModel, ModelType } from './model';
import type { ICell } from './cell';

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
    validate:       () => void;
}

export class Candidate implements ICandidate {
    readonly type = "Candidate";

    private constructor(
        readonly value: number,
        readonly cell: ICell,
        readonly events: IEventStore
    ) { }

    static create(events: IEventManager, value: number, cell: ICell): ICandidate {
        return new Candidate(value, cell, events.type(ModelType.Candidate));
    }

    validate = () => {
        let valid = true;
        for (const cell of this.cell.rcb) {
            if (this.value === cell.getValue()) {
                valid = false;
                break;
            }
        }
        this.setValid(valid);
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
