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
    onToolpanelClose?:  () => void;
    displayControls?:   boolean;
    displayToolpanel?:  boolean;
    className?:         string;
}

export const PuzzleViewUnstyled = (props: IPuzzleViewProperties) => {
    const view = useView();

    return (
        <div className={ clsx(props.className) }>
            <div className={ 'game-ui'}>
                <Board      model={ props.model } actions={ view.actions } scale={ view.scale } />
                <Controls   model={ props.model } actions={ view.actions } scale={ view.scale } open={ props.displayControls } />
            </div>
            <Toolpanel  model={ props.model } open={ props.displayToolpanel } onClose={ props.onToolpanelClose } />
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

    '& .game-ui': {
        display:        'flex',
        height:         '100%',
        width:          '100%',
        alignItems:     'center',
        justifyContent: 'space-evenly',
        '.landscape &': {
            flexDirection:  'row',
        },
        '.portrait &': {
            flexDirection: 'column',
        },
    },

    '.landscape &': {
        flexDirection:  'row',
    },

    '.portrait &': {
        flexDirection: 'column',
    },
});

export default PuzzleView;