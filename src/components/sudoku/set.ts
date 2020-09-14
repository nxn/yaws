import { IEventStore, IEventManager, IBoard, ISet, ICell, ISetValidationResult, ModelType } from './interfaces';

export enum SetEvents { };

export function create(events: IEventStore, board: IBoard, name: string, index: number): ISet {
    const setEvents = events.get(ModelType.Set);
    const id = `${board.id}-${name}`;
    const cells:ICell[] = [];

    return new Set(id, name, index, cells, setEvents);
}

export function validate(set: ISet): ISetValidationResult {
    const result : { valid: boolean, errors: ICell[] } = { valid: true, errors: [] };
    const values: Map<number, ICell[]> = new Map();
    
    for (const cell of set.cells) {
        if (cell.getValue() === 0) {
            continue;
        }
        
        if (values.has(cell.getValue())) {
            result.valid = false;
        } else {
            values.set(cell.getValue(), []);
        }

        values.get(cell.getValue()).push(cell);
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

/* Data structure for validating uniqueness of cell members in a group such as a row, column, or box.
 *
 * Despite being named a set, it is not intended to prohibit non-distinct values from existing within it. Instead,
 * duplicate values should trigger an invalid state along with a reference to all non-unique cells.
 * */
class Set implements ISet {
    readonly type = ModelType.Set;

    constructor(
        readonly id:        string,
        readonly name:      string,
        readonly index:     number,
        readonly cells:     ICell[],
        readonly events:    IEventManager
    ) { }

    validate(): ISetValidationResult {
        return validate(this);
    }
}
