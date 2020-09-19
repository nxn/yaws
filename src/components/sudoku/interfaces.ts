export type TSudokuPuzzle = string | number[];

export type ModelType = "Board" | "Cell" | "Candidate";
export const ModelType = {
    get Board(): ModelType      { return "Board"; },
    get Cell(): ModelType       { return "Cell"; },
    get Candidate(): ModelType  { return "Candidate"; }
}

export interface IModel { 
    type:   ModelType;
    events: IEventStore;
}

export interface IBoard extends IModel {
    type:           "Board";
    id:             string;
    cells:          ICell[];
    rows:           ISet[];
    columns:        ISet[];
    boxes:          ISet[];
    getCursor:      () => ICell;
    setCursor:      (to: ICell, silent?: boolean) => void;
    isReady:        () => boolean;
    setReady:       (value: boolean, silent?: boolean) => void;
    validate:       (silent?: boolean) => IBoard;
    clear:          (silent?: boolean) => IBoard;
    reset:          (silent?: boolean) => IBoard;
}

export interface ICell extends IModel {
    type:           "Cell";
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
    clear:          (silent?: boolean) => void;
}

export interface ICandidate extends IModel {
    type:           "Candidate";
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

export type EventListener = (...args: any[]) => void;
import {
    IGenerationalIndexAllocator         as IEventListenerKeyAllocator,
    IGenerationalIndex                  as IEventListenerKey,
    IGenerationalIndexArray             as IEventListenerArray,
    IGenerationalIndexArrayIterator     as IEventListenerIterator,
    createGenerationalIndexAllocator    as createEventListenerKeyAllocator,
    createGenerationalIndexArray        as createEventListenerArray
} from './garray';
export {
    IEventListenerKeyAllocator,
    IEventListenerKey,
    IEventListenerArray,
    IEventListenerIterator,
    createEventListenerKeyAllocator,
    createEventListenerArray
}

export interface IEventManager {
    get: (type: ModelType, eventName: string) => IEvent;
    type: (type: ModelType) => IEventStore;
}

export interface IEventStore {
    get: (eventName: string) => IEvent;
}

export interface IEvent {
    attach:     (listener: (...args: any[]) => any) => IEventListenerKey;
    fire:       (...eventArgs: any[]) => void;
    detach:     (listenerKey: IEventListenerKey) => boolean;
    stop:       () => void;
    start:      () => void;
    isStopped:  () => boolean;
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