import React from 'react';

import MuiDivider, { DividerProps } from '@material-ui/core/Divider';

import useView from '../viewcontext';

export const Divider = (props: DividerProps) => {
    const view = useView();
    const { orientation, flexItem, ...remaining } = props;
    return (
        <MuiDivider flexItem orientation={ view.orientation === 'landscape' ? 'horizontal' : 'vertical' } { ...remaining } />
    );
}

export default Divider;