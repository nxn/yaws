import { IBoard, ICell, ICandidate, ICursor, ModelType } from '../interfaces';
import { compose } from '@components/utilities/misc';

export interface ICandidateController {
    toggleCandidate:    (context: { model: IBoard, target: ICandidate }) => void;
    setCellValue:       (context: { model: IBoard, target: ICandidate }) => void;
}

export interface ICellController extends ICandidateController {
    clearCellValue:     (context: { model: IBoard, target: ICell }) => void;
    setCursor:          (context: { model: IBoard, target: ICell }) => void;
}

export interface ICursorController {
    clearCursor:        (context: { model: IBoard, target: ICursor }) => void;
    setCellValue:       (context: { model: IBoard, target: ICursor, value: number }) => void;
    toggleCandidate:    (context: { model: IBoard, target: ICursor, value: number }) => void;
}

const Controller: ICellController & ICursorController = {
    toggleCandidate: (context: { model: IBoard, target: (ICandidate | ICursor), value?: number }) => {
        if (context.target.type === ModelType.Candidate) {
            context.target.isSelected = !context.target.isSelected;
            return;
        }
    
        if (!context.value) { return; }
    
        let candidate = context.target.cell.candidates[context.value - 1];
        candidate.isSelected = !candidate.isSelected;
    },
    
    setCellValue: (context: { model: IBoard, target: ICandidate | ICursor, value?: number }) => {
        if (context.target.type === ModelType.Candidate) {
            // Hack: the only reason this works is because the first click of the double-click event updates the cursor 
            // prior to the value being set. This event should probably propagate down to the cell before being handled.
            context.model.cursor.cell.value = context.target.value;
            return;
        }
        
        if (!context.value) { return; }
    
        context.target.cell.value = context.value;
    },
    
    clearCellValue: (context: { model: IBoard, target: ICell }) => {
        context.target.value = 0;
    },

    setCursor: (context: { model: IBoard, target: ICell }) => {
        context.model.cursor.cell = context.target;
    },

    clearCursor: (context: { model: IBoard, target: ICursor}) => {
        context.target.clear();
    }
}

export function create(refresh: () => void): ICellController & ICursorController {
    return {
        toggleCandidate  : compose(refresh, Controller.toggleCandidate),
        setCellValue     : compose(refresh, Controller.setCellValue),
        clearCellValue   : compose(refresh, Controller.clearCellValue),
        setCursor        : compose(refresh, Controller.setCursor),
        clearCursor      : compose(refresh, Controller.clearCursor)
    }
}
