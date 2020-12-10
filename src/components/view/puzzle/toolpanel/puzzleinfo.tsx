import React from 'react';

import {
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    Typography,
} from '@material-ui/core';

import { IBoard, BoardEvents } from '@components/sudoku/models/board';
import type { IPuzzle } from '@components/sudoku/models/puzzle';

type TPuzzleInfoProperties = {
    model: IBoard
}

const info = (puzzle: IPuzzle) => ({
    name:       puzzle.getName(),
    difficulty: puzzle.getDifficulty(),
    created:    puzzle.getCreated(),
    modified:   puzzle.getModified(),
});

export const PuzzleInfo = (props: TPuzzleInfoProperties) => {
    const [puzzle, setPuzzle] = React.useState(info(props.model.getPuzzle()));

    React.useEffect(() => {
        const handler = (_: IBoard, puzzle: IPuzzle) => setPuzzle(info(puzzle));

        const eventStore = props.model.events.get(BoardEvents.PuzzleChanged);
        const eventListenerKey = eventStore.attach(handler);

        return () => eventStore.detach(eventListenerKey);
    });
    
    return (
        <Table size="small">
            <TableHead>
                <TableRow>
                    <TableCell colSpan={2}>
                        <Typography variant="subtitle1" color="textSecondary">{ puzzle.name }</Typography>
                    </TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                { !puzzle.difficulty ? null :
                    <TableRow>
                        <TableCell>
                            <Typography variant="subtitle2" color="textSecondary">Difficulty</Typography>
                        </TableCell>
                        <TableCell>
                            { puzzle.difficulty }
                        </TableCell>
                    </TableRow>
                }
                { !puzzle.created ? null :
                    <TableRow>
                        <TableCell>
                            <Typography variant="subtitle2" color="textSecondary">Created</Typography>
                        </TableCell>
                        <TableCell>
                            { puzzle.created.toLocaleString() }
                        </TableCell>
                    </TableRow>
                }
                { !puzzle.modified ? null :
                    <TableRow>
                        <TableCell>
                            <Typography variant="subtitle2" color="textSecondary">Modified</Typography>
                        </TableCell>
                        <TableCell>
                            { puzzle.modified.toLocaleString() }
                        </TableCell>
                    </TableRow>
                }
            </TableBody>
        </Table>
    );
}