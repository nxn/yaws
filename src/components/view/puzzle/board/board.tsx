import type { IBoardController } from '@components/sudoku/controllers/board';
import type { IEventListenerKey } from '@components/sudoku/events';
import type { ICell } from '@components/sudoku/models/cell';
import { IBoard, BoardEvents } from '@components/sudoku/models/board';

import Cell from './cell';
import React from 'react';


import { partialEq } from '@components/utilities/misc';
import { experimentalStyled as styled, alpha } from '@material-ui/core/styles';
import { grey } from '@material-ui/core/colors';
import clsx from 'clsx';


type BoardProperties = { 
    model:      IBoard,
    controller: IBoardController,
    scale:      number,
    className?: string
};

type BoardState = {
    isReady:            boolean,
    highlightedColumn:  number,
    highlightedRow:     number,
    readyListener?:     IEventListenerKey,
    cursorListener?:    IEventListenerKey
};

export class Board extends React.Component<BoardProperties, BoardState> {
    constructor(props: BoardProperties) {
        super(props);
        this.state = {
            isReady:            props.model.isReady(),
            highlightedColumn:  props.model.getCursor().column.index, 
            highlightedRow:     props.model.getCursor().row.index
        };
    }

    componentDidMount() {
        const listeners = {
            readyListener: this.props.model.events
                .get(BoardEvents.ReadyStateChanged)
                .attach(this.updateReadyState),

            cursorListener: this.props.model.events
                .get(BoardEvents.CursorMoved)
                .attach(this.updateHighlightState)
        }

        this.setState(() => listeners);
    }
    
    componentWillUnmount() {
        if (this.state.readyListener) {
            this.props.model.events.get(BoardEvents.ReadyStateChanged).detach(this.state.readyListener);
        }
        
        if (this.state.cursorListener) {
            this.props.model.events.get(BoardEvents.CursorMoved).detach(this.state.cursorListener);
        }

        this.setState(() => ({
            readyListener: undefined,
            cursorListener: undefined
        }));
    }

    // TODO: Since scaling is now done via dynamic CSS, re-renders are necessary in order to update it. :(
    // shouldComponentUpdate(_: BoardProperties, nextState: BoardState) {
    //     return !partialEq(this.state, nextState);
    // }

    updateReadyState = (board: IBoard) => {
        if (this.props.model === board && this.state.isReady !== board.isReady()) {
            this.setState(() => ({ isReady: board.isReady() }));
        }
    }

    updateHighlightState = (board: IBoard, cell: ICell) => {
        if (board !== this.props.model) { return; }
        this.setHighlight(cell);
    }

    setHighlight = (cell: ICell) => {
        const newState = {
            highlightedColumn: cell.column.index,
            highlightedRow: cell.row.index
        };

        if (!partialEq(this.state, newState)) {
            this.setState(() => newState);
        }
    }

    resetHighlight = () => {
        this.setHighlight(this.props.model.getCursor());
    }

    isHighlighted(cell: ICell) {
        return cell.row.index    === this.state.highlightedRow 
            || cell.column.index === this.state.highlightedColumn;
    }

    setCursor = (cell: ICell) => {
        this.props.controller.setCursor(this.props.model, cell);
    }

    render() {
        return (
            <div id={this.props.model.id} 
                className={ clsx("board", !this.state.isReady && "loading", this.props.className) }//this.state.isReady ? "board" : "board loading" }
                onMouseLeave={ this.resetHighlight }>{
                this.props.model.cells.map((cell: ICell) => 
                    <Cell 
                        key         = { cell.index }
                        model       = { cell } 
                        controller  = { this.props.controller }
                        board       = { this.props.model }
                        onClick     = { this.setCursor }
                        onMouseMove = { this.setHighlight }
                        highlight   = { this.isHighlighted(cell) } />
                )
            }</div>
        );
    }
}

