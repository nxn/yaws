import React from 'react';

import {
    MenuItem,
    ListItemIcon,
    ListItemText
} from '@material-ui/core';

import { 
    Edit                as EditIcon,
    PaletteOutlined     as ColorIcon,
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

import useView from '../viewcontext';
import Toolbar from '../appbar/toolbar';
import SubMenu from '../appbar/submenu';

import { 
    Button, 
    ToggleButton, 
    ToggleButtonGroup 
} from '../appbar/button';

export interface IPuzzleToolsProperties {
    className?: string
};

export const PuzzleTools = (props: IPuzzleToolsProperties) => {
    const [mode, setMode] = React.useState('edit');
    const changeMode = (_: React.MouseEvent<HTMLElement>, mode: string | null) => {
        if (mode) {
            setMode(mode);
        }
    };

    const [toolpanel, setToolpanel] = React.useState(false);
    const toggleToolpanel = () => setToolpanel(!toolpanel);

    const [controls, setControls] = React.useState(true);
    const toggleControls = () => setControls(!controls);

    const [subMenu, setSubMenu] = React.useState({ id: null, target: null });
    const subMenuOpen = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        setSubMenu({
            id:     event.currentTarget.dataset.submenu,
            target: event.currentTarget
        });
    };
    const subMenuClose = () => {
        setSubMenu({ id: null, target: null });
    };

    const view = useView();
    const ToolpanelIcon = view.orientation === 'landscape' ? <PanelVertical /> : <PanelHorizontal />;

    return <>
        <Toolbar className={ props.className }>
            <Button icon={<MenuIcon />} label="Puzzle" variant="full" />

            <ToggleButtonGroup exclusive value={ mode } onChange={ changeMode }>
                <ToggleButton value="edit" icon={<EditIcon />} label="Edit" />
                <ToggleButton value="color" icon={<ColorIcon />} label="Color" />
            </ToggleButtonGroup>

            <ToggleButton 
                value       = "controls" 
                selected    = { controls }
                icon        = { <ControlsIcon /> } 
                label       = "Controls"
                onChange    = { toggleControls } />

            <ToggleButton 
                value       = "toolpanel" 
                selected    = { toolpanel } 
                icon        = { ToolpanelIcon } 
                label       = "Tools"
                onChange    = { toggleToolpanel } />
        </Toolbar>

        <SubMenu
            id="file-menu"
            anchorEl={ subMenu.target }
            anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
            transformOrigin={{ horizontal: 'left', vertical: 'top' }}
            marginThreshold={0}
            elevation={0}
            open={ subMenu.id === 'file-menu' }
            onClose={ subMenuClose }
            keepMounted>

            {/* 
            Material-UI tries to align the pop-over menu's first item exactly alongside the DOM element it is anchored 
            to. In the case of components in the app-bar, things look a lot cleaner if it doesn't do that. Setting the 
            first item in the menu to 'display: none' prevents this unwanted alignment. It also avoids some ref 
            forwarding issues, but those aren't applicable here.
            */}
            <MenuItem style={{ display: 'none' }} />

            <MenuItem data-dialog="new-puzzle" onClick={ () => {} }>
                <ListItemIcon><NewIcon /></ListItemIcon>
                <ListItemText primary="New" />
            </MenuItem>

            <MenuItem onClick={subMenuClose}>
                <ListItemIcon><OpenIcon /></ListItemIcon>
                <ListItemText primary="Open" />
            </MenuItem>

            <MenuItem onClick={subMenuClose}>
                <ListItemIcon><SaveIcon /></ListItemIcon>
                <ListItemText primary="Save" />
            </MenuItem>

            <MenuItem onClick={subMenuClose}>
                <ListItemIcon><ResetIcon /></ListItemIcon>
                <ListItemText primary="Reset" />
            </MenuItem>

            <MenuItem onClick={subMenuClose}>
                <ListItemIcon><ShareIcon /></ListItemIcon>
                <ListItemText primary="Share" />
            </MenuItem>
        </SubMenu>
    </>;
}

export default PuzzleTools;