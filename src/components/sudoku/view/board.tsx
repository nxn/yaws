import type { IBoardController } from '../controller';
import type { ICell } from '../cell';
import { IBoard, BoardEvents } from '../board';
import Cell from './cell';
import React from 'react';

type BoardProperties = { 
    model:      IBoard,
    controller: IBoardController
};

export default function Board(props: BoardProperties) {
    const [ready, setReady] = React.useState(props.model.isReady());
    const [highlight, setHighlight] = React.useState(props.model.getCursor());

    // External event for updating UI when board changes readyness state
    React.useEffect(() => {
        const updateReadyState = (board: IBoard) => {
            if (props.model === board && ready !== board.isReady()) {
                setReady(board.isReady());
            }
        }

        const eventStore = props.model.events.get(BoardEvents.ReadyStateChanged);
        const listenerKey = eventStore.attach(updateReadyState);

        return function cleanup() {
            eventStore.detach(listenerKey);
        }
    }, [ready]);

    // External event for updating UI highlight when cursor moves
    React.useEffect(() => {
        const updateHighlightState = (board: IBoard, cell: ICell) => {
            if (board !== props.model) { return; }
            setHighlight(cell);
        }

        const eventStore = props.model.events.get(BoardEvents.CursorMoved);
        const listenerKey = eventStore.attach(updateHighlightState);

        return function cleanup() {
            eventStore.detach(listenerKey);
        }
    }, [highlight]);

    const resetHighlight = () => {
        setHighlight(props.model.getCursor());
    }
    
    const isHighlighted = (cell: ICell) => {
        return cell.row.index    === highlight.row.index 
            || cell.column.index === highlight.column.index
    }
    
    const setCursor = (cell: ICell) => {
        props.controller.setCursor(props.model, cell);
    }

    return (
        <div id={ props.model.id } 
            className={ ready ? "board" : "board loading" }
            onMouseLeave={ resetHighlight }>{
                props.model.cells.map((cell: ICell) => 
                    <Cell 
                        key         = { cell.index }
                        model       = { cell } 
                        controller  = { props.controller }
                        board       = { props.model }
                        onClick     = { setCursor }
                        onMouseMove = { setHighlight }
                        highlight   = { isHighlighted(cell) } />
                )
        }</div>
    );
}
