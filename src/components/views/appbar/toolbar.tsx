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
    gap: theme.spacing(1),

    '.portrait &': {
        flexFlow: 'row nowrap'
    },

    '.landscape &': {
        flexFlow: 'column nowrap'
    },
}));

export default Toolbar;