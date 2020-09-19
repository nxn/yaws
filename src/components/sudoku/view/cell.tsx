import { Component, linkEvent } from 'inferno';
import { Candidate } from "./candidate";
import { IBoard, ICell, ICellController, IEventListenerKey } from "../interfaces";
import { createPointerDoubleClickHandler } from '../pointer';
import { BoardEvents, CommonEvents } from '../events';
import { partialEq } from '@components/utilities/misc';

type CellProperties = { 
    model:          ICell,
    board:          IBoard,
    controller:     ICellController,
    onClick:        (cell: ICell) => void,
    onMouseMove:    (cell: ICell) => void,
    highlight?:     boolean
};

type CellState = {
    value:                  number,
    isValid:                boolean,
    isCursor:               boolean,
    isStatic:               boolean,
    readyStateListener?:    IEventListenerKey,
    cursorListener?:        IEventListenerKey,
    cellStateListener?:     IEventListenerKey
};

export class Cell extends Component<CellProperties, CellState>{
    private valuePointerDown: (event: PointerEvent) => any;

    constructor(props: CellProperties) {
        super(props);

        this.state = {
            value:      props.model.getValue(),
            isValid:    props.model.isValid(),
            isStatic:   props.model.isStatic(),
            isCursor:   props.board.getCursor() === props.model
        }

        this.valuePointerDown = createPointerDoubleClickHandler(
            () => { }, // No action for single click
            () => props.controller.clear(props.board, props.model)
        );
    }

    componentWillMount() {
        const listeners = {
            readyStateListener: this.props.board.events
                .get(BoardEvents.ReadyStateChanged)
                .attach(this.loadCellState),
                
            cursorListener: this.props.board.events
                .get(BoardEvents.CursorMoved)
                .attach(this.updateCursorState),

            cellStateListener: this.props.model.events
                .get(CommonEvents.StateChanged)
                .attach(this.updateCellState)
        };
        
        this.setState(() => listeners);
    }

    componentWillUnmount() {
        if (this.state.readyStateListener) {
            this.props.board.events.get(BoardEvents.ReadyStateChanged).detach(this.state.readyStateListener);
        }

        if (this.state.cursorListener) {
            this.props.board.events.get(BoardEvents.CursorMoved).detach(this.state.cursorListener);
        }

        if (this.state.cellStateListener) {
            this.props.model.events.get(CommonEvents.StateChanged).detach(this.state.cellStateListener);
        }

        this.setState(() => ({
            readyStateListener: undefined,
            cursorListener: undefined,
            cellStateListener: undefined
        }));
    }

    updateCursorState = (_: IBoard, to: ICell, from: ICell) => {
        if (this.props.model !== to && this.props.model !== from) {
            return;
        }

        const cursor = this.props.model === to;
        if (this.state.isCursor === cursor) {
            return;
        }

        this.setState(() => ({ isCursor: cursor }));
    }

    loadCellState = (board: IBoard) => {
        if (this.props.board === board && board.isReady()) {
            this.updateCellState(this.props.model);
        }
    }

    updateCellState = (cell: ICell) => {
        if (this.props.model !== cell) { return; }

        const newState = {
            value:      cell.getValue(),
            isValid:    cell.isValid(),
            isStatic:   cell.isStatic()
        }

        if (!partialEq(this.state, newState)) {
            this.setState(() => newState);
        }
    }

    shouldComponentUpdate(nextProps: CellProperties, nextState: CellState) {
        if (this.props.highlight !== nextProps.highlight) {
            return true;
        }

        return !partialEq(this.state, nextState);
    }

    setCellValue = (value: number) => {
        this.props.controller.setCellValue(this.props.board, this.props.model, value);
    }

    render() {
        let classes = [
            'cell',
            this.props.model.row.name,
            this.props.model.column.name,
            this.props.model.box.name,

            this.state.isStatic ? 'static' : 'editable'
        ];

        if (this.state.isCursor) {
            classes.push('cursor');
        }

        if (this.props.highlight) {
            classes.push('highlight');
        }

        return (
            <div id         = { this.props.model.id } 
                className   = { classes.join(' ') }
                onMouseMove = { linkEvent(this.props.model, this.props.onMouseMove) }
                onClick     = { linkEvent(this.props.model, this.props.onClick) }>

                { this.state.value > 0 ? this.renderValue() : this.renderNotes() }
            </div>
        );
    }

    renderValue() {
        return (
            <div className={ this.state.isValid ? "value" : "invalid value" } onpointerdown={ this.valuePointerDown }>
                { this.state.value > 0 ? this.state.value : "" }
            </div>
        );
    }

    renderNotes() {
        return (
            <div className="notes">{
                this.props.model.candidates.map(candidate => 
                    <Candidate
                        key             = { candidate.value }
                        model           = { candidate }
                        controller      = { this.props.controller }
                        board           = { this.props.board }
                        cell            = { this.props.model }
                        onDoubleClick   = { this.setCellValue } />
                )
            }</div>
        );
    }
};
