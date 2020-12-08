import React from 'react';

import { Zoom as Animation, experimentalStyled as styled } from '@material-ui/core';
import IconClear from '@material-ui/icons/Clear';
import clsx from 'clsx';

import type { IActions } from '@components/sudoku/actions/actions';
import type { IBoard } from '@components/sudoku/models/board';

import { range } from '@components/utilities/misc';

import { Fab } from './button';

type ControlProperties = { 
    model:      IBoard,
    actions:    IActions,
    scale:      number,
    open?:      boolean,
    className?: string
};

export class Controls extends React.Component<ControlProperties, any> {
    constructor(props: ControlProperties) {
        super(props);
    }

    setCellValue = (value: number) => {
        this.props.actions.cell.setValue(this.props.model, this.props.model.getCursor(), value);
    }

    toggleCandidate = (value: number) => {
        this.props.actions.candidate.toggle(this.props.model, this.props.model.getCursor(), value);
    }

    clear = () => {
        this.props.actions.cell.clear(this.props.model, this.props.model.getCursor());
    }

    render() {
        return (
            <div className={ clsx('control-panel', this.props.className, this.props.open ? 'expanded' : 'collapsed') }>
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
    ({theme, scale}) => ({
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

        '&.collapsed': {
            transform: 'scale(0)',
            transformOrigin: 'top left',
            opacity: 0,
            // width: 0,
            // height: 0,
            display: 'none',
            transition: theme.transitions.create(['transform', 'width', 'height', 'opacity'], {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.leavingScreen,
            })
        },
        '&.expanded': {
            transform: 'scale(1)',
            transformOrigin: 'top left',
            opacity: 1,
            // height: `488px`,
            // width: '184px',
            
            transition: theme.transitions.create(['transform', 'width', 'height', 'opacity'], {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen,
            })
        }
    })
);