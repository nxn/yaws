import React from 'react';

import config from '../../../emailjs';
import email from 'emailjs-com';

import {
    Box,
    TextField,
    Typography,
    Fab,
    Snackbar,
    Alert,
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
    const [subject, setSubject] = React.useState('');
    const [message, setMessage] = React.useState('');
    const [address, setAddress] = React.useState('');

    const [severity, setSeverity] = React.useState<'success' | 'error'>('success');
    const [disableSend, setDisableSend] = React.useState(false);
    const [showResult, setShowResult] = React.useState(false);

    const handleSubjectChange = (event: React.ChangeEvent<HTMLInputElement>) => setSubject(event.target.value);
    const handleMessageChange = (event: React.ChangeEvent<HTMLInputElement>) => setMessage(event.target.value);
    const handleAddressChange = (event: React.ChangeEvent<HTMLInputElement>) => setAddress(event.target.value);

    const success = () => {
        setSeverity('success');
        setShowResult(true);
        setDisableSend(false);
    }

    const error = (_reason: any) => {
        setSeverity('error');
        setShowResult(true);
        setDisableSend(false);
    }

    const send = () => {
        setDisableSend(true);

        email.send(
            config.serviceID, 
            config.templateID, 
            { subject: subject, message: message, address: address }
        ).then(success, error);
    }

    const handleAlertClose = () => setShowResult(false);

    return <>
        <Typography variant="h4" component="h1">Help: Contact Form</Typography>
        <br /><br />
        <Email>
            <Subject
                id="subject"
                label="Subject"
                placeholder="Subject"
                variant="standard"
                onChange={ handleSubjectChange }
                fullWidth
                required />

            <Message
                id="body"
                label="Message"
                variant="outlined"
                rows={10}
                onChange={ handleMessageChange }
                fullWidth
                multiline
                required />

            <Address
                id="address"
                label="Your Email"
                placeholder="email@address.com"
                variant="standard"
                margin="normal"
                onChange={ handleAddressChange }
                fullWidth
                required />

            <Send variant="extended" size="small" color="secondary" onClick={ send } disabled={ disableSend }>
                <SendIcon />Send
            </Send>
        </Email>
        <Snackbar open={ showResult } onClose={ handleAlertClose }>
            <Alert severity={ severity } onClose={ handleAlertClose }>
                { severity === 'success' ? "Message sent!" : "Could not deliver message!" }
            </Alert>
        </Snackbar>
    </>;
};

export default Contact;