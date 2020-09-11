import { linkEvent } from 'inferno';

import { ICell, ICandidate } from "../interfaces";
import { Candidate } from "./candidate";
import { ICellController } from "./controller";

type CellProperties = { 
    model:      ICell,
    controller: ICellController,
    cursor:     boolean
};

export const Cell = (props: CellProperties) => {
    let classes = [
        'cell',
        props.model.row.name,
        props.model.column.name,
        props.model.box.name,
        props.model.isStatic ? 'static' : 'editable'
    ];

    if (props.cursor) {
        classes.push('cursor');
    }

    return (
        <div id={props.model.id} className={ classes.join(' ') }
            onClick={ linkEvent(props.model, props.controller.setCursor) }
            onTouchEnd={ linkEvent(props.model, props.controller.setCursor) }>

            <div className={ props.model.isValid ? "value" : "invalid value" }
                onDblClick={ linkEvent(props.model, props.controller.clearCellValue) }>
                { props.model.value > 0 ? props.model.value : "" }
            </div>

            <div className={ props.model.value === 0 ? "notes" : "notes hidden" }>
                { props.model.candidates.map(candidate => createCandidate(candidate, props)) }
            </div>
        </div>
    );
};

const createCandidate = (candidate: ICandidate, props: CellProperties) => (
    <Candidate model={candidate} controller={props.controller} />
);
