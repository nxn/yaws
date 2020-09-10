import { IBoard, ICell } from '../interfaces';

import { Cell } from './cell';
import { YawsController } from './controller';

type BoardProperties = { 
    model:      IBoard,
    controller: YawsController
};

export const Board = (props: BoardProperties) => (
    <div id={props.model.id} className="board">
        { props.model.cells.map((cell: ICell) => createCell(cell, props)) }
    </div>
);

const createCell = (cell: ICell, props: BoardProperties) =>
    <Cell model={cell} controller={props.controller} cursor={props.model.cursor.cell === cell} />;
