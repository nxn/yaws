import React from 'react';

import SignOutIcon from '@material-ui/icons/ExitToApp';

import Toolbar from '../appbar/toolbar';
import Divider from '../appbar/divider';
import Button from '../appbar/button';

export interface IAccountToolsProperties {
    className?: string
};

export const AccountTools = (props: IAccountToolsProperties) => {
    return (
        <Toolbar className={ props.className }>
            <Divider />
            <Button guttered icon={<SignOutIcon />} label="Sign Out" />
        </Toolbar>
    );
}

export default AccountTools;