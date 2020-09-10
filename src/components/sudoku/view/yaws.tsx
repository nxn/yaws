import { render as inferno } from 'inferno';

import { IBoard }   from '../interfaces';
import { Board }    from './board';
import { Controls } from './controls';

import './board.css';

type TProps = { board: IBoard };

export const Yaws = (props: TProps) => (
    <div className="yaws">
        <Board model={props.board} />
        <Controls board={props.board} />
    </div>
);

export function init(board: IBoard, parent: string) {
    scaleToViewport();
    window.addEventListener('resize', scaleToViewport);

    const render = () => inferno(<Yaws board={board} />, document.getElementById(parent));
    render();
    return render;
}

function scaleToViewport() {
    const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
    const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
    
    const vmin = 320;
    const vsize = Math.min(vw, vh);
    
    const scale = Math.max(1, Math.min(2, vsize/vmin));

    document.documentElement.style.setProperty('--yaws-scale', scale.toString());
}