import React from 'react';

import {
    Button as MuiButton,
    ButtonProps as MuiButtonProps,
    ButtonGroup as MuiButtonGroup,
    ButtonGroupProps as MuiButtonGroupProps,
    IconButton as MuiIconButton,
    experimentalStyled as styled
} from '@material-ui/core';

import clsx from 'clsx';

import useView from '../viewcontext';

type AppBarButtonProperties = {
    icon: JSX.Element,
    label: string | JSX.Element,
    variant?: "standard" | "outlined" | "full",
    className?: string
}

const AppBarButton = (props: AppBarButtonProperties & Omit<MuiButtonProps, 'variant'>) => {
    const view = useView();
    const { icon, label, color, className, variant = 'standard', ...remaining } = props;

    return (
        <MuiButton 
            className   = { clsx(className, variant) }
            color       = "inherit" 
            variant     = { variant === 'outlined' ? variant : 'text' }
            //startIcon   = { view.appBar.labels && icon }
            { ...remaining }>

            { /*view.appBar.labels ? props.label : icon*/ }
            { icon }
            { view.appBar.labels && <span className="label">{ props.label }</span> }
        </MuiButton>
    );
}

export const Button = styled(AppBarButton)(({theme}) => ({
    '&.MuiButtonBase-root': {
        justifyContent: 'initial'
    },

    '&.MuiButton-root': {
        padding: theme.spacing(1),
        minWidth: 'initial',
        lineHeight: 'initial',
        '& .label': {
            padding: theme.spacing(0, 3),
            '& .MuiTypography-root': {
                lineHeight: 'initial',
                textTransform: 'initial'
            }
        }
    },

    '&.standard': {
        '.landscape &': {
            margin: theme.spacing(0, 1)
        },
        '.portrait &': {
            margin: theme.spacing(1, 0)
        }
    },

    '&.outlined': { },

    '&.full': {
        borderRadius: 0,
        padding: theme.spacing(1.5, 2),
        '.landscape &': {
            borderTop: `1px solid ${ theme.palette.divider }`,
            borderBottom: `1px solid ${ theme.palette.divider }`,
            paddingLeft: `calc(${ theme.spacing(2) } + 1px)`,
            paddingRight: `calc(${ theme.spacing(2) } + 1px)`,
        },
        '.portrait &': {
            borderLeft: `1px solid ${ theme.palette.divider }`,
            borderRight: `1px solid ${ theme.palette.divider }`,
            paddingTop: `calc(${ theme.spacing(2) } + 1px)`,
            paddingBottom: `calc(${ theme.spacing(2) } + 1px)`,
        }
    }

    // '& .MuiSvgIcon-root': {
    //     margin: theme.spacing(0, 2),
    // },
    // '& .MuiButton-label': {
    //     justifyContent: 'flex-start'
    // }
}));


const AppBarButtonGroup = (props: MuiButtonGroupProps) => {
    const view = useView();

    const { color, orientation, ...remaining } = props;
    return (
        <MuiButtonGroup
            color="inherit"
            orientation={ view.orientation === 'landscape' ? 'vertical' : 'horizontal' }
            { ...remaining } />
    );
};

export const ButtonGroup = styled(AppBarButtonGroup)(({theme}) => ({
    '&.MuiButtonGroup-root': {
        '.landscape &': {
            margin: theme.spacing(0, 1)
        },
        '.portrait &': {
            margin: theme.spacing(1, 0)
        }
    },

    '& .MuiButton-colorInherit': {
        borderColor: theme.palette.divider
    }
}));



export const IconButton = styled(MuiIconButton)(({theme}) => ({
    '&.MuiIconButton-root': {
        borderRadius: 0
    }
}));

export default Button;