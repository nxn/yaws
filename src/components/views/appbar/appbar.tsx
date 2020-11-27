import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';

import Drawer from '@material-ui/core/Drawer';
import Divider from '@material-ui/core/Divider';

import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';


import { List, ListItemFull, ListItemIcon, ListItemText } from './list';

import ViewContext from '../context';

const drawerWidth = 180;

const useDrawerStyles = makeStyles((theme) => ({
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap'
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

type AppBarProperties = {
    children: React.ReactNode,
    className?: string
}

export default (props: AppBarProperties) => {
    const drawerClasses = useDrawerStyles();

    const [open, setOpen] = React.useState(false);
    const toggleNavDrawer = () => setOpen(!open);

    let expander;
    if (!React.useContext(ViewContext).tiny) {
        expander = (
            <List component="div" disablePadding>
                <ListItemFull button key="drawer" onClick={ toggleNavDrawer } disableGutters divider>
                    <ListItemIcon>
                        { open ? <ChevronLeftIcon /> : <ChevronRightIcon /> }
                    </ListItemIcon>
                    <ListItemText primary="YAWS" />
                </ListItemFull>
            </List>
        );
    }

    return (
        <div className={ props.className }>
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
