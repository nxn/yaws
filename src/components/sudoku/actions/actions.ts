import type { IPuzzleActions } from '@components/sudoku/actions/puzzle';
import type { ICellActions }        from './cell';
import type { ICursorActions }      from './cursor';
import type { ICandidateActions }   from './candidate';
import type { IBoardActions }       from './board';

export interface IActions {
    board:      IBoardActions
    puzzle:     IPuzzleActions,
    cell:       ICellActions,
    cursor:     ICursorActions,
    candidate:  ICandidateActions
}

export type { IBoardActions, IPuzzleActions, ICellActions, ICursorActions, ICandidateActions };
