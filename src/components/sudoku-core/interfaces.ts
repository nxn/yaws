export type TSudokuPuzzle = string | number[];

//#region Set
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
//#endregion

//#region Cell
export interface ICell {
    id:             string;
    name:           string;
    index:          number;
    value:          number;
    row:            ISet;
    column:         ISet;
    box:            ISet;
    candidates:     ICellCandidate[];
    isStatic:       boolean;
    isValid:        boolean;
    clear:          () => void;
}

export interface ICellCandidate {
    value:      number;
    cell:       ICell;
    isValid:    boolean;
    selected:   boolean;
}
//#endregion

//#region Cursor
export interface ICursor {
    cell:           ICell;
    columnLeft:     () => ICell;
    columnRight:    () => ICell;
    rowUp:          () => ICell;
    rowDown:        () => ICell;
    boxLeft:        () => ICell;
    boxRight:       () => ICell;
    boxUp:          () => ICell;
    boxDown:        () => ICell;
    previousError:  () => ICell;
    nextError:      () => ICell;
    clear:          () => ICell;
}
//#endregion

//#region Board
export interface IBoard {
    id:         string;
    cells:      ICell[];
    rows:       ISet[];
    columns:    ISet[];
    boxes:      ISet[];
    cursor:     ICursor;
    isLoaded:   boolean;
    clear:      () => void;
    reset:      () => void;
}
//#endregion

//#region Game State
export interface IGameState {
    getString:      () => string;
    loadString:     (puzzle: string) => void;
    getTypedArray:  () => Uint8Array;
    loadTypedArray: (array: Uint8Array) => void;
    getLink:        (includeProgress: boolean, location: ILocation) => string;
    loadLink:       (link: string) => void;
    getData:        (ignoreHiddenCandidates?: boolean) => ICellData[];
    loadData:       (data: ICellData[]) => void;
    getBinary:      (ignoreHiddenCandidates?: boolean) => Uint8Array;
    loadBinary:     (buffer: ArrayBuffer) => void;
}

export interface ICellData {
    v: number;
    c: number[];
    s: boolean;
}

export interface ILocation {
    origin: string;
    pathname: string;
}
//#endregion

//#region Keyboard
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

export interface IKeyboardController {
    map:    { [key: string]: KeyboardActions[] }
    onKey:  (key: IKeyPress) => void;
}

export interface IKeyPress {
    key: string;
    code: string;
    preventDefault: () => void;
}
//#endregion

//#region Misc

//#endregion

