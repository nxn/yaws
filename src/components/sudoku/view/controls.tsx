import { Component }                    from 'inferno';
import { IBoard, ICellController }      from '../interfaces';
import { ValueButtons, NoteButtons }    from './buttons';
import icons from './images/icons.svg';

type ControlProperties = { 
    board:      IBoard,
    controller: ICellController
};

export class Controls extends Component<ControlProperties, any> {
    constructor(props: ControlProperties) {
        super(props);
    }

    setCellValue = (value: number) => {
        this.props.controller.setCellValue(this.props.board, this.props.board.cursor, value);
    }

    toggleCandidate = (value: number) => {
        this.props.controller.toggleCandidate(this.props.board, this.props.board.cursor, value);
    }

    clear = () => {
        this.props.controller.clear(this.props.board, this.props.board.cursor);
    }

    render() {
        return (
            <div className="control-panel">
                <ValueButtons onClick={ this.setCellValue } />
                <NoteButtons  onClick={ this.toggleCandidate } />
                <button className="btn-clear" onClick={ this.clear }>
                    <span>
                        <svg class="icon">
                            <use xlinkHref={ icons + '#yaws-icon-x' }></use>
                        </svg>
                    </span>
                </button>
            </div>
        );
    }
}