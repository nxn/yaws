import React from 'react';

import type { IActions } from '@components/sudoku/actions/actions';

type Orientation = 'landscape' | 'portrait';

export interface IViewContext {
    orientation: Orientation;
    setOrientation: (orientation: Orientation) => void;

    scale: number;
    setScale: (scale: number) => void;

    tiny: boolean;
    toggleTiny: () => void;

    appBar: {
        labels: boolean;
        toggleLabels: () => void;
    },

    actions: IActions
}

export const ViewContext = React.createContext<IViewContext>({
    orientation: 'landscape',
    setOrientation: () => {},

    scale: 1.0,
    setScale: (_: number) => {},

    tiny: false,
    toggleTiny: () => {},

    appBar: {
        labels: false,
        toggleLabels: () => {}
    },

    actions: null
});

export const ViewProvider = ViewContext.Provider;

export const useView = () => React.useContext(ViewContext);

export default useView;