import React from 'react';

import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
    Button,
    FormControlLabel,
    Checkbox,
    TextField,
    Snackbar,
    Alert
} from '@material-ui/core';

import type { IBoard } from '@components/sudoku/models/board';
import useView from '../../context';

export interface ShareDialogProperties {
	model: IBoard,
	open?: boolean,
    onClose: () => void
};


export default function ShareDialog(props: ShareDialogProperties) {
    const view = useView();

    const [progress, setProgress] = React.useState(true);

    // The Alert component crashes if it receives a null severity value, therefore the @severity state must contain an acceptable 
    // value at all times, even when it isn't being displayed.
    const [severity, setSeverity] = React.useState<'success' | 'error'>('success');
    const [showResult, setShowResult] = React.useState(false);
    
    const handleChange = (_: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
        setProgress(checked);
    }

    const url = view.actions.puzzle.getLink(props.model, progress, window.location);
    const checkbox = <Checkbox checked={ progress } onChange={ handleChange } name="include-progress" color="primary" />;

    const select = (event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => event.target.select();

    const success = () => {
        setSeverity("success");
        setShowResult(true);
    }

    const fail = () => {
        setSeverity("error");
        setShowResult(true);
    }

    const copy = () => {
        navigator.clipboard.writeText(url).then(success, fail);
        props.onClose();
    };

    const handleAlertClose = () => setShowResult(false);

    return <>
		<Dialog onClose={ props.onClose } aria-labelledby="customized-dialog-title" open={!!props.open} maxWidth="md" fullWidth>
			<DialogTitle>Share Link</DialogTitle>

			<DialogContent dividers>
                <TextField id="puzzle-link" label="URL" value={ url } variant="outlined" onFocus={ select } fullWidth multiline />
                <br />
                <FormControlLabel control={ checkbox } label="Include filled in values?" />
			</DialogContent>

			<DialogActions>
				<Button color="primary" autoFocus onClick={ props.onClose }>
					Cancel
				</Button>
				<Button color="secondary" onClick={ copy }>
					Copy
				</Button>
			</DialogActions>
		</Dialog>
        
        <Snackbar open={ showResult } onClose={ handleAlertClose }>
            <Alert severity={ severity } onClose={ handleAlertClose }>
                { severity === 'success' ? "Link copied!" : "Could not copy link!" }
            </Alert>
        </Snackbar>
    </>;
}