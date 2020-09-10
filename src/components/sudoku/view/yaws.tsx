import { render as inferno } from 'inferno';

import { IBoard }   from '../interfaces';
import { Board }    from './board';
import { Controls } from './controls';
import { YawsController, createYawsController } from './controller';

import './board.css';

type YawsProperties = { 
    model:      IBoard,
    controller: YawsController
};

export const Yaws = (props: YawsProperties) => (
    <div className="yaws">
        <Board model={props.model} controller={props.controller} />
        <Controls board={props.model} />
    </div>
);

export function init(board: IBoard, containerId: string) {
    const container = document.getElementById(containerId);

    scaleToViewport();
    window.addEventListener('resize', scaleToViewport);

    let render = () => { };
    const controller = createYawsController(board, () => render());
    render = () => inferno(<Yaws model={board} controller={controller} />, container);
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