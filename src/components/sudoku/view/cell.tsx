import { ICell, ICellCandidate } from "../interfaces";
import { Candidate } from "./candidate";

type TProps = { model: ICell };

const createCandidate = (candidate: ICellCandidate) => (
    <Candidate model={candidate} />
);

export const Cell = (props: TProps) => {
    let classes = [
        'cell',
        props.model.row.name,
        props.model.column.name,
        props.model.box.name,
        props.model.isStatic ? 'static' : 'editable'
    ];

    return (
        <div id={props.model.id} className={ classes.join(' ') }>
            <div className="value">
                { props.model.value > 0 ? props.model.value : "" }
            </div>
            <div className="notes">
                { props.model.candidates.map(createCandidate) }
            </div>
        </div>
    );
};