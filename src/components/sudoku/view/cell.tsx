import { Component, linkEvent } from 'inferno';
import { Candidate } from "./candidate";
import { ICell, ICellController } from "../interfaces";
import { createPointerDoubleClickHandler } from '../pointer';

type CellProperties = { 
    model:          ICell,
    controller:     ICellController,
    onClick:        (cell: ICell) => void,
    onMouseMove:    (cell: ICell) => void,    
    cursor?:        boolean,
    highlight?:     boolean,
};

export class Cell extends Component<CellProperties, any>{
    private candidatePointerDown:   (data: number, event: PointerEvent) => any;
    private valuePointerDown:       (event: PointerEvent) => any;

    constructor(props: CellProperties) {
        super(props);

        this.candidatePointerDown = createPointerDoubleClickHandler(
            (value: number) => props.controller.toggleCandidate(props.model, value),
            (value: number) => props.controller.setCellValue(props.model, value)
        );

        this.valuePointerDown = createPointerDoubleClickHandler(
            () => { }, // No action for single click
            () => props.controller.clear(props.model)
        );
    }

    render() {
        let cell = this.props.model;

        let classes = [
            'cell',
            cell.row.name,
            cell.column.name,
            cell.box.name,
            cell.isStatic ? 'static' : 'editable'
        ];

        if (this.props.cursor) {
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

                <div className={ cell.isValid ? "value" : "invalid value" } onpointerdown={ this.valuePointerDown }>
                    { cell.value > 0 ? cell.value : "" }
                </div>

                <div className={ cell.value === 0 ? "notes" : "notes hidden" }>{
                    cell.candidates.map(candidate => 
                        <Candidate
                            key             = { candidate.value }
                            model           = { candidate }
                            onpointerdown   = { this.candidatePointerDown } />
                    )
                }</div>
            </div>
        );
    }
};
