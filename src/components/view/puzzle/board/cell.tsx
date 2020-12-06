import type { ICellController } from '@components/sudoku/controllers/board';
import type { ICell } from '@components/sudoku/models/cell';
import { IEventListenerKey, CommonEvents } from '@components/sudoku/events';
import { IBoard, BoardEvents } from '@components/sudoku/models/board';

import { createPointerDoubleClickHandler } from '@components/sudoku/pointer';

import Candidate from "./candidate";

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

type CellState = {
    value:                  number,
    isValid:                boolean,
    isCursor:               boolean,
    isStatic:               boolean,
    readyStateListener?:    IEventListenerKey,
    cursorListener?:        IEventListenerKey,
    cellStateListener?:     IEventListenerKey
};

export default class Cell extends React.Component<CellProperties, CellState>{
    private valuePointerDown:   (event: React.PointerEvent) => void;
    private onMouseMove:        (event: React.MouseEvent)   => void;
    private onClick:            (event: React.MouseEvent)   => void;

    constructor(props: CellProperties) {
        super(props);

        this.state = {
            value:      props.model.getValue(),
            isValid:    props.model.isValid(),
            isStatic:   props.model.isStatic(),
            isCursor:   props.board.getCursor() === props.model
        }

        const handler = createPointerDoubleClickHandler(
            () => { }, // No action for single click
            () => props.controller.clear(props.model)
        );

        this.valuePointerDown   = (event: React.SyntheticEvent) => handler(event.nativeEvent);
        this.onMouseMove        = () => props.onMouseMove(props.model);
        this.onClick            = () => props.onClick(props.model)
    }

    componentDidMount() {
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

    shouldComponentUpdate(nextProps: CellProperties, nextState: CellState) {
        if (this.props.highlight !== nextProps.highlight) {
            return true;
        }

        return !partialEq(this.state, nextState);
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

    setCellValue = (value: number) => {
        this.props.controller.setCellValue(this.props.model, value);
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
                onMouseMove = { this.onMouseMove }
                onClick     = { this.onClick }>

                { this.state.value > 0 ? this.renderValue() : this.renderNotes() }
            </div>
        );
    }

    renderValue() {
        return (
            <div className={ this.state.isValid ? "value" : "invalid value" } onPointerDown={ this.valuePointerDown }>
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
