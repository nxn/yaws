// Modifies the standard menu so that it appears attached to the AppBar

import Menu from '@material-ui/core/Menu';
import { experimentalStyled as styled } from '@material-ui/core/styles';

export default styled(Menu)(
    ({theme}) => ({
        '& .MuiMenu-paper': {
            boxSizing:              'border-box',
            border:                 `1px solid  ${ theme.palette.divider }`,
            borderLeft:             `1px dashed ${ theme.palette.divider }`,
            borderTopLeftRadius:    '0',
            borderBottomLeftRadius: '0',
        }
    })
);