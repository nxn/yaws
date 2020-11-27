import React from 'react';

import { List, ListItem, ListItemIcon, ListItemText } from '../appbar/list';
import NavIcon from '@material-ui/icons/Navigation';

export interface IHelpToolsProperties {
    className?: string
};

export const HelpTools = (props: IHelpToolsProperties) => {
    return <>
        <List>
            <ListItem button key="toggle-nav" selected={ true } data-mode="toggle-nav" >
                <ListItemIcon><NavIcon /></ListItemIcon>
                <ListItemText primary="Navigation" />
            </ListItem>
        </List>
    </>;
}

export default HelpTools;