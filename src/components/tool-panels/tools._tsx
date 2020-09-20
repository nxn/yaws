import * as React from "react";
import * as ReactDOM from 'react-dom';

import { TabPanel }     from '@components/ui-widgets/tabpanel';

import { PuzzleTools }  from './puzzletools';
import { SavedGames }   from './savedgames';
import { Settings }     from './settings';
import { Generator }    from './generator';
import { Solution }     from './solution';
import { Colors }       from './colors';

import './tools.css';
import '@components/ui-widgets/widgets.css';

export function Tools() {
    return (
        <div className="tools">
            <TabPanel>
                <PuzzleTools name="Puzzle" />
                <Settings name="Settings" />
            </TabPanel>

            <div className="spacer" />
            
            <TabPanel>
                <Generator name="New" />
                <SavedGames name="Saved" />
                <Solution name="Solution" />
            </TabPanel>

            <div className="spacer" />

            <TabPanel>
                <Colors name="Colors" />
            </TabPanel>
        </div>
    );
}

export function init(parent: string) {
    ReactDOM.render(Tools(), document.getElementById(parent));
}
