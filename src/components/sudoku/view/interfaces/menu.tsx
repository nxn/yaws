import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';

import Drawer from '@material-ui/core/Drawer';
import Divider from '@material-ui/core/Divider';

import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import NewIcon from '@material-ui/icons/GridOn';
import OpenIcon from '@material-ui/icons/FolderOpen';
import SaveIcon from '@material-ui/icons/SaveAlt';
import ResetIcon from '@material-ui/icons/Replay';
import ShareIcon from '@material-ui/icons/Share';
import OptionsIcon from '@material-ui/icons/Settings';
import InfoIcon from '@material-ui/icons/Info';
import HelpIcon from '@material-ui/icons/Help';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import { Dialogs } from './interfaces';

const drawerWidth = 180;

const useStyles = makeStyles((theme) => ({
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
    },
    drawerOpen: {
        width: drawerWidth,
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    drawerClose: {
        width: theme.spacing(7) + 1,
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        overflowX: 'hidden'
    }
}));

export interface DialogMenuProps {
    onItemClick: (dialog: Dialogs) => void;
}

export default function AppMenu(props: DialogMenuProps) {
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);

    const toggleDrawer = () => {
        setOpen(!open);
    }

    return (
        <Drawer variant="permanent"
            className={clsx(classes.drawer, {
                [classes.drawerOpen]: open,
                [classes.drawerClose]: !open,
            })}
            classes={{
                paper: clsx({
                    [classes.drawerOpen]: open,
                    [classes.drawerClose]: !open,
                }),
            }}>

            <List>
                <ListItem button key="drawer" onClick={ toggleDrawer }>
                    <ListItemIcon>
                        { open ? <ChevronLeftIcon /> : <ChevronRightIcon /> }
                    </ListItemIcon>
                    <ListItemText primary="YAWS" />
                </ListItem>
            </List>

            <Divider />

            <List>
                <ListItem button key="new" onClick={ () => props.onItemClick(Dialogs.NewPuzzle) }>
                    <ListItemIcon><NewIcon /></ListItemIcon>
                    <ListItemText primary="New" />
                </ListItem>
                <ListItem button key="open">
                    <ListItemIcon><OpenIcon /></ListItemIcon>
                    <ListItemText primary="Open" />
                </ListItem>
                <ListItem button key="save">
                    <ListItemIcon><SaveIcon /></ListItemIcon>
                    <ListItemText primary="Save" />
                </ListItem>
                <ListItem button key="reset">
                    <ListItemIcon><ResetIcon /></ListItemIcon>
                    <ListItemText primary="Reset" />
                </ListItem>
                <ListItem button key="share">
                    <ListItemIcon><ShareIcon /></ListItemIcon>
                    <ListItemText primary="Share" />
                </ListItem>
            </List>

            <Divider />

            <List>
                <ListItem button key="options">
                    <ListItemIcon><OptionsIcon /></ListItemIcon>
                    <ListItemText primary="Options" />
                </ListItem>
                <ListItem button key="info">
                    <ListItemIcon><InfoIcon /></ListItemIcon>
                    <ListItemText primary="Info" />
                </ListItem>
                <ListItem button key="help">
                    <ListItemIcon><HelpIcon /></ListItemIcon>
                    <ListItemText primary="Help" />
                </ListItem>
            </List>
        </Drawer>
    );
}
