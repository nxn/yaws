import type { ICandidateController } from '../controller';
import type { ICandidate } from '../candidate';
import type { ICell } from '../cell';
import { CommonEvents } from '../events';
import { IBoard, BoardEvents } from '../board';
import { createPointerDoubleClickHandler } from '../pointer';
import { partialEq } from '@components/utilities/misc';
import React from 'react';

type CandidateProperties = {
    model:          ICandidate,
    controller:     ICandidateController,
    board:          IBoard,
    cell:           ICell,
    onDoubleClick:  (value: number) => any;
};

export default function Candidate(props: CandidateProperties) {
    const [candidateState, setCandidateState] = React.useState({
        selected: props.model.isSelected(),
        valid: props.model.isValid()
    });

    // TODO: This could use a cleanup or refactor so that the use of memoization isn't mandatory.
    // Right now the issue is caused by the double click handler keeping internal state between clicks so that it can distinguish
    // between a single and double click. If a re-render occurs during this time a new handler gets created potentially conflicting 
    // with the previous one's state. Memoizing the handler ensures this doesn't happen, but there's likely a cleaner approach now
    // that compatibility with Inferno's linkEvent function isn't a strict requirement.
    const handler = React.useCallback(
        createPointerDoubleClickHandler(
            () => props.controller.toggleCandidate(props.board, props.cell, props.model),
            () => props.onDoubleClick(props.model.value)
        ),
        [props.model, props.cell, props.board]
    );
    const candidatePointerDown = (event: React.SyntheticEvent) => handler(event.nativeEvent);

    React.useEffect(() => {
        const update = (candidate: ICandidate) => {
            if (props.model !== candidate) {
                return;
            }
    
            const newState = {
                selected: candidate.isSelected(),
                valid: candidate.isValid()
            }
    
            if (!partialEq(candidateState, newState)) {
                setCandidateState(newState);
            }
        }

        const load = (board: IBoard) => {
            if (props.board === board && board.isReady()) {
                update(props.model);
            }
        }

        const boardEventStore = props.board.events.get(BoardEvents.ReadyStateChanged);
        const boardListenerKey = boardEventStore.attach(load);

        const candidateEventStore = props.model.events.get(CommonEvents.StateChanged);
        const candidateListenerKey = candidateEventStore.attach(update);

        return function cleanup() {
            boardEventStore.detach(boardListenerKey);
            candidateEventStore.detach(candidateListenerKey);
        }
    });

    let classes = ['candidate'];
    if (candidateState.selected) {
        classes.push('selected');
    }
    if (!candidateState.valid) {
        classes.push('invalid');
    }
    if (props.model.value % 3 === 0) {
        classes.push('last-column');
    }
    if (props.model.value > 6) {
        classes.push('last-row');
    }

    return (
        <div className={ classes.join(' ') } onPointerDown={ candidatePointerDown }>
            { props.model.value }
        </div>
    );
}
