export type TSudokuPuzzle = string | number[];

export enum ModelType   { Board, Cursor, Cell, Candidate, Set };
export interface IModel { type: ModelType; }

//#region Set
export interface ISet extends IModel {
    type:       ModelType.Set;
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
export interface ICell extends IModel {
    type:           ModelType.Cell;
    id:             string;
    name:           string;
    index:          number;
    value:          number;
    row:            ISet;
    column:         ISet;
    box:            ISet;
    candidates:     ICandidate[];
    isStatic:       boolean;
    isValid:        boolean;
    clear:          () => void;
}

export interface ICandidate extends IModel {
    type:       ModelType.Candidate;
    value:      number;
    //cell:       ICell;
    isValid:    boolean;
    isSelected: boolean;
}
//#endregion

//#region Cursor
export interface ICursor extends IModel {
    type:           ModelType.Cursor;
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
export interface IBoard extends IModel {
    type:       ModelType.Board;
    id:         string;
    cells:      ICell[];
    rows:       ISet[];
    columns:    ISet[];
    boxes:      ISet[];
    cursor:     ICursor;
    isLoaded:   boolean;
    clear:      () => IBoard;
    reset:      () => IBoard;
}
//#endregion

//#region State Manager
export interface IStateManager {
    getString:      () => string;
    loadString:     (puzzle: string) => IBoard;
    getTypedArray:  () => Uint8Array;
    loadTypedArray: (array: Uint8Array) => IBoard;
    getLink:        (includeProgress: boolean, location: ILocation) => string;
    loadLink:       (link: string) => IBoard;
    getData:        (ignoreHiddenCandidates?: boolean) => ICellData[];
    loadData:       (data: ICellData[]) => IBoard;
    getBinary:      (ignoreHiddenCandidates?: boolean) => Uint8Array;
    loadBinary:     (buffer: ArrayBuffer) => IBoard;
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
    shiftKey: boolean;
    preventDefault: () => void;
}
//#endregion
