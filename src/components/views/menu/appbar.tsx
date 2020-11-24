import React from 'react';
import clsx from 'clsx';
import { makeStyles, withStyles, experimentalStyled as styled } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

import Drawer from '@material-ui/core/Drawer';
import Divider from '@material-ui/core/Divider';

import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';


    import NewIcon from '@material-ui/icons/AddCircleOutline';
    import OpenIcon from '@material-ui/icons/FolderOpen';
    import SaveIcon from '@material-ui/icons/SaveAlt';
    import ResetIcon from '@material-ui/icons/Replay';
    import ShareIcon from '@material-ui/icons/Share';


import EditIcon from '@material-ui/icons/Edit';
import ColorIcon from '@material-ui/icons/PaletteOutlined';
import HistoryIcon from '@material-ui/icons/History';
import TouchIcon from '@material-ui/icons/TouchApp';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import Box from '@material-ui/core/Box';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

import Tabs from '@material-ui/core/Tabs';
import MuiTab from '@material-ui/core/Tab';

const drawerWidth = 180;

// Material UI's tabs only support placing icons above labels -- even when using vertical alignment. It also adds a
// mess of random padding and margin values to position things. The following tries to remove as much of that as
// possible by overriding these styles back to default.
export const AppBarTab = styled(MuiTab)(({theme}) => ({
    '&.Mui-selected': {
        backgroundColor: theme.palette.action.selected
    },
    '&.MuiTab-root': {
        padding: 'initial',
        textTransform: 'initial'
    },

    // Ideally this class should not be applied
    '&.MuiTab-labelIcon': {
        minHeight: '48px',
        // Change first-child to first-of-type due to compile time warning
        '& .MuiTab-wrapper > *:first-of-type': {
            marginBottom: 'initial'
        }
    },

    '& .MuiTab-wrapper': {
        flexDirection: 'row',
        alignItems: 'initial',
        justifyContent: 'initial'
    },

    // Margin changes so that icons and text are aligned within appbar
    '& .MuiSvgIcon-root': {
        margin: theme.spacing(0, 2),
    },
    '& .MuiTypography-root': {
        margin: theme.spacing(0, 2),
    }
}));

export const AppBarTabLabel = (props: { children: React.ReactChild }) => (
    <Typography component="span" variant="body1">{ props.children }</Typography>
);

export const AppBarMenu = styled(Menu)(
    ({theme}) => ({
        '& .MuiMenu-paper': {
            boxSizing:              'border-box',
            border:                 `1px solid  ${ theme.palette.divider }`,
            borderLeft:             `1px dashed ${ theme.palette.divider }`,
            borderTopLeftRadius:    '0',
            borderBottomLeftRadius: '0',
        }
    })
);

// Mimics AppBarTab style even though it's a single list
const AppBarTinyTab = styled(List)(({theme}) => ({
    borderTop: `1px solid ${ theme.palette.divider }`,
    borderRight: `2px solid ${ theme.palette.secondary.main }`,
    '&.MuiList-padding': {
        paddingTop: 0, 
        paddingBottom: 0
    }
}))

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

const mapEventToIndex = (cb: (index: number) => any) => (_: React.SyntheticEvent<Element, Event>, v: number) => cb(v);

type NavItem = {
    icon: JSX.Element;
    label: string;
    disabled?: boolean;
}

type NavMenuProperties = {
    current?: any, 
    items: NavItem[], 
    onItemClick: (e: React.SyntheticEvent<Element, Event>, v: any) => any
};

const FullNav = (props: NavMenuProperties) => (
    <Tabs orientation="vertical" value={ props.current } onChange={ props.onItemClick } aria-label="Navigation">{
        props.items.map(item =>
            <AppBarTab 
                icon={ item.icon } 
                label={<AppBarTabLabel>{ item.label }</AppBarTabLabel>} 
                disabled={ item.disabled } />
        )
    }</Tabs>
)

const TinyNav = (props: NavMenuProperties) => {
    const [anchor, setAnchor] = React.useState<null | HTMLElement>(null);

    const open = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
        setAnchor(event.currentTarget);
    };

    const close = () => {
        setAnchor(null);
    };

    const current = props.items[props.current || 0];

    const setView = (event: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
        const index = parseInt(event.currentTarget.dataset.index);
        props.onItemClick(null, index);
        close();
    }

    return <>
        <AppBarTinyTab>
            <ListItem button aria-controls="nav-menu" aria-haspopup="true" onClick={ open }>
                <ListItemIcon>{ current.icon }</ListItemIcon>
                <ListItemText>{ current.label }</ListItemText>
            </ListItem>
        </AppBarTinyTab>
        <AppBarMenu
            id="nav-menu"
            anchorEl={ anchor }
            anchorOrigin={{
                horizontal: 'right',
                vertical: 'top'
            }}
            transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
            }}
            marginThreshold={0}
            elevation={0}
            open={ Boolean(anchor) }
            onClose={ close }
            keepMounted>{

            props.items.map((item, index) =>
                <MenuItem onClick={ setView } data-index={ index } disabled={ item.disabled }>
                    <ListItemIcon>{ item.icon }</ListItemIcon>
                    <ListItemText>{ item.label }</ListItemText>
                </MenuItem>
            )
        }</AppBarMenu>
    </>
};

type AppBarProperties = {
    navItems: NavItem[],
    selectedNavIndex: number,
    onNavItemClick: (index: number) => any,
    tiny?: boolean,
    className?: string
}

export default function AppBar(props: AppBarProperties) {
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

    const onItemClick = mapEventToIndex(props.onNavItemClick);

    const nav = props.tiny
        ? <TinyNav items={ props.navItems } current={ props.selectedNavIndex } onItemClick={ onItemClick } />
        : <>
        <MenuGroup>
            <MenuGroupItem button key="drawer" onClick={ toggleNavDrawer } >
                <ListItemIcon>
                    { open ? <ChevronLeftIcon /> : <ChevronRightIcon /> }
                </ListItemIcon>
                <ListItemText primary="YAWS" />
            </MenuGroupItem>
        </MenuGroup>

        <Divider />

        <FullNav items={ props.navItems } current={ props.selectedNavIndex } onItemClick={ onItemClick } />
    </>;

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
                
                { nav }

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
                    <MenuGroupItem button key="history" selected={ history } onClick={ toggleHistory }>
                        <ListItemIcon><HistoryIcon /></ListItemIcon>
                        <ListItemText primary="History" />
                    </MenuGroupItem>
                    <MenuGroupItem button key="touch" selected={ touch } onClick={ toggleTouch }>
                        <ListItemIcon><TouchIcon /></ListItemIcon>
                        <ListItemText primary="Controls" />
                    </MenuGroupItem>

                </MenuGroup>
            </Drawer>

            {/* <DrawerSubMenu
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
            </DrawerSubMenu> */}
        </div>
    );
}
