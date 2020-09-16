import config                               from './config';
import { createStore as createEventStore }  from '@components/sudoku/events';
import { create as createBoard }            from '@components/sudoku/board';
import { create as createStateManager }     from '@components/sudoku/statemanager';
import { create as createBoardController }  from '@components/sudoku/controller';
import { create as createKeyboardHandler }  from '@components/sudoku/keyboard';
import { init as initView }                 from '@components/sudoku/view/view';
import { init as initPage }                 from '@components/page/page';
import { storage, proxies }                 from '@components/storage/storage';
import { waffleIron }                       from '@components/web-workers/waffle-iron';

function init() {
    const eventStore    = createEventStore();
    const board         = createBoard(eventStore);
    const controller    = createBoardController();
    const keyboard      = createKeyboardHandler(board, controller);
    const state         = createStateManager(board);
    const puzzleStore   = storage(config.appName || 'yaws').data<Uint8Array>('puzzle', proxies.compress);

    initPage();
    const render = initView(board, controller, 'sudoku');
    document.addEventListener(
        'keydown', event => { keyboard.onKey(event); }
    );

    // check if URL contains puzzle
    if (false) {
        state.loadLink(location.toString())
    }
    else if (!puzzleStore.empty) {
        state.loadBinary(puzzleStore.mostRecent.buffer)
    }
    else {
        waffleIron.generate(
            { samples: 15, iterations: 29, removals: 2}
        ).then(response => {
            state.loadTypedArray(response.puzzle);
        });
    }

    render();
};

init();
