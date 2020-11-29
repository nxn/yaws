import React from 'react';

import Divider from '@material-ui/core/Divider';
import NavIcon from '@material-ui/icons/VerticalSplit';

import Toolbar from '../appbar/toolbar';
import Button from '../appbar/button';

export interface IHelpToolsProperties {
    className?: string
};

export const HelpTools = (props: IHelpToolsProperties) => {
    return (
        <Toolbar className={ props.className }>
            <Divider />
            <Button icon={<NavIcon />} label="Navigation" />
        </Toolbar>
    );
        // <List component="div">
        //     <ListItem button key="toggle-nav" selected={ true } data-mode="toggle-nav" >
        //         <ListItemIcon><NavIcon /></ListItemIcon>
        //         <ListItemText primary="Navigation" />
        //     </ListItem>
        // </List>
}

export default HelpTools;