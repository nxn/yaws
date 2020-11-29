import React from 'react';

import { experimentalStyled as styled } from '@material-ui/core/styles';
import clsx from 'clsx';

import { IBoard }           from '@components/sudoku/board';
import { IBoardController } from '@components/sudoku/controller';

import Board        from './board/board';
import Controls     from './controls/controls';
import Toolpanel    from './toolpanel/toolpanel';

export interface IPuzzleViewProperties {
    model:              IBoard;
    controller:         IBoardController;
    displayControls?:   boolean;
    displaySidePanel?:  boolean;
    className?:         string;
}

export const PuzzleViewUnstyled = (props: IPuzzleViewProperties) => {
    const displayControls   = props.displayControls === undefined ? true : props.displayControls;
    const displaySidePanel  = props.displaySidePanel === undefined ? false : props.displaySidePanel;
    const scale = 2.0;

    return (
        <div className={ clsx('view', props.className) }>
            <Board      model={ props.model } controller={ props.controller } scale={ scale } />
            <Controls   board={ props.model } controller={ props.controller } visible={ displayControls }/>
            {/* <SidePanel  visible={ displaySidePanel } /> */}
        </div>
    );
}

export const PuzzleView = styled(PuzzleViewUnstyled)({
    display:        'flex',
    flexFlow:       'column nowrap',
    alignItems:     'center',
    justifyContent: 'center',
    height:         '100vh',

    '@media (orientation: landscape)': {
        flexDirection:  'row',
        justifyContent: 'space-evenly'
    },

    '@media (orientation: portrait)': {
        flexDirection: 'column'
    },
    
    '& .board': { flexGrow: 0 }
});

export default PuzzleView;