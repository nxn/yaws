export type TSudokuPuzzle = string | number[];

export enum ModelType   { 
    Board       = "Board",
    Cell        = "Cell",
    Candidate   = "Candidate"
};

export interface IModel { 
    type:   ModelType;
    events: IEventManager;
}

export interface IBoard extends IModel {
    type:           ModelType.Board;
    id:             string;
    cells:          ICell[];
    rows:           ISet[];
    columns:        ISet[];
    boxes:          ISet[];
    getCursor:      () => ICell;
    setCursor:      (to: ICell, silent?: boolean) => void;
    isLoaded:       () => boolean;
    setLoaded:      (value: boolean, silent?: boolean) => void;
    validate:       (silent: boolean) => IBoard;
    clear:          (silent: boolean) => IBoard;
    reset:          (silent: boolean) => IBoard;
}

export interface ICell extends IModel {
    type:           ModelType.Cell;
    id:             string;
    name:           string;
    index:          number;
    row:            ISet;
    column:         ISet;
    box:            ISet;
    rcb:            Set<ICell>;
    candidates:     ICandidate[];
    getValue:       () => number;
    setValue:       (value: number, silent?: boolean, validate?: boolean) => void;
    isStatic:       () => boolean;
    setStatic:      (value: boolean, silent?: boolean) => void;
    isValid:        () => boolean;
    setValid:       (value: boolean, silent?: boolean) => void;
    clear:          (silent: boolean) => void;
}

export interface ICandidate extends IModel {
    type:           ModelType.Candidate;
    value:          number;
    isValid:        () => boolean;
    setValid:       (value: boolean, silent?: boolean) => void;
    isSelected:     () => boolean;
    setSelected:    (value: boolean, silent?: boolean) => void;
}

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

export interface ICandidateController {
    toggleCandidate:    (board: IBoard, cell: ICell, candidate: ICandidate | number) => void;
}

export interface ICellController extends ICandidateController {
    setCellValue:       (board: IBoard, cell: ICell, value: number) => void;
    clear:              (board: IBoard, cell: ICell) => void;
}

export interface ICursorController {
    setCursor:      (board: IBoard, cell: ICell) => void;
    columnLeft:     (board: IBoard) => void;
    columnRight:    (board: IBoard) => void;
    rowUp:          (board: IBoard) => void;
    rowDown:        (board: IBoard) => void;
    boxLeft:        (board: IBoard) => void;
    boxRight:       (board: IBoard) => void;
    boxUp:          (board: IBoard) => void;
    boxDown:        (board: IBoard) => void;
    previousError:  (board: IBoard) => void;
    nextError:      (board: IBoard) => void;
}

export interface IBoardController extends ICellController, ICursorController { }

export interface IEventManager {
    on:         (eventName: string, listener: (...args: any[]) => any) => void;
    fire:       (eventName: string, ...eventArgs: any[]) => void;
    detach:     (eventName: string, listener: (...args: any[]) => any) => boolean;
    detachAll:  (eventName: string) => boolean;
    clear:      () => void;
    stop:       () => void;
    start:      () => void;
    isStopped:  () => boolean;
}

export interface IEventStore {
    get: (modelType: ModelType) => IEventManager;
}

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