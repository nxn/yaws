// Re-styles Tab components so they can be displayed within the AppBar.

import React from 'react';

import MuiTab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';

import { experimentalStyled as styled } from '@material-ui/core/styles'

// Currently no custom styling is necessary for the "Tabs" wrapper component. The stock component is re-exported through
// here so that if changes are needed in the future they will apply to anything that imports it from this module.
export { default as Tabs } from '@material-ui/core/Tabs';

// Material UI's tabs only support placing icons above labels -- even when using vertical alignment. It also adds a
// mess of random padding and margin values to position things. The following tries to remove as much of that as
// possible by overriding these styles back to default.
export const Tab = styled(MuiTab)(({theme}) => ({
    '&.Mui-selected': {
        backgroundColor: theme.palette.action.selected
    },
    '&.MuiTab-root': {
        padding: 'initial',
        textTransform: 'initial'
    },

    // Ideally this class should not be applied
    '&.MuiTab-labelIcon': {
        minHeight: '48px',
        // Change first-child to first-of-type due to compile time warning
        '& .MuiTab-wrapper > *:first-of-type': {
            marginBottom: 'initial'
        }
    },

    '& .MuiTab-wrapper': {
        flexDirection: 'row',
        alignItems: 'initial',
        justifyContent: 'initial'
    },

    // Margin changes so that icons and text are aligned within appbar
    '& .MuiSvgIcon-root': {
        margin: theme.spacing(0, 2),
    },
    '& .MuiTypography-root': {
        margin: theme.spacing(0, 2),
    }
}));

// Replicates the above Tab style for button components. Used when there isn't enough space to display a full row/column
// of tabs -- instead a single button resembling a tab is used to launch a pop-over menu that displays the other panels.
export const TinyTab = styled(IconButton)(({theme}) => ({
    '&.MuiIconButton-root': {
        borderRadius: 0,
        backgroundColor: theme.palette.action.selected,
        //borderTop: `1px solid ${ theme.palette.divider }`,
        borderRight: `2px solid ${ theme.palette.secondary.main }`,
        // following only to ensure centering of icon
        //borderBottom: `1px solid ${ theme.palette.divider }`,
        borderLeft: '2px solid transparent'
    }
}))

// Wraps the textual portion of the tab with 'body1' Typography so that it mimics the styling used for other components
// like lists, menus, etc when used within the application's AppBar.
export const TabLabel = (props: { children: React.ReactChild }) => (
    <Typography component="span" variant="body1">{ props.children }</Typography>
);

type TabPanelChildProperties = {
    value: string
}

type TabPanelContainerProperties = {
    id: string,
    value: string,
    children: React.ReactNode,
    className?: string
};

export const TabPanelContainer = (props: TabPanelContainerProperties) => (
    <div id={ props.id } className={ props.className }>{
        React.Children.map(props.children, (child: React.ReactElement<TabPanelChildProperties>) => (
            <div
                id              = {`${ props.id }-${child.props.value}`}
                role            = "tabpanel"
                hidden          = { props.value !== child.props.value }
                aria-labelledby = {`tab-${ child.props.value }`}
            >
                { child }
            </div>
        ))
    }</div>
)
