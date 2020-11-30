import React from 'react';

import { 
    Fab as MuiFab, 
    FabProps as MuiFabProps,
    experimentalStyled as styled
} from '@material-ui/core';

import clsx from 'clsx';

//import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { grey } from '@material-ui/core/colors';

type ButtonProperties = {
    variant: 'value' | 'candidate' | 'clear',
    scale: number
};

export const FabUnstyled = (props: ButtonProperties & Omit<MuiFabProps, 'variant'>) => {
    const { variant, scale, className, ...remaining } = props;

    return (
        <MuiFab 
            className={ clsx(className, variant) } 
            variant={ variant === 'clear' ? 'extended' : 'circular' }
            { ...remaining }>

            { props.children }
        </MuiFab>
    );
}

const normalize = (min: number, max: number, scale: number) => min + (max - min) * (scale - 1);

export const Fab = styled(FabUnstyled)(({ theme, scale }) => {
    const width = `${ normalize(2.25, 3.5, scale) }rem`;
    return {
        '&.MuiFab-root': {
            color:              theme.palette.text.secondary,
            backgroundColor:    theme.palette.mode === 'dark' ? grey[800] : grey[200],
            boxShadow:          'none',
            width:              width,
            height:             width,
            
            '&:hover': {
                backgroundColor: theme.palette.action.hover
            },
    
            '&:active, &:focus': {
                boxShadow: 'none',
            },
        },

        '&.value': {
            fontFamily: '"Cabin Condensed", sans-serif',
            fontSize:   `${ 1.3125 * scale }rem`
        },

        '&.candidate': {
            fontFamily: '"Roboto Mono", monospace',
            fontSize:   `${ 0.65625 * scale }rem`
        },

        '&.clear': {
            color: theme.palette.text.primary,
            backgroundColor: theme.palette.mode === 'dark' ? grey[900] : grey[300],
            boxShadow: 'none',
            '&:hover': {
                backgroundColor: theme.palette.action.hover
            },
            '&:active, &:focus': {
                boxShadow: 'none',
            },
        }
    };
});