import React from 'react';

import { experimentalStyled as styled } from '@material-ui/core/styles';

type ToolbarProperties = {
    children?: React.ReactNode;
    className?: string;
    disablePadding?: boolean;
}

const AppBarToolbar = (props: ToolbarProperties) => {
    return (
        <div className={ props.className }>
            { props.children }
        </div>
    );
}

export const Toolbar = styled(AppBarToolbar)(({theme}) => ({
    display: 'flex',
    
    '.landscape &': {
        flexFlow: 'column nowrap'
    },
    '.portrait &': {
        flexFlow: 'row nowrap'
    },

    // Nasty CSS Hacks to get around lack of support for flex gaps
    margin: theme.spacing(-1, 0, 0, -1),
    '& > *': {
        margin: `${ theme.spacing(1, 0, 0, 1) } !important`,
        '.landscape &.gutters': {
            margin: `${ theme.spacing(1, 1, 0, 2) } !important`
        },
        '.portrait &.gutters': {
            margin: `${ theme.spacing(2, 0, 1, 1) } !important`
        },
    },
}));

export default Toolbar;