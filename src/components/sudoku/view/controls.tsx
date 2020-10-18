import type { ICellController } from '../controller';
import type { IBoard } from '../board';
import { ValueButtons, NoteButtons } from './buttons';
import React from 'react';
import icons from './images/icons.svg';

type ControlProperties = { 
    board:      IBoard,
    controller: ICellController
};

export default class Controls extends React.Component<ControlProperties, any> {
    constructor(props: ControlProperties) {
        super(props);
    }

    setCellValue = (value: number) => {
        this.props.controller.setCellValue(this.props.board, this.props.board.getCursor(), value);
    }

    toggleCandidate = (value: number) => {
        this.props.controller.toggleCandidate(this.props.board, this.props.board.getCursor(), value);
    }

    clear = () => {
        this.props.controller.clear(this.props.board, this.props.board.getCursor());
    }

    render() {
        return (
            <div className="control-panel">
                <ValueButtons onClick={ this.setCellValue } />
                <NoteButtons  onClick={ this.toggleCandidate } />
                <button className="btn-clear" onClick={ this.clear }>
                    <span>
                        <svg className="icon">
                            <use xlinkHref={ icons + '#yaws-icon-x' }></use>
                        </svg>
                    </span>
                </button>
            </div>
        );
    }
}