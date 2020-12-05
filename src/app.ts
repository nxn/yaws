import config               from './config';
import { EventManager }     from '@components/sudoku/events';
import { Board }            from '@components/sudoku/models/board';
import { PuzzleManager }     from '@components/sudoku/models/puzzle';
import { BoardController }  from '@components/sudoku/controllers/board';
import { KeyboardHandler }  from '@components/sudoku/keyboard';
import { init as initView } from '@components/view/view';
import { storage, proxies } from '@components/storage/storage';
import { waffleIron }       from '@components/workers/waffle-iron';

function init() {
    const events        = EventManager.create();
    const board         = Board.create(events);
    const controller    = BoardController.create();
    const keyboard      = KeyboardHandler.create(board, controller);
    const puzzleStore   = storage(config.appName || 'yaws').data<Uint8Array>('puzzle', proxies.compress);
    const puzzle        = PuzzleManager.create(board, puzzleStore, waffleIron);
    

    const render = initView(board, controller, 'sudoku');
    document.addEventListener(
        'keydown', event => { keyboard.onKey(event); }
    );

    // check if URL contains puzzle
    if (false) {
        puzzle.openLink(location.toString())
    }
    else if (!puzzleStore.empty) {
        puzzle.openMostRecent();
    }
    else {
        puzzle.generate({ samples: 15, iterations: 29, removals: 2 });
    }

    const renderStart = 'render start';
    performance.mark(renderStart);

    render();

    const renderEnd = 'render end';
    performance.mark(renderEnd);
    performance.measure("Render", renderStart, renderEnd);
};

init();
