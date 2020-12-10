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

import type { IBoard } from '@components/sudoku/models/board';
import useView from '../../context';

export interface NewPuzzleDialogProperties {
	model: IBoard,
	open?: boolean,
    onClose: () => void
};

function CustomRadio(props: RadioProps) {
	return (
		<Radio icon={<CustomizeIcon />} { ...props } />
	);
}

type TDifficulty = 'easy' | 'medium' | 'hard' | 'random';

const getGenerateSettings = (difficulty: TDifficulty) => {
	switch (difficulty) {
		case 'easy':
			return { samples: 0, iterations: 1, removals: 1 };
		case 'medium':
			return { samples: 5, iterations: 29, removals: 2 };
		case 'hard':
			return { samples: 21, iterations: 58, removals: 1 };
		case 'random':
			return { samples: 15, iterations: 29, removals: 2 };
	}
}

export default function NewPuzzleDialog(props: NewPuzzleDialogProperties) {
	const [difficulty, setDifficulty] = React.useState<TDifficulty | 'custom'>('random');
	const handleDifficultyChange = (_: React.ChangeEvent<HTMLInputElement>, value: TDifficulty) => {
		setDifficulty(value)
	}

	const view = useView();

	const generate = () => {
		if (difficulty === 'custom') {

		}
		else {
			view.actions.puzzle.generate(props.model, getGenerateSettings(difficulty));
		}

		props.onClose();
	}
    return (
		<Dialog onClose={ props.onClose } open={!!props.open}>
			<DialogTitle>New Puzzle Difficulty</DialogTitle>

			<DialogContent dividers>
				<RadioGroup aria-label="difficulty" name="difficulty" value={difficulty} onChange={ handleDifficultyChange } >
					<FormControlLabel value="easy" key="easy" control={<Radio />} label="Easy" disabled />
					<FormControlLabel value="medium" key="medium" control={<Radio />} label="Medium" disabled />
					<FormControlLabel value="hard" key="hard" control={<Radio />} label="Hard" disabled />
					<FormControlLabel value="random" key="random" control={<Radio />} label="Random" />
					<FormControlLabel value="custom" key="custom" control={<CustomRadio />} label="Advanced" disabled />
				</RadioGroup>
			</DialogContent>

			<DialogActions>
				<Button color="primary" autoFocus onClick={ props.onClose }>
					Cancel
				</Button>
				<Button color="secondary" onClick={ generate }>
					Ok
				</Button>
			</DialogActions>
		</Dialog>
    );
}