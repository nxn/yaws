import { IBoardController, IKeyboardController, IKeyPress, KeyboardActions, IBoard } from "./interfaces";

const rxNumberInput = /(?:Digit|Numpad)([1-9])/i;

const actionMap: { [key: string]: (board: IBoard, controller: IBoardController) => void } = {
    [KeyboardActions.left]:         (b,c) => c.columnLeft(b),
    [KeyboardActions.right]:        (b,c) => c.columnRight(b),
    [KeyboardActions.up]:           (b,c) => c.rowUp(b),
    [KeyboardActions.down]:         (b,c) => c.rowDown(b),
    [KeyboardActions.boxLeft]:      (b,c) => c.boxLeft(b),
    [KeyboardActions.boxRight]:     (b,c) => c.boxRight(b),
    [KeyboardActions.boxUp]:        (b,c) => c.boxUp(b),
    [KeyboardActions.boxDown]:      (b,c) => c.boxDown(b),
    [KeyboardActions.nextError]:    (b,c) => c.nextError(b),
    [KeyboardActions.prevError]:    (b,c) => c.previousError(b),
    [KeyboardActions.clearCell]:    (b,c) => c.clear(b.cursor)
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
        readonly controller: IBoardController,
        readonly bindings = defaultMap
    ) { }

    get map() { 
        return this.bindings;
    };

    onKey(keyPress: IKeyPress) {
        if (keyPress.code.match(rxNumberInput)) {
            this.digitHandler(keyPress);
            return;
        }
    
        let input = (keyPress.shiftKey ? 'shift+' + keyPress.key : keyPress.key).toLowerCase();
        const actions = this.map[input];
    
        if (!actions) { return; }
    
        keyPress.preventDefault();
        for (let action of actions) {
            actionMap[action](this.board, this.controller);
        }
    }
    
    private digitHandler(keyPress: IKeyPress): void {
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
            this.controller.setCellValue(this.board.cursor, num);
            return;
        }
        
        if (num > 0 && num < 10) {
            keyPress.preventDefault();
            if (this.board.cursor.value > 0) {
                // If cell already has a value set, update it
                this.controller.setCellValue(this.board.cursor, num);
            }
            else {
                // Otherwise flip the candidate selection
                this.controller.toggleCandidate(this.board.cursor, num);
            }
        }
    }
}

export function create(board: IBoard, controller: IBoardController, map = defaultMap) {
    let kc = new KeyboardController(board, controller, map);
    document.addEventListener('keydown', event => { kc.onKey(event); });
    return kc;
}


