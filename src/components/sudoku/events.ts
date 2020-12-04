import { ModelType } from './models/model';
import { StateChangeEvents as BoardStateChangeEvents } from './models/board';
import { StateChangeEvents as CellStateChangeEvents } from './models/cell';
import { StateChangeEvents as CandidateStateChangeEvents } from './models/candidate';

export type EventListener = (...args: any[]) => void;

export type CommonEvents = "StateChanged";
export const CommonEvents = { 
    get StateChanged(): CommonEvents { return "StateChanged"; }
}

import {
    IGenerationalIndex                  as IEventListenerKey,
    IGenerationalIndexAllocator         as IEventListenerKeyAllocator,
    IGenerationalIndexArray             as IEventListenerArray,
    GenerationalIndexAllocator          as EventListenerKeyAllocator,
    GenerationalIndexArray              as EventListenerArray
} from './genarray';

export type {
    IEventListenerKey,
    IEventListenerKeyAllocator,
    IEventListenerArray
};

export interface IEventManager {
    get: (type: ModelType, eventName: string) => IEvent;
    type: (type: ModelType) => IEventStore;
}

export interface IEventStore {
    get: (eventName: string) => IEvent;
}

export interface IEvent {
    attach:     (listener: (...args: any[]) => any) => IEventListenerKey;
    fire:       (...eventArgs: any[]) => void;
    detach:     (listenerKey: IEventListenerKey) => boolean;
    stop:       () => void;
    start:      () => void;
    isStopped:  () => boolean;
}

const StateChangeEvents = {
    "Board":        BoardStateChangeEvents,
    "Cell":         CellStateChangeEvents,
    "Candidate":    CandidateStateChangeEvents
};

export class EventManager implements IEventManager {
    private stores: Map<ModelType, Map<string, IEvent>>;

    private constructor() {
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

    static create(): IEventManager {
        return new EventManager();
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
            event = Event.create(eventName);
            store.set(eventName, event);
        }

        return event;
    }
}

export class Event implements IEvent {
    private stopped =   false;

    private constructor(
        readonly name: string, 
        private keys: IEventListenerKeyAllocator,
        private listeners: IEventListenerArray<EventListener>
    ) { }

    static create(name: string): IEvent {
        return new Event(name, EventListenerKeyAllocator.create(), EventListenerArray.create());
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