import React from 'react';
import clsx from 'clsx';
import { makeStyles, withStyles, useTheme } from '@material-ui/core/styles';

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

const useDrawerStyles = makeStyles((theme) => ({
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

const DrawerSubMenu = withStyles((theme) => ({
    paper: {
        border:                 `1px solid  ${ theme.palette.divider }`,
        borderLeft:             `1px dashed ${ theme.palette.divider }`,
        borderTopLeftRadius:    '0',
        borderBottomLeftRadius: '0',
        marginLeft:             theme.spacing(1),
        marginTop:              -1 * (theme.spacing(1) + 1)
    },
}))((props: MenuProps) => (
    <Menu
        elevation={0}
        getContentAnchorEl={null}
        anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
        }}
        {...props} />
));

const MenuGroup = withStyles((theme) => ({
    padding: {
        padding: theme.spacing(0, 1)
    }
}))(List);

const MenuGroupItem = withStyles((theme) => ({
    root: {
        borderRadius: theme.shape.borderRadius,
        margin: theme.spacing(1, 0)
    },
    gutters: {
        padding: theme.spacing(0.5, 1)
    }
}))(ListItem);

export interface DialogMenuProps {
    onItemClick: (dialog: string) => void;
}

export default function AppMenu(props: DialogMenuProps) {
    const drawerClasses = useDrawerStyles();

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
    const changeMode = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        setMode(event.currentTarget.dataset.mode);
    };

    const [history, setHistory] = React.useState(false);
    const toggleHistory = () => {
        setHistory(!history);
    }

    const openDialog = (event: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
        props.onItemClick(event.currentTarget.dataset.dialog);
        subMenuClose();
    };

    return (
        <>
            <Drawer variant="permanent"
                className={clsx(drawerClasses.drawer, {
                    [drawerClasses.drawerOpen]: open,
                    [drawerClasses.drawerClose]: !open,
                })}
                classes={{
                    paper: clsx({
                        [drawerClasses.drawerOpen]: open,
                        [drawerClasses.drawerClose]: !open,
                    }),
                }}>

                <MenuGroup>
                    <MenuGroupItem button key="drawer" onClick={ toggleNavDrawer } >
                        <ListItemIcon>
                            { open ? <ChevronLeftIcon /> : <ChevronRightIcon /> }
                        </ListItemIcon>
                        <ListItemText primary="YAWS" />
                    </MenuGroupItem>
                </MenuGroup>

                <Divider />

                <MenuGroup>
                    <MenuGroupItem button key="puzzle" data-submenu="puzzle-sub-menu" onClick={ subMenuOpen }>
                        <ListItemIcon><GridIcon /></ListItemIcon>
                        <ListItemText primary="Puzzle" />
                    </MenuGroupItem>
                    <MenuGroupItem button key="history" selected={ history } onClick={ toggleHistory }>
                        <ListItemIcon><HistoryIcon /></ListItemIcon>
                        <ListItemText primary="History" />
                    </MenuGroupItem>
                    <MenuGroupItem button key="settings" disabled={ true }>
                        <ListItemIcon><SettingsIcon /></ListItemIcon>
                        <ListItemText primary="Settings" />
                    </MenuGroupItem>
                </MenuGroup>

                <Divider />

                <MenuGroup>
                    <MenuGroupItem button key="edit" selected={ mode === 'edit' } data-mode="edit" onClick={ changeMode }>
                        <ListItemIcon><EditIcon /></ListItemIcon>
                        <ListItemText primary="Edit" />
                    </MenuGroupItem>
                    <MenuGroupItem button key="color" selected={ mode === 'color' } data-mode="color" onClick={ changeMode }>
                        <ListItemIcon><ColorIcon /></ListItemIcon>
                        <ListItemText primary="Color" />
                    </MenuGroupItem>
                </MenuGroup>

                <Divider />

                <MenuGroup>
                    <MenuGroupItem button key="help">
                        <ListItemIcon><HelpIcon /></ListItemIcon>
                        <ListItemText primary="Help" />
                    </MenuGroupItem>
                </MenuGroup>
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
        </>
    );
}
