import type { IPuzzleActions } from '@components/sudoku/actions/puzzle';
import type { ICellActions } from '@components/sudoku/actions/cell';
import type { ICursorActions } from '@components/sudoku/actions/cursor';
import type { ICandidateActions } from '@components/sudoku/actions/candidate';

export interface IActions {
    puzzle:     IPuzzleActions,
    cell:       ICellActions,
    cursor:     ICursorActions,
    candidate:  ICandidateActions
}

export type { IPuzzleActions, ICellActions, ICursorActions, ICandidateActions };
