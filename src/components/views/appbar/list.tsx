import React from 'react';

import MuiList      from '@material-ui/core/List';
import MuiListItem  from '@material-ui/core/ListItem';

import { experimentalStyled as styled } from '@material-ui/core/styles';

export { default as ListItemIcon } from '@material-ui/core/ListItemIcon';
export { default as ListItemText } from '@material-ui/core/ListItemText';

export const List = styled(MuiList)(({theme}) => ({
    '&.MuiList-padding': {
        padding: theme.spacing(0, 1)
    }
}));

export const ListItem = styled(MuiListItem)(({theme}) => ({
    '&.MuiListItem-root': {
        borderRadius: theme.shape.borderRadius,
        margin: theme.spacing(1, 0)
    },
    
    '&.MuiListItem-gutters': {
        padding: theme.spacing(0.5, 1)
    }
}));

export const ListItemFull = styled(MuiListItem)(({theme}) => ({
    '& .MuiListItemIcon-root': {
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(4)
    },
}));

export default List;