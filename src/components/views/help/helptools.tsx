import React from 'react';

import { List, ListItem, ListItemIcon, ListItemText } from '../appbar/list';
import NavIcon from '@material-ui/icons/VerticalSplit';

export interface IHelpToolsProperties {
    className?: string
};

export const HelpTools = (_: IHelpToolsProperties) => {
    return <>
        <List component="div">
            <ListItem button key="toggle-nav" selected={ true } data-mode="toggle-nav" >
                <ListItemIcon><NavIcon /></ListItemIcon>
                <ListItemText primary="Navigation" />
            </ListItem>
        </List>
    </>;
}

export default HelpTools;