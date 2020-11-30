import React from 'react';

import {
    MenuItem,
    ListItemIcon,
    ListItemText,
    PopoverOrigin
} from '@material-ui/core';

import useView from '../viewcontext';

import { Tabs, Tab, TinyTab, TabLabel } from './tabs';
import SubMenu from './submenu';

type NavItemProperties = {
    value:      string,
    icon:       JSX.Element,
    label:      string,
    disabled?:  boolean,
    onClick?:   (event: React.MouseEvent<HTMLElement, MouseEvent>) => void
}

const FullNavItem = (props: NavItemProperties) => {
    // Tab's label needs to be modified by being wrapped with "<TabLabel>"; the rest of the props can be passed through
    // as they are.
    const { label, ...remaining } = props;

    const view = useView();
    return (
        <Tab 
            key         = { `nav-full-tab-${ props.value }` }
            data-value  = { props.value }
            label       = { view.appBar.labels && <TabLabel>{ label }</TabLabel> }
            { ... remaining } />
    );
}

const TinyNavItem = (props: NavItemProperties) => {
    // In the case of the menu, both the icon and label are specified via their own nested components; remaining
    // props can be passed through.
    const { icon, label, ...remaining } = props;
    return (
        <MenuItem 
            key         = { `nav-tiny-tab-${ props.value }` } 
            data-value  = { props.value }
            { ... remaining }>
            <ListItemIcon>{ icon }</ListItemIcon>
            <ListItemText>{ label }</ListItemText>
        </MenuItem>
    );
};

type NavMenuProperties = {
    value:      string, 
    children:   any[], 
    onChange:   (id: string) => void,
    className?: string
};

const FullNav = (props: NavMenuProperties) => {
    const view = useView();

    const changeHandler = (_: React.SyntheticEvent<Element, Event>, value: any) => {
        props.onChange(value);
    }

    return (
        <Tabs 
            className   = { props.className } 
            orientation = { view.orientation === 'landscape' ? 'vertical' : 'horizontal' }
            value       = { props.value } 
            onChange    = { changeHandler } 
            aria-label  = "Navigation">

            { props.children }
        </Tabs>
    );
}

const TinyNav = (props: NavMenuProperties) => {
    const [anchor, setAnchor] = React.useState<null | HTMLElement>(null);

    const open = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
        setAnchor(event.currentTarget);
    };

    const close = () => {
        setAnchor(null);
    };

    const clickHandler = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
        props.onChange(event.currentTarget.dataset.value);
        close();
    }

    const current = props.children.find(c => c.props.value === props.value);

    const view = useView();

    const transformOrigin: PopoverOrigin = view.orientation === 'landscape'
        ? { vertical: 'bottom', horizontal: 'left' }
        : { vertical: 'top',    horizontal: 'right' };

    return <>
        <TinyTab className={ props.className } aria-controls="nav-menu" aria-haspopup="true" onClick={ open }>
            { current.props.icon }
        </TinyTab>
        <SubMenu
            anchorEl            = { anchor }
            anchorOrigin        = { { vertical: 'bottom', horizontal: 'right' } }
            transformOrigin     = { transformOrigin }
            open                = { Boolean(anchor) }
            onClose             = { close }
            elevation           = { 0 }
            marginThreshold     = { 0 }
            getContentAnchorEl  = { null }
            keepMounted>

            {/* 
            Material-UI passes a React ref to the first element of Menu components in an effort to align it with the DOM 
            element that the menu is anchored to. In order to avoid the headache of passing this ref through multiple
            functional wrapper components, a dummy MenuItem is added here to receive that ref. 
            
            See following for more details: https://stackoverflow.com/a/56309771/806003

            This also has the added bonus of visually looking a lot better for components that are rendered within the 
            AppBar. The menu itself will now align perfectly with the anchored element rather than having the alignment
            be based off of the first item.
            */}
            <MenuItem style={{ display: "none" }} />
            
            {
                React.Children.map(props.children, (child: React.ReactElement<NavItemProperties>) => {
                    if (!React.isValidElement(child)) {
                        return child;
                    }

                    // If the child already has an onClick property create a new handler that calls both it and the
                    // default clickHandler. Otherwise use the default handler directly.
                    const handler = child.props.onClick ? (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
                        child.props.onClick(event);
                        clickHandler(event);
                    } : clickHandler;

                    return React.cloneElement(child, { onClick: handler });
                })
            }
        </SubMenu>
    </>
};

export const NavItem = (props: NavItemProperties) =>
    useView().tiny ? TinyNavItem(props) : FullNavItem(props);

export const NavMenu = (props: NavMenuProperties) => 
    useView().tiny ? TinyNav(props) : FullNav(props);

export default NavMenu;