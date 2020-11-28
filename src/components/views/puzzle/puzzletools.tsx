import React from 'react';

import Divider from '@material-ui/core/Divider';
import MenuItem from '@material-ui/core/MenuItem';
import { List, GroupedList, ListItem, ListItemFull, ListItemIcon, ListItemText } from '../appbar/list';
import SubMenu from '../appbar/submenu';

import EditIcon from '@material-ui/icons/Edit';
import ColorIcon from '@material-ui/icons/PaletteOutlined';
import HistoryIcon from '@material-ui/icons/History';
import TouchIcon from '@material-ui/icons/TouchApp';

import MenuIcon from '@material-ui/icons/Menu';

import NewIcon from '@material-ui/icons/AddCircleOutline';
import OpenIcon from '@material-ui/icons/FolderOpen';
import SaveIcon from '@material-ui/icons/SaveAlt';
import ResetIcon from '@material-ui/icons/Replay';
import ShareIcon from '@material-ui/icons/Share';

import { useTheme } from '@material-ui/core/styles';

export interface IPuzzleToolsProperties {
    className?: string
};

export const PuzzleTools = (props: IPuzzleToolsProperties) => {
    const [mode, setMode] = React.useState('edit');
    const changeMode = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        setMode(event.currentTarget.dataset.mode);
    };

    const [history, setHistory] = React.useState(false);
    const toggleHistory = () => setHistory(!history);

    const [touch, setTouch] = React.useState(true);
    const toggleTouch = () => setTouch(!touch);

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

    return <>
        <List component="div" disablePadding>
            <ListItemFull button key="open-file-menu" data-submenu="file-menu" onClick={ subMenuOpen } divider disableGutters>
                <ListItemIcon><MenuIcon /></ListItemIcon>
                <ListItemText primary="Puzzle" primaryTypographyProps={{variant: 'button'}} />
            </ListItemFull>
        </List>

        <GroupedList component="div" disablePadding>
            <ListItem button key="edit" selected={ mode === 'edit' } data-mode="edit" onClick={ changeMode } divider>
                <ListItemIcon><EditIcon /></ListItemIcon>
                <ListItemText primary="Edit" />
            </ListItem>
            <ListItem button key="color" selected={ mode === 'color' } data-mode="color" onClick={ changeMode }>
                <ListItemIcon><ColorIcon /></ListItemIcon>
                <ListItemText primary="Color" />
            </ListItem>
        </GroupedList>

        <List component="div">
            <ListItem button key="touch" selected={ touch } onClick={ toggleTouch }>
                <ListItemIcon><TouchIcon /></ListItemIcon>
                <ListItemText primary="Controls" />
            </ListItem>
            <ListItem button key="history" selected={ history } onClick={ toggleHistory }>
                <ListItemIcon><HistoryIcon /></ListItemIcon>
                <ListItemText primary="History" />
            </ListItem>
        </List>

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