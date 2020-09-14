import { ICandidate, ICell, IEventStore, IEventManager, ModelType } from './interfaces';
import { CandidateEvents } from "./events";

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
    ) { }
    
    isValid(): boolean {
        if (!this.isSelected()) { return true; }

        const cell = this.cell;
        const selectedValue = (c:ICell) => c.getValue() === this.value;
    
        return !cell.row.cells.find(selectedValue)
            && !cell.column.cells.find(selectedValue)
            && !cell.box.cells.find(selectedValue);
    }

    private selected = false;
    isSelected() {
        return !this.cell.isStatic() && this.selected;
    };
    setSelected(value: boolean, silent = false) {
        if (typeof value !== "boolean") {
            return;
        }
        let previous = this.selected;
        this.selected = value && !this.cell.isStatic()

        if ((previous !== this.selected) && !silent) {
            this.events.fire(CandidateEvents.SelectedChanged, this, this.value, this.selected);
        }
    }
}
