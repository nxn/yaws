import { IBoard, ICell } from '../interfaces';
import { Cell } from './cell';

type TProps = { model: IBoard };

const createCell = (board: IBoard, cell: ICell) =>
    <Cell model={cell} cursor={board.cursor.cell === cell} />;

export const Board = (props: TProps) => (
    <div id={props.model.id} className="board">
        { props.model.cells.map((cell: ICell) => createCell(props.model, cell)) }
    </div>
);