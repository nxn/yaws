import React from 'react';

import { experimentalStyled as styled } from '@material-ui/core/styles';
import clsx from 'clsx';

import { IBoard }   from '@components/sudoku/models/board';

import Board        from './board/board';
import Controls     from './controls/controls';
import Toolpanel    from './toolpanel/toolpanel';
import useView      from '../context';

export interface IPuzzleViewProperties {
    model:              IBoard;
    displayControls?:   boolean;
    displaySidePanel?:  boolean;
    className?:         string;
}

export const PuzzleViewUnstyled = (props: IPuzzleViewProperties) => {
    const view = useView();
    const displayControls   = props.displayControls === undefined ? true : props.displayControls;
    const displaySidePanel  = props.displaySidePanel === undefined ? false : props.displaySidePanel;

    return (
        <div className={ clsx(props.className) }>
            <Board      model={ props.model } actions={ view.actions } scale={ view.scale } />
            <Controls   board={ props.model } actions={ view.actions } scale={ view.scale } visible={ displayControls }/>
            {/* <SidePanel  visible={ displaySidePanel } /> */}
        </div>
    );
}

export const PuzzleView = styled(PuzzleViewUnstyled)({
    display:        'flex',
    flexFlow:       'column nowrap',
    alignItems:     'center',
    justifyContent: 'center',
    height:         '100%',
    width:          '100%',

    '.landscape &': {
        flexDirection:  'row',
        justifyContent: 'space-evenly'
    },

    '.portrait &': {
        flexDirection: 'column',
        justifyContent: 'space-evenly'
    },
    
    '& .board': { flexGrow: 0 }
});

export default PuzzleView;