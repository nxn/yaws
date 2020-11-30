import React from 'react';

import Divider from '@material-ui/core/Divider';
import SignOutIcon from '@material-ui/icons/ExitToApp';

import Toolbar from '../appbar/toolbar';
import Button from '../appbar/button';

export interface IAccountToolsProperties {
    className?: string
};

export const AccountTools = (props: IAccountToolsProperties) => {
    return (
        <Toolbar className={ props.className }>
            <Divider />
            <Button icon={<SignOutIcon />} label="Sign Out" />
        </Toolbar>
    );
}

export default AccountTools;