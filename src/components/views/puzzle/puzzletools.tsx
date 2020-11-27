import React from 'react';

import Divider from '@material-ui/core/Divider';
import { List, ListItem, ListItemIcon, ListItemText } from '../appbar/list';

import EditIcon from '@material-ui/icons/Edit';
import ColorIcon from '@material-ui/icons/PaletteOutlined';
import HistoryIcon from '@material-ui/icons/History';
import TouchIcon from '@material-ui/icons/TouchApp';


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
        <List>
            <ListItem button key="edit" selected={ mode === 'edit' } data-mode="edit" onClick={ changeMode }>
                <ListItemIcon><EditIcon /></ListItemIcon>
                <ListItemText primary="Edit" />
            </ListItem>
            <ListItem button key="color" selected={ mode === 'color' } data-mode="color" onClick={ changeMode }>
                <ListItemIcon><ColorIcon /></ListItemIcon>
                <ListItemText primary="Color" />
            </ListItem>
        </List>

        <Divider />

        <List>
            <ListItem button key="history" selected={ history } onClick={ toggleHistory }>
                <ListItemIcon><HistoryIcon /></ListItemIcon>
                <ListItemText primary="History" />
            </ListItem>
            <ListItem button key="touch" selected={ touch } onClick={ toggleTouch }>
                <ListItemIcon><TouchIcon /></ListItemIcon>
                <ListItemText primary="Controls" />
            </ListItem>

        </List>
    </>;
}

export default PuzzleTools;