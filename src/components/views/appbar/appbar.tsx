import React from 'react';
import clsx from 'clsx';
import { makeStyles, withStyles, experimentalStyled as styled } from '@material-ui/core/styles';

import Drawer from '@material-ui/core/Drawer';
import Divider from '@material-ui/core/Divider';

import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';


import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import ViewContext from '../context';


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
        width: `calc(${ theme.spacing(7) } + 1px)`,
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        overflowX: 'hidden'
    }
}));

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



type AppBarProperties = {
    children: React.ReactNode,
    className?: string
}

export default (props: AppBarProperties) => {
    const drawerClasses = useDrawerStyles();

    const [open, setOpen] = React.useState(false);
    const toggleNavDrawer = () => setOpen(!open);

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
    const toggleHistory = () => setHistory(!history);

    const [touch, setTouch] = React.useState(true);
    const toggleTouch = () => setTouch(!touch);

    //const onItemClick = mapEventToIndex(props.onNavItemClick);

    let expander;
    if (!React.useContext(ViewContext).tiny) {
        expander = (
            <>
                <MenuGroup>
                    <MenuGroupItem button key="drawer" onClick={ toggleNavDrawer } >
                        <ListItemIcon>
                            { open ? <ChevronLeftIcon /> : <ChevronRightIcon /> }
                        </ListItemIcon>
                        <ListItemText primary="YAWS" />
                    </MenuGroupItem>
                </MenuGroup>

                <Divider />
            </>
        );
    }

    return (
        <div className={ clsx('app-menu', props.className) }>
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
                
                { expander }

                { props.children }
            </Drawer>
        </div>
    );
};
/* 
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
                    <MenuGroupItem button key="history" selected={ history } onClick={ toggleHistory }>
                        <ListItemIcon><HistoryIcon /></ListItemIcon>
                        <ListItemText primary="History" />
                    </MenuGroupItem>
                    <MenuGroupItem button key="touch" selected={ touch } onClick={ toggleTouch }>
                        <ListItemIcon><TouchIcon /></ListItemIcon>
                        <ListItemText primary="Controls" />
                    </MenuGroupItem>

                </MenuGroup>
            </Drawer> */

            /* <DrawerSubMenu
                id="puzzle-sub-menu"
                anchorEl={ subMenu.target }
                keepMounted
                open={ subMenu.id === 'puzzle-sub-menu' }
                onClose={ subMenuClose }>

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
            </DrawerSubMenu> */
//    );
//})
