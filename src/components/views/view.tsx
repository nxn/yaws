import type { IBoardController } from '@components/sudoku/controller';
import type { IBoard } from '@components/sudoku/board';


import PuzzleView   from './puzzle/puzzleview';
import AccountView  from './account/accountview';
import SettingsView from './settings/settingsview';
import HelpView     from './help/helpview';


import AppBar, { AppBarTab as Tab } from './menu/appbar';
import Tabs from '@material-ui/core/Tabs';
import Typography from '@material-ui/core/Typography';

import React from 'react';
import ReactDOM from 'react-dom';
import { hot } from 'react-hot-loader';
import clsx from 'clsx';
import { Theme, ThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';

import cabinCondensedWoff   from './fonts/cabincondensed-bold-digits.woff';
import cabinCondensedWoff2  from './fonts/cabincondensed-bold-digits.woff2';
import robotoMonoWoff       from './fonts/robotomono-bold-digits.woff';
import robotoMonoWoff2      from './fonts/robotomono-bold-digits.woff2';

import GridIcon from '@material-ui/icons/GridOn';
import AccountIcon from '@material-ui/icons/Person';
import SettingsIcon from '@material-ui/icons/Settings';
import HelpIcon from '@material-ui/icons/Help';

import { experimentalStyled as styled } from '@material-ui/core/styles';
import { Global } from '@emotion/react';

const TabLabel = (props: { children: React.ReactChild }) => (
    <Typography component="span" variant="body1">{ props.children }</Typography>
);

type ViewProperties = {
    model:      IBoard,
    controller: IBoardController,
    // Cannot be named 'theme', otherwise it will be overwritten by material ui's 'styled' function which uses that name
    // to propagate any existing theme to the style object. As no theme has been set yet, it gets overwritten by
    // 'undefined'.
    muiTheme:   Theme,
    className?: string
};

export const Yaws = (props: ViewProperties) => {
    const [view, setView] = React.useState(0);

    const switchView = (_: any, view: number) => {
        setView(view);
    };

    return <>
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

            <div className={ clsx('yaws-root', props.className) }>
                <AppBar>
                    <Tabs orientation="vertical" value={ view } onChange={ switchView } aria-label="Navigation">
                        <Tab icon={<GridIcon />} label={<TabLabel>Puzzle</TabLabel>} />
                        <Tab icon={<AccountIcon />} label={<TabLabel>Account</TabLabel>} disabled />
                        <Tab icon={<SettingsIcon />} label={<TabLabel>Settings</TabLabel>} />
                        <Tab icon={<HelpIcon />} label={<TabLabel>Help</TabLabel>} />
                    </Tabs>
                </AppBar>

                <div className="views">
                    <PuzzleView   className={ clsx(view !== 0 && 'hidden') } model={ props.model } controller={ props.controller } />
                    <AccountView  className={ clsx(view !== 1 && 'hidden') } />
                    <SettingsView className={ clsx(view !== 2 && 'hidden') } />
                    <HelpView     className={ clsx(view !== 3 && 'hidden') } />
                </div>
            </div>
        </ThemeProvider>
    </>;
}

export const View = styled(Yaws)({
    display:    'flex',
    flexFlow:   'row nowrap',

    '& .app-menu':      { flexShrink: 0 },
    '& .views':         { flexGrow: 1 },
    //'& .views > .view': { height: '100vh' },
    '& .hidden':        { display: 'none' }
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