import React from 'react';

import {
    Info as InfoIcon,
    ContactSupport as ContactIcon
} from '@material-ui/icons';

import clsx from 'clsx';

import {
    Tab,
    Tabs
} from '../common/tabs';

import Info from './info';
import Contact from './contact';
import useView from '../context';

export interface IHelpViewProperties {
    className?: string
}

type TVisibility = {
    visible: boolean
};

export function asTabPanel<P>(Component: React.ComponentType<P>) {
    return (props: P & TVisibility) => <div hidden={ !props.visible }><Component { ...props } /></div>;
}

const InfoTab = asTabPanel(Info);
const ContactTab = asTabPanel(Contact);

export const HelpView = (props: IHelpViewProperties) => {
    const view = useView();

    const [tab, setTab] = React.useState('info');

    const handleChange = (_: React.SyntheticEvent<Element, Event>, value: string) => {
        setTab(value);
    };

    let padding = '2rem 3rem';
    if (view.tiny) {
        padding = view.orientation === 'landscape' ? '2rem' : '1rem'
    }

    return (
        <div className={ clsx('view', props.className) }>
            <Tabs aria-label="Help" value={ tab } onChange={ handleChange }>
                <Tab icon={ <InfoIcon /> } label="Information" value="info" />
                <Tab icon={ <ContactIcon /> } label="Contact" value="contact" />
            </Tabs>

            <div style={{padding: padding, paddingBottom: 0}}>
                <InfoTab visible={ tab === 'info' } />
                <ContactTab visible={ tab === 'contact' } />
            </div>
            
        </div>
    );
}

export default HelpView;