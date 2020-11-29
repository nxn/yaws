import React from 'react';

import {
    Box,
    Paper,
    Typography,
    experimentalStyled as styled
} from '@material-ui/core';

import clsx from 'clsx';

export interface IAccountViewProperties { 
    className?: string
}

const Section = styled(Paper)({
    margin: '2rem',
    padding: '1rem'
});

const Title = styled(Box)({
    margin: '2rem 3rem',
    marginBottom: 0
})

export const AccountView = (props: IAccountViewProperties) => (
    <div className={ clsx('view', props.className) }>
        <Title>
            <Typography variant="h2" component="h1" gutterBottom>Account</Typography>
        </Title>
    </div>
);

export default AccountView;