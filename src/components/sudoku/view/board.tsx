import { IBoard, ICell }    from '../interfaces';
import { ICellController }  from './controller';
import { Cell }             from './cell';

type BoardProperties = { 
    model:      IBoard,
    controller: ICellController
};

export const Board = (props: BoardProperties) => (
    <div id={props.model.id} className="board">{
        props.model.cells.map(
            (cell: ICell) => <Cell model={props.model} controller={props.controller} context={cell} />
        )
    }</div>
);
