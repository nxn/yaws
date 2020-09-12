import config                                   from './config';
import { storage, proxies }                     from '@components/storage/storage';
import { create as createBoard }                from '@components/sudoku/board';
import { create as createStateManager }         from '@components/sudoku/statemanager';
import { create as createController }           from '@components/sudoku/controller';
import { create as createKeyboardController }   from '@components/sudoku/keyboard';
import { init as initView }                     from '@components/sudoku/view/yaws';
import { init as initPage }                     from '@components/page/page';
import { waffleIron }                           from '@components/web-workers/waffle-iron';

function init() {
    const board = createBoard();
    const state = createStateManager(board);
    const puzzleStore = storage(config.appName || 'yaws').data<Uint8Array>('puzzle', proxies.compress);

    let render = () => {};
    const controller = createController(() => render());
    render = initView(board, controller, 'sudoku');
    createKeyboardController(board, controller);
    initPage();
    render();

    // check if URL contains puzzle
    if (false) {
        state.loadLink(location.toString())
        render();
    }
    else if (!puzzleStore.empty) {
        state.loadBinary(puzzleStore.mostRecent.buffer)
        render();
    }
    else {
        waffleIron.generate(
            { samples: 15, iterations: 29, removals: 2}
        ).then(response => {
            state.loadTypedArray(response.puzzle);
            render();
        });
    }
};

init();
