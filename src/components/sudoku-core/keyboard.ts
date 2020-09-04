import { IKeyboardController, IKeyPress, ICell, KeyboardActions, IBoard } from "./interfaces";
 
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

export const defaultMap: { [key: string]: string[] } = {
    // Standard
    'ArrowUp'     : [KeyboardActions.up],
    'ArrowLeft'   : [KeyboardActions.left],
    'ArrowDown'   : [KeyboardActions.down],
    'ArrowRight'  : [KeyboardActions.right],

    // Vim-like
    'h': [KeyboardActions.left],      'H': [KeyboardActions.boxLeft],
    'j': [KeyboardActions.down],      'J': [KeyboardActions.boxDown],
    'k': [KeyboardActions.up],        'K': [KeyboardActions.boxUp],
    'l': [KeyboardActions.right],     'L': [KeyboardActions.boxRight],

    // WASD
    'w': [KeyboardActions.up],        'W': [KeyboardActions.boxUp],
    'a': [KeyboardActions.left],      'A': [KeyboardActions.boxLeft],
    's': [KeyboardActions.down],      'S': [KeyboardActions.boxDown],
    'd': [KeyboardActions.right],     'D': [KeyboardActions.boxRight],

    // Go to error
    'e': [KeyboardActions.nextError], 'E': [KeyboardActions.prevError],

    'x': [KeyboardActions.nextError, KeyboardActions.clearCell],
    'X': [KeyboardActions.prevError, KeyboardActions.clearCell],

    // Clear
    'Backspace'   : [KeyboardActions.clearCell],
    'Delete'      : [KeyboardActions.clearCell],
};

export function createKeyboardController(board: IBoard, map = defaultMap) {
    const controller: IKeyboardController = Object.create(null, {
        map:        { get: () => map },
        onKey:      { value: (key: IKeyPress) => onKey(controller, board, key) }
    });


    Object.freeze(controller);
    return controller;
}

function onKey(controller: IKeyboardController, board: IBoard, keyPress: IKeyPress) {
    keyPress.preventDefault();
    const cell = board.cursor.cell;

    if (keyPress.code.startsWith('Digit')) {
        digitHandler(cell, keyPress);
        return;
    }

    const actions = controller.map[keyPress.key];

    if (!actions) { return; }

    for (let action of actions) {
        actionMap[action](board);
    }
}

function digitHandler(cell: ICell, keyPress: IKeyPress): void {
    if (!keyPress.code.startsWith('Digit')) {
        return;
    }

    const num = parseInt(keyPress.key);

    // If parsing the key value did not result in a number but the event code signified a number input, shift was being
    // held during the input. If so we take that to mean that the cell value should be set.
    if (Number.isNaN(num)) {
        cell.value = parseInt(keyPress.code.substring(5));
        return;
    }
    
    if (num > 0 && num < 10) {
        if (cell.value > 0) {
            // If cell already has a value set, update it
            cell.value = num;
        }
        else {
            // Otherwise flip the candidate selection
            let candidate = cell.candidates.find(c => c.value === num);
            candidate.selected = !candidate.selected;
        }
    }
}

