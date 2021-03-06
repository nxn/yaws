import React from 'react';
import ReactDOM from 'react-dom';
//import { hot } from 'react-hot-loader';

import {
    ThemeProvider,
    CssBaseline,
    Snackbar,
    Alert,
    experimentalStyled as styled
} from '@material-ui/core';

import {
    GridOn      as GridIcon,
    Person      as AccountIcon,
    Settings    as SettingsIcon,
    Help        as HelpIcon
} from '@material-ui/icons';

import clsx from 'clsx';

import type { IBoard } from '@components/sudoku/models/board';
import type { IActions } from '@components/sudoku/actions/actions';
import type { IKeyboardHandler } from '@components/sudoku/keyboard';

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
import { ViewProvider, IViewContext } from './context';
import { light, dark } from './theme';

type YawsProperties = {
    model:          IBoard,
    actions:        IActions,
    keyboard:       IKeyboardHandler,
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
    const [orientation,         setOrientationState]    = React.useState(viewInfo.orientation as 'landscape' | 'portrait');
    const [scale,               setScaleState]          = React.useState(viewInfo.scale);
    const [tiny,                setTinyState]           = React.useState(viewInfo.tiny);
    const [appBarLabels,        setAppBarLabelState]    = React.useState(false);
    const [puzzleControlsOpen,  setPuzzleControlsOpen]  = React.useState(true);
    const [puzzleToolpanelOpen, setPuzzleToolpanelOpen] = React.useState(false);
    const [showDisclaimer,      setShowDisclaimer]      = React.useState(true);

    const toggleControls    = () => setPuzzleControlsOpen(!puzzleControlsOpen);
    const toggleToolpanel   = () => setPuzzleToolpanelOpen(!puzzleToolpanelOpen);

    const handleDisclaimerClose = () => {
        setShowDisclaimer(false);
    }

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
        },

        actions: props.actions
    }

    React.useEffect(() => {
        const handler = (event: KeyboardEvent) => {
            if (view === 'board') {
                props.keyboard.onKey(event);
            }
        }

        document.addEventListener('keydown', handler);
        return () => document.removeEventListener('keydown', handler);
    });

    React.useEffect(() => {
        const install = () => {
            console.log("INSTALL");
        }

        window.addEventListener('beforeinstallprompt', install);
        return () => window.removeEventListener('beforeinstallprompt', install);
    });

    React.useLayoutEffect(() => {
        let timeout: null | any = null;

        const resize = () => {
            const vinfo = getViewInfo();

            setOrientationState(vinfo.orientation);
            setScaleState(vinfo.scale);
            setTinyState(vinfo.tiny);

            if (vinfo.orientation === 'portrait' || vinfo.tiny) {
                setAppBarLabelState(false);
            }
            else {
                //setAppBarLabelState(savedState);
            }
        }

        const resizeHandler = () => {
            if (timeout) {
                clearTimeout(timeout);
            }

            timeout = setTimeout(resize, 100);
        }

        window.addEventListener('resize', resizeHandler);

        return () => window.removeEventListener('resize', resizeHandler);
    })

    return <>
        <ThemeProvider theme={ light }>
            <CssBaseline />

            <ViewProvider value={ viewContext }>
                <div className={ clsx(props.className, viewInfo.orientation) }>
                    <AppBar className="app-menu" title={ view }>
                        <TabPanelContainer id="tool-panel" className="tools" value={ view }>
                            <PuzzleToolTab   
                                value           = "board"
                                model           = { props.model }
                                controlsOpen    = { puzzleControlsOpen }
                                toolpanelOpen   = { puzzleToolpanelOpen }
                                toggleControls  = { toggleControls }
                                toggleToolpanel = { toggleToolpanel } />

                            <AccountToolTab  value="account" />
                            <SettingsToolTab value="settings" />
                            <HelpToolTab     value="help" />
                        </TabPanelContainer>

                        <Tabs value={ view } onChange={ switchView } className="nav">
                            <Tab value="board"    label="Board"    icon={ <GridIcon /> } />
                            <Tab value="account"  label="Account"  icon={ <AccountIcon /> } disabled />
                            <Tab value="settings" label="Settings" icon={ <SettingsIcon /> } disabled />
                            <Tab value="help"     label="Help"     icon={ <HelpIcon /> } />
                        </Tabs>
                    </AppBar>

                    <TabPanelContainer id="view-panel" className="views" value={ view }>
                        <PuzzleViewTab
                            value               = "board"
                            model               = { props.model }
                            displayControls     = { puzzleControlsOpen }
                            displayToolpanel    = { puzzleToolpanelOpen }
                            onToolpanelClose    = { toggleToolpanel } />

                        <AccountViewTab  value="account" />
                        <SettingsViewTab value="settings" />
                        <HelpViewTab     value="help" />
                    </TabPanelContainer>

                    <div id="modal-root" className={ viewInfo.orientation } />

                    <Snackbar open={ showDisclaimer } onClose={ handleDisclaimerClose } autoHideDuration={ 10000 }>
                        <Alert severity="info" onClose={ handleDisclaimerClose }>
                            Disclaimer: This app is in a very early stage of development!
                        </Alert>
                    </Snackbar>
                </div>
            </ViewProvider>
        </ThemeProvider>
    </>;
}

export const AppView = styled(Yaws)({
    display:    'flex',
    minHeight:  '100vh',

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
    '& .views':     { 
        flexGrow: 1, 
        display: 'inherit',
        // TODO: Not sure why this is necessary, need to look into why the tab wrapper isn't automatically full width.
        '& .tabpanel-wrapper': {
            width: '100%'
        }
    },
});

export function init(board: IBoard, actions: IActions, keyboard: IKeyboardHandler, containerId: string) {
    const container = document.getElementById(containerId);

    return () => ReactDOM.render(
        <AppView model={board} actions={actions} keyboard={keyboard} />, container
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
    //     orientation:    'landscape' as 'landscape' | 'portrait',
    //     tiny:           true
    // };

    return {
        width:          vw,
        height:         vh,
        size:           vsize,
        scale:          Math.max(1, Math.min(2, vsize/vmin)),
        orientation:    vw > vh ? 'landscape' : 'portrait' as 'landscape' | 'portrait',
        tiny:           vsize < 500
    };
}

//export default hot(module)(View);