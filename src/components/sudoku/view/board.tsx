import { Component, linkEvent } from 'inferno';

import { Cell } from './cell';
import { IBoardController, IBoard, BoardEvents, ICell } from '../interfaces';

type BoardProperties = { 
    model:      IBoard,
    controller: IBoardController
};

type BoardState = {
    highlightedColumn:  number,
    highlightedRow:     number
};

export class Board extends Component<BoardProperties, BoardState> {
    constructor(props: BoardProperties) {
        super(props);
        this.state = { 
            highlightedColumn:  props.model.cursor.column.index, 
            highlightedRow:     props.model.cursor.row.index,
        };
        props.controller.on(BoardEvents.StateChanged, this.setHighlight);
    }

    setCursor = (cell: ICell) => {
        this.props.controller.setCursor(this.props.model, cell);
    }

    setHighlight = (cell: ICell) => {
        // No change, return early
        if (this.state.highlightedColumn === cell.column.index && this.state.highlightedRow === cell.row.index) {
            return;
        }
        // Update state
        this.setState({
            highlightedColumn: cell.column.index,
            highlightedRow: cell.row.index
        });
    }

    isHighlighted(cell: ICell) {
        return cell.row.index    === this.state.highlightedRow 
            || cell.column.index === this.state.highlightedColumn;
    }

    isCursor(cell: ICell) {
        return cell === this.props.model.cursor
    }

    render() {
        return (
            <div id={this.props.model.id} 
                className="board"
                onmouseleave={ linkEvent(this.props.model.cursor, this.setHighlight) }>{
                this.props.model.cells.map((cell: ICell) => 
                    <Cell 
                        key         = { cell.index }
                        model       = { cell } 
                        controller  = { this.props.controller } 
                        onClick     = { this.setCursor }
                        onMouseMove = { this.setHighlight }
                        highlight   = { this.isHighlighted(cell) }
                        cursor      = { this.isCursor(cell) } />
                )
            }</div>
        );
    }
}
