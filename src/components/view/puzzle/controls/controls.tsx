import React from 'react';

import { experimentalStyled as styled } from '@material-ui/core/styles';
import IconClear from '@material-ui/icons/Clear';
import clsx from 'clsx';

import type { IActions } from '@components/sudoku/actions/actions';
import type { IBoard } from '@components/sudoku/models/board';

import { range } from '@components/utilities/misc';

import { Fab } from './button';

type ControlProperties = { 
    board:      IBoard,
    actions:    IActions,
    scale:      number,
    visible?:   boolean,
    className?: string
};

export class Controls extends React.Component<ControlProperties, any> {
    constructor(props: ControlProperties) {
        super(props);
    }

    setCellValue = (value: number) => {
        this.props.actions.cell.setValue(this.props.board, this.props.board.getCursor(), value);
    }

    toggleCandidate = (value: number) => {
        this.props.actions.candidate.toggle(this.props.board, this.props.board.getCursor(), value);
    }

    clear = () => {
        this.props.actions.cell.clear(this.props.board, this.props.board.getCursor());
    }

    render() {
        return (
            <div className={ clsx('control-panel', this.props.className) }>
                <div className="values">{
                    range(1, 9).map(n => (
                        <Fab
                            key         = { n }
                            variant     = "value"
                            scale       = { this.props.scale }
                            aria-label  = { n.toString() }
                            onClick     = { this.setCellValue.bind(this, n) }>
                                { n }
                            </Fab>
                    ))
                }</div>

                <div className="notes">{
                    range(1, 9).map(n => (
                        <Fab
                            key         = { n }
                            variant     = "candidate"
                            scale       = { this.props.scale }
                            aria-label  = { n.toString() }
                            onClick     = { this.toggleCandidate.bind(this, n) }>
                                { n }
                            </Fab>
                    ))
                }</div>

                <Fab 
                    variant     = "clear"
                    className   = "btn-clear"
                    scale       = { this.props.scale }
                    aria-label  = "Clear"
                    onClick     = { this.clear }>

                    <IconClear />
                </Fab>
            </div>
        );
    }
}

export default styled(Controls)(
    ({scale}) => ({
        display: 'grid',
        gap: `${ scale }rem`,
        '& .values, & .notes': {
            display:                'grid',
            gridTemplateColumns:    'repeat(3, 1fr)',
            gridTemplateRows:       'repeat(3, 1fr)',
            gap:                    `${ 0.25 * scale }rem`,
        },
        '& .notes':     { gridArea: 'notes' },
        '& .values':    {  gridArea: 'values' },
        '& .btn-clear': { 
            gridArea: 'clear',

            '.landscape &': {
                width: 'auto'
            },

            '.portrait &': {
                height: 'auto'
            },
        },

        '.landscape &': {
            gridTemplateAreas: `
                "values"
                "clear"
                "notes"
            `
        },
        '.portrait &': {
            gridTemplateAreas:  '"values clear notes"'
        },
    })
);