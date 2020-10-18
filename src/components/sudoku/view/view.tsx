import type { IBoardController } from '../controller';
import type { IBoard } from '../board';
import Board from './board';
import Controls from './controls';
import React from 'react';
import ReactDOM from 'react-dom';
import { hot } from "react-hot-loader";
import ScopedCssBaseline from '@material-ui/core/ScopedCssBaseline';
import './board.css';
import Dialogs from './dialogs/container';

type ViewProperties = {
    model:      IBoard,
    controller: IBoardController
};

export const Yaws = (props: ViewProperties) => (
    <ScopedCssBaseline>
        <div className="yaws">
            <Board      model={props.model} controller={props.controller} />
            <Controls   board={props.model} controller={props.controller} />
            <Dialogs />
        </div>
    </ScopedCssBaseline>
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

export default hot(module)(Yaws);