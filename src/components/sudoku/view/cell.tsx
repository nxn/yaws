import type { ICellController } from '../controller';
import type { ICell } from '../cell';
import { CommonEvents } from '../events';
import { IBoard, BoardEvents } from '../board';
import Candidate from "./candidate";
import { createPointerDoubleClickHandler } from '../pointer';
import { partialEq } from '@components/utilities/misc';
import React from 'react';
import clsx from 'clsx';
import { Theme, makeStyles, createStyles } from '@material-ui/core/styles';

type StyleProperties = {
    scale: number
}

type CellProperties = { 
    model:          ICell,
    board:          IBoard,
    controller:     ICellController,
    onClick:        (cell: ICell) => void,
    onMouseMove:    (cell: ICell) => void,
    highlight?:     boolean,
    scale:          number,
    className:      string
};

const useStyles = makeStyles((theme: Theme) => createStyles({
    root: (props: StyleProperties) => {
        const size = `${ 2.0 * props.scale }rem`;
        return {
            position:           'relative',
            backgroundColor:    theme.palette.background.paper,
            width:              size,
            height:             size,
            transition:         `background-color ${ theme.transitions.duration.short }ms ease`,
            '& > div':          { position: 'absolute' }
        }
    },

    value: (props: StyleProperties) => ({
        color:      theme.palette.text.primary,
        fontFamily: '"Cabin Condensed", sans-serif',
        fontSize:   `${ 1.3125 * props.scale }rem`,
        lineHeight: `${ 2.0000 * props.scale }rem`,
        width:      '100%',
        height:     '100%'
    }),

    invalid: (props: StyleProperties) => ({
        color: `${ theme.palette.error.dark }`
    }),

    static: (props: StyleProperties) => ({
        '& $value': {
            boxSizing:          'border-box',
            border:             `0.0625rem solid ${ theme.palette.action.selected }`,
            backgroundColor:    `${ theme.palette.action.disabledBackground }`,
            borderRadius:       `${ 0.125 * props.scale }rem`,
            lineHeight:         `${ 1.375 * props.scale }rem`,
            width:              `${ 1.500 * props.scale }rem`,
            height:             `${ 1.500 * props.scale }rem`,
            margin:             `${ 0.250 * props.scale }rem`
        },

        '& $invalid': {
            color:              theme.palette.text.primary,
            backgroundColor:    `${ theme.palette.error.light }`,
            borderColor:        `${ theme.palette.error.dark }`,
            borderWidth:        `${ 0.0625 * props.scale }rem`,
            lineHeight:         `${ 1.3125 * props.scale }rem`
        }
    }),

    highlight: {
        backgroundColor:    `${ theme.palette.action.hover } !important`,
        transition:         `background-color ${ theme.transitions.duration.short }ms ease`
    },

    cursor: {
        backgroundColor: `${ theme.palette.action.selected } !important`
    },

    notes: {
        display: 'none'
    }
}));

export default function Cell(props: CellProperties) {
    const [cellState, setCellState] = React.useState({
        value:  props.model.getValue(),
        valid:  props.model.isValid(),
        static: props.model.isStatic()
    });

    const [cursor, setCursor] = React.useState(props.board.getCursor() === props.model);

    React.useEffect(() => {
        const update = (cell: ICell) => {
            if (props.model !== cell) { return; }
    
            const newState = {
                value:  cell.getValue(),
                valid:  cell.isValid(),
                static: cell.isStatic()
            };
    
            if (!partialEq(cellState, newState)) {
                setCellState(newState);
            }
        }

        const load = (board: IBoard) => {
            if (props.board === board && board.isReady()) {
                update(props.model);
            }
        }

        const boardEventStore = props.board.events.get(BoardEvents.ReadyStateChanged);
        const boardListenerKey = boardEventStore.attach(load);

        const cellEventStore = props.model.events.get(CommonEvents.StateChanged);
        const cellListenerKey = cellEventStore.attach(update);

        return function cleanup() {
            boardEventStore.detach(boardListenerKey);
            cellEventStore.detach(cellListenerKey);
        };
    });

    React.useEffect(() => {
        const updateCursorState = (_: IBoard, to: ICell, from: ICell) => {
            if (props.model !== to && props.model !== from) {
                return;
            }
    
            const isCursor = props.model === to;
            if (cursor === isCursor) {
                return;
            }
    
            setCursor(isCursor);
        }

        const eventStore = props.board.events.get(BoardEvents.CursorMoved);
        const listenerKey = eventStore.attach(updateCursorState);

        return function cleanup() {
            eventStore.detach(listenerKey);
        }
    });

    const onMouseMove   = () => props.onMouseMove(props.model);
    const onClick       = () => props.onClick(props.model)

    const classes = useStyles(props);

    return (
        <div id         = { props.model.id } 
            className   = { clsx(
                classes.root, 
                props.className, { 
                    [classes.static]: cellState.static,
                    [classes.highlight]: props.highlight,
                    [classes.cursor]: cursor
                }
            ) }
            onMouseMove = { onMouseMove }
            onClick     = { onClick }>{ 
                cellState.value > 0 
                    ? <CellValue 
                        controller  = { props.controller } 
                        board       = { props.board } 
                        cell        = { props.model } 
                        value       = { cellState.value } 
                        scale       = { props.scale }
                        className   = { clsx(classes.value, { [classes.invalid]: !cellState.valid }) } />
                    : <CellNotes 
                        controller  = { props.controller } 
                        board       = { props.board } 
                        cell        = { props.model } 
                        className   = { classes.notes } />
        }</div>
    );
}



type CellValueProps = {
    controller: ICellController,
    board: IBoard,
    cell: ICell,
    value: number,
    scale: number,
    className: string
}

function CellValue(props: CellValueProps) {
    const handler = createPointerDoubleClickHandler(
        () => { }, // No action for single click
        () => props.controller.clear(props.board, props.cell)
    );

    const valuePointerDown = (event: React.SyntheticEvent) => handler(event.nativeEvent);

    return (
        <div onPointerDown={ valuePointerDown } 
            className={ props.className }>
            { props.value > 0 ? props.value : "" }
        </div>
    );
}



type CellNoteProps = {
    controller: ICellController,
    board: IBoard,
    cell: ICell,
    className: string
}

function CellNotes(props: CellNoteProps) {
    const setCellValue = (value: number) => {
        props.controller.setCellValue(props.board, props.cell, value);
    }

    return (
        <div className={ props.className }>{
            props.cell.candidates.map(candidate => 
                <Candidate
                    key             = { candidate.value }
                    model           = { candidate }
                    controller      = { props.controller }
                    board           = { props.board }
                    cell            = { props.cell }
                    onDoubleClick   = { setCellValue } />
            )
        }</div>
    );
}
