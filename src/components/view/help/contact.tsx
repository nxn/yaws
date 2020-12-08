import React from 'react';

import {
    Box,
    TextField,
    Typography,
    Fab,
    experimentalStyled as styled
} from '@material-ui/core';

import {
    Send as SendIcon
} from '@material-ui/icons';

const Email = styled(Box)({
    display: 'grid',
    maxWidth: '800px',
    //margin: '0 auto',
    gridTemplateColumns: '1fr 1fr',
    gridTemplateAreas: `
        "subject subject"
        "message message"
        "address action"`
});

const Subject = styled(TextField)({
    gridArea: 'subject'
});

const Message = styled(TextField)(({theme}) => ({
    gridArea: 'message',
    '&.MuiTextField-root': {
        backgroundColor: theme.palette.background.paper,
        marginTop: theme.spacing(4)
    },
}));

const Address = styled(TextField)({
    gridArea: 'address'
});

const Send = styled(Fab)(({theme}) => ({
    gridArea: 'action',
    alignSelf: 'flex-end',
    justifySelf: 'flex-end',

    '&.MuiButtonBase-root': {
        marginBottom: theme.spacing(1)
    },
    '&.MuiFab-extended.MuiFab-sizeSmall': {
        padding: theme.spacing(0, 4),
    },
    '& .MuiSvgIcon-root': {
        marginRight: theme.spacing(1)
    }
}));

export const Contact = () => {
    return <>
        <Typography variant="h4" component="h1">Help: Contact Form</Typography>
        <br /><br />
        <Email>
            <Subject
                id="subject"
                label="Subject"
                placeholder="Subject"
                fullWidth
                variant="standard"
                required />

            <Message
                id="body"
                label="Message"
                variant="outlined"
                rows={10}
                fullWidth
                multiline
                required />

            <Address
                id="address"
                label="Your Email"
                placeholder="email@address.com"
                variant="standard"
                margin="normal"
                fullWidth
                required />

            <Send variant="extended" size="small" color="secondary">
                <SendIcon />Send
            </Send>
        </Email>
    </>;
};

export default Contact;