import type { IBoard } from "../models/board";
import type { ICell } from "../models/cell";

export interface ICellActions {
    setValue:   (board: IBoard, cell: ICell, value: number) => void;
    clear:      (board: IBoard, cell: ICell) => void;
}

export const createCellActions = (): ICellActions => ({
    setValue: function(board: IBoard, cell: ICell, value: number) {
        if (board.getCursor() !== cell) {
            board.setCursor(cell);
        }

        // if there is already a set value in the cursor cell and the new one is the same, clear the value instead.
        cell.setValue(cell.getValue() > 0 && cell.getValue() === value ? 0 : value);
    },
    
    clear: function(board: IBoard, cell: ICell) {
        if (board.getCursor() !== cell) {
            board.setCursor(cell);
        }

        if (cell.getValue() > 0) {
            // If the cell has a value clear it
            cell.setValue(0);
        }
        else {
            // If it doesn't, proceed to clearing the candidates/notes
            cell.candidates.forEach(c => { c.setSelected(false); });
        }
    }
})