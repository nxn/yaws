import { ICursor } from '../interfaces';
import { range } from '@components/utilities/misc';
import { ICursorController } from './controller';

type TProps = { 
    className: string, 
    model: ICursor,
    controller: ICursorController
};

const createButton = (number: number) => {
    let classes = [];

    if      (number <= 3)   { classes.push('top'); }
    else if (number <= 6)   { classes.push('middle'); }
    else                    { classes.push('bottom'); }

    if      (number % 3 === 1)  { classes.push('left'); }
    else if (number % 3 === 2)  { classes.push('center'); }
    else                        { classes.push('right'); }

    return (
        <button className={classes.join(' ')}>
            <span>{number}</span>
        </button>
    );
}

export const NumberButtons = (props: TProps) => (
    <div className={props.className}>
        { range(1,9).map(createButton) }
    </div>
);