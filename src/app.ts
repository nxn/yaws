import config               from './config';
import { EventManager }     from '@components/sudoku/events';
import { Board }            from '@components/sudoku/models/board';
import { KeyboardHandler }  from '@components/sudoku/keyboard';
import { init as initView } from '@components/view/view';
import { storage, proxies } from '@components/storage/storage';
import { waffleIron }       from '@components/workers/waffle-iron';

import { createPuzzleActions  }     from '@components/sudoku/actions/puzzle';
import { createCandidateActions }   from '@components/sudoku/actions/candidate';
import { createCellActions }        from '@components/sudoku/actions/cell';
import { createCursorActions }      from '@components/sudoku/actions/cursor';

function init() {
    const events    = EventManager.create();
    const puzzles   = storage(config.appName || 'yaws').data<Uint8Array>('puzzle', proxies.compress);

    const models = {
        board: Board.create(events)
    }

    const actions = {
        puzzle:     createPuzzleActions(puzzles, waffleIron),
        cell:       createCellActions(),
        cursor:     createCursorActions(),
        candidate:  createCandidateActions()
    }

    const keyboard = KeyboardHandler.create(models.board, actions);

    const render = initView(models.board, actions, 'sudoku');
    document.addEventListener(
        'keydown', event => { keyboard.onKey(event); }
    );

    // check if URL contains puzzle
    if (false) {
        actions.puzzle.openLink(models.board, location.toString())
    }
    else if (!puzzles.empty) {
        actions.puzzle.openMostRecent(models.board);
    }
    else {
        actions.puzzle.generate(models.board, { samples: 15, iterations: 29, removals: 2 });
    }

    const renderStart = 'render start';
    performance.mark(renderStart);

    render();

    const renderEnd = 'render end';
    performance.mark(renderEnd);
    performance.measure("Render", renderStart, renderEnd);
};

init();
