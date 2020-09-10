import { ICellCandidate } from "../interfaces";

type TProps = { model: ICellCandidate };

export const Candidate = (props: TProps) => {
    let classes = ['candidate'];

    if (props.model.selected) {
        classes.push('selected');
    }

    if (!props.model.isValid) {
        classes.push('invalid');
    }

    if (props.model.value % 3 === 0) {
        classes.push('last-column');
    }

    if (props.model.value > 6) {
        classes.push('last-row');
    }

    return (
        <div className={ classes.join(' ') }>
            { props.model.value }
        </div>
    );
};