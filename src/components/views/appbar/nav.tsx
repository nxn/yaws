import React from 'react';

import ViewContext from '../context';

import { Tabs, Tab, TinyTab, TabLabel } from './tabs';
import SubMenu from './submenu';

import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

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
    return (
        <Tab 
            key         = { `nav-full-tab-${ props.value }` }
            data-value  = { props.value }
            label       = { <TabLabel>{ label }</TabLabel> }
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
    onChange:   (id: string) => void
};

const FullNav = (props: NavMenuProperties) => {
    const changeHandler = (_: React.SyntheticEvent<Element, Event>, value: any) => {
        props.onChange(value);
    }

    return (
        <Tabs orientation="vertical" value={ props.value } onChange={ changeHandler } aria-label="Navigation">
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

    return <>
        <TinyTab aria-controls="nav-menu" aria-haspopup="true" onClick={ open }>
            { current.props.icon }
        </TinyTab>
        <SubMenu
            id="nav-menu"
            anchorEl={ anchor }
            anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
            transformOrigin={{ horizontal: 'left', vertical: 'top' }}
            marginThreshold={0}
            elevation={0}
            open={ Boolean(anchor) }
            onClose={ close }
            keepMounted>

            {/* 
            Material-UI passes a React ref to the first element of Menu components in an effort to align it with the DOM 
            element that the menu is anchored to. In order to avoid the headache of passing this ref through multiple
            functional wrapper components, a dummy MenuItem is added here to receive that ref. 
            
            See following for more details: https://stackoverflow.com/a/56309771/806003
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
    React.useContext(ViewContext).tiny ? TinyNavItem(props) : FullNavItem(props);

export const NavMenu = (props: NavMenuProperties) => 
    React.useContext(ViewContext).tiny ? TinyNav(props) : FullNav(props);

export default NavMenu;