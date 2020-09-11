import { IBoard, ICell, ICandidate, ICursor, ModelType } from '../interfaces';
import { curry, pipe } from '@components/utilities/misc';

export interface ICandidateController {
    toggleCandidate:    (model: ICandidate) => void;
    setCellValue:       (model: ICandidate) => void;
}

export interface ICellController extends ICandidateController {
    clearCellValue:     (cell: ICell) => void;
    setCursor:          (cell: ICell) => void;
}

export interface ICursorController {
    clearCursor:        (cursor: ICursor) => void;
    setCellValue:       (cursor: ICursor, value: number) => void;
    toggleCandidate:    (cursor: ICursor, value: number) => void;
}

export type YawsController = ICellController & ICursorController & ICandidateController;

export function createYawsController(board: IBoard, onUpdate: () => void): YawsController {
    const controller: YawsController = Object.create(null, {
        toggleCandidate:    { value: pipe(toggleCandidate,          onUpdate) },
        setCellValue:       { value: pipe(setCellValue,             onUpdate) },
        clearCellValue:     { value: pipe(clearCellValue,           onUpdate) },
        setCursor:          { value: pipe(curry(setCursor)(board),  onUpdate) },
        clearCursor:        { value: pipe(clearCursor,              onUpdate) }
    });

    Object.freeze(controller);
    return controller;
}

function toggleCandidate(target: ICandidate | ICursor, digit?: number) {
    if (target.type === ModelType.Candidate) {
        target.isSelected = !target.isSelected;
        return;
    }

    if (!digit) { return; }

    let candidate = target.cell.candidates[digit - 1];
    candidate.isSelected = !candidate.isSelected;
};

function setCellValue(target: ICandidate | ICursor, digit?: number) {
    if (target.type === ModelType.Candidate) {
        target.cell.value = target.value;
    }
    
    if (!digit) { return; }

    target.cell.value = digit;
}

function clearCellValue(cell: ICell) {
    cell.value = 0;
}
    
function setCursor(board: IBoard, cell: ICell) {
    board.cursor.cell = cell;
}

function clearCursor(cursor: ICursor) {
    cursor.clear();
}
