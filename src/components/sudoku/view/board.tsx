import { IBoard, ICell } from '../interfaces';
import { Cell } from './cell';

type TProps = { model: IBoard };

const createCell = (cell: ICell) => <Cell model={cell} />;

export const Board = (props: TProps) => (
    <div id={props.model.id} className="board">
        { props.model.cells.map(createCell) }
    </div>
);