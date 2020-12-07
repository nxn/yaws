import type { IBoard } from '../models/board';

export interface IBoardActions {
    reset: (board: IBoard) => void;
    clear: (board: IBoard) => void;
}

export const createBoardActions = (): IBoardActions => ({
    reset: function(board: IBoard) {
        board.reset();
    },
    clear: function(board: IBoard) {
        board.clear();
    }
});