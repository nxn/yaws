import { linkEvent }                    from 'inferno';
import { curry }                        from 'ramda';
import { IBoard }                       from '../interfaces';
import { ICellController }              from './controller';
import { ValueButtons, NoteButtons }    from './buttons';
import icons from './images/icons.svg';

type ControlProperties = { 
    model:      IBoard,
    controller: ICellController
};

export const Controls = (props: ControlProperties) => {
    let setCellValue = curry(props.controller.setCellValue)(props.model.cursor.cell);
    let toggleCandidate = curry(props.controller.toggleCandidate)(props.model.cursor.cell);

    return (
        <div className="control-panel">
            <ValueButtons onClick={ setCellValue } />
            <NoteButtons  onClick={ toggleCandidate } />
            <button className="btn-clear" onClick={ linkEvent(props.model.cursor.cell, props.controller.clearCell)}>
                <span>
                    <svg class="icon">
                        <use xlinkHref={ icons + '#yaws-icon-x' }></use>
                    </svg>
                </span>
            </button>
        </div>
    );
}