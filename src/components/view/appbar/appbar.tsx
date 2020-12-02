import React from 'react';

import {
    Typography,
    experimentalStyled as styled
} from '@material-ui/core';

import { ChevronLeft, ChevronRight } from '@material-ui/icons';

import useView from '../context';
import Button from './button';

type AppBarProperties = {
    children: React.ReactNode,
    title: string,
    className?: string
}

const AppBarUnstyled = (props: AppBarProperties) => {
    const view = useView();
    const title = <Typography style={{ textTransform: 'capitalize' }} variant="body1">{ props.title }</Typography>;

    return (
        <div className={ props.className }>
            { 
                view.orientation === 'landscape' && !view.tiny &&
                    <Button
                        className   = { 'expander' }
                        icon        = { view.appBar.labels ? <ChevronLeft /> : <ChevronRight /> } 
                        label       = { title }
                        onClick     = { view.appBar.toggleLabels } />
            }
            { props.children }
        </div>
    );
};

export const AppBar = styled(AppBarUnstyled)(({theme}) => ({
    position: 'sticky',
    top: 0,
    left: 0,
    zIndex: 1,
    display: 'flex',
    
    color: theme.palette.text.secondary,
    backgroundColor: theme.palette.background.paper,

    '.landscape &': {
        flexFlow: 'column nowrap',
        height: '100vh',
        borderRight: `1px solid ${ theme.palette.divider }`,
    },

    '.portrait &': {
        flexFlow: 'row nowrap',
        borderBottom: `1px solid ${ theme.palette.divider }`,
    },

    // '& .selected': {
    //     color: theme.palette.text.primary,
    //     backgroundColor: theme.palette.action.selected
    // },

    '& .expander': {
        margin: `${ theme.spacing(1) } !important`
    },
}));

export default AppBar;