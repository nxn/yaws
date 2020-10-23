import React from 'react';
import AppMenu from './menu';

import NewPuzzle from './newpuzzle';

export default function AppInterfaces() {
    const [openDialog, setOpenDialog] = React.useState(null);
    const close = () => setOpenDialog(null);

    return (
        <div className="app-ui">
            <AppMenu onItemClick={ setOpenDialog }/>
            <div className="dialogs">
                <NewPuzzle open={ openDialog === "new-puzzle" } onClose={ close } />
            </div>
        </div>
    );
};