import type { ICellController } from '../controller';
import type { IBoard } from '../board';
import { ValueButtons, NoteButtons } from './buttons';
import React from 'react';
import icons from './images/icons.svg';
import { experimentalStyled as styled } from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';
import IconClear from '@material-ui/icons/Clear';
import { grey } from '@material-ui/core/colors';
import clsx from 'clsx';

type ControlProperties = { 
    board:      IBoard,
    controller: ICellController,
    scale:      number,
    className?: string
};



export class Controls extends React.Component<ControlProperties, any> {
    constructor(props: ControlProperties) {
        super(props);
    }

    setCellValue = (value: number) => {
        this.props.controller.setCellValue(this.props.board, this.props.board.getCursor(), value);
    }

    toggleCandidate = (value: number) => {
        this.props.controller.toggleCandidate(this.props.board, this.props.board.getCursor(), value);
    }

    clear = () => {
        this.props.controller.clear(this.props.board, this.props.board.getCursor());
    }

    render() {
        return (
            <div className={ clsx('control-panel', this.props.className) }>
                <ValueButtons onClick={ this.setCellValue } />
                <NoteButtons  onClick={ this.toggleCandidate } />
                <Fab variant="extended" aria-label="Clear" className="btn-clear" onClick={ this.clear  }>
                    <IconClear />
                </Fab>
            </div>
        );
    }
}

export default styled(Controls)(
    ({theme, scale}) => ({
        display: 'grid',
        gap: '2rem',
        '& .values, & .notes': {
            display:                'grid',
            gridTemplateColumns:    'repeat(3, 1fr)',
            gridTemplateRows:       'repeat(3, 1fr)',
            gap:                    '1rem',
        },
        '& .notes':     { gridArea: 'notes' },
        '& .values':    { 
            gridArea: 'values',
            '& button': {
                fontFamily: '"Cabin Condensed", sans-serif',
                fontSize:   '2.25rem',
            }
        },
        '& .btn-clear': { 
            gridArea: 'clear',

            color: theme.palette.text.primary,
            backgroundColor: theme.palette.mode === 'dark' ? grey[900] : grey[300],
            boxShadow: 'none',
            '&:hover': {
                backgroundColor: theme.palette.action.hover
            },
            '&:active, &:focus': {
                boxShadow: 'none',
            }
        },

        '@media (orientation: landscape)': {
            gridTemplateAreas: `
                'values'
                'clear'
                'notes'`
        },

        '@media (orientation: portrait)': {
            marginTop:          '2rem',
            gridTemplateAreas:  'values clear notes'
        },
    })
);