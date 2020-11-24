import React from 'react';
import { range } from '@components/utilities/misc';

import Fab from '@material-ui/core/Fab';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { grey } from '@material-ui/core/colors';

type ButtonProperties = {
    onClick:    (value: number) => void
};


const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            color: theme.palette.text.secondary,
            backgroundColor: theme.palette.mode === 'dark' ? grey[800] : grey[200],
            boxShadow: 'none',
            '&:hover': {
                backgroundColor: theme.palette.action.hover
            },
            '&:active, &:focus': {
                boxShadow: 'none',
            }
        }
    }),
);

const createButton = (number: number, props: ButtonProperties, className: string) => (
    <Fab key={ number } aria-label={number.toString()} className={className} onClick={ () => props.onClick(number) }>
        {number}
    </Fab>
);

export const ValueButtons = (props: ButtonProperties) => Buttons(props, "values");
export const NoteButtons  = (props: ButtonProperties) => Buttons(props, "notes");
const Buttons = (props: ButtonProperties, className = "") => {
    const classes = useStyles(props);
    return (
        <div className={className}>
            { range(1,9).map(n => createButton(n, props, classes.root)) }
        </div>
    );
}