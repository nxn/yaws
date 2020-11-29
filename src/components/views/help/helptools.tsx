import React from 'react';

import Divider from '@material-ui/core/Divider';
import NavIcon from '@material-ui/icons/ChromeReaderModeOutlined';

import Toolbar from '../appbar/toolbar';
import { ToggleButton } from '../appbar/button';

export interface IHelpToolsProperties {
    className?: string
};

export const HelpTools = (props: IHelpToolsProperties) => {
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
        // <List component="div">
        //     <ListItem button key="toggle-nav" selected={ true } data-mode="toggle-nav" >
        //         <ListItemIcon><NavIcon /></ListItemIcon>
        //         <ListItemText primary="Navigation" />
        //     </ListItem>
        // </List>
}

export default HelpTools;