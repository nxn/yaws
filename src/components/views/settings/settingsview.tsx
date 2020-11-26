import { IViewPropertiesBase } from '../view';

import React from 'react';
import { experimentalStyled as styled } from '@material-ui/core/styles';
import clsx from 'clsx';

import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

interface ISettingsViewProperties extends IViewPropertiesBase { }

const Section = styled(Paper)({
    margin: '2rem',
    padding: '1rem'
});

const Title = styled(Box)({
    margin: '2rem 3rem',
    marginBottom: 0
})

export const SettingsView = (props: ISettingsViewProperties) => {
    return (
        <div className={ clsx('view', props.className) }>
            <Title>
                <Typography variant="h2" component="h1" gutterBottom>Settings</Typography>
            </Title>
        </div>
    );
}

export default SettingsView;