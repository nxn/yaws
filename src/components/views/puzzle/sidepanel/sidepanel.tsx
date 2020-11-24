import React from 'react';

type SidePanelProperties = {
    visible?: boolean,
    className?: string
}

export default (props: SidePanelProperties) => (
    <div className={ props.className }>

    </div>
)