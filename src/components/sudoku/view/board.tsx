import { Component } from 'inferno';
import { Cell } from './cell';
import { IBoardController, IBoard, ICell } from '../interfaces';
import { BoardEvents } from '../events';

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
            highlightedColumn:  props.model.getCursor().column.index, 
            highlightedRow:     props.model.getCursor().row.index
        };
    }

    componentDidMount() {
        this.props.model.events.on(BoardEvents.CursorMoved, this.updateHighlightState);
        //this.props.model.events.on(BoardEvents.Loaded, this.update);
    }
    componentWillUnmount() {
        this.props.model.events.detach(BoardEvents.CursorMoved, this.updateHighlightState);
    }

    shouldComponentUpdate(_: BoardProperties, nextState: BoardState) {
        if (this.state.highlightedColumn !== nextState.highlightedColumn) {
            return true;
        }
        if (this.state.highlightedRow !== nextState.highlightedRow) {
            return true;
        }

        return false;
    }

    updateHighlightState = (_: IBoard, cell: ICell) => { this.setHighlight(cell); }
    setHighlight = (cell: ICell) => {
        if (this.state.highlightedColumn === cell.column.index && this.state.highlightedRow === cell.row.index) {
            return;
        }

        this.setState({
            highlightedColumn: cell.column.index,
            highlightedRow: cell.row.index
        });
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
                className="board"
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
