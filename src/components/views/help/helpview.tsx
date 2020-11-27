import React from 'react';
import { experimentalStyled as styled } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import clsx from 'clsx';

export interface IHelpViewProperties {
    className?: string
}

const Section = styled(Paper)({
    margin: '2rem',
    padding: '1rem'
});

const Title = styled(Box)({
    margin: '2rem 3rem',
    marginBottom: 0
});

export const HelpView = (props: IHelpViewProperties) => (
    <div className={ clsx('view', props.className) }>
        <Title>
            <Typography variant="h2" component="h1" gutterBottom>Help: General Information</Typography>
        </Title>

        <Section>
            <Typography variant="h4" component="h2" gutterBottom>Sudoku Rules</Typography>
            <Typography variant="body1" gutterBottom>
                The objective is to fill the 9×9 grid with digits so that each column, each row, and each of the
                nine 3×3 subgrids contain all of the digits from 1 to 9. For more information regarding Sudoku,
                feel free to <Link href="https://en.wikipedia.org/wiki/Sudoku" target="_blank" rel="noreferrer">
                visit the wikipedia article.</Link>
            </Typography>
        </Section>

        <Section>
            <Typography variant="h4" component="h2" gutterBottom>Keyboard Controls</Typography>

            <Typography variant="body1" gutterBottom>
                Besides using a <strong>mouse</strong>, or <strong>touch</strong>, you can use <strong>Arrow 
                Keys</strong>, <strong>W / A / S / D</strong>, or (if you're familiar with VIM-like navigation) 
                <strong> H / J / K / L</strong> to move the cursor by a single cell. Holding <strong>Shift
                </strong> while pressing any direction key will move the cursor over by a box.
            </Typography>
            <br />
            <Typography variant="body1" gutterBottom>
                To mark a candidate within a cell, first navigate to the cell, then press the <strong>number key
                </strong> of the digit you'd like to mark as a candidate. This can be done using either the 
                keyboard's <strong>standard number keys</strong>, or with its <strong>number pad</strong>. 
                Pressing the number again will remove that candidate from the cell.
            </Typography>
            <br />
            <Typography variant="body1" gutterBottom>
                Once you are confident that you have narrowed down a given cell to a single value, you can set 
                that value by holding <strong>Shift</strong> while inputting the desired number.
            </Typography>
            <br />
            <Typography variant="body1" gutterBottom>
                Using <strong>X</strong>, <strong>Backspace</strong> or <strong>Delete</strong> will clear the 
                current cell of its value. If there is no set value, it will clear all marked candidates within 
                the cell instead.
            </Typography>
            <br />
            <Typography variant="body1" gutterBottom>
                If any errors are present on the grid, pressing <strong>E</strong> will cause the cursor to
                cycle through them. <strong>Shift + E</strong> can be used to move in the opposite direction.
            </Typography>
        </Section>

        <Section>
            <Typography variant="h4" component="h2" gutterBottom>About This Project</Typography>

            <Typography variant="body1" gutterBottom>
                <strong>YAWS</strong> is a personal project to create a modern and functional web-based sudoku
                game using standard browser technologies. It is able to solve and generate challenging puzzles 
                in a consistant manner via the use of <Link href="https://webassembly.org/" target="_blank"
                rel="noreferrer">Web Assembly</Link> for its core code. The user interface was created using 
                standard HTML5, CSS, and JavaScript techniques.
            </Typography>
        </Section>

        <Section>
            <Typography variant="h4" component="h2" gutterBottom>Disclaimer</Typography>

            <Typography variant="body1" gutterBottom>
                This game is in a very early stage of development; lots of things may be broken, misbehaving, or
                simply not be implemented yet. This page is an early demo that does not capture the full scope
                of the project.
            </Typography>
        </Section>
    </div>
);

export default HelpView;