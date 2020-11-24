

import React from 'react';
import { experimentalStyled as styled } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import clsx from 'clsx';

type AccountViewProperties = {
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

export const AccountView = (props: AccountViewProperties) => (
    <div className={ clsx('view', props.className) }>
        <Title>
            <Typography variant="h2" component="h1" gutterBottom>Account</Typography>
        </Title>
    </div>
);

export default styled(AccountView)({

});