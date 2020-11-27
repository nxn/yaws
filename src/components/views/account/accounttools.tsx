import React from 'react';

import { List, ListItem, ListItemIcon, ListItemText } from '../appbar/list';
import SignOutIcon from '@material-ui/icons/ExitToApp';
import Divider from '@material-ui/core/Divider';

export interface IAccountToolsProperties {
    className?: string
};

export const AccountTools = (props: IAccountToolsProperties) => {
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