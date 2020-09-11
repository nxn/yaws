import { ICursor } from '../interfaces';
import { NumberButtons } from './number-buttons';
import { ICursorController } from './controller';
import { linkEvent } from 'inferno';

import icons from './images/icons.svg';

type ControlProperties = { 
    model: ICursor,
    controller: ICursorController
};

export const Controls = (props: ControlProperties) => (
    <div className="control-panel">
        <NumberButtons model={props.model} controller={props.controller} className="values" />
        <NumberButtons model={props.model} controller={props.controller} className="notes" />
        <button className="btn-clear" onClick={ linkEvent(props.model, props.controller.clearCursor)}>
            <span>
                <svg class="icon">
                    <use xlinkHref={ icons + '#yaws-icon-x' }></use>
                </svg>
            </span>
        </button>
    </div>
);