// Modifies the standard menu so that it appears attached to the AppBar
import {
    Menu,
    experimentalStyled as styled
} from '@material-ui/core';

export const SubMenu = styled(Menu)(
    ({theme}) => ({
        '& .MuiList-padding': {
            paddingTop: 0,
            paddingBottom: 0
        },
        '& .MuiMenu-paper': {
            color:  theme.palette.text.secondary,
            border: `1px solid  ${ theme.palette.divider }`,
            '.landscape &': {
                borderLeft:             `1px dashed ${ theme.palette.divider }`,
                borderTopLeftRadius:    '0',
                borderBottomLeftRadius: '0',
            },
            '.portrait &': {
                borderTop:             `1px dashed ${ theme.palette.divider }`,
                borderTopLeftRadius:    '0',
                borderTopRightRadius:   '0',
            }
        },
        '& .MuiListItemIcon-root': {
            color: theme.palette.text.secondary,
        }
        // '& .MuiMenuItem-root': {
        //     minHeight: '48px'
        // }
    })
);

export default SubMenu;