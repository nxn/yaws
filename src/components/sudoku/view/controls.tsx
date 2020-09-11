import { linkEvent } from 'inferno';

import { IBoard } from '../interfaces';
import { ICursorController } from './controller';
import { NumberButtons } from './numberbuttons';

import icons from './images/icons.svg';

type ControlProperties = { 
    model:      IBoard,
    controller: ICursorController
};

export const Controls = (props: ControlProperties) => {
    let eventContext = {
        model: props.model,
        target: props.model.cursor
    }
    return (
        <div className="control-panel">
            <NumberButtons model={props.model} controller={props.controller} className="values" />
            <NumberButtons model={props.model} controller={props.controller} className="notes" />
            <button className="btn-clear" onClick={ linkEvent(eventContext, props.controller.clearCursor)}>
                <span>
                    <svg class="icon">
                        <use xlinkHref={ icons + '#yaws-icon-x' }></use>
                    </svg>
                </span>
            </button>
        </div>
    );
}