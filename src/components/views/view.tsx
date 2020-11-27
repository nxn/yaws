import type { IBoardController } from '@components/sudoku/controller';
import type { IBoard } from '@components/sudoku/board';

import PuzzleView,      { IPuzzleViewProperties }       from './puzzle/puzzleview';
import PuzzleTools,     { IPuzzleToolsProperties }      from './puzzle/puzzletools';
import AccountView,     { IAccountViewProperties }      from './account/accountview';
import AccountTools,    { IAccountToolsProperties }     from './account/accounttools';
import SettingsView,    { ISettingsViewProperties }     from './settings/settingsview';
import SettingsTools,   { ISettingsToolsProperties }    from './settings/settingstools';
import HelpView,        { IHelpViewProperties }         from './help/helpview';
import HelpTools,       { IHelpToolsProperties }        from './help/helptools';

import AppBar from './appbar/appbar';
import { TabPanelContainer } from './appbar/tabs';

import React from 'react';
import ReactDOM from 'react-dom';
import { hot } from 'react-hot-loader';
import clsx from 'clsx';
import { Theme, ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';

import cabinCondensedWoff   from './fonts/cabincondensed-bold-digits.woff';
import cabinCondensedWoff2  from './fonts/cabincondensed-bold-digits.woff2';
import robotoMonoWoff       from './fonts/robotomono-bold-digits.woff';
import robotoMonoWoff2      from './fonts/robotomono-bold-digits.woff2';

import GridIcon from '@material-ui/icons/GridOn';
import AccountIcon from '@material-ui/icons/Person';
import SettingsIcon from '@material-ui/icons/Settings';
import HelpIcon from '@material-ui/icons/Help';

import Divider from '@material-ui/core/Divider';

import { experimentalStyled as styled } from '@material-ui/core/styles';
import { Global } from '@emotion/react';

import { NavMenu as Tabs, NavItem as Tab } from './appbar/nav';
import { ViewProvider, IViewContext } from './context';
import { light, dark } from './theme';

import { extend } from './util';

type YawsProperties = {
    model:          IBoard,
    controller:     IBoardController,
    viewInfo: {
        orientation:    'landscape' | 'portrait',
        scale:         number,
        tiny:          boolean
    }
    // Cannot be named 'theme', otherwise it will be overwritten by material ui's 'styled' function which uses that name
    // to propagate any existing theme to the style object. As no theme has been set yet, it gets overwritten by
    // 'undefined'.
    muiTheme:       Theme,
    className?:     string
};

interface ITabPanelView {
    value: string
}

const PuzzleViewTab     = extend<IPuzzleViewProperties,     ITabPanelView>(PuzzleView);
const PuzzleToolTab     = extend<IPuzzleToolsProperties,    ITabPanelView>(PuzzleTools);
const AccountViewTab    = extend<IAccountViewProperties,    ITabPanelView>(AccountView);
const AccountToolTab    = extend<IAccountToolsProperties,   ITabPanelView>(AccountTools);
const SettingsViewTab   = extend<ISettingsViewProperties,   ITabPanelView>(SettingsView);
const SettingsToolTab   = extend<ISettingsToolsProperties,  ITabPanelView>(SettingsTools);
const HelpViewTab       = extend<IHelpViewProperties,       ITabPanelView>(HelpView);
const HelpToolTab       = extend<IHelpToolsProperties,      ITabPanelView>(HelpTools);

export const Yaws = (props: YawsProperties) => {
    const [view, setView] = React.useState('board');

    const switchView = (value: string) => {
        setView(value);
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

            <ViewProvider value={ props.viewInfo }>
                <div className={ clsx('yaws-root', props.className) }>
                    <AppBar className="app-menu">
                        <Tabs value={ view } onChange={ switchView }>
                            <Tab value="board"    label="Board"   icon={ <GridIcon /> } />
                            <Tab value="account"  label="Account"  icon={ <AccountIcon /> } />
                            <Tab value="settings" label="Settings" icon={ <SettingsIcon /> } />
                            <Tab value="help"     label="Help"     icon={ <HelpIcon /> } />
                        </Tabs>

                        <TabPanelContainer id="tool-panel" className="tools" value={ view }>
                            <PuzzleToolTab   value="board" />
                            <AccountToolTab  value="account" />
                            <SettingsToolTab value="settings" />
                            <HelpToolTab     value="help" />
                        </TabPanelContainer>
                    </AppBar>

                    <TabPanelContainer id="view-panel" className="views" value={ view }>
                        <PuzzleViewTab   value="board" model={ props.model } controller={ props.controller } />
                        <AccountViewTab  value="account" />
                        <SettingsViewTab value="settings" />
                        <HelpViewTab     value="help" />
                    </TabPanelContainer>
                </div>
            </ViewProvider>
        </ThemeProvider>
    </>;
}

export const AppView = styled(Yaws)({
    display:    'flex',
    flexFlow:   'row nowrap',

    '& .app-menu':      { flexShrink: 0 },
    '& .views':         { flexGrow: 1 }
});

export function init(board: IBoard, controller: IBoardController, containerId: string) {
    const container = document.getElementById(containerId);
    const vinfo = getViewInfo();

    //vinfo.tiny = true;
    //window.addEventListener('resize', scaleToViewport);

    return () => ReactDOM.render(
        <AppView model={board} controller={controller} muiTheme={dark} viewInfo={ vinfo } />,
        container
    );
}


function getViewInfo(): IViewContext {
    const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
    const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
    
    const vsize = Math.min(vw, vh);
    const vmin = 320; // Minimum supported resolution (smallest dimension)
    
    return {
        scale:          Math.max(1, Math.min(2, vsize/vmin)),
        orientation:    vw > vh ? 'landscape' : 'portrait',
        tiny:           vsize < 640
    };
}

//export default hot(module)(View);