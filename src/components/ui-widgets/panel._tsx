import * as React from 'react';

type TProps = {
    active?: boolean
    children?: any
}

export function Panel(props: TProps): JSX.Element {
    const className = props.active ? "panel active" : "panel";

    return (
        <div className={ className }>
            { props.children }
        </div>
    );
}