import type { IBoardController } from '../controller';
import type { IBoard } from '../board';
import Board from './board';
import Controls from './controls';
import React from 'react';
import ReactDOM from 'react-dom';
import { hot } from "react-hot-loader";
import { Theme, ThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';

import cabinCondensedWoff   from './fonts/cabincondensed-bold-digits.woff';
import cabinCondensedWoff2  from './fonts/cabincondensed-bold-digits.woff2';
import robotoMonoWoff       from './fonts/robotomono-bold-digits.woff';
import robotoMonoWoff2      from './fonts/robotomono-bold-digits.woff2';

import AppInterfaces from './interfaces/interfaces';

import { experimentalStyled as styled } from '@material-ui/core/styles';
import clsx from 'clsx';
import { Global } from '@emotion/react';


type ViewProperties = {
    model:      IBoard,
    controller: IBoardController,
    muiTheme:   Theme,
    className?: string
};

export const Yaws = (props: ViewProperties) => <>
    <Global styles={[ {
        ':focus':               { outline: 'none' },
        '::-moz-focus-inner':   { border: 0 }
    }, {
        '@font-face': {
            fontFamily: '"Cabin Condensed"',
            fontStyle: 'normal',
            fontWeight: 700,
            fontDisplay: 'swap',
            src: `url("${ cabinCondensedWoff2 }") format("woff2"), url("${ cabinCondensedWoff }") format("woff")`
        }
    }, {
        '@font-face':  {
            fontFamily: '"Roboto Mono"',
            fontStyle: 'normal',
            fontWeight: 700,
            fontDisplay: 'swap',
            src: `url("${ robotoMonoWoff2 }") format("woff2"), url("${ robotoMonoWoff }") format("woff")`
        }
    } ]} />

    <ThemeProvider theme={ props.muiTheme }>
        <CssBaseline />

        <div className={ props.className }>
            <AppInterfaces />
            <div className="game-ui">
                <Board      model={props.model} controller={props.controller} scale={2.0} />
                {/* <Controls   board={props.model} controller={props.controller} /> */}
            </div>
        </div>
    </ThemeProvider>
</>;

export const View = styled(Yaws)({
    display:    'flex',
    flexFlow:   'row nowrap',

    '& .app-ui': { flexShrink: 0 },
    '& .game-ui': {
        flexGrow:       1,
        height:         '100vh',

        display:        'flex',
        flexFlow:       'column nowrap',
        alignItems:     'center',
        justifyContent: 'center'
    },
    '& .board': { flexGrow: 0 }
});

export function init(board: IBoard, controller: IBoardController, containerId: string) {
    const container = document.getElementById(containerId);

    //scaleToViewport();
    //window.addEventListener('resize', scaleToViewport);

    const light  = createMuiTheme({
        palette: {
            mode: 'light',
            primary: {
                light: '#62727b',
                main: '#37474f',
                dark: '#102027',
                contrastText: '#fff',
            },
            secondary: {
                light: '#8e99f3',
                main: '#5c6bc0',
                dark: '#26418f',
                contrastText: '#fff',
            },
        }
    });

    const dark = createMuiTheme({
        palette: {
            mode: 'dark',
            primary: {
                light: '#eeffff',
                main: '#bbdefb',
                dark: '#8aacc8',
                contrastText: '#000',
            },
            secondary: {
                light: '#e6ceff',
                main: '#b39ddb',
                dark: '#836fa9',
                contrastText: '#000',
            },
        }
    });

    return () => ReactDOM.render(<View model={board} controller={controller} muiTheme={dark} />, container);
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

    //document.documentElement.style.setProperty('--yaws-scale', scale.toString());
}

//export default hot(module)(View);