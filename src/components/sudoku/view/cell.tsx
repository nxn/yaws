import { linkEvent } from 'inferno';

import { IBoard, ICell }    from "../interfaces";
import { ICellController }              from "./controller";
import { Candidate }                    from "./candidate";

type CellProperties = { 
    model:      IBoard,
    controller: ICellController,
    context:    ICell
};

export const Cell = (props: CellProperties) => {
    let cell = props.context;
    let eventContext = { model: props.model, target: cell };

    let classes = [
        'cell',
        cell.row.name,
        cell.column.name,
        cell.box.name,
        cell.isStatic ? 'static' : 'editable'
    ];

    if (cell === props.model.cursor.cell) {
        classes.push('cursor');
    }

    return (
        <div id={props.model.id} className={ classes.join(' ') }
            onClick={ linkEvent(eventContext, props.controller.setCursor) }
            onTouchEnd={ linkEvent(eventContext, props.controller.setCursor) }>

            <div className={ cell.isValid ? "value" : "invalid value" }
                onDblClick={ linkEvent(eventContext, props.controller.clearCellValue) }>
                { cell.value > 0 ? cell.value : "" }
            </div>

            <div className={ props.context.value === 0 ? "notes" : "notes hidden" }>{
                cell.candidates.map(
                    candidate => <Candidate model={props.model} controller={props.controller} context={candidate} />
                )
            }</div>
        </div>
    );
};
