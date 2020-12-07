import React from 'react';

import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
    Button,
    FormControlLabel,
    Checkbox,
    TextField
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
    
    const handleChange = (_: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
        setProgress(checked);
    }

    const url = view.actions.puzzle.getLink(props.model, progress, window.location);
    const checkbox = <Checkbox checked={ progress } onChange={ handleChange } name="include-progress" color="primary" />;

    const select = (event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => event.target.select();

    const copy = () => {
        navigator.clipboard.writeText(url);
        props.onClose();
    };

    return (
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
    );
}