import { Component, linkEvent } from 'inferno';
import { ICandidate, ICandidateController, ICell, IBoard } from '../interfaces';
import { BoardEvents, CommonEvents } from '../events';
import { createPointerDoubleClickHandler } from '../pointer';

type CandidateProperties = {
    model:          ICandidate,
    controller:     ICandidateController,
    board:          IBoard,
    cell:           ICell,
    onDoubleClick:  (value: number) => any;
};

type CandidateState = {
    selected: boolean,
    valid: boolean
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

    componentDidMount() {
        this.props.board.events.attach(BoardEvents.ReadyStateChanged,   this.loadCandidateState);
        this.props.model.events.attach(CommonEvents.StateChanged,       this.updateCandidateState);
    }
    componentWillUnmount() {
        this.props.board.events.detach(BoardEvents.ReadyStateChanged,   this.loadCandidateState);
        this.props.model.events.detach(CommonEvents.StateChanged,       this.updateCandidateState);
    }

    loadCandidateState = (board: IBoard) => {
        if (board.isReady()) {
            this.updateCandidateState(this.props.model);
        }
    }

    updateCandidateState = (candidate: ICandidate) => {
        if (this.props.model !== candidate) {
            return;
        }

        const selected = candidate.isSelected();
        const valid = candidate.isValid();

        if (this.state.selected === selected && this.state.valid === valid) {
            return;
        }

        this.setState(() => ({
            selected: selected,
            valid: valid
        }));
    }

    shouldComponentUpdate(_: CandidateProperties, nextState: CandidateState) {
        if (this.state.selected !== nextState.selected) {
            return true;
        }
        if (this.state.valid !== nextState.valid) {
            return true;
        }
        return false;
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
