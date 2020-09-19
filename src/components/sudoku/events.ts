import { 
    ModelType,
    IEvent, 
    IEventStore,
    IEventManager,
    IEventListenerKey,
    IEventListenerKeyAllocator,
    IEventListenerArray,
    EventListener,
} from './interfaces';

import { 
    createGenerationalIndexAllocator    as createEventListenerKeyAllocator,
    createGenerationalIndexArray        as createEventListenerArray
} from './genarray';

export type CommonEvents = "StateChanged";
export const CommonEvents = { 
    get StateChanged(): CommonEvents { return "StateChanged"; }
}

export type BoardEvents = "CursorMoved" | "ReadyStateChanged" | "Solved" | "Cleared" | "Reset";
export const BoardEvents = {
    get CursorMoved(): BoardEvents          { return "CursorMoved" },
    get ReadyStateChanged(): BoardEvents    { return "ReadyStateChanged" },
    get Solved(): BoardEvents               { return "Solved" },
    get Cleared(): BoardEvents              { return "Cleared" },
    get Reset(): BoardEvents                { return "Reset" }
}

export type CellEvents = "ValueChanged" | "StaticChanged" | "ValidityChanged" | "Cleared";
export const CellEvents = {
    get ValueChanged(): CellEvents      { return "ValueChanged" },
    get StaticChanged(): CellEvents     { return "StaticChanged" },
    get ValidityChanged(): CellEvents   { return "ValidityChanged" },
    get Cleared(): CellEvents           { return "Cleared" }
}

export type CandidateEvents = "SelectedChanged" | "ValidityChanged";
export const CandidateEvents = {
    get SelectedChanged(): CandidateEvents { return "SelectedChanged" },
    get ValidityChanged(): CandidateEvents { return "ValidityChanged" }
}

export function create() {
    return new EventManager();
}

const StateChangeEvents: { 
    "Board": BoardEvents[], 
    "Cell": CellEvents[], 
    "Candidate": CandidateEvents[] 
} = {
    "Board": [
        BoardEvents.CursorMoved, 
        BoardEvents.ReadyStateChanged, 
        BoardEvents.Reset, 
        BoardEvents.Cleared
    ],
    "Cell": [
        CellEvents.ValueChanged, 
        CellEvents.ValidityChanged, 
        CellEvents.StaticChanged, 
        CellEvents.Cleared
    ],
    "Candidate": [
        CandidateEvents.SelectedChanged,
        CandidateEvents.ValidityChanged
    ]
};

class EventManager implements IEventManager {
    private stores: Map<ModelType, Map<string, IEvent>>;

    constructor() {
        this.stores = new Map();

        // Fire a generic StateChanged event whenever any of the events listed in StateChangeEvents are fired
        let model: ModelType;
        for (model in StateChangeEvents)
        for (let eventName of StateChangeEvents[model]) {
            const type = this.type(model);
            type.get(eventName).attach((...args: any[]) => {
                type.get(CommonEvents.StateChanged).fire(...args);
            });
        }
    }

    type(type: ModelType): IEventStore | undefined {
        if (!type) { return undefined; }
        return {
            get: (eventName: string) => {
                return this.get(type, eventName);
            }
        };
    }

    get(type: ModelType, eventName: string): IEvent | undefined {
        if (!type || !eventName) {
            return undefined;
        }

        let store = this.stores.get(type);
        if (!store) {
            store = new Map();
            this.stores.set(type, store);
        }

        let event = store.get(eventName);

        if (!event) {
            event = new Event(eventName);
            store.set(eventName, event);
        }

        return event;
    }
}

class Event implements IEvent {
    private keys:       IEventListenerKeyAllocator;
    private listeners:  IEventListenerArray<EventListener>;
    private stopped =   false;

    constructor(readonly name: string) {
        this.keys       = createEventListenerKeyAllocator();
        this.listeners  = createEventListenerArray();
    }

    stop()      { this.stopped = true; }
    start()     { this.stopped = false; }
    isStopped() { return this.stopped; }

    attach(listener: EventListener): IEventListenerKey {
        const listenerKey = this.keys.allocate();
        // In the case where this function is being called from another listener that has been executed through @fire we
        // want to avoid modifying the event store until after @fire is finished. Adding listeners through setTimout
        // should hopefully allow @fire to finish iterating through existing listeners first.
        setTimeout(() => { this.listeners.set(listenerKey, listener); });
        return listenerKey;
    }

    fire(...eventArgs: any[]) {
        for (const listener of this.listeners) {
            listener(...eventArgs);
        }
    }

    detach(listenerKey: IEventListenerKey): boolean {
        // This needs to be performed via setTimeout to ensure that any event listeners detaching themselves after
        // being executed via @fire are not modifying the event store as it is being iterated over.
        setTimeout(() => { this.listeners.remove(listenerKey); });
        return this.keys.deallocate(listenerKey);
    }
}