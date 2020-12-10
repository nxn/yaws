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
        color: theme.palette.text.secondary,
        borderRadius: theme.shape.borderRadius,
        margin: theme.spacing(1, 0)
    },

    '& .MuiListItemIcon-root': {
        color: theme.palette.text.secondary
    },

    // TODO: The following approach to specifying text properties using a spread operator works, but it also causes
    // typescript to lose its mind.
    //'& .MuiListItemText-root': { ...theme.typography.button },

    '&.Mui-selected': {
        color: theme.palette.text.primary,
        backgroundColor: `${ theme.palette.action.selected } !important`,
        '& .MuiListItemIcon-root': {
            color: theme.palette.text.primary
        },
    },
    
    '&.MuiListItem-gutters': {
        padding: theme.spacing(0.5, 1)
    },
}));

export const ListItemFull = styled(MuiListItem)(({theme}) => ({
    '&.MuiListItem-root': {
        color: theme.palette.text.secondary,
    },
    '& .MuiListItemIcon-root': {
        color: theme.palette.text.secondary,
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(4)
    },
}));

export const GroupedList = styled(MuiList)(({theme}) => ({
    '&.MuiList-root': {
        margin: theme.spacing(1),
        borderRadius: `${theme.shape.borderRadius}px`,
        border: `1px solid ${ theme.palette.divider }`,
        overflow: 'hidden'
    },

    '& .MuiListItem-root': {
        margin: '0 !important',
        borderRadius: '0 !important',
    }
}));

export default List;