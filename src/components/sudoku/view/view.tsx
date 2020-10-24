import type { IBoardController } from '../controller';
import type { IBoard } from '../board';
import Board from './board';
import Controls from './controls';
import React from 'react';
import ReactDOM from 'react-dom';
import { hot } from "react-hot-loader";
import { Theme, ThemeProvider, createMuiTheme } from '@material-ui/core';
import CssBaseline from '@material-ui/core/CssBaseline';
import './board.css';
import AppInterfaces from './interfaces/interfaces';


type ViewProperties = {
    model:      IBoard,
    controller: IBoardController,
    theme:      Theme
};

export const Yaws = (props: ViewProperties) => (
    <ThemeProvider theme={props.theme}>
        <CssBaseline />
        <div className="yaws">
            <AppInterfaces />
            <div className="game-ui">
                <Board      model={props.model} controller={props.controller} />
                <Controls   board={props.model} controller={props.controller} />
            </div>
        </div>
    </ThemeProvider>
);

export function init(board: IBoard, controller: IBoardController, containerId: string) {
    const container = document.getElementById(containerId);

    scaleToViewport();
    window.addEventListener('resize', scaleToViewport);

    const dark = createMuiTheme({
        palette: {
            type: 'dark',
        },
    });

    return () => ReactDOM.render(<Yaws model={board} controller={controller} theme={dark} />, container);
}


function scaleToViewport() {
    const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
    const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
    
    const vmin = 320;

    // TODO: Hardcoding dimensions of menu and controls for the time being
    const menuSize = 57;
    const controlsSize = 184;
    
    const vsize = Math.max(vw, vh) - (menuSize + controlsSize);
    
    const scale = Math.max(1, Math.min(2, vsize/vmin));

    document.documentElement.style.setProperty('--yaws-scale', scale.toString());
}

export default hot(module)(Yaws);