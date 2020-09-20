import * as React from 'react'

type TProps = {
    className?: string;
    text?:      string;
    active?:    boolean;
    onClick?:   (...args:any) => void;
}

export function Button(props: TProps): JSX.Element {
    let className = props.className ?? "btn";

    if (props.active) {
        className += " active";
    }

    return (
        <button className={ className } onClick={ props.onClick }>{ props.text }</button>
    );
}