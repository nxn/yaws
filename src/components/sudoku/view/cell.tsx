import { Component, linkEvent } from 'inferno';
import { Candidate } from "./candidate";
import { IBoard, ICell, ICellController } from "../interfaces";
import { createPointerDoubleClickHandler } from '../pointer';
import { BoardEvents, CellEvents } from '../events';

type CellProperties = { 
    model:          ICell,
    board:          IBoard,
    controller:     ICellController,
    onClick:        (cell: ICell) => void,
    onMouseMove:    (cell: ICell) => void,
    highlight?:     boolean
};

type CellState = {
    value:      number,
    valid:      boolean,
    cursor:     boolean,
    static:     boolean,
};

export class Cell extends Component<CellProperties, CellState>{
    private valuePointerDown: (event: PointerEvent) => any;

    constructor(props: CellProperties) {
        super(props);

        this.state = {
            value:      props.model.getValue(),
            valid:      props.model.isValid(),
            static:     props.model.isStatic(),
            cursor:     props.board.getCursor() === props.model
        }

        this.valuePointerDown = createPointerDoubleClickHandler(
            () => { }, // No action for single click
            () => props.controller.clear(props.board, props.model)
        );
    }

    componentDidMount() {
        this.props.board.events.on(BoardEvents.CursorMoved, this.updateCursorState);
        this.props.model.events.on(CellEvents.ValueChanged, this.updateValueState);
        this.props.model.events.on(CellEvents.ValidityChanged, this.updateValueState);
        this.props.model.events.on(CellEvents.StaticChanged, this.updateStaticState);
    }

    componentWillUnmount() {
        this.props.board.events.detach(BoardEvents.CursorMoved, this.updateCursorState);
        this.props.model.events.detach(CellEvents.ValueChanged, this.updateValueState);
        this.props.model.events.detach(CellEvents.ValidityChanged, this.updateValueState);
        this.props.model.events.detach(CellEvents.StaticChanged, this.updateStaticState);
    }

    updateCursorState = (_: IBoard, to: ICell, from: ICell) => {
        if (this.props.model !== to && this.props.model !== from) {
            return;
        }

        const cursor = this.props.model === to;
        if (this.state.cursor === cursor) {
            return;
        }

        this.setState(() => ({ cursor: cursor }));
    }

    updateValueState = (cell: ICell) => {
        if (this.props.model !== cell) {
            return;
        }

        const value = cell.getValue();
        const valid = cell.isValid();
        if (this.state.value === value && this.state.valid === valid) {
            return;
        }

        this.setState(() => ({ 
            value: value, 
            valid: valid
        }));
    }

    updateStaticState = (cell: ICell) => {
        if (this.props.model !== cell) {
            return;
        }

        const isStatic = cell.isStatic();
        if (this.state.static === isStatic) {
            return;
        }

        this.setState(() => ({ 
            static: isStatic
        }));
    }

    shouldComponentUpdate(nextProps: CellProperties, nextState: CellState) {
        if (this.props.highlight !== nextProps.highlight) {
            return true;
        }
        if (this.state.cursor !== nextState.cursor) {
            return true;
        }
        if (this.state.value !== nextState.value) {
            return true;
        }
        if (this.state.valid !== nextState.valid) {
            return true;
        }
        if (this.state.static !== nextState.static) {
            return true;
        }

        return false;
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

            this.state.static ? 'static' : 'editable'
        ];

        if (this.state.cursor) {
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

                <div className={ this.state.valid ? "value" : "invalid value" } onpointerdown={ this.valuePointerDown }>
                    { this.state.value > 0 ? this.state.value : "" }
                </div>

                <div className={ this.state.value === 0 ? "notes" : "notes hidden" }>{
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
            </div>
        );
    }
};
