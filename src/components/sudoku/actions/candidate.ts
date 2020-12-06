import type { IBoard } from "../models/board";
import type { ICell } from "../models/cell";
import type { ICandidate } from "../models/candidate";

export interface ICandidateActions {
    toggle: (board: IBoard, cell: ICell, candidate: ICandidate | number) => void;
}

export const createCandidateActions = (): ICandidateActions => ({
    toggle: function(board: IBoard, cell: ICell, candidate: ICandidate | number) {
        if (board.getCursor() !== cell) {
            board.setCursor(cell);
        }

        let model = typeof candidate === "number"
            ? cell.candidates[candidate - 1]
            : candidate;

        model.setSelected(!model.isSelected());
    }
});