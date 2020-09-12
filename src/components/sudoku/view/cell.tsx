import { linkEvent }        from 'inferno';
import { curry }            from 'ramda';
import { ICell }            from "../interfaces";
import { ICellController }  from "./controller";
import { Candidate }        from "./candidate";

type CellProperties = { 
    model:      ICell,
    controller: ICellController,
    cursor:     boolean;
    onClick:    (cell: ICell) => void;
    onTouchEnd: (cell: ICell) => void;
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

    let setCellValue    = curry(props.controller.setCellValue)(cell);
    let toggleCandidate = curry(props.controller.toggleCandidate)(cell);

    return (
        <div id         = { props.model.id } 
            className   = { classes.join(' ') }
            onClick     = { linkEvent(cell, props.onClick) }
            onTouchEnd  = { linkEvent(cell, props.onTouchEnd) }>

            <div className = { cell.isValid ? "value" : "invalid value" }
                onDblClick = { linkEvent(cell, props.controller.clearCell) }>
                { cell.value > 0 ? cell.value : "" }
            </div>

            <div className={ cell.value === 0 ? "notes" : "notes hidden" }>{
                cell.candidates.map(candidate => 
                    <Candidate 
                        model       = { candidate }
                        onClick     = { toggleCandidate }
                        onDblClick  = { setCellValue } />
                )
            }</div>
        </div>
    );
};
