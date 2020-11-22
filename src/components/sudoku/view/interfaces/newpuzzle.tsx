import React from 'react';
import { createStyles, Theme, withStyles, WithStyles, makeStyles } from '@material-ui/core/styles';
import Dialog           from '@material-ui/core/Dialog';
import DialogTitle   	from '@material-ui/core/DialogTitle';
import IconButton       from '@material-ui/core/IconButton';
import CloseIcon        from '@material-ui/icons/Close';
import Typography       from '@material-ui/core/Typography';
import DialogContent 	from '@material-ui/core/DialogContent';
import DialogActions 	from '@material-ui/core/DialogActions';
import Button 			from '@material-ui/core/Button';
import RadioGroup 		from '@material-ui/core/RadioGroup';
import Radio, { RadioProps }	from '@material-ui/core/Radio';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import Fab from '@material-ui/core/Fab';

import Accordion 		from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon 	from '@material-ui/icons/ExpandMore';

import List             from '@material-ui/core/List';
import ListItem         from '@material-ui/core/ListItem';
import ListItemIcon 	from '@material-ui/core/ListItemIcon';
import ListItemText     from '@material-ui/core/ListItemText';

import DifficultyEasyIcon	from '@material-ui/icons/StarBorder';
import DifficultyMediumIcon	from '@material-ui/icons/StarHalf';
import DifficultyHardIcon	from '@material-ui/icons/Star';
import DifficultyCustomIcon from '@material-ui/icons/Stars';

import CustomizeIcon from '@material-ui/icons/AddCircle';

const useStyles = makeStyles((theme: Theme) => createStyles({
	fabButton: {
		position: 'absolute',
		zIndex: 1,
		bottom: 30,
		left: 30
	},
	button: {
		margin: theme.spacing(1),
	},
	custom: {
		color: theme.palette.action.active,
		margin: theme.spacing(1),
	}
}));


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
						<FormControlLabel value="custom" key="custom" control={<CustomRadio />} label="Custom" />
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