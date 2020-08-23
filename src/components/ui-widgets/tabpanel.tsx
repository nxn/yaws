import * as React       from 'react';

import { Panel }        from './panel';
import { Button }       from './button';
import { ButtonGroup }  from './buttongroup';

type TChild = { props: { name?: string, active?: boolean } };
type TProps = { children?: TChild | TChild[] };

export function TabPanel(props: TProps): JSX.Element {
    const [active, setActive] = React.useState(
        Math.max(0, React.Children.toArray(props.children).findIndex((c:TChild) => c.props.active))
    );

    const buttons: JSX.Element[] = [];
    const panels:  JSX.Element[] = [];

    React.Children.forEach(props.children, (child, index) => {
        const buttonText = child.props?.name ?? `Tab: ${ index }`;
        buttons.push(
            index === active
                ? <Button key={ index } text={ buttonText } onClick={ () => setActive(index) } active />
                : <Button key={ index } text={ buttonText } onClick={ () => setActive(index) } />
        );

        panels.push(
            index === active
                ? <Panel key={ index } active>{ child }</Panel>
                : <Panel key={ index }>{ child }</Panel>
        );
    });

    return (
        <div className="tabs">
            <ButtonGroup className="tab-buttons">
                { buttons }
            </ButtonGroup>
            <div className="tab-panels">
                { panels }
            </div>
        </div>
    );
}