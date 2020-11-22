import type { IBoardController } from '../controller';
import type { IEventListenerKey } from '../events';
import type { ICell } from '../cell';
import { IBoard, BoardEvents } from '../board';
import Cell from './cell';
import React from 'react';


import { partialEq } from '@components/utilities/misc';
import { experimentalStyled as styled } from '@material-ui/core/styles';
import clsx from 'clsx';


type BoardProperties = { 
    model:      IBoard,
    controller: IBoardController,
    scale:      number,
    className?:  string
};

type BoardState = {
    isReady:            boolean,
    highlightedColumn:  number,
    highlightedRow:     number,
    readyListener?:     IEventListenerKey,
    cursorListener?:    IEventListenerKey
};

class Board extends React.Component<BoardProperties, BoardState> {
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

    shouldComponentUpdate(_: BoardProperties, nextState: BoardState) {
        return !partialEq(this.state, nextState);
    }

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
                className={ clsx(this.props.className, { "loading": !this.state.isReady }) }//this.state.isReady ? "board" : "board loading" }
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

        flexGrow:               0,
        textAlign:              'center',
        display:                'grid',
        gridTemplateColumns:    'repeat(9, auto)',
        verticalAlign:          'middle',

        backgroundColor:        theme.palette.divider,
        border:                 `${ 0.1875 * scale }rem solid ${ theme.palette.action.hover }`,
        borderRadius:           `${ 0.25 * scale }rem`,

        '& .cell': {
            position:           'relative',
            backgroundColor:    theme.palette.background.paper,
            width:              `${ 2.0 * scale }rem`,
            height:             `${ 2.0 * scale }rem`,
            marginRight:        '0.0625rem',
            marginBottom:       '0.0625rem',
            transition:         `background-color ${ theme.transitions.duration.short }ms ease`,
            '& > div':          { position: 'absolute' },
        
            '& .value': {
                color:      theme.palette.text.primary,
                fontFamily: '"Cabin Condensed", sans-serif',
                fontSize:   `${ 1.3125 * scale }rem`,
                lineHeight: `${ 2.0000 * scale }rem`,
                width:      '100%',
                height:     '100%'
            },
        
            '& .invalid': {
                color: `${ theme.palette.error.dark }`
            },
        
            '& .notes': {
                display: 'none'
            },
            
            '&.c1.r1': { borderTopLeftRadius:        `${ 0.125 * scale }rem` },
            '&.c9.r1': { borderTopRightRadius:       `${ 0.125 * scale }rem` },
            '&.c1.r9': { borderBottomLeftRadius:     `${ 0.125 * scale }rem` },
            '&.c9.r9': { borderBottomRightRadius:    `${ 0.125 * scale }rem` },

            /* Separate grid boxes (columns and rows 3 and 6) */
            '&.c3, &.c6': { marginRight:    `${ 0.1875 * scale }rem` },
            '&.r3, &.r6': { marginBottom:   `${ 0.1875 * scale }rem` },

            /* Remove borders and margins on the last column and row */
            '&.c9': { marginRight:     0, borderRight:    0 },
            '&.r9': { marginBottom:    0, borderBottom:   0 }
        },

        '& .cell.static': {
            '& .value': {
                boxSizing:          'border-box',
                border:             `0.0625rem solid ${ theme.palette.action.selected }`,
                backgroundColor:    `${ theme.palette.action.disabledBackground }`,
                borderRadius:       `${ 0.125 * scale }rem`,
                lineHeight:         `${ 1.375 * scale }rem`,
                width:              `${ 1.500 * scale }rem`,
                height:             `${ 1.500 * scale }rem`,
                margin:             `${ 0.250 * scale }rem`
            },
    
            '& .invalid': {
                color:              theme.palette.text.primary,
                backgroundColor:    `${ theme.palette.error.light }`,
                borderColor:        `${ theme.palette.error.dark }`,
                borderWidth:        `${ 0.0625 * scale }rem`,
                lineHeight:         `${ 1.3125 * scale }rem`
            }
        },

        '& .cell.highlight': {
            backgroundColor:    `${ theme.palette.action.hover }`,
            transition:         `background-color ${ theme.transitions.duration.short }ms ease`
        },
    
        '& .cell.cursor': {
            backgroundColor: `${ theme.palette.action.selected }`
        },
    })
);
