import React from 'react';

export function extend<P1, P2>(Component: React.ComponentType<P1>) {
    return (props: P1 & P2) => <Component { ...props } />
}