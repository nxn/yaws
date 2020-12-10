import React from 'react';

import {
    Typography,
    experimentalStyled as styled
} from '@material-ui/core';

import { ChevronLeft, ChevronRight } from '@material-ui/icons';

import clsx from 'clsx';

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

    const collapseToggle = !view.tiny && view.orientation === 'landscape';
    return (
        <div className={ clsx(props.className, collapseToggle && (view.appBar.labels ? 'expanded' : 'collapsed')) }>
            { 
                collapseToggle &&
                    <Button
                        className   = { 'toggle' }
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
    overflow: 'hidden',

    color: theme.palette.text.secondary,
    backgroundColor: theme.palette.background.paper,

    '.landscape &': {
        flexFlow: 'column nowrap',
        height: '100vh',
        boxShadow:
            '1px 0px 1px -1px rgba(0,0,0,0.2),' +
            '1px 0px 1px 0px rgba(0,0,0,0.14),' +
            '3px 0px 3px 0px rgba(0,0,0,0.12)'
    },

    '.portrait &': {
        flexFlow: 'row nowrap',
        boxShadow: 
            '0px 1px 1px -1px rgba(0,0,0,0.2),' +
            '0px 1px 1px 0px rgba(0,0,0,0.14),' +
            '0px 3px 3px 0px rgba(0,0,0,0.12)'
    },

    '&.collapsed': {
        width: '58px',
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        })
    },

    '&.expanded': {
        width: '180px',
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        })
    },

    '& .toggle': {
        margin: `${ theme.spacing(1) } !important`
    },
}));

export default AppBar;