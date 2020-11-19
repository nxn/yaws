import type { ICellController } from '../controller';
import type { ICell } from '../cell';
import { CommonEvents } from '../events';
import { IBoard, BoardEvents } from '../board';
import Candidate from "./candidate";
import { createPointerDoubleClickHandler } from '../pointer';
import { partialEq } from '@components/utilities/misc';
import React from 'react';

type CellProperties = { 
    model:          ICell,
    board:          IBoard,
    controller:     ICellController,
    onClick:        (cell: ICell) => void,
    onMouseMove:    (cell: ICell) => void,
    highlight?:     boolean
};

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

    let classes = [
        'cell',
        props.model.row.name,
        props.model.column.name,
        props.model.box.name,

        cellState.static ? 'static' : 'editable'
    ];

    if (cursor) {
        classes.push('cursor');
    }

    if (props.highlight) {
        classes.push('highlight');
    }

    return (
        <div id         = { props.model.id } 
            className   = { classes.join(' ') }
            onMouseMove = { onMouseMove }
            onClick     = { onClick }>{ 
                cellState.value > 0 
                    ? <CellValue controller={ props.controller } board={ props.board } cell={ props.model } value={ cellState.value } valid={ cellState.valid } />
                    : <CellNotes controller={ props.controller } board={ props.board } cell={ props.model } />
        }</div>
    );
}

type CellValueProps = {
    controller: ICellController,
    board: IBoard,
    cell: ICell,
    value: number,
    valid: boolean
}

function CellValue(props: CellValueProps) {
    const handler = createPointerDoubleClickHandler(
        () => { }, // No action for single click
        () => props.controller.clear(props.board, props.cell)
    );

    const valuePointerDown = (event: React.SyntheticEvent) => handler(event.nativeEvent);

    return (
        <div className={ props.valid ? "value" : "invalid value" } onPointerDown={ valuePointerDown }>
            { props.value > 0 ? props.value : "" }
        </div>
    );
}

type CellNoteProps = {
    controller: ICellController,
    board: IBoard,
    cell: ICell
}

function CellNotes(props: CellNoteProps) {
    const setCellValue = (value: number) => {
        props.controller.setCellValue(props.board, props.cell, value);
    }

    return (
        <div className="notes">{
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
