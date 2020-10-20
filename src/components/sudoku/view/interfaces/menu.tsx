import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';

import Drawer from '@material-ui/core/Drawer';
import Toolbar from '@material-ui/core/Toolbar';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';

import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import NewIcon from '@material-ui/icons/AddCircleOutline';
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
    hide: {
        display: 'none',
    },
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
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        overflowX: 'hidden',
        width: theme.spacing(7) + 1,
        [theme.breakpoints.up('sm')]: {
            width: theme.spacing(9) + 1,
        },
    },
    toolbar: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: theme.spacing(0, 1),
        // necessary for content to be below app bar
        ...theme.mixins.toolbar,
    }
}));

export interface DialogMenuProps {
    onItemClick: (dialog: Dialogs) => void;
}

export default function DialogMenu(props: DialogMenuProps) {
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

            <div className={ classes.toolbar }>
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label={ open ? "Collapse" : "Expand" }
                        onClick={ toggleDrawer }
                        edge="end">
                        { open ? <ChevronLeftIcon /> : <ChevronRightIcon /> }
                    </IconButton>
                </Toolbar>
            </div>

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
