import { BinaryHeap } from './binheap';
import { Nothing } from './maybe';

export interface IGenerationalIndex {
    index:      number;
    generation: number;
}

export interface IGenerationalIndexAllocator {
    allocate    ():                             IGenerationalIndex;
    deallocate  (index: IGenerationalIndex):    boolean;
    isLive      (index: IGenerationalIndex):    boolean;
}

export interface IGenerationalIndexArray<T> {
    get(index: IGenerationalIndex):             T | undefined;
    set(index: IGenerationalIndex, value: T):   T | undefined;
    remove(index: IGenerationalIndex):          T | undefined;
    [Symbol.iterator]():                        Generator<T>;
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
    private free:       BinaryHeap<number>;

    constructor() {
        this.entries    = [];
        this.free       = BinaryHeap.create((n: number) => n);
    }

    allocate(): IGenerationalIndex {
        const index = this.free.pop();

        if (index === Nothing) {
            const index = this.entries.length;
            this.entries.push({
                live: true,
                generation: 0
            });
            return Object.freeze({ index: index, generation: 0 });
        }
        else {
            const entry = this.entries[index.value];
            if (!entry) {
                throw "Generational Index Allocator: Free contained non-existant index"
            }
            entry.live = true;
            entry.generation += 1;
            return Object.freeze({ index: index.value, generation: entry.generation });
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

    remove(index: IGenerationalIndex): T | undefined {
        if (!index) { return undefined; }

        const entry = this.entries[index.index];
        if (entry && index.generation >= entry.generation) {
            let value = entry.value;
            // This will delete both the entry and index key from the array, leaving an empty gap that will
            // automatically be skipped when iterating over the array using object keys rather than indexes (i.e.,
            // using Object.keys(), for..in, or array.forEach()). On the other hand, the gap will not be skipped when
            // iterating via for..of, Array.keys(), or most other conventional means of iterating through an array.
            delete this.entries[index.index];
            return value;
        }

        return undefined;
    }

    *[Symbol.iterator]() {
        // Using a for..in loop skips over any deleted indexes. Another option is to retrieve the existing indexes via
        // Object.keys() and iterate over that instead.
        for (const key in this.entries) {
            yield this.entries[key].value;
        }
    }
}
