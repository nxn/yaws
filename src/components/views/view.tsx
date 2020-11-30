import React from 'react';
import ReactDOM from 'react-dom';
//import { hot } from 'react-hot-loader';

import {
    ThemeProvider,
    CssBaseline,
    experimentalStyled as styled
} from '@material-ui/core';

import {
    GridOn      as GridIcon,
    Person      as AccountIcon,
    Settings    as SettingsIcon,
    Help        as HelpIcon
} from '@material-ui/icons';

import { Global } from '@emotion/react';
import clsx from 'clsx';

import cabinCondensedWoff   from './fonts/cabincondensed-bold-digits.woff';
import cabinCondensedWoff2  from './fonts/cabincondensed-bold-digits.woff2';
import robotoMonoWoff       from './fonts/robotomono-bold-digits.woff';
import robotoMonoWoff2      from './fonts/robotomono-bold-digits.woff2';

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

import { extend } from './util';
import AppBar from './appbar/appbar';
import { TabPanelContainer } from './appbar/tabs';
import { NavMenu as Tabs, NavItem as Tab } from './appbar/nav';
import { ViewProvider, IViewContext } from './viewcontext';
import { light, dark } from './theme';

type YawsProperties = {
    model:          IBoard,
    controller:     IBoardController,
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

    const viewInfo = getViewInfo();
    const [orientation,     setOrientationState]    = React.useState(viewInfo.orientation as 'landscape' | 'portrait');
    const [scale,           setScaleState]          = React.useState(viewInfo.scale);
    const [tiny,            setTinyState]           = React.useState(viewInfo.tiny);
    const [appBarLabels,    setAppBarLabelState]    = React.useState(false);

    const viewContext: IViewContext = {
        orientation: orientation,
        setOrientation: (orientation: 'landscape' | 'portrait') => {
            setOrientationState(orientation);
        },
    
        scale: scale,
        setScale: (scale: number) => {
            if (scale >= 1.0 && scale <= 2.0) {
                setScaleState(scale);
            }
        },
    
        tiny: tiny,
        toggleTiny: () => {
            setTinyState(!tiny);
        },
    
        appBar: {
            labels: appBarLabels,
            toggleLabels: () => {
                setAppBarLabelState(!appBarLabels && orientation === 'landscape' && !tiny);
            }
        }
    }

    React.useEffect(() => {
        const resize = () => {
            const vinfo = getViewInfo();

            setOrientationState(vinfo.orientation);
            setScaleState(vinfo.scale);
            setTinyState(vinfo.tiny);

            if (vinfo.orientation === 'portrait' || vinfo.tiny) {
                setAppBarLabelState(false);
            }
        }

        //window.addEventListener('resize', resize);
        //return () => window.removeEventListener('resize', resize);
    })

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

        <ThemeProvider theme={ dark }>
            <CssBaseline />

            <ViewProvider value={ viewContext }>
                <div className={ clsx(props.className, viewInfo.orientation) }>
                    <AppBar className="app-menu" title={ view }>
                        <TabPanelContainer id="tool-panel" className="tools" value={ view }>
                            <PuzzleToolTab   value="board" />
                            <AccountToolTab  value="account" />
                            <SettingsToolTab value="settings" />
                            <HelpToolTab     value="help" />
                        </TabPanelContainer>

                        <Tabs value={ view } onChange={ switchView } className="nav">
                            <Tab value="board"    label="Board"   icon={ <GridIcon /> } />
                            <Tab value="account"  label="Account"  icon={ <AccountIcon /> } />
                            <Tab value="settings" label="Settings" icon={ <SettingsIcon /> } />
                            <Tab value="help"     label="Help"     icon={ <HelpIcon /> } />
                        </Tabs>
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

    '&.landscape': {
        flexFlow: 'row nowrap',
        '& .nav': {
            marginTop: 'auto'
        }
    },

    '&.portrait': {
        flexFlow: 'column nowrap',
        '& .nav': {
            marginLeft: 'auto'
        }
    },

    '& .app-menu':  { flexShrink: 0 },
    '& .views':     { flexGrow: 1 },
});

export function init(board: IBoard, controller: IBoardController, containerId: string) {
    const container = document.getElementById(containerId);

    return () => ReactDOM.render(
        <AppView model={board} controller={controller} />, container
    );
}

function getViewInfo() {
    const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
    const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
    
    const vsize = Math.min(vw, vh);
    const vmin = 320; // Minimum supported resolution (smallest dimension)

    // return {
    //     width:          vw,
    //     height:         vh,
    //     size:           vsize,
    //     scale:          Math.max(1, Math.min(2, vsize/vmin)),
    //     orientation:    'portrait' as 'landscape' | 'portrait',
    //     tiny:           true
    // };

    return {
        width:          vw,
        height:         vh,
        size:           vsize,
        scale:          Math.max(1, Math.min(2, vsize/vmin)),
        orientation:    vw > vh ? 'landscape' : 'portrait' as 'landscape' | 'portrait',
        tiny:           vsize < 640
    };
}

//export default hot(module)(View);