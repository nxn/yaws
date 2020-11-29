import React from 'react';

type ToolpanelProperties = {
    visible?: boolean,
    className?: string
}

export default (props: ToolpanelProperties) => (
    <div className={ props.className }>

    </div>
)