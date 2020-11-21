import type { IBoardController } from '../controller';
import type { ICell } from '../cell';
import { IBoard, BoardEvents } from '../board';
import Cell from './cell';
import React from 'react';
import clsx from 'clsx';
import { Theme, makeStyles, createStyles } from '@material-ui/core/styles';

type StyleProperties = {
    scale: number
}

type BoardProperties = { 
    model:      IBoard,
    controller: IBoardController,
    scale:      number
};

const useStyles = makeStyles((theme: Theme) => createStyles({
    root: (props: StyleProperties) => ({
        cursor:                 'default',
        WebkitUserSelect:       'none',
        MozUserSelect:          'none',
        msUserSelect:           'none',
        userSelect:             'none',
        touchAction:            'auto',

        flexGrow:               0,
        textAlign:              'center',
        display:                'grid',
        gridTemplateColumns:    'repeat(9, auto)',
        verticalAlign:          'middle',

        // The root background is only visible in gaps between cells, therefore the divider color is most appropriate
        backgroundColor:        theme.palette.divider,
        border:                 `${ 0.1875 * props.scale }rem solid ${ theme.palette.action.hover }`,
        borderRadius:           `${ 0.25 * props.scale }rem`,
    }),

    // Board Dividers
    cellSpacerRightSmall: {
        marginRight: '0.0625rem'
    },
    cellSpacerRightLarge: (props: StyleProperties) => ({
        marginRight: `${ 0.1875 * props.scale }rem`
    }),
    cellSpacerBottomSmall: {
        marginBottom: '0.0625rem'
    },
    cellSpacerBottomLarge: (props: StyleProperties) => ({
        marginBottom: `${ 0.1875 * props.scale }rem`
    }),

    // Board Inner Corners
    cellCornerTopLeft: (props: StyleProperties) => ({
        borderTopLeftRadius: `${ 0.125 * props.scale }rem`
    }),
    cellCornerTopRight: (props: StyleProperties) => ({
        borderTopRightRadius: `${ 0.125 * props.scale }rem`
    }),
    cellCornerBottomLeft: (props: StyleProperties) => ({
        borderBottomLeftRadius: `${ 0.125 * props.scale }rem`
    }),
    cellCornerBottomRight: (props: StyleProperties) => ({
        borderBottomRightRadius: `${ 0.125 * props.scale }rem`
    }),

    loading: {}
}));

export default function Board(props: BoardProperties) {
    const [ready, setReady] = React.useState(props.model.isReady());
    const [highlight, setHighlight] = React.useState(props.model.getCursor());

    // External event for updating UI when board changes readyness state
    React.useEffect(() => {
        const updateReadyState = (board: IBoard) => {
            if (props.model === board && ready !== board.isReady()) {
                setReady(board.isReady());
            }
        }

        const eventStore = props.model.events.get(BoardEvents.ReadyStateChanged);
        const listenerKey = eventStore.attach(updateReadyState);

        return function cleanup() {
            eventStore.detach(listenerKey);
        }
    }, [ready]);

    // External event for updating UI highlight when cursor moves
    React.useEffect(() => {
        const updateHighlightState = (board: IBoard, cell: ICell) => {
            if (board !== props.model) { return; }
            setHighlight(cell);
        }

        const eventStore = props.model.events.get(BoardEvents.CursorMoved);
        const listenerKey = eventStore.attach(updateHighlightState);

        return function cleanup() {
            eventStore.detach(listenerKey);
        }
    }, [highlight]);

    const resetHighlight = () => {
        setHighlight(props.model.getCursor());
    }
    
    const isHighlighted = (cell: ICell) => {
        return cell.row.index    === highlight.row.index 
            || cell.column.index === highlight.column.index
    }
    
    const setCursor = (cell: ICell) => {
        props.controller.setCursor(props.model, cell);
    }

    const classes = useStyles(props);
    return (
        <div id={ props.model.id } 
            className={ clsx(classes.root, { [classes.loading]: !ready }) }
            onMouseLeave={ resetHighlight }>{
                props.model.cells.map((cell: ICell) => 
                    <Cell 
                        key         = { cell.index }
                        model       = { cell } 
                        controller  = { props.controller }
                        board       = { props.model }
                        onClick     = { setCursor }
                        onMouseMove = { setHighlight }
                        highlight   = { isHighlighted(cell) }
                        scale       = { props.scale }
                        className   = { clsx({
                            // Spacers and Sub-Dividers
                            [classes.cellSpacerRightLarge]:     (cell.column.index + 1) % 3 === 0 && (cell.column.index + 1)    % 9 !== 0,
                            [classes.cellSpacerRightSmall]:     (cell.column.index + 1) % 3 !== 0 && (cell.column.index + 1)    % 9 !== 0,
                            [classes.cellSpacerBottomLarge]:    (cell.row.index + 1)    % 3 === 0 && (cell.row.index + 1)       % 9 !== 0,
                            [classes.cellSpacerBottomSmall]:    (cell.row.index + 1)    % 3 !== 0 && (cell.row.index + 1)       % 9 !== 0,

                            // Board Corners
                            [classes.cellCornerTopLeft]:        cell.column.index === 0 && cell.row.index === 0,
                            [classes.cellCornerBottomLeft]:     cell.column.index === 0 && cell.row.index === 8,
                            [classes.cellCornerTopRight]:       cell.column.index === 8 && cell.row.index === 0,
                            [classes.cellCornerBottomRight]:    cell.column.index === 8 && cell.row.index === 8
                        })} />
                )
        }</div>
    );
}
