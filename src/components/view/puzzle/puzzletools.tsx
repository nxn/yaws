import React from 'react';

import {
    MenuItem,
    ListItemIcon,
    ListItemText,
    PopoverOrigin
} from '@material-ui/core';

import { 
    PlayArrow           as PlayIcon,
    Pause               as PauseIcon,
    VerticalSplit       as PanelVertical,
    HorizontalSplit     as PanelHorizontal,
    TouchApp            as ControlsIcon,
    Menu                as MenuIcon,
    AddCircleOutline    as NewIcon,
    FolderOpen          as OpenIcon,
    SaveAlt             as SaveIcon,
    Replay              as ResetIcon,
    Share               as ShareIcon
} from '@material-ui/icons';

import type { IBoard } from "@components/sudoku/models/board";
import useView from '../context';
import Toolbar from '../appbar/toolbar';
import SubMenu from '../appbar/submenu';
import NewPuzzleDialog from './dialogs/newpuzzle';
import ShareDialog from './dialogs/share';

import { 
    Button, 
    ToggleButton, 
    ToggleButtonGroup 
} from '../appbar/button';

export interface IPuzzleToolsProperties {
    model:              IBoard,
    controlsOpen?:      boolean,
    toolpanelOpen?:     boolean,
    toggleControls?:    () => void,
    toggleToolpanel?:   () => void,
    className?:         string
};

export const PuzzleTools = (props: IPuzzleToolsProperties) => {
    const [mode, setMode] = React.useState('play');
    const changeMode = (_: React.MouseEvent<HTMLElement>, mode: string | null) => {
        if (mode) {
            setMode(mode);
        }
    };

    const [anchor, setAnchor] = React.useState<null | HTMLElement>(null);
    const openPuzzleMenu = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
        setAnchor(event.currentTarget);
    };

    const closePuzzleMenu = () => {
        setAnchor(null);
    };

    const [dialog, setDialog] = React.useState(null);
    const openDialog = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
        setDialog(event.currentTarget.dataset.dialog);
        closePuzzleMenu();
    }
    const closeDialog = () => {
        setDialog(null);
    }

    const view = useView();
    const ToolpanelIcon = view.orientation === 'landscape' 
        ? <PanelVertical /> 
        : <PanelHorizontal />;

    const anchorOrigin: PopoverOrigin = view.orientation === 'landscape'
        ? { vertical: 'top',    horizontal: 'right' }
        : { vertical: 'bottom', horizontal: 'left' };

    const resetBoard = () => {
        view.actions.board.reset(props.model);
        closePuzzleMenu();
    }

    return <>
        <Toolbar className={ props.className }>
            <Button icon={<MenuIcon />} label="Puzzle" variant="full" onClick={ openPuzzleMenu } />

            <ToggleButtonGroup exclusive guttered value={ mode } onChange={ changeMode }>
                <ToggleButton value="play" icon={<PlayIcon />} label="Play" />
                <ToggleButton value="pause" icon={<PauseIcon />} label="Pause" disabled />
            </ToggleButtonGroup>

            <ToggleButton guttered
                value       = "controls" 
                selected    = { props.controlsOpen }
                icon        = { <ControlsIcon /> } 
                label       = "Controls"
                onChange    = { props.toggleControls } />

            <ToggleButton guttered
                value       = "toolpanel" 
                selected    = { props.toolpanelOpen } 
                icon        = { ToolpanelIcon } 
                label       = "Tools"
                onChange    = { props.toggleToolpanel } />
        </Toolbar>

        <SubMenu
            anchorEl            = { anchor }
            anchorOrigin        = { anchorOrigin }
            transformOrigin     = { { vertical: 'top', horizontal: 'left' } }
            open                = { Boolean(anchor) }
            onClose             = { closePuzzleMenu }
            elevation           = { 3 }
            marginThreshold     = { 0 }
            getContentAnchorEl  = { null }
            keepMounted>

            {/* 
            Material-UI tries to align the pop-over menu's first item exactly alongside the DOM element it is anchored 
            to. In the case of components in the app-bar, things look a lot cleaner if it doesn't do that. Setting the 
            first item in the menu to 'display: none' prevents this unwanted alignment. It also avoids some ref 
            forwarding issues, but those aren't applicable here.
            */}
            <MenuItem style={{ display: 'none' }} />

            <MenuItem data-dialog="new-puzzle" onClick={ openDialog }>
                <ListItemIcon><NewIcon /></ListItemIcon>
                <ListItemText primary="New" />
            </MenuItem>

            <MenuItem onClick={closePuzzleMenu} disabled>
                <ListItemIcon><OpenIcon /></ListItemIcon>
                <ListItemText primary="Open" />
            </MenuItem>

            <MenuItem onClick={closePuzzleMenu} disabled>
                <ListItemIcon><SaveIcon /></ListItemIcon>
                <ListItemText primary="Save" />
            </MenuItem>

            <MenuItem onClick={ resetBoard }>
                <ListItemIcon><ResetIcon /></ListItemIcon>
                <ListItemText primary="Reset" />
            </MenuItem>

            <MenuItem data-dialog="share" onClick={ openDialog }>
                <ListItemIcon><ShareIcon /></ListItemIcon>
                <ListItemText primary="Share" />
            </MenuItem>
        </SubMenu>

        <NewPuzzleDialog    open={ dialog === 'new-puzzle' }    model={ props.model } onClose={ closeDialog } />
        <ShareDialog        open={ dialog === 'share' }         model={ props.model } onClose={ closeDialog } />
    </>;
}

export default PuzzleTools;