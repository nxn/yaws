import config               from './config';
import { EventManager }     from '@components/sudoku/events';
import { Board }            from '@components/sudoku/board';
import { StateManager }     from '@components/sudoku/statemanager';
import { BoardController }  from '@components/sudoku/controller';
import { KeyboardHandler }  from '@components/sudoku/keyboard';
import { init as initView } from '@components/sudoku/view/view';
import { init as initPage } from '@components/page/page';
import { storage, proxies } from '@components/storage/storage';
import { waffleIron }       from '@components/web-workers/waffle-iron';

function init() {
    const events        = EventManager.create();
    const board         = Board.create(events);
    const controller    = BoardController.create();
    const keyboard      = KeyboardHandler.create(board, controller);
    const state         = StateManager.create(board);
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
        const generateStart = 'generate start';
        performance.mark(generateStart);

        waffleIron.generate(
            { samples: 15, iterations: 29, removals: 2}
        ).then(response => {
            const generateEnd = 'generate end';
            performance.mark(generateEnd);
            performance.measure("Generate", generateStart, generateEnd);

            const loadStart = 'load start';
            performance.mark(loadStart);

            state.loadTypedArray(response.puzzle);

            const loadEnd = 'load end';
            performance.mark(loadEnd);
            performance.measure("Load", loadStart, loadEnd);

            const measurements = performance.getEntriesByType("measure");
            performance.clearMarks();
            performance.clearMeasures();

            const el = document.querySelector("#performance");
            for(const m of measurements) {
                el.append(`- ${m.name}: ${m.duration} -`);
            }
        });
    }

    const renderStart = 'render start';
    performance.mark(renderStart);

    render();

    const renderEnd = 'render end';
    performance.mark(renderEnd);
    performance.measure("Render", renderStart, renderEnd);
};

init();
