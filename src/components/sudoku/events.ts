import { ModelType, IEventManager, IEventStore } from './interfaces';

export enum CommonEvents {
    StateChanged    = "StateChanged"
}

export enum BoardEvents {
    CursorMoved     = "CursorMoved",
    Loaded          = "Loaded",
    Solved          = "Solved",
    Cleared         = "Cleared",
    Reset           = "Reset"
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
        BoardEvents.Loaded, 
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
            manager.on(event, (...args: any[]) => {
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

    on(eventName: string, listener: (...args:any[]) => any) {
        if (eventName === null || eventName === undefined) {
            return false;
        }

        const event = eventName.toUpperCase();
        let attachedListeners = this.listeners.get(event);
        if (!attachedListeners) {
            attachedListeners = [];
            this.listeners.set(event, attachedListeners);
        }
        attachedListeners.push(listener);

        return true;
    }

    fire(eventName: string, ...eventArgs: any[]) {
        if (this.stopped || eventName === null || eventName === undefined) { 
            return false;
        }

        let attachedListeners = this.listeners.get(eventName.toUpperCase());
        if (!attachedListeners) { return true; };

        for (let listener of attachedListeners) {
            listener(...eventArgs);
        }

        return true;
    }

    detach(eventName: string, listener: (...args:any[]) => any) {
        if (eventName === null || eventName === undefined) {
            return false;
        }

        let attachedListeners = this.listeners.get(eventName.toUpperCase());
        if (!attachedListeners) { return false; }

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
        
        return found;
    }

    detachAll(eventName: string) {
        if (eventName === null || eventName === undefined) {
            return false;
        }

        return this.listeners.delete(eventName.toUpperCase());
    }

    clear() {
        return this.listeners.clear();
    }
}