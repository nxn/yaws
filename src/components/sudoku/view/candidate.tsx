import { linkEvent } from 'inferno';

import { IBoard, ICandidate } from "../interfaces";
import { ICandidateController } from "./controller";

type CandidateProperties = {
    model:      IBoard,
    controller: ICandidateController,
    context:    ICandidate
};

export const Candidate = (props: CandidateProperties) => {
    let candidate = props.context;
    let eventContext = {
        model: props.model,
        target: candidate
    }

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
        <div className={ classes.join(' ') } 
            onClick={ linkEvent(eventContext, props.controller.toggleCandidate) } 
            onDblClick={ linkEvent(eventContext, props.controller.setCellValue) } 
            onTouchEnd={ preventTouchEvents }>

            { candidate.value }
        </div>
    );
};

function preventTouchEvents(event: TouchEvent) {
    event.preventDefault();
}