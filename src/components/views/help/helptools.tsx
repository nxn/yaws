import React from 'react';

import { List, ListItem, ListItemIcon, ListItemText } from '../appbar/list';
import NavIcon from '@material-ui/icons/VerticalSplit';
import Divider from '@material-ui/core/Divider';

export interface IHelpToolsProperties {
    className?: string
};

export const HelpTools = (props: IHelpToolsProperties) => {
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