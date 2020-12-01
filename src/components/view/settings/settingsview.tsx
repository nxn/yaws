import React from 'react';

import {
    Box,
    Paper,
    Typography,
    Tab,
    Tabs,
    experimentalStyled as styled
} from '@material-ui/core';

import clsx from 'clsx';

export interface ISettingsViewProperties {
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

export const SettingsView = (props: ISettingsViewProperties) => {
    return (
        <div className={ clsx(props.className) }>
            <Title>
                <Typography variant="h2" component="h1" gutterBottom>Settings</Typography>
            </Title>
            {/* <Tabs value="game-settings">
                <Tab label="Game" value="game-settings" />
                <Tab label="View" value="view-settings" />
                <Tab label="Controls" value="control-settings" />
            </Tabs> */}
        </div>
    );
}

export default SettingsView;