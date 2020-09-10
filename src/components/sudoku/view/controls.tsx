import { IBoard } from '../interfaces';
import { NumberButtons } from './number-buttons';

import icons from './images/icons.svg';

type TProps = { board: IBoard };

export const Controls = (props: TProps) => (
    <div className="control-panel">
        <NumberButtons board={props.board} className="values" />
        <NumberButtons board={props.board} className="notes" />
        <button className="btn-clear">
            <span>
                <svg class="icon">
                    <use xlinkHref={ icons + '#yaws-icon-x' }></use>
                </svg>
            </span>
        </button>
    </div>
);