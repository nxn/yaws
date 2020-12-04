import React from 'react';

import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Button,
	RadioGroup,
	Radio,
	RadioProps,
	FormControlLabel
} from '@material-ui/core';

import CustomizeIcon from '@material-ui/icons/AddCircle';

export interface NewPuzzleProps {
    open?: boolean,
    onClose: () => void
};

function CustomRadio(props: RadioProps) {
	return (
		<Radio icon={<CustomizeIcon />} { ...props } />
	);
}

export default function NewPuzzleDialog(props: NewPuzzleProps) {
    return (
        <div>
            <Dialog onClose={ props.onClose } aria-labelledby="customized-dialog-title" open={!!props.open}>
                <DialogTitle>New Puzzle Difficulty</DialogTitle>

				<DialogContent dividers>
					<RadioGroup aria-label="difficulty" name="difficulty">
						<FormControlLabel value="easy" key="easy" control={<Radio />} label="Easy" />
						<FormControlLabel value="medium" key="medium" control={<Radio />} label="Medium" />
						<FormControlLabel value="hard" key="hard" control={<Radio />} label="Hard" />
						<FormControlLabel value="custom" key="custom" control={<CustomRadio />} label="Advanced" />
					</RadioGroup>
				</DialogContent>

				<DialogActions>
					<Button color="primary" autoFocus onClick={ props.onClose }>
						Cancel
					</Button>
					<Button color="secondary" onClick={ props.onClose }>
						Ok
					</Button>
				</DialogActions>
            </Dialog>
        </div>
    );
}