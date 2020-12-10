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
import useView, { IViewContext } from '../context';

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

// TODO: Do this with CSS
const getBasePaddingStyle = (defaultValue: string | number) => ({
    paddingTop:    defaultValue,
    paddingRight:  defaultValue,
    paddingBottom: defaultValue,
    paddingLeft:   defaultValue
});

const getViewPaddingStyle = (view: IViewContext) => {
    let style = getBasePaddingStyle('3rem');

    if (view.tiny) {
        if (view.orientation === 'landscape') {
            style = getBasePaddingStyle('2rem');
        }
        else {
            style = getBasePaddingStyle('1rem');
        }
    }
    else {
        style.paddingTop = '2rem';
    }

    style.paddingBottom = 0;
    return style;
}

export const HelpView = (props: IHelpViewProperties) => {
    const [tab, setTab] = React.useState('info');

    const handleChange = (_: React.SyntheticEvent<Element, Event>, value: string) => {
        setTab(value);
    };

    const style = getViewPaddingStyle(useView());

    return (
        <div className={ clsx('view', props.className) }>
            <Tabs aria-label="Help" value={ tab } onChange={ handleChange }>
                <Tab icon={ <InfoIcon /> } label="Information" value="info" />
                <Tab icon={ <ContactIcon /> } label="Contact" value="contact" />
            </Tabs>

            <div style={ style }>
                <InfoTab visible={ tab === 'info' } />
                <ContactTab visible={ tab === 'contact' } />
            </div>
            
        </div>
    );
}

export default HelpView;