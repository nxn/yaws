import { Component } from 'inferno';
import { Cell } from './cell';
import { IBoardController, IBoard, ICell, IEventListenerKey } from '../interfaces';
import { BoardEvents } from '../events';
import { partialEq } from '@components/utilities/misc';

type BoardProperties = { 
    model:      IBoard,
    controller: IBoardController
};

type BoardState = {
    isReady:            boolean,
    highlightedColumn:  number,
    highlightedRow:     number,
    readyListener?:     IEventListenerKey,
    cursorListener?:    IEventListenerKey
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

    componentWillMount() {
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
