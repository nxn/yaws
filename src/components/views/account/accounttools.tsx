import React from 'react';

import SignOutIcon from '@material-ui/icons/ExitToApp';

import useView from '../viewcontext';
import Toolbar from '../appbar/toolbar';
import Divider from '../appbar/divider';
import Button from '../appbar/button';

export interface IAccountToolsProperties {
    className?: string
};

export const AccountTools = (props: IAccountToolsProperties) => {
    const view = useView();
    return (
        <Toolbar className={ props.className }>
            <Divider />
            <Button icon={<SignOutIcon />} label="Sign Out" />
        </Toolbar>
    );
}

export default AccountTools;