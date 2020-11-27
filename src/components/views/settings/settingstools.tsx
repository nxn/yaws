import React from 'react';

import { List, ListItem, ListItemIcon, ListItemText } from '../appbar/list';
import CancelIcon from '@material-ui/icons/Close';
import ApplyIcon from '@material-ui/icons/Check';
import Divider from '@material-ui/core/Divider';

export interface ISettingsToolsProperties {
    className?: string
};

export const SettingsTools = (props: ISettingsToolsProperties) => {
    return <>
        <List component="div">
            <ListItem button key="apply" data-mode="apply">
                <ListItemIcon><ApplyIcon /></ListItemIcon>
                <ListItemText primary="Apply" />
            </ListItem>
            <ListItem button key="cancel" data-mode="cancel">
                <ListItemIcon><CancelIcon /></ListItemIcon>
                <ListItemText primary="Cancel" />
            </ListItem>
        </List>
    </>;
}

export default SettingsTools;