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
import type { IPuzzleInfo } from '@components/sudoku/models/puzzleinfo';

type TPuzzleInfoProperties = {
    model: IBoard
}

export const PuzzleInfo = (props: TPuzzleInfoProperties) => {
    const [info, setInfo] = React.useState(props.model.getPuzzleInfo() || {
        name: 'Empty',
        created: 0,
        modified: 0
    })

    React.useEffect(() => {
        const handler = (_: IBoard, info: IPuzzleInfo) => setInfo(info);

        const eventStore = props.model.events.get(BoardEvents.PuzzleChanged);
        const eventListenerKey = eventStore.attach(handler);

        return () => eventStore.detach(eventListenerKey);
    });
    
    return (
        <Table size="small">
            <TableHead>
                <TableRow>
                    <TableCell colSpan={2}>
                        <Typography variant="subtitle1" color="textSecondary">{ info.name }</Typography>
                    </TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                { !info.difficulty ? null :
                    <TableRow>
                        <TableCell>
                            <Typography variant="subtitle2" color="textSecondary">Difficulty</Typography>
                        </TableCell>
                        <TableCell>
                            { info.difficulty }
                        </TableCell>
                    </TableRow>
                }
                { !info.created ? null :
                    <TableRow>
                        <TableCell>
                            <Typography variant="subtitle2" color="textSecondary">Created</Typography>
                        </TableCell>
                        <TableCell>
                            { new Date(info.created).toLocaleString() }
                        </TableCell>
                    </TableRow>
                }
                { !info.modified || info.created === info.modified ? null :
                    <TableRow>
                        <TableCell>
                            <Typography variant="subtitle2" color="textSecondary">Modified</Typography>
                        </TableCell>
                        <TableCell>
                            { new Date(info.modified).toLocaleString() }
                        </TableCell>
                    </TableRow>
                }
            </TableBody>
        </Table>
    );
}