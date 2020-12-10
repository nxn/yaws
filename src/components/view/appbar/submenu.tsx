// Modifies the standard menu so that it appears attached to the AppBar
import {
    Menu,
    experimentalStyled as styled
} from '@material-ui/core';

import { lighten, darken } from '@material-ui/core/styles';

export const SubMenu = styled(Menu)(
    ({theme}) => ({
        '& .MuiList-padding': {
            paddingTop: 0,
            paddingBottom: 0
        },
        '& .MuiMenu-paper': {
            color: theme.palette.text.secondary,
            backgroundColor: theme.palette.mode === "dark" 
                ? lighten(theme.palette.background.paper, 0.08) 
                : darken(theme.palette.background.paper, 0.08),

            '.landscape &': {
                borderLeft:             theme.palette.mode === 'dark' ? 0 : `1px solid ${ theme.palette.divider }`,
                borderTopLeftRadius:    0,
                borderBottomLeftRadius: 0,
            },
            '.portrait &': {
                borderTop:              theme.palette.mode === 'dark' ? 0 : `1px solid ${ theme.palette.divider }`,
                borderTopLeftRadius:    0,
                borderTopRightRadius:   0,
            }
        },

        '& .MuiPaper-elevation':{
            /* offset-x | offset-y | blur-radius | spread-radius | color */
            boxShadow: 
                '1px 1px 1px -2px rgba(0,0,0,0.2),'+
                '1px 1px 1px 0px rgba(0,0,0,0.14),'+
                '3px 3px 3px 0px rgba(0,0,0,0.12)'
        },

        '& .MuiListItemIcon-root': {
            color: theme.palette.text.secondary,
        }
    })
);

export default SubMenu;