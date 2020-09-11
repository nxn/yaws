import { linkEvent } from 'inferno';

import { IBoard, ICursor } from '../interfaces';
import { ICursorController } from './controller';
import { range } from '@components/utilities/misc';

type ButtonProperties = {
    model:      IBoard,
    controller: ICursorController
};

type ClickHandler = (context: { model: IBoard, target: ICursor, value: number }) => void;

const createButton = (number: number, props: ButtonProperties, handler: ClickHandler) => {
    let eventContext = {
        model:  props.model,
        target: props.model.cursor,
        value:  number
    };

    let classes = [];

    if      (number <= 3)   { classes.push('top'); }
    else if (number <= 6)   { classes.push('middle'); }
    else                    { classes.push('bottom'); }

    if      (number % 3 === 1)  { classes.push('left'); }
    else if (number % 3 === 2)  { classes.push('center'); }
    else                        { classes.push('right'); }

    return (
        <button className={classes.join(' ')} onClick={ linkEvent(eventContext, handler) }>
            <span>{number}</span>
        </button>
    );
}

export const ValueButtons = (props: ButtonProperties) => Buttons(props, props.controller.setCellValue,    "values");
export const NoteButtons  = (props: ButtonProperties) => Buttons(props, props.controller.toggleCandidate, "notes");
const Buttons = (props: ButtonProperties, handler: ClickHandler, className = "") => (
    <div className={className}>
        { range(1,9).map(n => createButton(n, props, handler)) }
    </div>
);