import { linkEvent }    from 'inferno';
import { curry }        from 'ramda';
import { Candidate }    from "./candidate";
import { ICell, ICellController } from "../interfaces";

type CellProperties = { 
    model:          ICell,
    controller:     ICellController,
    onClick:        (cell: ICell) => void,
    onTouchEnd:     (cell: ICell) => void,
    onMouseMove:    (cell: ICell) => void,    
    cursor?:        boolean,
    highlight?:     boolean,
};

export const Cell = (props: CellProperties) => {
    let cell = props.model;

    let classes = [
        'cell',
        cell.row.name,
        cell.column.name,
        cell.box.name,
        cell.isStatic ? 'static' : 'editable'
    ];

    if (props.cursor) {
        classes.push('cursor');
    }

    if (props.highlight) {
        classes.push('highlight');
    }

    let setCellValue    = curry(props.controller.setCellValue)(cell);
    let toggleCandidate = curry(props.controller.toggleCandidate)(cell);

    return (
        <div id         = { props.model.id } 
            className   = { classes.join(' ') }
            onMouseMove = { linkEvent(cell, props.onMouseMove) }
            onClick     = { linkEvent(cell, props.onClick) }
            onTouchEnd  = { linkEvent(cell, props.onTouchEnd) }>

            <div className = { cell.isValid ? "value" : "invalid value" }
                onDblClick = { linkEvent(cell, props.controller.clear) }>
                { cell.value > 0 ? cell.value : "" }
            </div>

            <div className={ cell.value === 0 ? "notes" : "notes hidden" }>{
                cell.candidates.map(candidate => 
                    <Candidate
                        key         = { candidate.value }
                        model       = { candidate }
                        onClick     = { toggleCandidate }
                        onDblClick  = { setCellValue } />
                )
            }</div>
        </div>
    );
};
