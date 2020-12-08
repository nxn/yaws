import React from 'react';

import {
    Tab         as MuiTab,
    Tabs        as MuiTabs,
    experimentalStyled as styled
} from '@material-ui/core';

export const Tabs = styled(MuiTabs)(({theme}) => ({
    '&.MuiTabs-root': {
        backgroundColor: 'rgba(0, 0, 0, 0.08)',
        borderBottom: `2px solid ${ theme.palette.divider }`,
    },
    '&.MuiTabs-root, & .MuiTabs-fixed': {
        overflow: 'visible !important'
    },
    '& .MuiTabs-indicator': {
        bottom: '-2px'
    }
}));

export const Tab = styled(MuiTab)(({theme}) => ({

}));