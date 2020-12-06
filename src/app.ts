import config               from './config';
import { EventManager }     from '@components/sudoku/events';
import { Board }            from '@components/sudoku/models/board';
import { PuzzleController } from '@components/sudoku/controllers/puzzle';
import { BoardController }  from '@components/sudoku/controllers/board';
import { KeyboardHandler }  from '@components/sudoku/keyboard';
import { init as initView } from '@components/view/view';
import { storage, proxies } from '@components/storage/storage';
import { waffleIron }       from '@components/workers/waffle-iron';

function init() {
    const events            = EventManager.create();
    const board             = Board.create(events);
    const puzzles           = storage(config.appName || 'yaws').data<Uint8Array>('puzzle', proxies.compress);
    const boardController   = BoardController.create(board);
    const puzzleController  = PuzzleController.create(board, puzzles, waffleIron);
    const keyboard          = KeyboardHandler.create(board, boardController);

    const render = initView(board, boardController, 'sudoku');
    document.addEventListener(
        'keydown', event => { keyboard.onKey(event); }
    );

    // check if URL contains puzzle
    if (false) {
        puzzleController.openLink(location.toString())
    }
    else if (!puzzles.empty) {
        puzzleController.openMostRecent();
    }
    else {
        puzzleController.generate({ samples: 15, iterations: 29, removals: 2 });
    }

    const renderStart = 'render start';
    performance.mark(renderStart);

    render();

    const renderEnd = 'render end';
    performance.mark(renderEnd);
    performance.measure("Render", renderStart, renderEnd);
};

init();
