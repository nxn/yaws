import { IEventManager } from './interfaces';

export function create() {
    return new EventManager();
}

class EventManager implements IEventManager {
    private listeners: Map<string, ((...args:any[]) => any)[]>;

    constructor() {
        this.listeners = new Map();
    }

    on(eventName: string, listener: (...args:any[]) => any) {
        let attachedListeners = this.listeners.get(eventName);
        if (!attachedListeners) {
            attachedListeners = [];
            this.listeners.set(eventName, attachedListeners);
        }
        attachedListeners.push(listener);
    }

    fire(eventName: string, ...eventArgs: any[]) {
        let attachedListeners = this.listeners.get(eventName);
        if (!attachedListeners) { return; };
        for (let listener of attachedListeners) {
            listener(...eventArgs);
        }
    }

    detach(eventName: string, listener: (...args:any[]) => any) {
        let attachedListeners = this.listeners.get(eventName);
        if (!attachedListeners) { return false; }

        let index = 0;
        while (index < attachedListeners.length) {
            if (listener === attachedListeners[index]) {
                break;
            }
            index++;
        }

        attachedListeners.splice(index, 1);
        return true;
    }

    detachAll(eventName: string) {
        return this.listeners.delete(eventName);
    }

    clear() {
        return this.listeners.clear();
    }
}