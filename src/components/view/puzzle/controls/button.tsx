import React from 'react';

import { 
    Fab as MuiFab, 
    FabProps as MuiFabProps,
    experimentalStyled as styled
} from '@material-ui/core';

import clsx from 'clsx';

//import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { lighten, darken  } from '@material-ui/core/styles';

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
    const width = normalize(2.25, 3.5, scale);
    return {
        '&.MuiFab-root': {
            color:              theme.palette.text.secondary,
            backgroundColor:    theme.palette.mode === 'dark' 
                                    ? lighten(theme.palette.background.default, 0.12) 
                                    : darken(theme.palette.background.default, 0.12),
            boxShadow:          'none',
            lineHeight:         'initial',
            width:              `${ width }rem`,
            height:             `${ width }rem`,
    
            '&:active': {
                boxShadow: 'none',
                backgroundColor: theme.palette.mode === 'dark'
                    ? lighten(theme.palette.background.default, 0.12) 
                    : darken(theme.palette.background.default, 0.12),
            },

            '&:focus': {
                boxShadow: 'none',
                backgroundColor: theme.palette.mode === 'dark'
                    ? lighten(theme.palette.background.default, 0.12) 
                    : darken(theme.palette.background.default, 0.12),
            },

            '&:hover': {
                '@media(hover: hover) and (pointer: fine)': {
                    backgroundColor: theme.palette.mode === 'dark'
                        ? lighten(theme.palette.background.default, 0.16) 
                        : darken(theme.palette.background.default, 0.16),
                }
            },
        },

        '&.MuiFab-extended': {
            borderRadius: `${ width/2 }rem`,
            minWidth: 'initial'
        },

        '&.value': {
            fontFamily: '"Cabin Condensed", sans-serif',
            fontSize:   `${ 1.3125 * scale }rem`
        },

        '&.candidate': {
            fontFamily: '"Roboto", sans-serif',
            fontSize:   `${ 0.65625 * scale }rem`
        },

        // '&.clear': {
        //     backgroundColor: theme.palette.mode === 'dark' ? '#222' : grey[400],
        //     boxShadow: 'none',

        //     '&:active': {
        //         boxShadow: 'none',
        //         backgroundColor: theme.palette.mode === 'dark' ? '#222' : grey[400]
        //     },
        //     '&:focus': {
        //         boxShadow: 'none',
        //         backgroundColor: theme.palette.mode === 'dark' ? '#222' : grey[400]
        //     },
        //     '&:hover': {
        //         '@media(hover: hover) and (pointer: fine)': {
        //             backgroundColor: theme.palette.mode === 'dark' ? '#111' : grey[500]
        //         }
        //     },
        // }
    };
});