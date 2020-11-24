

import React from 'react';
import { experimentalStyled as styled } from '@material-ui/core/styles';
import clsx from 'clsx';

type AccountViewProperties = {
    className?: string
}

export const AccountView = (props: AccountViewProperties) => (
    <div className={ clsx('view', props.className) }>

    </div>
);

export default styled(AccountView)({

});