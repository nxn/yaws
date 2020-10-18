import React from 'react';
import Menu from './menu';

import NewPuzzle from './newpuzzle';

export enum Dialogs {
    NewPuzzle,
    None
}

export default function DialogContainer() {
    const [openDialog, setOpenDialog] = React.useState(Dialogs.None);

    return (
        <div>
            <Menu onItemClick={ setOpenDialog }/>
            <div className="dialogs">
                <NewPuzzle open={ openDialog === Dialogs.NewPuzzle } />
            </div>
        </div>
    );
};