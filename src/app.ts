import config                                   from './config';
import * as page                                from '@components/page/page';
import { storage, proxies }                     from '@components/storage/storage';
import { create as createBoard }                from '@components/sudoku/board';
import { create as createStateManager }         from '@components/sudoku/statemanager';
import { create as createKeyboardController }   from '@components/sudoku/keyboard';
import { waffleIron }                           from '@components/web-workers/waffle-iron';

import * as view from '@components/sudoku/view/yaws';

function init() {
    const board     = createBoard();
    const state     = createStateManager(board);
    const puzzleStore = storage(config.appName || 'yaws').data<Uint8Array>('puzzle', proxies.compress);

    const controller = view.init(board, 'sudoku');

    createKeyboardController(board, controller);
    
    // check if URL contains puzzle
    if (false) {
        state.loadLink(location.toString())
        controller.refresh();
    }
    else if (!puzzleStore.empty) {
        state.loadBinary(puzzleStore.mostRecent.buffer)
        controller.refresh();
    }
    else {
        waffleIron.generate(
            { samples: 15, iterations: 29, removals: 2}
        ).then(response => {
            state.loadTypedArray(response.puzzle);
            controller.refresh();
        });
    }

    page.init();
    //window["wi"] = waffleIron;
    //wi.generate().then(function(r) { return wi.solve({ puzzle: r.puzzle }); }).then(function(r) { console.log(r) });
};

init();
