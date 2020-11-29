import React from 'react';

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
    }
}

export const ViewContext = React.createContext<IViewContext>({
    orientation: 'landscape',
    setOrientation: () => {},

    scale: 1.0,
    setScale: (_: number) => {},

    tiny:           false,
    toggleTiny: () => {},

    appBar: {
        labels: false,
        toggleLabels: () => {}
    }
});

export const ViewProvider = ViewContext.Provider;

export const useView = () => React.useContext(ViewContext);

export default useView;