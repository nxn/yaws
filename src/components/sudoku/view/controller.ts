import { ICandidateController } from './candidate';
import { ICellController } from './cell';
import { IBoard, ICell, ICellCandidate } from '../interfaces';

export type YawsController = ICellController & ICandidateController;

export function createYawsController(board: IBoard, onUpdate: () => void): YawsController {
    const toggleSelect = (candidate: ICellCandidate) => {
        candidate.selected = !candidate.selected;
        onUpdate();
    };
    const setCellValue = (candidate: ICellCandidate) => {
        candidate.cell.value = candidate.value;
        onUpdate();
    };
    const clearCellValue = (cell: ICell) => {
        cell.value = 0;
        onUpdate();
    };
    const setCursor = (cell: ICell) => {
        board.cursor.cell = cell;
        onUpdate();
    };

    const controller = Object.create(null, {
        toggleSelect:   { value: toggleSelect },
        setCellValue:   { value: setCellValue },
        clearCellValue: { value: clearCellValue },
        setCursor:      { value: setCursor }
    });

    Object.freeze(controller);

    return controller;
}