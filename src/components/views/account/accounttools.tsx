import React from 'react';

import { List, ListItem, ListItemIcon, ListItemText } from '../appbar/list';
import SignOutIcon from '@material-ui/icons/ExitToApp';

export interface IAccountToolsProperties {
    className?: string
};

export const AccountTools = (_: IAccountToolsProperties) => {
    return <>
        <List component="div">
            <ListItem button key="sign-out" data-mode="sign-out" disabled>
                <ListItemIcon><SignOutIcon /></ListItemIcon>
                <ListItemText primary="Sign Out" />
            </ListItem>
        </List>
    </>;
}

export default AccountTools;