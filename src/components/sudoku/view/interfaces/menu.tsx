import React from 'react';
import clsx from 'clsx';
import { makeStyles, withStyles } from '@material-ui/core/styles';

import Drawer from '@material-ui/core/Drawer';
import Divider from '@material-ui/core/Divider';

import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';

import GridIcon from '@material-ui/icons/GridOn';
    import NewIcon from '@material-ui/icons/AddCircleOutline';
    import OpenIcon from '@material-ui/icons/FolderOpen';
    import SaveIcon from '@material-ui/icons/SaveAlt';
    import ResetIcon from '@material-ui/icons/Replay';
    import ShareIcon from '@material-ui/icons/Share';
import SettingsIcon from '@material-ui/icons/Settings';

import EditIcon from '@material-ui/icons/Edit';
import ColorIcon from '@material-ui/icons/PaletteOutlined';
import HistoryIcon from '@material-ui/icons/History';

import HelpIcon from '@material-ui/icons/Help';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import Menu, { MenuProps } from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

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

const DrawerSubMenu = withStyles({
    paper: {
        border: '1px solid rgba(0, 0, 0, 0.12)',
        borderLeft: '1px dashed rgba(0, 0, 0, 0.12)',
        borderTopLeftRadius: '0',
        borderBottomLeftRadius: '0'
    },
})((props: MenuProps) => (
    <Menu
        elevation={0}
        getContentAnchorEl={null}
        anchorOrigin={{
            vertical: -9,
            horizontal: 'right',
        }}
        {...props}
    />
));

export interface DialogMenuProps {
    onItemClick: (dialog: string) => void;
}

export default function AppMenu(props: DialogMenuProps) {
    const classes = useStyles();

    const [open, setOpen] = React.useState(false);
    const toggleNavDrawer = () => {
        setOpen(!open);
    }

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

    const [mode, setMode] = React.useState('edit');
    const changeMode = (event: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
        setMode(event.currentTarget.dataset.mode);
        subMenuClose();
    };

    const openDialog = (event: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
        props.onItemClick(event.currentTarget.dataset.dialog);
        subMenuClose();
    };

    return (
        <>
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
                    <ListItem button key="drawer" onClick={ toggleNavDrawer } >
                        <ListItemIcon>
                            { open ? <ChevronLeftIcon /> : <ChevronRightIcon /> }
                        </ListItemIcon>
                        <ListItemText primary="YAWS" />
                    </ListItem>
                </List>

                <Divider />

                <List>
                    <ListItem button key="puzzle" data-submenu="puzzle-sub-menu" onClick={ subMenuOpen }>
                        <ListItemIcon><GridIcon /></ListItemIcon>
                        <ListItemText primary="Puzzle" />
                    </ListItem>
                    <ListItem button key="settings" disabled={ true }>
                        <ListItemIcon><SettingsIcon /></ListItemIcon>
                        <ListItemText primary="Settings" />
                    </ListItem>
                </List>

                <Divider />

                <List>
                    <ListItem button key="input" data-submenu="mode-sub-menu" onClick={ subMenuOpen }>
                        <ListItemIcon>{ mode === 'color' ? <ColorIcon /> : <EditIcon /> }</ListItemIcon>
                        <ListItemText primary="Input Mode" />
                    </ListItem>
                    <ListItem button key="history" disabled={ true }>
                        <ListItemIcon><HistoryIcon /></ListItemIcon>
                        <ListItemText primary="History" />
                    </ListItem>
                </List>

                <Divider />

                <List>
                    <ListItem button key="help">
                        <ListItemIcon><HelpIcon /></ListItemIcon>
                        <ListItemText primary="Help" />
                    </ListItem>
                </List>
            </Drawer>

            <DrawerSubMenu
                id="puzzle-sub-menu"
                anchorEl={ subMenu.target }
                keepMounted
                open={ subMenu.id === 'puzzle-sub-menu' }
                onClose={ subMenuClose }>

                <MenuItem data-dialog="new-puzzle" onClick={ openDialog }>
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
            </DrawerSubMenu>

            <DrawerSubMenu
                id="mode-sub-menu"
                anchorEl={ subMenu.target }
                keepMounted
                open={ subMenu.id === 'mode-sub-menu' }
                onClose={ subMenuClose }>

                <MenuItem data-mode="edit" onClick={ changeMode }>
                    <ListItemIcon><EditIcon /></ListItemIcon>
                    <ListItemText primary="Edit" />
                </MenuItem>

                <MenuItem data-mode="color" onClick={ changeMode }>
                    <ListItemIcon><ColorIcon /></ListItemIcon>
                    <ListItemText primary="Color" />
                </MenuItem>
            </DrawerSubMenu>
        </>
    );
}
