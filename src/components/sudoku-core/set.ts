import { IBoard, ISet, ICell, ISetValidationResult } from './interfaces';

/* Data structure for validating uniqueness of cell members in a group such as a row, column, or box.
 *
 * Despite being named a set, it is not intended to prohibit non-distinct values from existing within it. Instead,
 * duplicate values should trigger an invalid state along with a reference to all non-unique cells.
 * */
export function create(board: IBoard, name: string, index: number): ISet {
    const id = `${board.id}-${name}`;
    const cells:ICell[] = [];

    const set: ISet = Object.create(null,
        { id:       { get: () => id }
        , name:     { get: () => name }
        , index:    { get: () => index }
        , cells:    { get: () => cells }
        , validate: { value: () => validate(set) }
        }
    );
    Object.freeze(set);

    return set;
}

export function validate(set: ISet): ISetValidationResult {
    const result : { valid: boolean, errors: ICell[] } = { valid: true, errors: [] };
    const values: Map<number, ICell[]> = new Map();
    
    for (const cell of set.cells) {
        if (cell.value === 0) {
            continue;
        }
        
        if (values.has(cell.value)) {
            result.valid = false;
        } else {
            values.set(cell.value, []);
        }

        values.get(cell.value).push(cell);
    }

    for (const v of values.values()) {
        if (v.length > 1) {
            result.errors = result.errors.concat(v);
        }
    }

    return result;
}

export function validateAll(...args: any[]): ISetValidationResult {
    /* flatten arguments to allow array inputs and/or standard rest params
     * */
    const sets = args.reduce((acc, val) => acc.concat(val), []);
    
    let valid = true;
    const errors: Map<string, ICell> = new Map();
    
    const check = function(set: ISet) {
        let result = set.validate();
        if (!result.valid) {
            valid = false;
            result.errors.forEach(c => errors.set(c.id, c));
        }
    };  

    sets.forEach(check);
    
    return { valid : valid, errors : Array.from(errors.values()) };
}

