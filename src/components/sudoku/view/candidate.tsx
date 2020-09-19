import { Component, linkEvent } from 'inferno';
import { ICandidate, ICandidateController, ICell, IBoard, IEventListenerKey } from '../interfaces';
import { BoardEvents, CommonEvents } from '../events';
import { createPointerDoubleClickHandler } from '../pointer';
import { partialEq } from '@components/utilities/misc';

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

export class Candidate extends Component<CandidateProperties, CandidateState> {
    private candidatePointerDown: (data: number, event: PointerEvent) => any;

    constructor(props: CandidateProperties) {
        super(props);

        this.state = {
            selected: props.model.isSelected(),
            valid: props.model.isValid()
        }

        this.candidatePointerDown = createPointerDoubleClickHandler(
            (value: number) => props.controller.toggleCandidate(this.props.board, this.props.cell, value),
            (value: number) => props.onDoubleClick(value)
        );
    }

    componentWillMount() {
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
            <div className={ classes.join(' ') }
                onpointerdown={ linkEvent(this.props.model.value, this.candidatePointerDown) }>

                { this.props.model.value }
            </div>
        );
    }
};
