import { linkEvent } from 'inferno';

import { ICell, ICellCandidate } from "../interfaces";
import { Candidate, ICandidateController } from "./candidate";

export interface ICellController extends ICandidateController {
    clearCellValue: (cell: ICell) => void;
    setCursor: (cell: ICell) => void;
}

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

const createCandidate = (candidate: ICellCandidate, props: CellProperties) => (
    <Candidate model={candidate} controller={props.controller} />
);
