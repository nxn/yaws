import { linkEvent }    from 'inferno';
import { range }        from '@components/utilities/misc';

type ButtonProperties = {
    onClick:    (value: number) => void
};

const createButton = (number: number, props: ButtonProperties) => {
    let classes = [];

    if      (number <= 3)   { classes.push('top'); }
    else if (number <= 6)   { classes.push('middle'); }
    else                    { classes.push('bottom'); }

    if      (number % 3 === 1)  { classes.push('left'); }
    else if (number % 3 === 2)  { classes.push('center'); }
    else                        { classes.push('right'); }

    return (
        <button className={classes.join(' ')} onClick={ linkEvent(number, props.onClick) }>
            <span>{number}</span>
        </button>
    );
}

export const ValueButtons = (props: ButtonProperties) => Buttons(props, "values");
export const NoteButtons  = (props: ButtonProperties) => Buttons(props, "notes");
const Buttons = (props: ButtonProperties, className = "") => (
    <div className={className}>
        { range(1,9).map(n => createButton(n, props)) }
    </div>
);