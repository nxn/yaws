import { linkEvent } from 'inferno';

import { ICandidate } from "../interfaces";
import { ICandidateController } from "./controller";

type CandidateProperties = {
    model: ICandidate,
    controller: ICandidateController
};

export const Candidate = (props: CandidateProperties) => {
    let classes = ['candidate'];

    if (props.model.isSelected) {
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
        <div className={ classes.join(' ') } 
            onClick={ linkEvent(props.model, props.controller.toggleCandidate) } 
            onDblClick={ linkEvent(props.model, props.controller.setCellValue) } 
            onTouchEnd={ preventTouchEvents }>

            { props.model.value }
        </div>
    );
};

function preventTouchEvents(event: TouchEvent) {
    event.preventDefault();
}