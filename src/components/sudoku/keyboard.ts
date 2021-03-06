import type { IBoard } from "./models/board";
import type { IActions } from "./actions/actions";

const rxNumberInput = /(?:Digit|Numpad)([1-9])/i;

export enum KeyboardActions {
    left        = "Left",
    right       = "Right",
    up          = "Up",
    down        = "Down",
    boxLeft     = "Box Left",
    boxRight    = "Box Right",
    boxUp       = "Box Up",
    boxDown     = "Box Down",
    nextError   = "Next Error",
    prevError   = "Previous Error",
    clearCell   = "Clear Cell",
    save        = "Save Game",
    resetBoard  = "Reset Board",
    getLink     = "Get Link"
}

export interface IKeyboardHandler {
    map:    { [key: string]: KeyboardActions[] }
    onKey:  (key: IKeyPress) => void;
}

export interface IKeyPress {
    key: string;
    code: string;
    shiftKey: boolean;
    preventDefault: () => void;
}

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

const actionMap: { [key: string]: (board: IBoard, actions: IActions) => void } = {
    [KeyboardActions.left]:         (b,c) => c.cursor.columnLeft(b),
    [KeyboardActions.right]:        (b,c) => c.cursor.columnRight(b),
    [KeyboardActions.up]:           (b,c) => c.cursor.rowUp(b),
    [KeyboardActions.down]:         (b,c) => c.cursor.rowDown(b),
    [KeyboardActions.boxLeft]:      (b,c) => c.cursor.boxLeft(b),
    [KeyboardActions.boxRight]:     (b,c) => c.cursor.boxRight(b),
    [KeyboardActions.boxUp]:        (b,c) => c.cursor.boxUp(b),
    [KeyboardActions.boxDown]:      (b,c) => c.cursor.boxDown(b),
    [KeyboardActions.nextError]:    (b,c) => c.cursor.nextError(b),
    [KeyboardActions.prevError]:    (b,c) => c.cursor.previousError(b),
    [KeyboardActions.clearCell]:    (b,c) => c.cell.clear(b, b.getCursor())
};

export class KeyboardHandler implements IKeyboardHandler {
    private constructor(
        readonly board: IBoard,
        readonly actions: IActions,
        readonly bindings = defaultMap
    ) { }

    static create(board: IBoard, actions: IActions, map = defaultMap): IKeyboardHandler {
        return new KeyboardHandler(board, actions, map);
    }

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
            actionMap[action](this.board, this.actions);
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
            this.actions.cell.setValue(this.board, this.board.getCursor(), num);
            return;
        }
        
        if (num > 0 && num < 10) {
            keyPress.preventDefault();
            if (this.board.getCursor().getValue() > 0) {
                // If cell already has a value set, update it
                this.actions.cell.setValue(this.board, this.board.getCursor(), num);
            }
            else {
                // Otherwise flip the candidate selection
                this.actions.candidate.toggle(this.board, this.board.getCursor(), num);
            }
        }
    }
}
