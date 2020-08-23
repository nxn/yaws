import * as React from 'react'

type TProps = {
    children?: any;
    name?: string;
}
export function Fieldset(props: TProps): JSX.Element {
    const name = props.name ?? "Fieldset";

    return (
        <fieldset className="fieldset">
            <legend>
                <span className="arrow">&gt;</span>&nbsp;{ name }&nbsp;
            </legend>
            { props.children }
        </fieldset>
    );
}