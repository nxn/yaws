// Modifies the standard menu so that it appears attached to the AppBar

import Menu from '@material-ui/core/Menu';
import { experimentalStyled as styled } from '@material-ui/core/styles';

export default styled(Menu)(
    ({theme}) => ({
        '& .MuiList-padding': {
            paddingTop: 0,
            paddingBottom: 0
        },
        '& .MuiMenu-paper': {
            color:                  theme.palette.text.secondary,
            border:                 `1px solid  ${ theme.palette.divider }`,
            borderLeft:             `1px dashed ${ theme.palette.divider }`,
            borderTopLeftRadius:    '0',
            borderBottomLeftRadius: '0',
        },
        '& .MuiListItemIcon-root': {
            color: theme.palette.text.secondary,
        }
        // '& .MuiMenuItem-root': {
        //     minHeight: '48px'
        // }
    })
);