import { compose }          from 'ramda';
import { IBoard, ICell }    from '../interfaces';

export interface ICellController {
    setCellValue:       (cell: ICell, value: number) => void;
    toggleCandidate:    (cell: ICell, value: number) => void;
    clearCell:          (cell: ICell) => void;
}

export interface IBoardController extends ICellController {
    moveCursor: (board: IBoard, cell: ICell) => void;
}

const Controller: IBoardController = {
    toggleCandidate: (cell: ICell, value: number) => {
        let candidate = cell.candidates[value - 1];
        candidate.isSelected = !candidate.isSelected;
    },
    
    setCellValue: (cell: ICell, value: number) => {
        // if there is already a set value in the cursor cell and the new one is the same, clear the value instead.
        cell.value = cell.value > 0 && cell.value === value ? 0 : value;
    },
    
    clearCell: (cell: ICell) => {
        if (cell.value > 0) {
            // If the cell has a value clear it
            cell.value = 0;
        }
        else {
            // If it doesn't, proceed to clearing the candidates/notes
            cell.candidates.forEach(c => c.isSelected = false);
        }
    },

    moveCursor: (board: IBoard, cell: ICell) => {
        board.cursor.cell = cell;
    }
}

export function create(refresh: () => void): IBoardController {
    return {
        toggleCandidate : compose(refresh, Controller.toggleCandidate),
        setCellValue    : compose(refresh, Controller.setCellValue),
        clearCell       : compose(refresh, Controller.clearCell),
        moveCursor      : compose(refresh, Controller.moveCursor)
    };
}