export default styled(Board)(
    ({theme, scale}) => ({
        cursor:                 "default",
        WebkitUserSelect:       'none',
        MozUserSelect:          'none',
        msUserSelect:           'none',
        userSelect:             'none',
        touchAction:            'auto',

        textAlign:              'center',
        display:                'grid',
        gridTemplateColumns:    'repeat(9, auto)',
        verticalAlign:          'middle',

        backgroundColor:        theme.palette.divider,
        border:                 `${ 0.1875 * scale }rem solid ${ theme.palette.action.hover }`,
        borderRadius:           `${ 0.2500 * scale }rem`,

        '& .cell': {
            position:           'relative',
            backgroundColor:    theme.palette.background.paper,
            width:              `${ 2.0 * scale }rem`,
            height:             `${ 2.0 * scale }rem`,
            marginRight:        '0.0625rem',
            marginBottom:       '0.0625rem',
            transition:         `background-color ${ theme.transitions.duration.short }ms ease`,

            '& > div': { 
                position:   'absolute',
                width:      '100%',
                height:     '100%'
            },
        
            '& > .value': {
                color:      theme.palette.text.primary,
                fontFamily: '"Cabin Condensed", sans-serif',
                fontSize:   `${ 1.3125 * scale }rem`,
                lineHeight: `${ 2.0000 * scale }rem`
            },

            '& .invalid': {
                color: `${ theme.palette.error.main } !important`
            }
        },

        '& .cell.static': {
            '& > .value': {
                color:              theme.palette.text.secondary,
                boxSizing:          'border-box',
                border:             `0.0625rem solid ${ theme.palette.action.selected }`,
                backgroundColor:    `${ theme.palette.action.disabledBackground }`,
                borderRadius:       `${ 0.125 * scale }rem`,
                lineHeight:         `${ 1.375 * scale }rem`,
                width:              `${ 1.500 * scale }rem`,
                height:             `${ 1.500 * scale }rem`,
                margin:             `${ 0.250 * scale }rem`
            },
    
            '& > .invalid.value': {
                color:              `${ theme.palette.error.dark } !important`,
                backgroundColor:    `${ theme.palette.error.light }`,
                borderColor:        `${ theme.palette.error.dark }`,
                borderWidth:        `${ 0.0625 * scale }rem`,
                lineHeight:         `${ 1.3125 * scale }rem`
            },

            '& > .notes': { display: 'none' }
        },

        '& .cell.editable': {
            '& > .invalid.value': {
                backgroundImage: `linear-gradient(
                    -135deg,
                    transparent                     ${ 0.25000 * scale }rem, 
                    ${ theme.palette.error.main }   ${ 0.25000 * scale }rem,
                    ${ theme.palette.error.main }   ${ 0.46875 * scale }rem,
                    transparent                     ${ 0.46875 * scale }rem,
                    transparent                     ${ 2.00000 * scale }rem
                )`
            },

            '& > .notes': {
                display:                'grid',
                gridTemplateColumns:    'repeat(3, 1fr)',
                gridTemplateRows:       'repeat(3, 1fr)',
                overflow:               'hidden',

                // Color and Border fully transparent by default
                '& .candidate': {
                    lineHeight:    `${ 0.625 * scale }rem`,
                    color:          alpha(theme.palette.text.secondary, 0),
                    fontFamily:     '"Roboto", sans-serif',
                    fontSize:       `${ 0.625 + (0.8125 - 0.625) * (scale - 1.0) }rem`,
                    fontWeight:     700,
                    borderRight:    `0.0625rem solid ${ alpha(theme.palette.divider, 0) }`,
                    borderBottom:   `0.0625rem solid ${ alpha(theme.palette.divider, 0) }`,
                
                    transitionProperty:         'color, border',
                    transitionDuration:         `${ theme.transitions.duration.short }ms`,
                    transitionTimingFunction:   'ease',

                    '&.selected': { color: theme.palette.text.primary }
                },

                // Show all candidates and borders when .notes is hovered; use media queries to prevent hover state on
                // touch/mobile devices.
                '&:hover .candidate': {
                    '@media(hover: hover) and (pointer: fine)': {
                        color:          theme.palette.text.secondary,
                        borderRight:   `0.0625rem solid ${ theme.palette.divider }`,
                        borderBottom:  `0.0625rem solid ${ theme.palette.divider }`
                    },

                    '&.selected': { color: theme.palette.text.primary }
                },

                // When specific candidate is hovered over highlight it; use media queries to prevent hover state on
                // touch/mobile devices.
                '& .candidate:hover': {
                    '@media(hover: hover) and (pointer: fine)': {
                        color: theme.palette.mode === 'dark' 
                            ? theme.palette.secondary.dark 
                            : theme.palette.secondary.main
                    }
                }
            }
        },

        '& .cell.highlight': {
            backgroundColor:    `${ theme.palette.mode === 'dark' ? '#3a3a3a' : grey[100] }`,
            transition:         `background-color ${ theme.transitions.duration.short }ms ease`
        },
    
        '& .cell.cursor': {
            backgroundColor: `${ theme.palette.mode === 'dark' ? '#333' : grey[300] }`
        },

        // Apply board inner radius to corner cells -- alternate way of doing this involves settings 
        // the overflow property on the board, but that causes problems with small viewport sizes 
        '& .cell.c1.r1': { borderTopLeftRadius:        `${ 0.125 * scale }rem` },
        '& .cell.c9.r1': { borderTopRightRadius:       `${ 0.125 * scale }rem` },
        '& .cell.c1.r9': { borderBottomLeftRadius:     `${ 0.125 * scale }rem` },
        '& .cell.c9.r9': { borderBottomRightRadius:    `${ 0.125 * scale }rem` },

        /* Separate grid boxes (columns and rows 3 and 6) */
        '& .cell.c3, & .cell.c6': { marginRight:    `${ 0.1875 * scale }rem` },
        '& .cell.r3, & .cell.r6': { marginBottom:   `${ 0.1875 * scale }rem` },

        /* Remove borders and margins on the last column and row */
        '& .cell.c9, & .last-column':   { marginRight:  0, borderRight:  '0 !important' },
        '& .cell.r9, & .last-row':      { marginBottom: 0, borderBottom: '0 !important' },

        '& .hidden': { display: 'none !important' }
    })
);
