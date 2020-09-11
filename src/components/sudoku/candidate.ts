import { ICandidate, ICell, ModelType } from './interfaces';

class Candidate implements ICandidate {
    readonly type = ModelType.Candidate;

    constructor(
        readonly value: number,
        readonly cell: ICell
    ) { }
    
    get isValid(): boolean {
        if (!this.isSelected) { return true; }

        const cell = this.cell;
        const selectedValue = (c:ICell) => c.value === this.value;
    
        return !cell.row.cells.find(selectedValue)
            && !cell.column.cells.find(selectedValue)
            && !cell.box.cells.find(selectedValue);
    }

    private selected = false;
    get isSelected() {
        return !this.cell.isStatic && this.selected;
    };
    set isSelected(value: boolean) {
        if (typeof value === "boolean") {
            this.selected = value && !this.cell.isStatic
        }
    }

}

export function create(value: number, cell: ICell): ICandidate {
    return new Candidate(value, cell);
}
