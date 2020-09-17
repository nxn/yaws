import { Component } from 'inferno';
import { Cell } from './cell';
import { IBoardController, IBoard, ICell } from '../interfaces';
import { BoardEvents } from '../events';
import { partialEq } from '@components/utilities/misc';

type BoardProperties = { 
    model:      IBoard,
    controller: IBoardController
};

type BoardState = {
    isReady:            boolean,
    highlightedColumn:  number,
    highlightedRow:     number
};

export class Board extends Component<BoardProperties, BoardState> {
    constructor(props: BoardProperties) {
        super(props);
        this.state = {
            isReady:            props.model.isReady(),
            highlightedColumn:  props.model.getCursor().column.index, 
            highlightedRow:     props.model.getCursor().row.index
        };
    }

    componentDidMount() {
        this.props.model.events.attach(BoardEvents.ReadyStateChanged,   this.updateReadyState)
        this.props.model.events.attach(BoardEvents.CursorMoved,         this.updateHighlightState);
    }
    componentWillUnmount() {
        this.props.model.events.detach(BoardEvents.ReadyStateChanged,   this.updateReadyState);
        this.props.model.events.detach(BoardEvents.CursorMoved,         this.updateHighlightState);
    }

    updateReadyState = (board: IBoard) => {
        if (this.props.model === board && board.isReady()) {
            this.setState(() => ({ isReady: true }));
        }
    }

    shouldComponentUpdate(_: BoardProperties, nextState: BoardState) {
        return !partialEq(this.state, nextState);
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
                className={ this.state.isReady ? "board" : "board loading" }
                onmouseleave={ this.resetHighlight }>{
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
