import React from 'react';

import Divider from '@material-ui/core/Divider';
import {
    Close as CancelIcon,
    Check as ApplyIcon,
} from '@material-ui/icons';

import Toolbar from '../appbar/toolbar';
import Button from '../appbar/button';

export interface ISettingsToolsProperties {
    className?: string
};

export const SettingsTools = (props: ISettingsToolsProperties) => {
    return (
        <Toolbar className={ props.className }>
            <Divider />
            <Button icon={<ApplyIcon />} label="Apply" />
            <Button icon={<CancelIcon />} label="Cancel" />
        </Toolbar>
    );
}

export default SettingsTools;