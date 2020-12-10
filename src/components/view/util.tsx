import React from 'react';

export function extend<P, PExtended>(Component: React.ComponentType<P>) {
    return (props: P & PExtended) => <Component { ...props } />;
}