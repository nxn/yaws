import { curry }            from 'ramda';
import { IBoard, ICell }    from '../interfaces';
import { IBoardController } from './controller';
import { Cell }             from './cell';

type BoardProperties = { 
    model:      IBoard,
    controller: IBoardController
};

export const Board = (props: BoardProperties) => {
    let setCursor = curry(props.controller.moveCursor)(props.model);

    return (
        <div id={props.model.id} className="board">{
            props.model.cells.map((cell: ICell) => 
                <Cell 
                    model       = { cell } 
                    controller  = { props.controller } 
                    onClick     = { setCursor }
                    onTouchEnd  = { setCursor }
                    cursor      = { cell === props.model.cursor.cell } />
            )
        }</div>
    );
}