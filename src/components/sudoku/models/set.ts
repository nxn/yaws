import type { IBoard } from './board';
import type { ICell } from './cell'; 

export interface ISet {
    id:         string;
    name:       string;
    index:      number;
    cells:      ICell[];
    validate:   () => ISetValidationResult;
}

export interface ISetValidationResult {
    valid:      boolean;
    errors?:    ICell[];
}

/* Data structure for validating uniqueness of cell members in a group such as a row, column, or box.
 *
 * Despite being named a set, it is not intended to prohibit non-distinct values from existing within it. Instead,
 * duplicate values should trigger an invalid state along with a reference to all non-unique cells.
 * */
export class Set implements ISet {
    private constructor(
        readonly id:        string,
        readonly name:      string,
        readonly index:     number,
        readonly cells:     ICell[]
    ) { }

    static create(board: IBoard, name: string, index: number): ISet {
        const id = `${board.id}-${name}`;
        const cells:ICell[] = [];
    
        return new Set(id, name, index, cells);
    }

    validate(): ISetValidationResult {
        const result : { valid: boolean, errors: ICell[] } = { valid: true, errors: [] };
        const values: Map<number, ICell[]> = new Map();
        
        for (const cell of this.cells) {
            let value = cell.getValue();
            if (value === 0) {
                continue;
            }
            
            let existing = values.get(value);
            if (existing === undefined) {
                existing = [];
                values.set(value, existing)
            }
            existing.push(cell);
        }
    
        for (const v of values.values()) {
            if (v.length > 1) {
                result.errors = result.errors.concat(v);
            }
        }
    
        return result;
    }

    static validateAll(...sets: ISet[]): ISetValidationResult {
        let valid = true;
        const errors: Map<string, ICell> = new Map();
    
        for (let set of sets) {
            let result = set.validate();
            if (!result.valid) {
                valid = false;
                result.errors.forEach(c => errors.set(c.id, c));
            }
        }
        
        return { valid : valid, errors : Array.from(errors.values()) };
    }
}