import React from 'react';

import config from '../../../emailjs';
import email from 'emailjs-com';

import {
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

const Email = styled('form')({
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

type TFormValues = {
    subject: string,
    message: string,
    address: string
}

type TFormErrors = {
    subject?: string,
    message?: string,
    address?: string
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
const emptyRegex = /^[\s]*$/;

const validate = (values: TFormValues): TFormErrors => {
    let result = {
        subject: 'Subject is required',
        message: 'Message is required',
        address: 'Address is required'
    }

    if (!values) { return result; }

    if (values.subject && !emptyRegex.test(values.subject)) {
        delete result.subject;
    }

    if (values.message && !emptyRegex.test(values.message)) {
        delete result.message;
    }

    if (values.address && !emptyRegex.test(values.address)) {
        if (emailRegex.test(values.address)) {
            delete result.address
        }
        else {
            result.address = "Invalid email format"
        }
    }

    return result;
}

export const Contact = () => {
    const blankForm: TFormValues = { subject: '', message: '', address: '' };

    const [formValues, setFormValues] = React.useState<TFormValues>(blankForm);
    const [formErrors, setFormErrors] = React.useState<TFormErrors>({});

    const [severity, setSeverity]       = React.useState<'success' | 'error'>('success');
    const [disabled, setDisabled]       = React.useState(false);
    const [showResult, setShowResult]   = React.useState(false);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setFormValues({ ...formValues, [name]: value.trimStart() });
    }

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const errors = validate(formValues);
        setFormErrors(errors);

        if (Object.keys(errors).length === 0) {
            setDisabled(true);

            email.send(
                config.serviceID, 
                config.templateID, 
                formValues
            ).then(handleSendSuccess, handleSendError);
        }

        return false;
    }

    const handleSendSuccess = () => {
        setSeverity('success');
        setShowResult(true);
        setFormValues(blankForm);
        setDisabled(false);
    }

    const handleSendError = (_reason: any) => {
        setSeverity('error');
        setShowResult(true);
        setDisabled(false);
    }

    const handleAlertClose = () => setShowResult(false);

    return <>
        <Typography variant="h4" component="h1">Send us a message:</Typography>
        <br /><br />
        <Email onSubmit={ handleSubmit } noValidate>
            <Subject fullWidth
                variant     = "standard"
                label       = "Subject:"
                id          = "subject"
                name        = "subject"
                value       = { formValues.subject }
                helperText  = { formErrors.subject }
                error       = { !!formErrors.subject }
                onChange    = { handleChange }
                disabled    = { disabled } />

            <Message fullWidth multiline
                rows        = {10}
                variant     = "outlined"
                label       = "Message:"
                id          = "message"
                name        = "message"
                value       = { formValues.message }
                helperText  = { formErrors.message }
                error       = { !!formErrors.message }
                onChange    = { handleChange }
                disabled    = { disabled } />

            <Address fullWidth
                variant     = "standard"
                margin      = "normal"
                label       = "Send replies to:"
                placeholder = "your.email@address.com"
                id          = "address"
                name        = "address"
                value       = { formValues.address }
                helperText  = { formErrors.address }
                error       = { !!formErrors.address }
                onChange    = { handleChange }
                disabled    = { disabled } />

            <Send variant="extended" size="small" color="secondary" type="submit" disabled={ disabled }>
                <SendIcon />Send
            </Send>
        </Email>

        <Snackbar open={ showResult } onClose={ handleAlertClose } autoHideDuration={ 10000 }>
            <Alert severity={ severity } onClose={ handleAlertClose }>
                { severity === 'success' ? "Message sent!" : "Could not deliver message!" }
            </Alert>
        </Snackbar>
    </>;
};

export default Contact;