import {
    Accordion           as MuiAccordion,
    AccordionSummary    as MuiAccordionSummary,
    AccordionDetails    as MuiAccordionDetails,

    experimentalStyled  as styled
} from '@material-ui/core';

import { lighten, darken } from '@material-ui/core/styles';

export const Accordion = styled(MuiAccordion)(({theme}) => ({
    '&.MuiAccordion-root': {
        boxShadow: 'none',
        borderBottom: `1px solid ${ theme.palette.divider }`,
        '&:before': { display: 'none' },
        '&.Mui-expanded': { margin: 'initial' }
    }
}));

export const AccordionSummary = styled(MuiAccordionSummary)(({theme}) => ({
    '&.MuiAccordionSummary-root': {
        '&.Mui-expanded': {
            minHeight: 'initial',
            borderBottom: `1px solid ${ theme.palette.divider }`
        },
    },

    '& .MuiAccordionSummary-content': {
        margin: theme.spacing(1.5, 0),
        '&.Mui-expanded': {
            margin: theme.spacing(1.5, 0)
        },
        '& .MuiSvgIcon-root': {
            marginRight: theme.spacing(2)
        }
    }
}));

export const AccordionDetails = styled(MuiAccordionDetails)(({theme}) => ({
    '&.MuiAccordionDetails-root': {
        padding: 0,
        backgroundColor: theme.palette.mode === "dark" 
            ? lighten(theme.palette.background.paper, 0.08) 
            : darken(theme.palette.background.paper, 0.08),
    },
}));