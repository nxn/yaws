import { IKeyboardController, IKeyPress, ICell, KeyboardActions, IBoard } from "./interfaces";

const rxNumberInput = /(?:Digit|Numpad)([1-9])/i;

const actionMap: { [key: string]: (board: IBoard) => ICell } = {
    [KeyboardActions.left]:         b => b.cursor.columnLeft(),
    [KeyboardActions.right]:        b => b.cursor.columnRight(),
    [KeyboardActions.up]:           b => b.cursor.rowUp(),
    [KeyboardActions.down]:         b => b.cursor.rowDown(),
    [KeyboardActions.boxLeft]:      b => b.cursor.boxLeft(),
    [KeyboardActions.boxRight]:     b => b.cursor.boxRight(),
    [KeyboardActions.boxUp]:        b => b.cursor.boxUp(),
    [KeyboardActions.boxDown]:      b => b.cursor.boxDown(),
    [KeyboardActions.nextError]:    b => b.cursor.nextError(),
    [KeyboardActions.prevError]:    b => b.cursor.previousError(),
    [KeyboardActions.clearCell]:    b => b.cursor.clear()
};

export const defaultMap: { [key: string]: KeyboardActions[] } = {
    // Standard
    'arrowup'     : [KeyboardActions.up],       'shift+arrowup'     : [KeyboardActions.boxUp],
    'arrowleft'   : [KeyboardActions.left],     'shift+arrowleft'   : [KeyboardActions.boxLeft],
    'arrowdown'   : [KeyboardActions.down],     'shift+arrowdown'   : [KeyboardActions.boxDown],
    'arrowright'  : [KeyboardActions.right],    'shift+arrowright'  : [KeyboardActions.boxRight],

    // Vim-like
    'h': [KeyboardActions.left],      'shift+h': [KeyboardActions.boxLeft],
    'j': [KeyboardActions.down],      'shift+j': [KeyboardActions.boxDown],
    'k': [KeyboardActions.up],        'shift+k': [KeyboardActions.boxUp],
    'l': [KeyboardActions.right],     'shift+l': [KeyboardActions.boxRight],

    // WASD
    'w': [KeyboardActions.up],        'shift+w': [KeyboardActions.boxUp],
    'a': [KeyboardActions.left],      'shift+a': [KeyboardActions.boxLeft],
    's': [KeyboardActions.down],      'shift+s': [KeyboardActions.boxDown],
    'd': [KeyboardActions.right],     'shift+d': [KeyboardActions.boxRight],

    // Go to error
    'e': [KeyboardActions.nextError], 'shift+e': [KeyboardActions.prevError],

    // Clear
    'backspace'   : [KeyboardActions.clearCell],
    'delete'      : [KeyboardActions.clearCell],
    'x'           : [KeyboardActions.clearCell], 
    'shift+x'     : [KeyboardActions.clearCell],
};

class KeyboardController implements IKeyboardController {
    constructor(
        readonly board: IBoard,
        readonly bindings = defaultMap
    ) { }

    get map() { 
        return this.bindings;
    };

    onKey(keyPress: IKeyPress) {
        const cell = this.board.cursor.cell;
    
        if (keyPress.code.match(rxNumberInput)) {
            this.digitHandler(cell, keyPress);
            return;
        }
    
        let input = (keyPress.shiftKey ? 'shift+' + keyPress.key : keyPress.key).toLowerCase();
        const actions = this.map[input];
    
        if (!actions) { return; }
    
        keyPress.preventDefault();
        for (let action of actions) {
            actionMap[action](this.board);
        }
    }
    
    private digitHandler(cell: ICell, keyPress: IKeyPress): void {
        let match = keyPress.code.match(rxNumberInput);
        if (!match || match.length !== 2) {
            return;
        }
    
        const num = parseInt(match[1]);
        if (Number.isNaN(num)) { return; }
    
        // Shift+[Numpad-Key] events have their 'shiftKey' property set to false despite the fact
        // it is being held. So instead, if the number parsed from the event 'code' doesn't match
        // the event 'key' property, assume it is because shift was being held. This could be the
        // case for other reasons, of course, but this will have to do for the time being.
        if (num !== parseInt(keyPress.key)) {
            keyPress.preventDefault();
            cell.value = num;
            return;
        }
        
        if (num > 0 && num < 10) {
            keyPress.preventDefault();
            if (cell.value > 0) {
                // If cell already has a value set, update it
                cell.value = num;
            }
            else {
                // Otherwise flip the candidate selection
                let candidate = cell.candidates.find(c => c.value === num);
                candidate.isSelected = !candidate.isSelected;
            }
        }
    }
}

export function create(board: IBoard, map = defaultMap) {
    return new KeyboardController(board, map);
}


