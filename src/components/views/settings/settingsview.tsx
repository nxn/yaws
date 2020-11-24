

import React from 'react';
import { experimentalStyled as styled } from '@material-ui/core/styles';
import clsx from 'clsx';

type SettingsViewProperties = {
    className?: string
}

export const SettingsView = (props: SettingsViewProperties) => (
    <div className={ clsx('view', props.className) }>

    </div>
);

export default styled(SettingsView)({

});