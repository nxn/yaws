import React from 'react';

import { List, ListItem, ListItemIcon, ListItemText } from '../appbar/list';
import ResetIcon from '@material-ui/icons/SettingsBackupRestore';
import ApplyIcon from '@material-ui/icons/Check';
import Divider from '@material-ui/core/Divider';

export interface ISettingsToolsProperties {
    className?: string
};

export const SettingsTools = (props: ISettingsToolsProperties) => {
    return <>
        <Divider />
        <List>
            <ListItem button key="apply" data-mode="apply">
                <ListItemIcon><ApplyIcon /></ListItemIcon>
                <ListItemText primary="Apply" />
            </ListItem>
            <ListItem button key="reset" data-mode="reset">
                <ListItemIcon><ResetIcon /></ListItemIcon>
                <ListItemText primary="Reset" />
            </ListItem>
        </List>
    </>;
}

export default SettingsTools;