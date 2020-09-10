import { IBoard } from '../interfaces';
import { range } from '@components/utilities/misc';

type TProps = { className: string, board: IBoard };

const createButton = (n: number) => {
    let classes = [];

    if      (n <= 3)    { classes.push('top'); }
    else if (n <= 6)    { classes.push('middle'); }
    else                { classes.push('bottom'); }

    if      (n % 3 === 1)   { classes.push('left'); }
    else if (n % 3 === 2)   { classes.push('center'); }
    else                    { classes.push('right'); }

    return (
        <button className={classes.join(' ')}>
            <span>{n}</span>
        </button>
    );
}

export const NumberButtons = (props: TProps) => (
    <div className={props.className}>
        { range(1,9).map(createButton) }
    </div>
);