import * as React from 'react'

import { Button } from './button';

type TChild = {
    props: { toggle: boolean }
}

type TProps = {
    minActive?: string;
    maxActive?: string;
    className?: string;
    children?: TChild | TChild[];
}

export function ButtonGroup(props: TProps): JSX.Element {
    let minActive = parseInt(props.minActive);
    let maxActive = parseInt(props.maxActive);

    const className = props.className ?? "button-group";

    if (minActive > 0 || maxActive > 0) {
        // children now must be in toggle mode
    }

    return (
        <div className={ className }>
            { props.children }
        </div>
    );
}