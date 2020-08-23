import * as React from 'react';

import { Button }       from '@components/ui-widgets/button';
import { ButtonGroup }  from '@components/ui-widgets/buttongroup';
import { Fieldset }     from '@components/ui-widgets/fieldset';

export function PuzzleTools(props: any) {
    return (<>
        <Fieldset name="Stopwatch">
            <ButtonGroup>
                <Button text="Start" />
                <Button text="Stop" />
                <Button text="Reset" />
            </ButtonGroup>
        </Fieldset>

        <Fieldset name="Puzzle Code">
            <div>[textbox]</div>
            <div className="spacer" />
            <ButtonGroup>
                <Button text="Load" />
                <Button text="Share" />
            </ButtonGroup>
        </Fieldset>

        <Button text="Hint: Select Easiest Cell" />

        <div className="spacer" />

        <ButtonGroup>
            <Button text="Clear Candidates" />
            <Button text="Reset Board" />
        </ButtonGroup>
    </>);
}