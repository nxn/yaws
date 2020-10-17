import type { IBoardController } from '../controller';
import type { IBoard } from '../board';
import { Board } from './board';
import { Controls } from './controls';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import './board.css';

type ViewProperties = {
    model:      IBoard,
    controller: IBoardController
};

export const Yaws = (props: ViewProperties) => (
    <div className="yaws">
        <Board      model={props.model} controller={props.controller} />
        <Controls   board={props.model} controller={props.controller} />
    </div>
);

export function init(board: IBoard, controller: IBoardController, containerId: string) {
    const container = document.getElementById(containerId);

    scaleToViewport();
    window.addEventListener('resize', scaleToViewport);

    return () => ReactDOM.render(<Yaws model={board} controller={controller} />, container);
}

function scaleToViewport() {
    const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
    const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
    
    const vmin = 320;
    const vsize = Math.min(vw, vh);
    
    const scale = Math.max(1, Math.min(2, vsize/vmin));

    document.documentElement.style.setProperty('--yaws-scale', scale.toString());
}