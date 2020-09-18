export interface IGenerationalIndex {
    index:      number;
    generation: number;
}

export interface IGenerationalIndexAllocator {
    allocate    ():                             IGenerationalIndex;
    deallocate  (index: IGenerationalIndex):    boolean;
    isLive      (index: IGenerationalIndex):    boolean;
}

export interface IGenerationalIndexArrayIterator<T> {
    next(): T | { done: true };
}

export interface IGenerationalIndexArray<T> {
    get(index: IGenerationalIndex):             T | undefined;
    set(index: IGenerationalIndex, value: T):   T | undefined;
    values():                                   IGenerationalIndexArrayIterator<T>;
}

export function createGenerationalIndexAllocator(): IGenerationalIndexAllocator {
    return new GenerationalIndexAllocator();
}

export function createGenerationalIndexArray<T>(): IGenerationalIndexArray<T> {
    return new GenerationalIndexArray();
}

interface IAllocEntry {
    live:       boolean;
    generation: number;
}

class GenerationalIndexAllocator implements IGenerationalIndexAllocator {
    private entries:    IAllocEntry[];
    private free:       number[];

    constructor() {
        this.entries    = [];
        this.free       = [];
    }

    allocate(): IGenerationalIndex {
        let index = this.free.pop();

        if (index === undefined) {
            index = this.entries.length;
            this.entries.push({
                live: true,
                generation: 0
            });
            return Object.freeze({ index: index, generation: 0 });
        }
        else {
            const entry = this.entries[index];
            if (!entry) {
                throw "Generational Index Allocator: Free contained non-existant index"
            }
            entry.live = true;
            entry.generation += 1;
            return Object.freeze({ index: index, generation: entry.generation });
        }
    }

    deallocate(index: IGenerationalIndex): boolean {
        if (!index) { return false; }

        const entry = this.entries[index.index];
        if (entry && entry.live && entry.generation === index.generation) { 
            entry.live = false;
            this.free.push(index.index);
            return true;
        }

        return false;
    }

    isLive(index: IGenerationalIndex): boolean {
        if (!index) { return false; }

        const entry = this.entries[index.index];
        return entry && entry.live && entry.generation === index.generation;
    }
}

interface IArrayEntry<T> {
    value: T,
    generation: number;
}

class GenerationalIndexArray<T> {
    private entries: IArrayEntry<T>[];
    constructor() {
        this.entries = [];
    }

    get(index: IGenerationalIndex): T | undefined {
        if (!index) { return undefined; }

        const entry = this.entries[index.index];
        if (!entry || entry.generation !== index.generation) { 
            return undefined
        };

        return entry.value;
    }

    set(index: IGenerationalIndex, value: T): T | undefined {
        if (!index) { return undefined; }

        const entry = this.entries[index.index];
        if (!entry) {
            this.entries[index.index] = { value: value, generation: index.generation }
            return undefined;
        }
        else if (index.generation >= entry.generation) {
            entry.value         = value;
            entry.generation    = index.generation;
            return entry.value;
        }

        return undefined;
    }

    values(): IGenerationalIndexArrayIterator<T> {
        let index = 0;
        return {
            next: () => {
                let entry = this.entries[index];
                while (entry === undefined) {
                    if (index >= this.entries.length) {
                        return { done: true }
                    }

                    entry = this.entries[++index];
                }
                index++;
                return entry.value;
            }
        };
    }
}