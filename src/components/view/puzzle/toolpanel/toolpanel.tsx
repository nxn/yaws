import React from 'react';

import {
    Drawer,
    Typography,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    experimentalStyled as styled
} from '@material-ui/core';

import {
    ExpandMore      as ExpandMoreIcon,
    PaletteOutlined as ColorIcon,
    History         as HistoryIcon,
    Info            as InfoIcon,
} from '@material-ui/icons';

import clsx from 'clsx';

import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
} from './accordion';

import useView from '../../context';
import type { IBoard } from '@components/sudoku/models/board';

type ToolpanelProperties = {
    model:      IBoard,
    onClose?:   (event: {}, reason: "backdropClick" | "escapeKeyDown") => void
    open?:      boolean,
    className?: string
}

type TPanels = { details: boolean, colors: boolean, history: boolean };
export const ToolpanelUnstyled = (props: ToolpanelProperties) => {
    const view = useView();

    const anchor = view.orientation === 'landscape' ? 'right' : 'bottom';
    const variant = view.orientation === 'landscape' && !view.tiny ? 'persistent' : 'temporary';

    const [expanded, setExpanded] = React.useState<TPanels>({ details: !view.tiny, colors: false, history: false });
    const handleChange = (panel: keyof TPanels) => (_: React.SyntheticEvent, isExpanded: boolean) => {
        const panels = view.tiny 
            ? { details: false, colors: false, history: false } 
            : { ... expanded }; // Need to create a clone so that modifications aren't performed on the state object directly
        panels[panel] = isExpanded;
        setExpanded(panels);
    }

    const now = Date.now();
    let info = props.model.getPuzzleInfo();
    if (!info) {
        info = {
            name: 'Unknown',
            created: now,
            modified: now
        }
    }

    return (
        <Drawer
            className   = { clsx(props.className, variant === 'persistent' && (props.open ? 'expanded' : 'collapsed')) }
            anchor      = { anchor }
            variant     = { variant }
            open        = { props.open }
            onClose     = { props.onClose }>
        
            <Accordion square expanded={ expanded.details } onChange={ handleChange('details') }>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header">
                    
                    <InfoIcon color="action" />
                    <Typography variant="button" color="textSecondary">Puzzle Details</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell colSpan={2}>
                                    <Typography variant="subtitle1" color="textSecondary">{ info.name }</Typography>
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            { info.difficulty &&
                                <TableRow>
                                    <TableCell>
                                        <Typography variant="subtitle2" color="textSecondary">Difficulty</Typography>
                                    </TableCell>
                                    <TableCell>
                                        { info.difficulty }
                                    </TableCell>
                                </TableRow>
                            }
                            <TableRow>
                                <TableCell>
                                    <Typography variant="subtitle2" color="textSecondary">Created</Typography>
                                </TableCell>
                                <TableCell>
                                    { new Date(info.created).toLocaleString() }
                                </TableCell>
                            </TableRow>
                            { info.created !== info.modified &&
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
                </AccordionDetails>
            </Accordion>

            <Accordion disabled square expanded={ expanded.colors } onChange={ handleChange('colors') }>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel2a-content"
                    id="panel2a-header">
                    
                    <ColorIcon color="action"  />
                    <Typography variant="button" color="textSecondary">Colors</Typography>
                </AccordionSummary>
                <AccordionDetails>
                </AccordionDetails>
            </Accordion>

            <Accordion disabled square expanded={ expanded.history } onChange={ handleChange('history') }>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel3a-content"
                    id="panel3a-header">
                    
                    <HistoryIcon color="action" />
                    <Typography variant="button" color="textSecondary">History</Typography>
                </AccordionSummary>
                <AccordionDetails>
                </AccordionDetails>
            </Accordion>
        </Drawer>
    );
}

const width = 260;
export const Toolpanel = styled(ToolpanelUnstyled)(({theme}) => ({
    '&.MuiDrawer-docked': {
        '& > .MuiDrawer-paper': {
            borderLeft: 'initial',
            boxShadow:
                '-1px 0px 1px -1px rgba(0,0,0,0.2),' +
                '-1px 0px 1px 0px rgba(0,0,0,0.14),' +
                '-3px 0px 3px 0px rgba(0,0,0,0.12)'
        },
        '&.collapsed': {
            width: 0,
            transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
            })
        },
        '&.expanded': {
            '& > .MuiDrawer-paper': { width: width },
            width: width,
            transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen,
            }),

        }
    }
}));


export default Toolpanel;