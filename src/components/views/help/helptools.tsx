import React from 'react';

import NavIcon from '@material-ui/icons/ChromeReaderModeOutlined';

import useView from '../viewcontext';
import Toolbar from '../appbar/toolbar';
import Divider from '../appbar/divider';
import { ToggleButton } from '../appbar/button';

export interface IHelpToolsProperties {
    className?: string
};

export const HelpTools = (props: IHelpToolsProperties) => {
    const view = useView();
    const [content, setContent] = React.useState(false);
    const toggleContent = () => {
        setContent(!content);
    }
    return (
        <Toolbar className={ props.className }>
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

export default HelpTools;