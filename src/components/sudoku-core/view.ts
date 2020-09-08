import { IBoard, ICell, ICellCandidate, ICursor } from './interfaces';
import { select, selectAll, Selection } from "d3-selection";
import { range } from "@components/utilities/misc";
import './board.css';
import icons from './icons.svg';

let refresh: (...args:any) => void = () => undefined;

export function init(board: IBoard, parent = 'body') {
    scaleToViewport();
    window.addEventListener('resize', scaleToViewport);

    const root = select(parent).attr('class', 'yaws');
    
    refresh = (updateHighlight = true) => {
        root.selectAll(`#${board.id}`)
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

    initControlPanel(root, board.cursor);

    return refresh;
}

function scaleToViewport() {
    const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
    const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
    
    const vmin = 320;
    const vsize = Math.min(vw, vh);
    
    const scale = Math.max(1, Math.min(2, vsize/vmin));

    document.documentElement.style.setProperty('--yaws-scale', scale.toString());
}

function boardEnter(selection:Selection<any, IBoard, any, unknown>) {
    return selection
        .append('div')
            .attr('id', (g:IBoard) => g.id)
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

function initControlPanel(root: Selection<any, unknown, HTMLElement, any>, cursor: ICursor) {
    const getCssClass = function(n: number): string {
        let classes = [];

        if      (n <= 3)    { classes.push('top'); }
        else if (n <= 6)    { classes.push('middle'); }
        else                { classes.push('bottom'); }

        if      (n % 3 === 1)   { classes.push('left'); }
        else if (n % 3 === 2)   { classes.push('center'); }
        else                    { classes.push('right'); }

        return classes.join(' ');
    }

    const numberButtons = range(1, 9);

    let controlPanel = root.append('div').attr('class', 'control-panel');

    controlPanel.append('div').attr('class', 'values').selectAll('.btn-value')
        .data(numberButtons)
        .join(function(selection:Selection<any, any, HTMLDivElement, any>) {
            return selection.append('button')
                .attr('class', getCssClass)
                .attr('type', 'button')
                .text(n => n.toString())
                .on('click', function(n: number) {
                    if (cursor.cell.value && cursor.cell.value === n) {
                        cursor.clear();
                    }
                    else {
                        cursor.cell.value = n;
                    }
                    refresh(false);
                });
        });

    controlPanel.append('div').attr('class', 'candidates').selectAll('.btn-candidate')
        .data(numberButtons)
        .join(function(selection:Selection<any, any, HTMLDivElement, any>) {
            return selection.append('button')
                .attr('class', getCssClass)
                .attr('type', 'button')
                .text(n => n.toString())
                .on('click', function(n: number) {
                    let candidate = cursor.cell.candidates[n-1];
                    if (!candidate) return;
                    candidate.selected = !candidate.selected;
                    refresh(false);
                });
        });

    controlPanel.append('button')
        .attr('class', 'btn-clear')
        .attr('type', 'button')
        .on('click', function() {
            cursor.clear();
            refresh(false);
        })
        .append('svg').attr('class', 'icon')
        .append('use').attr('href', `${icons}#yaws-icon-x`);
}