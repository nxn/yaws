import React from 'react';
import Menu from './menu';

import NewPuzzle from './newpuzzle';

export enum Dialogs {
    NewPuzzle,
    None
}

export default function AppInterfaces() {
    const [openDialog, setOpenDialog] = React.useState(Dialogs.None);
    const close = () => {
        setOpenDialog(Dialogs.None);
    }

    return (
        <div className="app-ui">
            <Menu onItemClick={ setOpenDialog }/>
            {/* <div className="dialogs">
                <NewPuzzle open={ openDialog === Dialogs.NewPuzzle } onClose={ close } />
            </div> */}
        </div>
    );
};