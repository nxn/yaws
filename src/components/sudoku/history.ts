/*
Objectives: Allow undo and redo functionality without copying entire game state at each player input.

Two potential approaches: 
    1) Use immutable data structure to store board state and avoid cost of fully copying all data on each Player action.
    2) Store only player inputs and derive the board state based on those inputs as needed.

Option 1 sill requires partial copies of nodes that travel from the location of the change to the root of the board state; in practise this
overhead is not insignificant. However, it does have the benefit of being similar to waffle iron's approach to solving puzzles since it uses
a data structure like this for backtracking purposes. This is probably not too valuable though when considering that any given state can contain 
errors made by the user and thus cannot be used as a starting point for solving or suggesting/hinting towards next actions.

Option 2 in Detail:
Will store array of user inputs and a reference to the current state.

History will be generated via event listeners that are attached to the board and its sub-components.

To simplify storage and transmission of history data, cell and candidates will be identified by index.
In the case of cells the index will span range 0-80, and in the case of candidates it will span 0-728 (81 cells, 9 candidates per cell).

Example Structure:
    let history = [
        // Player set a new cell value:
        'value': { value: 2, previous: 0, cell: 21 },

        // Player changed cell value:
        'value': { value: 8, previous: 2, cell: 21 },

        // Player toggled candidate
        'candidate': { value: true, candidate: 214 },

        // Player toggled candidate
        'candidate': { value: false, candidate: 214 }
    ];

Undo and Redo operations will accept a new history index and return an array of actions (wrap computation into a function?) that transform
the Board state to a different point in the history.

Example Pseudo Code:
    // Undo a set of operations
    if (newHistoryIndex < currentHistoryIndex) {
        // When performing an undo operation, the modifications will be reversed. In the case of cells the 'value' field will be substituted 
        // with the 'previous' field, and in the case of candidates 'value' will simply be flipped to '!value'.

        // The order the operations are applied in is not relevant so long as the bulk operation is fully applied before any validation takes
        // place. Alternatively, if the history array is to contain other actions where order is significant, the actions can be looped through 
        // in reverse order. If so, this should be encapsulated by either returning a function that will perform the actions appropriately or
        // by returning an Iterator/Generator which returns them in reverse order.

        return history.slice(newHistoryIndex, currentHistoryIndex).reverse();
    }

    // Replay a set of operations
    else if (newHistoryIndex > currentHistoryIndex) {
        return history.slice(currentHistoryIndex, newHistoryIndex);
    }


In the event a new action is performed when the current history index is not at the tail of the history array, the array should be truncated 
before the action is appended
*/