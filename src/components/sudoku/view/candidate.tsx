import type { ICandidateController } from '../controller';
import type { ICandidate } from '../candidate';
import type { ICell } from '../cell';
import { IEventListenerKey, CommonEvents } from '../events';
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

type CandidateState = {
    selected:                   boolean,
    valid:                      boolean,
    readyStateListener?:        IEventListenerKey,
    candidateStateListener?:    IEventListenerKey
}

export default class Candidate extends React.Component<CandidateProperties, CandidateState> {
    private candidatePointerDown: (event: React.PointerEvent) => void;

    constructor(props: CandidateProperties) {
        super(props);

        this.state = {
            selected: props.model.isSelected(),
            valid: props.model.isValid()
        }

        const handler = createPointerDoubleClickHandler(
            () => props.controller.toggleCandidate(props.board, props.cell, props.model),
            () => props.onDoubleClick(props.model.value)
        );

        this.candidatePointerDown = (event: React.SyntheticEvent) => handler(event.nativeEvent);
    }

    componentDidMount() {
        const listeners = {
            readyStateListener: this.props.board.events
                .get(BoardEvents.ReadyStateChanged)
                .attach(this.loadCandidateState),

            candidateStateListener: this.props.model.events
                .get(CommonEvents.StateChanged)
                .attach(this.updateCandidateState)
        };
        
        this.setState(() => listeners);
    }

    componentWillUnmount() {
        if (this.state.readyStateListener) {
            this.props.board.events.get(BoardEvents.ReadyStateChanged).detach(this.state.readyStateListener);
        }

        if (this.state.candidateStateListener) {
            this.props.model.events.get(CommonEvents.StateChanged).detach(this.state.candidateStateListener);
        }
        
        this.setState(() => ({
            readyStateListener: undefined,
            candidateStateListener: undefined
        }));
    }

    shouldComponentUpdate(_: CandidateProperties, nextState: CandidateState) {
        return !partialEq(this.state, nextState);
    }

    loadCandidateState = (board: IBoard) => {
        if (this.props.board === board && board.isReady()) {
            this.updateCandidateState(this.props.model);
        }
    }

    updateCandidateState = (candidate: ICandidate) => {
        if (this.props.model !== candidate) {
            return;
        }

        const newState = {
            selected: candidate.isSelected(),
            valid: candidate.isValid()
        }

        if (!partialEq(this.state, newState)) {
            this.setState(() => newState);
        }
    }

    render() {
        let classes = ['candidate'];
        if (this.state.selected) {
            classes.push('selected');
        }
        if (!this.state.valid) {
            classes.push('invalid');
        }
        if (this.props.model.value % 3 === 0) {
            classes.push('last-column');
        }
        if (this.props.model.value > 6) {
            classes.push('last-row');
        }
    
        return (
            <div className={ classes.join(' ') } onPointerDown={ this.candidatePointerDown }>
                { this.props.model.value }
            </div>
        );
    }
};
