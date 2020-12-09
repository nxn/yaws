import config               from './config';
import emailConfig          from './emailjs';

import { init as emailInit }    from 'emailjs-com';
import { EventManager }         from '@components/sudoku/events';
import { Board }                from '@components/sudoku/models/board';
import { KeyboardHandler }      from '@components/sudoku/keyboard';
import { init as initView }     from '@components/view/view';
import { storage, proxies }     from '@components/storage/storage';
import { waffleIron }           from '@components/workers/waffle-iron';

import { createBoardActions }       from '@components/sudoku/actions/board';
import { createPuzzleActions  }     from '@components/sudoku/actions/puzzle';
import { createCandidateActions }   from '@components/sudoku/actions/candidate';
import { createCellActions }        from '@components/sudoku/actions/cell';
import { createCursorActions }      from '@components/sudoku/actions/cursor';

function init() {
    emailInit(emailConfig.userID);

    const events    = EventManager.create();
    const puzzles   = storage(config.appName || 'yaws').data<Uint8Array>('puzzle', proxies.compress);

    const models = {
        board: Board.create(events)
    }

    const actions = {
        board:      createBoardActions(),
        puzzle:     createPuzzleActions(puzzles, waffleIron),
        cell:       createCellActions(),
        cursor:     createCursorActions(),
        candidate:  createCandidateActions()
    }

    const keyboard = KeyboardHandler.create(models.board, actions);

    const render = initView(models.board, actions, keyboard, 'sudoku');

    // check if URL contains puzzle
    let loaded = false;
    
    if (new URLSearchParams(location.search).has('p')) {
        loaded = actions.puzzle.openLink(models.board, location.toString())
    }

    if (!loaded && !puzzles.empty) {
        loaded = actions.puzzle.openMostRecent(models.board);
    }
    
    if (!loaded) {
        actions.puzzle.generate(models.board, { samples: 15, iterations: 29, removals: 2 });
    }

    render();
};

init();
