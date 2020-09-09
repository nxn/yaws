import config                                   from './config';
import * as page                                from '@components/page/page';
import { storage, proxies }                     from '@components/storage/storage';
import { create as createBoard }                from '@components/sudoku/board';
import { createManager as createStateManager }  from '@components/sudoku/gamestate';
import { createKeyboardController }             from '@components/sudoku/keyboard';
import { waffleIron }                           from '@components/web-workers/waffle-iron';

function init() {
    const board     = createBoard();
    const state     = createStateManager(board);
    const keyboard  = createKeyboardController(board);
    const refresh   = page.init(board, null, config.parentSelector);
    const puzzleStore = storage(config.appName || 'yaws').data<Uint8Array>('puzzle', proxies.compress);

    document.addEventListener('keydown', event => {
        keyboard.onKey(event);
        refresh.board();
    });
    
    // check if URL contains puzzle
    if (false) {
        state.loadLink(location.toString())
        refresh.board();
    }
    else if (!puzzleStore.empty) {
        state.loadBinary(puzzleStore.mostRecent.buffer)
        refresh.board();
    }
    else {
        waffleIron.generate(
            { samples: 15, iterations: 29, removals: 2}
        ).then(response => {
            state.loadTypedArray(response.puzzle);
            refresh.board();
        });
    }

    //window["wi"] = waffleIron;
    //wi.generate().then(function(r) { return wi.solve({ puzzle: r.puzzle }); }).then(function(r) { console.log(r) });
};

init();
