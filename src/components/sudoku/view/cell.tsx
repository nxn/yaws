import { Component, linkEvent } from 'inferno';
import { CellValue } from "./cell-value";
import { CellCandidate } from "./cell-candidate";
import { IBoard, ICell, ICellController, CellEvents, BoardEvents } from "../interfaces";
import { createPointerDoubleClickHandler } from '../pointer';

type CellProperties = { 
    model:          ICell,
    board:          IBoard,
    controller:     ICellController,
    onClick:        (cell: ICell) => void,
    onMouseMove:    (cell: ICell) => void,
    highlight?:     boolean,
};

export class Cell extends Component<CellProperties, any>{
    private candidatePointerDown:   (data: number, event: PointerEvent) => any;
    private valuePointerDown:       (event: PointerEvent) => any;

    constructor(props: CellProperties) {
        super(props);

        this.candidatePointerDown = createPointerDoubleClickHandler(
            (value: number) => props.controller.toggleCandidate(props.board, props.model, value),
            (value: number) => props.controller.setCellValue(props.board, props.model, value)
        );

        this.valuePointerDown = createPointerDoubleClickHandler(
            () => { }, // No action for single click
            () => props.controller.clear(props.board, props.model)
        );
    }

    componentDidMount() {
        this.props.controller.on(BoardEvents.CursorMoved, (to: ICell, from: ICell) => {
            if (this.props.model === to || this.props.model === from) {
                this.setState(this.state);
            }
        });
        
        this.props.controller.on(CellEvents.CellChanged, (cell: ICell) => {
            if (this.props.model === cell) {
                this.setState(this.state);
            }
        });
    }

    render() {
        console.log('cell render');
        let cell = this.props.model;

        let classes = [
            'cell',
            cell.row.name,
            cell.column.name,
            cell.box.name,
            cell.isStatic ? 'static' : 'editable'
        ];

        if (cell === this.props.board.cursor) {
            classes.push('cursor');
        }

        if (this.props.highlight) {
            classes.push('highlight');
        }

        return (
            <div id         = { this.props.model.id } 
                className   = { classes.join(' ') }
                onMouseMove = { linkEvent(cell, this.props.onMouseMove) }
                onClick     = { linkEvent(cell, this.props.onClick) }>

                <CellValue model={cell} onpointerdown={this.valuePointerDown} />
                <div className={ cell.value === 0 ? "notes" : "notes hidden" }>{
                    cell.candidates.map(candidate => 
                        <CellCandidate
                            key             = { candidate.value }
                            model           = { candidate }
                            onpointerdown   = { this.candidatePointerDown } />
                    )
                }</div>
            </div>
        );
    }
};
