import { IBoard, ICell, ICellCandidate } from './interfaces';
import { select, selectAll, Selection } from "d3-selection";
import './board.css';

let refresh: (...args:any) => void = () => undefined;

export function init(board: IBoard, parent = 'body') {
    const dom = select(parent);

    refresh = (updateHighlight = true) => {
        dom.selectAll(`#${board.id}`)
                .data([board], (g:IBoard) => g.id)
                .join(boardEnter)
            .selectAll('.cell')
                .data(g => g.cells, (c:ICell) => c.id)
                .join(cellEnter, cellUpdate)
            .selectAll('.candidate')
                .data(c => c.candidates)
                .join(candidateEnter, candidateUpdate);

        if (updateHighlight) {
            setHighlight(board.cursor.cell)
        }
    };

    refresh();

    return refresh;
}

function boardEnter(selection:Selection<any, IBoard, any, unknown>) {
    return selection
        .append('div')
            .attr('id', (g:IBoard) => g.id)
            .attr('class', 'yaws')
        .append('div')
            .attr('class', 'board')
            .on('mouseleave', g => setHighlight(g.cursor.cell));
}

function cellEnter(selection:Selection<any, ICell, any, IBoard>) {
    const cell = selection.append('div')
        .attr('id', c => c.id)
        .attr('class', c =>
            [ 'cell'
            , c.row.name
            , c.column.name
            , c.box.name
            , c.isStatic ? 'static' : 'editable'
            ].join(' ')
        )
        .classed('cursor', function(c) {
            return c === (select(this.parentNode).datum() as IBoard).cursor.cell;
        })
        .on('mouseenter', setHighlight)
        // .on('mouseenter', function(c) {
        //     (select(this.parentNode).datum() as IBoard).cursor.cell = c;
        //     refresh();
        // });

    cell.append('div')
        .attr('class', c => c.isValid ? 'value' : 'value invalid')
        .text(c => c.value > 0 ? c.value : '')
        .on('dblclick', c => {
            c.value = 0;
            refresh(false);
        });

    return cell.append('div')
        .attr('class', 'notes')
        .classed('hidden', c => c.value !== 0);
}

function cellUpdate(selection:Selection<any, ICell, any, IBoard>) {
    selection
        .classed('static', c => c.isStatic)
        .classed('editable', c => !c.isStatic)
        .classed('cursor', function(c) {
            return c === (select(this.parentNode).datum() as IBoard).cursor.cell
        });

    selection.selectAll('.value')
            .attr('class', (c:ICell) => c.isValid ? 'value' : 'value invalid')
            .text((c:ICell) => c.value > 0 ? c.value : '');

    selection.selectAll('.notes')
        .classed('hidden', (c:ICell) => c.value !== 0);

    return selection;
}

function candidateEnter(selection:Selection<any, ICellCandidate, any, ICell>) {
    return selection.append('div')
        .attr('class', getCandidateClasses)
        .text(c => c.value)
        .on('click', c => { 
            c.selected = !c.selected; 
            refresh(false); 
        })
        .on('dblclick', c => { 
            c.cell.value = c.value; 
            refresh(false);
        });
}

function candidateUpdate(selection: Selection<any, ICellCandidate, any, ICell>) {
    selection
        .classed('selected', c => c.selected)
        .classed('invalid', c => !c.isValid);

    return selection;
}

function getCandidateClasses(candidate: ICellCandidate) {
    let classes = ['candidate'];

    if (candidate.selected) {
        classes.push('selected');
    }

    if (!candidate.isValid) {
        classes.push('invalid');
    }

    if (candidate.value % 3 === 0) {
        classes.push('last-column');
    }

    if (candidate.value > 6) {
        classes.push('last-row');
    }

    return classes.join(' ');
}

function hideCursor() {
    selectAll(`.cursor`).classed('cursor', false);
}

function setHighlight(cell: ICell): void {
    selectAll('.highlight').classed('highlight', false);
    selectAll(`.${cell.row.name}, .${cell.column.name}`)
        .classed('highlight', true);
}
