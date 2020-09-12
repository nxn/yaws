import { curry } from 'ramda';
import { Cell } from './cell';
import { IBoardController, IBoard, ICell } from '../interfaces';

type BoardProperties = { 
    model:      IBoard,
    controller: IBoardController
};

export const Board = (props: BoardProperties) => {
    let setCursor = curry(props.controller.setCursor)(props.model);

    return (
        <div id={props.model.id} className="board">{
            props.model.cells.map((cell: ICell) => 
                <Cell 
                    model       = { cell } 
                    controller  = { props.controller } 
                    onClick     = { setCursor }
                    onTouchEnd  = { setCursor }
                    cursor      = { cell === props.model.cursor } />
            )
        }</div>
    );
}