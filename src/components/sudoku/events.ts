import { ModelType, IEventManager, IEventStore } from './interfaces';

export enum CommonEvents {
    StateChanged    = "StateChanged"
}

export enum BoardEvents {
    CursorMoved         = "CursorMoved",
    ReadyStateChanged   = "ReadyStateChanged",
    Solved              = "Solved",
    Cleared             = "Cleared",
    Reset               = "Reset"
}

export enum CellEvents {
    ValueChanged    = "ValueChanged",
    StaticChanged   = "StaticChanged",
    ValidityChanged = "ValidityChanged",
    Cleared         = "Cleared"
}

export enum CandidateEvents {
    SelectedChanged = "SelectedChanged",
    ValidityChanged = "ValidityChanged"
}

export function createManager() {
    return new EventManager();
}

export function createStore() {
    return new EventStore();
}

const StateChangeEvents: { [key: string]: string[] } = {
    [ModelType.Board]: [
        BoardEvents.CursorMoved, 
        BoardEvents.ReadyStateChanged, 
        BoardEvents.Reset, 
        BoardEvents.Cleared
    ],
    [ModelType.Cell]: [
        CellEvents.ValueChanged, 
        CellEvents.ValidityChanged, 
        CellEvents.StaticChanged, 
        CellEvents.Cleared
    ],
    [ModelType.Candidate]: [
        CandidateEvents.SelectedChanged,
        CandidateEvents.ValidityChanged
    ]
};

class EventStore implements IEventStore {
    private stores: Map<string, IEventManager>;

    constructor() {
        this.stores = new Map();

        // Fire a generic StateChanged event whenever any of the events listed in StateChangeEvents are fired
        for (let model of Object.keys(StateChangeEvents))
        for (let event of StateChangeEvents[model]) {
            let manager = this.get(model);
            manager.attach(event, (...args: any[]) => {
                manager.fire(CommonEvents.StateChanged, ...args);
            });
        }
    }

    get(modelType: string) {
        if (modelType === null || modelType === undefined) {
            return undefined;
        }

        const model = modelType.toUpperCase();
        let manager = this.stores.get(model);
        if (!manager) {
            manager = new EventManager();
            this.stores.set(model, manager);
        }
        return manager;
    }
}

class EventManager implements IEventManager {
    private listeners: Map<string, ((...args:any[]) => any)[]>;
    private stopped = false;

    constructor() {
        this.listeners = new Map();
    }

    stop() {
        this.stopped = true;
    }

    start() {
        this.stopped = false;
    }

    isStopped() {
        return this.stopped;
    }

    attach(eventName: string, listener: (...args:any[]) => any) {
        if (eventName === null || eventName === undefined) {
            return false;
        }

        const event = eventName.toUpperCase();
        let attachedListeners = this.listeners.get(event);
        if (!attachedListeners) {
            attachedListeners = [];
            this.listeners.set(event, attachedListeners);
        }
        
        // In the case where this function is being called from another listener that has been executed through @fire we
        // want to avoid modifying the event store until after @fire is finished. Adding listeners through setTimout
        // should hopefully allow @fire to finish iterating through existing listeners first.
        setTimeout(() => { attachedListeners.push(listener); });

        return true;
    }

    fire(eventName: string, ...eventArgs: any[]) {
        if (this.stopped || eventName === null || eventName === undefined) { 
            return false;
        }

        const attachedListeners = this.listeners.get(eventName.toUpperCase());
        if (!attachedListeners) { return true; };

        for (const listener of attachedListeners) {
            listener(...eventArgs);
        }

        return true;
    }

    detach(eventName: string, listener: (...args:any[]) => any) {
        if (eventName === null || eventName === undefined) {
            return false;
        }

        const attachedListeners = this.listeners.get(eventName.toUpperCase());
        if (!attachedListeners) { return false; }

        // This needs to be performed via setTimeout to ensure that any event listeners detaching themselves after
        // being executed via @fire are not modifying the event store as it is being iterated over.
        setTimeout(() => {
            let index = 0;
            let found = false;
            while (index < attachedListeners.length) {
                if (listener === attachedListeners[index]) {
                    found = true;
                    break;
                }
                index++;
            }
    
            if (found) {
                attachedListeners.splice(index, 1);
            }
        });
        
        return true;
    }

    detachAll(eventName: string) {
        if (eventName === null || eventName === undefined) {
            return false;
        }
        setTimeout(() => this.listeners.delete(eventName.toUpperCase()));
        return true;
    }

    clear() {
        setTimeout(() => this.listeners.clear());
    }
}