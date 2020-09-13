import { linkEvent }    from 'inferno';
import { ICandidate }   from "../interfaces";

type CandidateProperties = {
    model:      ICandidate,
    onClick:    (value: number) => void;
    onDblClick: (value: number) => void;
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
        <div className  = { classes.join(' ') }
            onTouchEnd  = { preventTouchEvents }
            onClick     = { linkEvent(candidate.value, props.onClick) } 
            onDblClick  = { linkEvent(candidate.value, props.onDblClick) }>
            { candidate.value }
        </div>
    );
};

function preventTouchEvents(event: TouchEvent) {
    event.preventDefault();
}