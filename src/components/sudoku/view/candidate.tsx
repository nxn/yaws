import { linkEvent }    from 'inferno';
import { ICandidate }   from "../interfaces";

type CandidateProperties = {
    model:          ICandidate,
    onpointerdown:  (value: number, event: PointerEvent) => any;
};

export const Candidate = (props: CandidateProperties) => {
    let candidate = props.model;

    let classes = ['candidate'];
    if (candidate.isSelected) {
        classes.push('selected');
    }
    if (!candidate.isValid) {
        classes.push('invalid');
    }
    if (candidate.value % 3 === 0) {
        classes.push('last-column');
    }
    if (candidate.value > 6) {
        classes.push('last-row');
    }

    return (
        <div className={ classes.join(' ') } onpointerdown={ linkEvent(props.model.value, props.onpointerdown) }>
            { candidate.value }
        </div>
    );
};
