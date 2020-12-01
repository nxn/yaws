import React from 'react';

import {
    Close as CancelIcon,
    Check as ApplyIcon,
    ChromeReaderModeOutlined as NavIcon
} from '@material-ui/icons';

import Toolbar from '../appbar/toolbar';
import Divider from '../appbar/divider';
import { Button, ToggleButton } from '../appbar/button';

export interface ISettingsToolsProperties {
    className?: string
};

export const SettingsTools = (props: ISettingsToolsProperties) => {
    const [content, setContent] = React.useState(false);
    const toggleContent = () => {
        setContent(!content);
    }
    return (
        <Toolbar className={ props.className }>
            <Divider />

            <Button icon={<ApplyIcon />} label="Apply" />
            <Button icon={<CancelIcon />} label="Cancel" />

            <Divider />

            <ToggleButton 
                value       = "content" 
                selected    = { content }
                icon        = { <NavIcon /> } 
                label       = "Content" 
                onChange    = { toggleContent } />
        </Toolbar>
    );
}

export default SettingsTools;