import { IBoard }                   from '@components/sudoku/interfaces';
import { init as boardViewInit }    from '@components/sudoku/view/yaws';
//import { init as toolViewInit }     from '@components/tool-panels/tools';
import { IStorageCollection }       from '@components/storage/interfaces';
import './page.css';

export function init(board: IBoard, store: IStorageCollection<Uint8Array>, parent: string) {
    const page = Object.create(null,
        { board: { value : boardViewInit(board, 'sudoku') }
        //, tools: { value : toolViewInit('tool-root') }
        }
    );

    Object.freeze(page);
    return page;
}

export { init as default }
