import React from 'react';

export interface IViewContext {
    tiny:           boolean,
    scale:          number,
    orientation:    'landscape' | 'portrait'
}

const ViewContext = React.createContext<IViewContext>({
    tiny:           false,
    orientation:    'landscape',
    scale:          1.0
});

export const ViewProvider = ViewContext.Provider;
export default ViewContext;