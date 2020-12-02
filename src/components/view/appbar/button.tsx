import React from 'react';

import {
    Theme,

    Button              as MuiButton,
    ButtonProps         as MuiButtonProps,
    ButtonGroup         as MuiButtonGroup,
    ButtonGroupProps    as MuiButtonGroupProps,

    ToggleButton            as MuiToggleButton,
    ToggleButtonProps       as MuiToggleButtonProps,
    ToggleButtonGroup       as MuiToggleButtonGroup,
    ToggleButtonGroupProps  as MuiToggleButtonGroupProps,

    IconButton as MuiIconButton,
    experimentalStyled as styled
} from '@material-ui/core';

import { Interpolation } from '@emotion/react';

import clsx from 'clsx';

import useView from '../context';

type AppBarButtonProperties = {
    icon: JSX.Element,
    label: string | JSX.Element,
    variant?: "standard" | "outlined" | "full",
    className?: string
}

function asAppBarButton<P extends MuiButtonProps | MuiToggleButtonProps>(
    MuiButtonComponent: React.ComponentType<P>
) {
    return (props: AppBarButtonProperties & Omit<P, 'variant'>) => {
        const view = useView();
        const { icon, label, color, className, variant = 'standard', ...remaining } = props;

        return (
            // TODO: Use discriminated union instead of casting the props object? The issue is that 'variant' is a
            // MuiButtonProps member, but it does not exist on MuiToggleButtonProps.
            <MuiButtonComponent 
                className   = { clsx(className, variant) }
                color       = "inherit" 
                variant     = { variant === 'outlined' ? variant : 'text' }
                { ...remaining as any }>

                { icon }
                { view.appBar.labels && <span className="label">{ props.label }</span> }
            </MuiButtonComponent>
        );
    };
}

function asAppBarButtonGroup<P extends MuiButtonGroupProps | MuiToggleButtonGroupProps>(
    MuiButtonGroupComponent: React.ComponentType<P>
) {
    return (props: P) => {
        const view = useView();
        const { color, orientation, ...remaining } = props;
        return (
            <MuiButtonGroupComponent
                color="inherit"
                orientation={ view.orientation === 'landscape' ? 'vertical' : 'horizontal' }
                { ...remaining as any } />
        );
    }
}

export const IconButton = styled(MuiIconButton)({
    '&.MuiIconButton-root': {
        borderRadius: 0
    }
});

const appBarButtonStyle: Interpolation<{ theme?: Theme }> = ({theme}) => ({
    '&.MuiButtonBase-root': {
        justifyContent: 'initial'
    },

    '&.MuiButton-root, &.MuiToggleButton-root': {
        padding: theme.spacing(1),
        minWidth: 'initial',
        lineHeight: 1.43,
        '& .label': {
            padding: theme.spacing(0, 3),
            '& .MuiTypography-root': {
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
});

const appBarButtonGroupStyle: Interpolation<{ theme?: Theme }> = ({theme}) => ({
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
})

export const Button             = styled(asAppBarButton(MuiButton))(appBarButtonStyle);
export const ButtonGroup        = styled(asAppBarButtonGroup(MuiButtonGroup))(appBarButtonGroupStyle);

export const ToggleButton       = styled(asAppBarButton(MuiToggleButton))(appBarButtonStyle);
export const ToggleButtonGroup  = styled(asAppBarButtonGroup(MuiToggleButtonGroup))(appBarButtonGroupStyle);

export default Button;